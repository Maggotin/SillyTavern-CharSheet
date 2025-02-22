import { FC, HTMLAttributes } from "react";

import { BuilderChoiceTypeEnum } from "~/constants";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useRuleData } from "~/hooks/useRuleData";
import { useSource } from "~/hooks/useSource";
import {
  DetailChoice,
  DetailChoiceFeat,
} from "~/tools/js/Shared/containers/DetailChoice";
import { TypeScriptUtils } from "~/tools/js/Shared/utils";
import {
  CharClass,
  Choice,
  ClassDefinitionContract,
  ClassFeature,
  Feat,
  FeatLookup,
  FeatureChoiceOption,
  HtmlSelectOptionGroup,
  SourceData,
} from "~/types";

export interface FeatureChoiceProps extends HTMLAttributes<HTMLDivElement> {
  choice: Choice;
  charClass?: CharClass;
  feature?: ClassFeature;
  featsData: Feat[];
  subclassData?: ClassDefinitionContract[];
  onChoiceChange: (
    choiceId: string,
    type: number,
    value: any,
    parentChoiceId: string | null
  ) => void;
  collapseDescription?: boolean;
}

/**
 * Component for rendering a features choice(s) - for species traits and class features - using DetailChoiceFeat for a selected feat's choices and DetailChoice for all others.
 It is used in both the builder and character sheet sidebar panes.
 */
