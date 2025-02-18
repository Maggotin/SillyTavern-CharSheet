import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";

import CircleInfo from "@dndbeyond/fontawesome-cache/svgs/regular/circle-info.svg";

import { Accordion } from "~/components/Accordion";
import { HtmlContent } from "~/components/HtmlContent";
import { Link } from "~/components/Link";
import { Toggle } from "~/components/Toggle";
import { Tooltip } from "~/components/Tooltip";
import { orderBy } from "~/helpers/sortUtils";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useSource } from "~/hooks/useSource";
import { Select } from "~/tools/js/smartComponents/legacy";
import { RaceDefinitionContract } from "~/types";

import { Button } from "../../../../components/Button";
import { ConfirmSpeciesModal } from "../../components/ConfirmSpeciesModal";
import { Listing } from "../../components/Listing";
import { PortraitName } from "../../components/PortraitName";
import { Search } from "../../components/Search";
import { SpeciesDisplay } from "../../components/SpeciesDisplay";
import { Spinner } from "../../components/Spinner";
import { useSpeciesContext } from "../../contexts/Species";
import styles from "./styles.module.css";

//showHeader and OnQuickSelect are only be used from QuickBuild.tsx and RandomBuild.tsx
export interface SpeciesChooseProps extends HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean;
  onQuickSelect?: (species: RaceDefinitionContract) => void;
}

export interface SourceGroupMapping {
  name: string;
  id: number;
  items: RaceDefinitionContract[];
  sortOrder: number | undefined;
  isOpen: boolean;
}

export const SpeciesChoose: FC<SpeciesChooseProps> = ({
  showHeader = true,
  onQuickSelect,
  className,
  ...props
}) => {
  const { race: currentSpecies } = useCharacterEngine();
  const {
    allSpecies,
    closeModal,
    filteredSpecies,
    isLegacyShowing,
    isModalShowing,
    setSource,
    source,
    sourceOptions,
    toggleLegacyContent,
    transformSpecies,
    query,
    setQuery,
    isLoading,
    getSpeciesInGroups,
  } = useSpeciesContext();
  const { getSourceCategoryGroups, getSourceCategoryDescription } = useSource();
  const [mappedSourceCategoryGroups, setMappedSourceCategoryGroups] = useState<
    SourceGroupMapping[]
  >([]);

  useEffect(() => {
    const sourceCategoryGroups = getSourceCategoryGroups(filteredSpecies);
    setMappedSourceCategoryGroups(
      sourceCategoryGroups.map((group) => ({
        ...group,
        isOpen: true,
      }))
    );
  }, [filteredSpecies]);

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
    <div className={clsx([styles.speciesChoose, className])} {...props}>
      {showHeader && (
        <>
          <PortraitName />
          <hr className={styles.divider} />
          <h2 className={styles.title}>
            {currentSpecies ? "Change Origin: " : "Choose Origin: "}
            {"Species"}
          </h2>
          {currentSpecies && (
            <>
              <SpeciesDisplay
                headingText="Current Species"
                actionText="Keep Species"
              />
              <h3 className={styles.title}>Select New Species</h3>
            </>
          )}
        </>
      )}

      <div className={styles.filters}>
        <div>
          <div className={styles.label}>Filter Species Source(s)</div>
          <Select
            placeholder={"-- All Sources --"}
            options={sourceOptions}
            value={source}
            onChange={(value) => setSource(value)}
          />
        </div>

        <div className={styles.legacy}>
          <Toggle
            className={styles.toggle}
            onClick={toggleLegacyContent}
            checked={isLegacyShowing}
            color="secondary"
            aria-labelledby="legacy-content-label"
          />
          <label id="legacy-content-label">
            Show Legacy Content{" "}
            <>
              <CircleInfo
                data-tooltip-id="legacy-info"
                data-tooltip-place="bottom"
                className={styles.infoIcon}
              />
              <Tooltip id="legacy-info" clickable>
                Legacy content doesn't reflect the latest rules and lore.{" "}
                <Link
                  href="https://dndbeyond.com/legacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </Link>
              </Tooltip>
            </>
          </label>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={clsx([styles.text, styles.marketplace])}>
        Looking for something not in the list below? Unlock all official options
        in the <Link href="/marketplace">Marketplace</Link>.
      </div>
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
              const name = category.name;
              const id = category.id;
              const description = getSourceCategoryDescription(category.id);

              const currentSpeciesId = currentSpecies
                ? [
                    `${currentSpecies.entityRaceId}-${currentSpecies.entityRaceTypeId}`,
                  ]
                : [];

              const groupedSpecies = getSpeciesInGroups(
                transformSpecies(category.items)
              );

              return (
                <Accordion
                  id={category.id.toString()}
                  className={styles.accordion}
                  summary={<h3 className={styles.heading}>{name}</h3>}
                  description={
                    description && (
                      <HtmlContent html={description} className={styles.text} />
                    )
                  }
                  variant="text"
                  resetOpen={allSpecies.length !== filteredSpecies.length}
                  key={id}
                  forceShow
                  override={category.isOpen}
                  handleIsOpen={handleSourceCategoryClick}
                >
                  <Listing
                    items={orderBy(groupedSpecies, "heading")}
                    disabledIds={currentSpeciesId}
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
      <ConfirmSpeciesModal open={isModalShowing} onClose={closeModal} />
    </div>
  );
};
