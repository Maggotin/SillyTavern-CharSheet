import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Accordion } from "~/components/Accordion";
import { HtmlContent } from "~/components/HtmlContent";
import { Link } from "~/components/Link";
import { PreferenceProgressionTypeEnum as progressionType } from "~/constants";
import { orderBy } from "~/helpers/sortUtils";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useSource } from "~/hooks/useSource";
import { navigationConfig } from "~/tools/js/CharacterBuilder/config";

import { Button } from "../../../../components/Button";
import { ConfirmClassModal } from "../../components/ConfirmClassModal";
import { Listing } from "../../components/Listing";
import { PortraitName } from "../../components/PortraitName";
import { Search } from "../../components/Search";
import { Spinner } from "../../components/Spinner";
import { RouteKey } from "../../constants";
import { useClassContext } from "../../contexts/Class";
import { getMissingRequirements } from "../../helpers/getMissingRequirements";
import {
  ClassDefinitionContract,
  ClassItems,
  ClassRequirements,
  ListingItem,
  MulticlassAvailability,
} from "../../types";
import styles from "./styles.module.css";

//showHeader and OnQuickSelect are only be used from QuickBuild.tsx and RandomBuild.tsx
export interface ClassChooseProps extends HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean;
  onQuickSelect?: (charClass: ClassDefinitionContract) => void;
}

export interface SourceGroupMapping {
  name: string;
  id: number;
  items: ClassDefinitionContract[];
  sortOrder: number | undefined;
  isOpen: boolean;
}

/**
 * The page which lists all available classes for the user to choose
 * from when building or updating a character. Can be found at
 * `/characters/:characterId/builder/class/choose`.
 */
