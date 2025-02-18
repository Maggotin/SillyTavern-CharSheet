import { orderBy } from "lodash";

import {
  BuilderChoiceOptionContract,
  EntityRestrictionData,
  HelperUtils,
  HtmlSelectOptionGroup,
  RuleDataUtils,
  SimpleSourcedDefinitionContract,
  SourceMappingContract,
  SourceUtils,
} from "../../character-rules-engine";

import { TypeScriptUtils } from "~/tools/js/Shared/utils";

import { useCharacterEngine } from "./useCharacterEngine";
import { useRuleData } from "./useRuleData";

interface SourceCategoryGroup<T> {
  name: string;
  id: number;
  items: Array<T>;
  sortOrder: number | undefined;
}

type SourceCategoryKey =
  | "avatarUrl"
  | "description"
  | "id"
  | "isEnabledByDefault"
  | "isHideable"
  | "isPartneredContent"
  | "isToggleable"
  | "name";

export const useSource = () => {
  const {
    ruleData,
    helperUtils: { lookupDataOrFallback },
    ruleDataUtils: { getSourceCategoryLookup },
  } = useCharacterEngine();
  const {
    ruleDataUtils: { getSourceDataLookup },
  } = useRuleData();
  const allSources = getSourceDataLookup(ruleData);
  const allSourceCategories = getSourceCategoryLookup(ruleData);

  // Returns the source ID from a given source
  const getSourceId = (source: SourceMappingContract) => source?.sourceId;

  const getSource = (sourceId: number | string) =>
    lookupDataOrFallback(allSources, sourceId);

  const getSourceName = (sourceId: number | string) =>
    lookupDataOrFallback(allSources, sourceId)?.name;

  const getSourceDescription = (sourceId: number | string) =>
    lookupDataOrFallback(allSources, sourceId)?.description;

  // Source Category direct access with category id
  const getSourceCategory = (sourceCategoryId: number) =>
    lookupDataOrFallback(allSourceCategories, sourceCategoryId);

  const getSourceCategoryDescription = (sourceCategoryId: number) =>
    getSourceCategory(sourceCategoryId)?.description;

  // Takes an array of any entity that contains a sources key and returns an array of sorted SourceCategoryGroup representing each Source Category with the category data and an array of the entities that belong to that category.
  const getSourceCategoryGroups = <
    T extends {
      sources: SourceMappingContract[] | null;
    }
  >(
    items: Array<T>
  ): Array<SourceCategoryGroup<T>> => {
    let groups: Array<SourceCategoryGroup<T>> = [];

    items.forEach((item) => {
      const sourceContracts = item.sources ?? [];

      //get the source data for each source contract
      const sources = sourceContracts
        .map((source) =>
          HelperUtils.lookupDataOrFallback(
            RuleDataUtils.getSourceDataLookup(ruleData),
            source.sourceId
          )
        )
        .filter(TypeScriptUtils.isNotNullOrUndefined);

      //get the source category name for the first source contract or default to Homebrew
      const sourceCategoryName =
        sources.length > 0 &&
        sources[0].sourceCategory &&
        sources[0].sourceCategory.name
          ? sources[0].sourceCategory.name
          : "Homebrew";

      // Search the availableGroupedOptions array for the source category
      const index = groups.findIndex(
        (element) => element.name === sourceCategoryName
      );

      // If the source category wasn't found, add it as a new option group.
      if (index < 0) {
        groups.push({
          name: sourceCategoryName,
          id: sources[0]?.sourceCategory?.id || 0,
          sortOrder: sources[0]?.sourceCategory?.sortOrder,
          items: [item],
        });
        // Otherwise, add the option to the existing source category's array of options.
      } else {
        groups[index].items.push(item);
      }
    });

    return orderBy(groups, "sortOrder");
  };

  // Takes an array of any entity's DefinitionContract and returns an array of sorted HtmlSelectOptionGroup representing each Source Category and a sorted array of options.
  const getGroupedOptionsBySourceCategory = <
    T extends {
      sources: SourceMappingContract[] | null;
      name: string | null;
      id: number;
      description?: string | null;
    }
  >(
    items: Array<T>,
    optionValue?: number | null,
    entityRestrictionData?: EntityRestrictionData,
    labelFallback?: string
  ): HtmlSelectOptionGroup[] => {
    return SourceUtils.getGroupedOptionsBySourceCategory(
      items,
      ruleData,
      optionValue,
      entityRestrictionData,
      labelFallback
    );
  };

  //Given an array of choiceOptionContracts, return an array of SimpleSourcedDefinitionContracts (these are used to create grouped options in a select dropdown)
  const getSimpleSourcedDefinitionContracts = (
    choiceOptionContracts: Array<BuilderChoiceOptionContract>
  ): Array<SimpleSourcedDefinitionContract> => {
    return SourceUtils.getSimpleSourcedDefinitionContracts(
      choiceOptionContracts
    );
  };

  // Compares a source's category to a given match and returns a boolean value
  const matchSourceCategory = (
    sourceId: number,
    match: string,
    key: SourceCategoryKey = "name"
  ) => {
    if (!sourceId) return false;

    const source = lookupDataOrFallback(allSources, sourceId);
    if (!source) return false;

    if (source.sourceCategory?.[key] === match) return true;
  };

  return {
    allSources,
    getSource,
    getSourceId,
    getSourceCategory,
    getSourceCategoryDescription,
    getSourceDescription,
    getSourceName,
    matchSourceCategory,
    getGroupedOptionsBySourceCategory,
    getSimpleSourcedDefinitionContracts,
    getSourceCategoryGroups,
  };
};