export const FeatureChoice: FC<FeatureChoiceProps> = ({
  charClass,
  choice,
  feature,
  featsData,
  subclassData,
  onChoiceChange,
  className,
  collapseDescription,
  ...props
}) => {
  const {
    choiceUtils,
    featUtils,
    helperUtils,
    prerequisiteUtils,
    classUtils,
    featLookup,
    preferences,
    prerequisiteData,
    choiceInfo,
    ruleData,
    entityRestrictionData,
  } = useCharacterEngine();

  const { ruleDataUtils } = useRuleData();

  const {
    getGroupedOptionsBySourceCategory,
    getSimpleSourcedDefinitionContracts,
  } = useSource();

  const optionValue = choiceUtils.getOptionValue(choice);
  const options = choiceUtils.getOptions(choice);
  const type = choiceUtils.getType(choice);
  const tagConstraints = choiceUtils.getTagConstraints(choice);

  let availableOptions: Array<FeatureChoiceOption> = [];
  let availableGroupedOptions: HtmlSelectOptionGroup[] = [];
  let detailChoiceDesc: string | null = null;
  let subchoicesNode: React.ReactNode;

  const handleChoiceChange = (
    id: string,
    type: number,
    subType: number | null,
    value: any,
    parentChoiceId: string | null
  ): void => {
    onChoiceChange(id, type, value, parentChoiceId);
  };

  const getSubclassData = (): ClassDefinitionContract[] => {
    if (!subclassData || !charClass) {
      return [];
    }

    let data: ClassDefinitionContract[] = [...subclassData];

    let existingSubclass = classUtils.getSubclass(charClass);
    if (
      existingSubclass !== null &&
      !data.some(
        (classDefinition) =>
          existingSubclass !== null &&
          classDefinition.id === existingSubclass.id
      )
    ) {
      data.push(existingSubclass);
    }

    return data;
  };

  const getAvailableFeatChoices = (
    existingFeatId: number | null,
    featData: Feat[],
    featLookup: FeatLookup
  ): Feat[] => {
    let data: Feat[] = [...featData];

    if (existingFeatId !== null) {
      let existingFeat = helperUtils.lookupDataOrFallback(
        featLookup,
        existingFeatId
      );
      if (
        existingFeat !== null &&
        !data.some((feat) => featUtils.getId(feat) === existingFeatId)
      ) {
        data.push(existingFeat);
      }
    }

    return data;
  };

  const getSubclassSources = (
    subclass: ClassDefinitionContract
  ): SourceData[] => {
    if (subclass.sources === null) {
      return [];
    }

    return subclass.sources
      .map((sourceMapping) =>
        helperUtils.lookupDataOrFallback(
          ruleDataUtils.getSourceDataLookup(ruleData),
          sourceMapping.sourceId
        )
      )
      .filter(TypeScriptUtils.isNotNullOrUndefined);
  };

  switch (type) {
    case BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION:
      const availableFeats = getAvailableFeatChoices(
        optionValue,
        featsData,
        featLookup
      );
      const repeatableFeatTracker = new Set();

      // Add selected feat to repeatable tracker if repeatable
      const selectedFeat = optionValue ? featLookup[optionValue] : null;
      if (selectedFeat && featUtils.isRepeatable(selectedFeat)) {
        const parentId = featUtils.getRepeatableGroupId(selectedFeat);
        if (parentId) {
          repeatableFeatTracker.add(parentId);
        }
      }

      const filteredFeats = availableFeats.filter((feat) => {
        const featId = featUtils.getId(feat);
        const isRepeatable = featUtils.isRepeatable(feat);

        // If the feat is the currently selected, always include it
        if (featId === optionValue) {
          return true;
        }

        // Always exclude all previous selected feats
        if (featLookup[featId]) {
          return false;
        }

        // If the Feat does not meet the tag constraints, should they exist, exclude it
        const tagCategories = featUtils.getCategories(feat);
        if (
          tagConstraints &&
          !featUtils.doesSatisfyTagConstraints(tagCategories, tagConstraints)
        ) {
          return false;
        }

        // Handle prerequisites when enforcing feat rules
        if (
          preferences.enforceFeatRules &&
          !prerequisiteUtils.validatePrerequisiteGrouping(
            featUtils.getPrerequisites(feat),
            prerequisiteData
          )
        ) {
          return false;
        }

        // Special handling for repeatable feats, there can be only one
        if (isRepeatable) {
          const parentId = featUtils.getRepeatableGroupId(feat);

          // If a feat from this repeatable group exist exclude all others
          if (repeatableFeatTracker.has(parentId)) {
            return false;
          }

          repeatableFeatTracker.add(parentId);
        }

        // If none of the exclusions above are met, include the feat
        return true;
      });

      //Group available feats by source category
      availableGroupedOptions = getGroupedOptionsBySourceCategory(
        filteredFeats
          .map((feat) => featUtils.getDefinition(feat))
          .filter(TypeScriptUtils.isNotNullOrUndefined)
      );

      if (selectedFeat && optionValue !== null) {
        detailChoiceDesc = featUtils.getDescription(selectedFeat);
        subchoicesNode = <DetailChoiceFeat featId={optionValue} />;
      }
      break;

    case BuilderChoiceTypeEnum.SUB_CLASS_OPTION:
      const subclassData = getSubclassData();

      //Group available subclasses by source category
      availableGroupedOptions = getGroupedOptionsBySourceCategory(subclassData);

      const chosenSubclass = subclassData.find(
        (subclass) => subclass.id === optionValue
      );
      if (chosenSubclass) {
        detailChoiceDesc = "";
        let sources = getSubclassSources(chosenSubclass);
        sources.forEach((source) => {
          if (source.sourceCategory && source.sourceCategory.isToggleable) {
            detailChoiceDesc += source.sourceCategory.description
              ? source.sourceCategory.description
              : "";
          }
        });
      }
      break;
    case BuilderChoiceTypeEnum.ENTITY_SPELL_OPTION:
      // Map over the options to mock parts of a SpellDefinitionContract.
      const spellOptions = getSimpleSourcedDefinitionContracts(options);
      availableGroupedOptions = getGroupedOptionsBySourceCategory(
        spellOptions,
        optionValue,
        entityRestrictionData
      );

      // If there is a chosen spell, set detailChoiceDesc to its description.
      const chosenSpell = spellOptions.find(
        (spell) => spell.id === optionValue
      );

      if (chosenSpell) {
        detailChoiceDesc = chosenSpell.description ?? "";
      }

      break;

    default:
      availableOptions = options.map((option) => ({
        ...option,
        value: option.id,
      }));
  }

  return (
    <div className={className} {...props}>
      <DetailChoice
        {...choice}
        choice={choice}
        options={
          availableGroupedOptions.length > 0
            ? availableGroupedOptions
            : availableOptions
        }
        onChange={handleChoiceChange}
        description={detailChoiceDesc || ""}
        choiceInfo={choiceInfo}
        classId={charClass && classUtils.getId(charClass)}
        showBackgroundProficiencyOptions={true}
        collapseDescription={collapseDescription}
      />
      {subchoicesNode}
    </div>
  );
};