export const ClassChoose: FC<ClassChooseProps> = ({
  showHeader = true,
  className,
  onQuickSelect,
  ...props
}) => {
  const navigate = useNavigate();
  const {
    classes: charClasses,
    preferences,
    prerequisiteData,
    startingClass,
    totalClassLevel,
    currentLevel,
    characterId,
    classUtils,
    helperUtils,
    prerequisiteUtils: {
      validatePrerequisiteGrouping: validateGrouping,
      getPrerequisiteGroupingFailures: getGroupingFailures,
    },
  } = useCharacterEngine();
  const { allSources, getSourceCategoryDescription, getSourceCategoryGroups } =
    useSource();
  const {
    filteredClasses,
    allClasses,
    handleSelectClass,
    query,
    setQuery,
    isLoading,
    isModalShowing,
    closeModal,
  } = useClassContext();

  const [mappedSourceCategoryGroups, setMappedSourceCategoryGroups] = useState<
    SourceGroupMapping[]
  >([]);

  useEffect(() => {
    const sourceCategoryGroups = getSourceCategoryGroups(filteredClasses);
    setMappedSourceCategoryGroups(
      sourceCategoryGroups.map((group) => ({
        ...group,
        isOpen: true,
      }))
    );
  }, [filteredClasses]);

  // Determine if the character's XP will be adjusted when adding a new class
  const willXpBeAdjusted =
    charClasses.length > 0 &&
    preferences.progressionType === progressionType.XP &&
    totalClassLevel + 1 > currentLevel;

  // Navigate back to the class manage page
  const handleNavigate = (): void =>
    navigate(
      navigationConfig
        .getRouteDefPath(RouteKey.CLASS_MANAGE)
        .replace(":characterId", characterId)
    );

  // Return requirements for multiclassing based on existing classes
  const getMulticlassAvailability = (
    classes: ClassItems
  ): Array<MulticlassAvailability> => {
    const { enforceMulticlassRules } = preferences;
    let canStartingClassMulticlass = false;
    let startingClassRequirements: ClassRequirements = [];

    if (enforceMulticlassRules) {
      if (startingClass) {
        canStartingClassMulticlass = validateGrouping(
          classUtils.getPrerequisites(startingClass),
          prerequisiteData
        );
        startingClassRequirements = getGroupingFailures(
          classUtils.getPrerequisites(startingClass),
          prerequisiteData
        );
      }
    } else {
      canStartingClassMulticlass = true;
    }

    return classes.map(
      ({ id: classId, prerequisites }): MulticlassAvailability => {
        let canMulticlass = false;
        const missingRequirements = getGroupingFailures(
          prerequisites,
          prerequisiteData
        );

        if (enforceMulticlassRules) {
          canMulticlass =
            canStartingClassMulticlass &&
            validateGrouping(prerequisites, prerequisiteData);
        } else {
          canMulticlass = true;
        }

        return {
          classId,
          canStartingClassMulticlass,
          startingClassRequirements,
          canMulticlass,
          missingRequirements,
        };
      }
    );
  };

  const getDisabledIds = (classes: ClassItems): Array<number> => {
    if (startingClass === null || !classes.length) {
      return [];
    }

    // const classDefinitions = classes.map((item) => item.entity);
    const multiclassAvailability = getMulticlassAvailability(classes);

    // disable any current classes
    let currentClassIds = charClasses.map((charClass) =>
      classUtils.getId(charClass)
    );

    // disable any multiclass options that don't meet required prerequisites
    let canMulticlassIds = multiclassAvailability
      .filter((classInfo) => !classInfo.canMulticlass)
      .map((classInfo) => classInfo.classId);

    return [...currentClassIds, ...canMulticlassIds];
  };

  // Transform the class items into a format that listing can use
  const transformClassItems = (data: ClassItems): Array<ListingItem> => {
    let classDefinitions = [...data];

    // Get the multiclass availability for each class
    const availability = getMulticlassAvailability(classDefinitions);

    return classDefinitions.map((classItem: ClassDefinitionContract) => {
      const { id, sources, name, portraitAvatarUrl } = classItem;
      // Find the class in the character's classes
      const existingClass = charClasses.find(
        (cls) => classUtils.getId(cls) === id
      );

      // Find the multiclass info for the class
      const multiclassInfo = availability.find((cls) => cls.classId === id);
      let metaItems: Array<{ type: string; text: string }> = [];

      // Add the source descriptions to the meta items
      if (sources)
        sources.forEach(({ sourceId }) => {
          let source = helperUtils.lookupDataOrFallback(allSources, sourceId);

          // If a source has a description and is toggleable, add it to the meta items
          if (
            source?.description !== null &&
            source?.sourceCategory?.isToggleable
          )
            metaItems.push({
              type: "normal",
              text: source.description,
            });
        });

      // If the character is already multiclassed
      if (charClasses && charClasses.length >= 1) {
        if (existingClass) {
          const { level, isStartingClass } = existingClass;
          const currentLevel = `Level ${level}`;
          const startingClass = isStartingClass ? " • Starting Class" : "";

          // Add the class level to the meta items
          metaItems.push({
            type: "normal",
            text: `${currentLevel}${startingClass}`,
          });
        }
        // If the class is the starting class
        else if (multiclassInfo) {
          const {
            canMulticlass,
            canStartingClassMulticlass,
            missingRequirements,
            startingClassRequirements,
          } = multiclassInfo;
          // Add an error message to the meta items
          if (!canMulticlass || !canStartingClassMulticlass)
            metaItems.push({
              type: "error",
              text: !canStartingClassMulticlass
                ? `Starting class does not meet multiclass prerequisites: ${getMissingRequirements(
                    startingClassRequirements
                  )}`
                : !canMulticlass
                ? `Prerequisites not met: ${getMissingRequirements(
                    missingRequirements
                  )}`
                : "",
            });
        }
      }

      return {
        id,
        metaItems,
        entityTypeId: -1,
        heading: name || "",
        image: portraitAvatarUrl || null,
        onClick: handleSelectClass,
        entity: classItem,
        type: "class",
      };
    });
  };

  const handleOverrideClick = (override): void => {
    const updatedGroups = mappedSourceCategoryGroups.map((group) => ({
      ...group,
      isOpen: override,
    }));

    setMappedSourceCategoryGroups(updatedGroups);
  };

  const handleSourceCategoryClick = (id: string, state: boolean): void => {
    const parsedId = parseInt(id);
    const updatedGroups = mappedSourceCategoryGroups.map((group) => ({
      ...group,
      isOpen: group.id === parsedId ? state : group.isOpen,
    }));

    setMappedSourceCategoryGroups(updatedGroups);
  };

  return (
    <div className={clsx([styles.page, className])} {...props}>
      {showHeader && (
        <>
          <PortraitName />
          <hr className={styles.divider} />
          <h2 className={styles.title}>
            Choose a Class{startingClass && " to Multiclass"}
          </h2>
          {startingClass && (
            <>
              <p className={styles.text}>
                Learn more about multiclassing{" "}
                <Link
                  href="/sources/dnd/free-rules/creating-a-character#Multiclassing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </Link>
                .
              </p>
              <p className={styles.multiclassMessage}>
                Classes from the 2024 and 2014 rulebooks are not designed to be
                multiclassed together.
              </p>
            </>
          )}
          {charClasses.length > 0 && (
            <div className={styles.buttons}>
              {willXpBeAdjusted && (
                <p className={styles.error}>
                  Your XP total will be adjusted when you add your new class.
                </p>
              )}
              <Button
                className={styles.navigateButton}
                variant="builder"
                onClick={handleNavigate}
              >
                Cancel Class Add
              </Button>
            </div>
          )}
        </>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Search
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className={styles.collapseExpand}>
            <Button
              variant="text"
              size="x-small"
              className={styles.collapseExpandButton}
              onClick={() => handleOverrideClick(false)}
              forceThemeMode="light"
            >
              Collapse All
            </Button>
            <Button
              variant="text"
              size="x-small"
              className={styles.collapseExpandButton}
              onClick={() => handleOverrideClick(true)}
              forceThemeMode="light"
            >
              Expand All
            </Button>
          </div>

          {mappedSourceCategoryGroups.length > 0 ? (
            mappedSourceCategoryGroups.map((category) => {
              const description = getSourceCategoryDescription(category.id);

              return (
                <Accordion
                  id={category.id.toString()}
                  className={styles.accordion}
                  summary={<h3 className={styles.heading}>{category.name}</h3>}
                  description={
                    description && (
                      <HtmlContent html={description} className={styles.text} />
                    )
                  }
                  forceShow
                  variant="text"
                  resetOpen={allClasses.length !== filteredClasses.length}
                  key={category.id}
                  handleIsOpen={handleSourceCategoryClick}
                  override={category.isOpen}
                >
                  <Listing
                    items={orderBy(
                      transformClassItems(category.items),
                      "heading"
                    )}
                    disabledIds={getDisabledIds(category.items)}
                    onQuickSelect={onQuickSelect}
                  />
                </Accordion>
              );
            })
          ) : (
            <p className={styles.notFound}>No Results Found</p>
          )}
        </>
      )}
      <ConfirmClassModal open={isModalShowing} onClose={closeModal} />
    </div>
  );
};
