import { has, orderBy, uniqBy } from 'lodash';
import { TypeScriptUtils } from "../../utils";
import { CharacterValidators } from '../Character';
import { SourceTypeEnum, } from '../Core';
import { HelperUtils } from '../Helper';
import { RuleDataUtils, RuleDataAccessors } from '../RuleData';
export const getSourceFullNames = (sources, ruleData) => {
    return sources
        .map((sourceMapping) => RuleDataUtils.getSourceDataInfo(sourceMapping.sourceId, ruleData))
        .map((source) => source === null || source === void 0 ? void 0 : source.description)
        .filter(TypeScriptUtils.isNotNullOrUndefined);
};
//Given an array of choiceOptionContracts, return an array of SimpleSourcedDefinitionContracts (these are used to create grouped options in a select dropdown)
export const getSimpleSourcedDefinitionContracts = (choiceOptionContracts) => {
    return choiceOptionContracts.map((contract) => {
        //If the contract has a sourceId, create a source contract with a sourceType of PRIMARY
        const sources = contract.sourceId
            ? [
                {
                    sourceId: contract.sourceId,
                    pageNumber: null,
                    sourceType: SourceTypeEnum.PRIMARY,
                },
            ]
            : null;
        return {
            sources: sources,
            name: contract.label,
            id: contract.id,
            description: contract.description,
        };
    });
};
// Takes an array of any entity's DefinitionContract and returns an array of sorted HtmlSelectOptionGroup representing each Source Category and a sorted array of options.
export const getGroupedOptionsBySourceCategory = (items, ruleData, optionValue, entityRestrictionData, labelFallback) => {
    let groupedOptions = [];
    //filter any items with a sourceId based on active and entitled sources
    if (entityRestrictionData) {
        items = items.filter((item) => {
            var _a, _b;
            //always include the option that is selected
            if (item.id === optionValue) {
                return true;
            }
            const primarySources = ((_a = item.sources) === null || _a === void 0 ? void 0 : _a.filter(CharacterValidators.isPrimarySource)) || [];
            const sourceId = ((_b = primarySources[0]) === null || _b === void 0 ? void 0 : _b.sourceId) || null;
            if (sourceId) {
                return has(entityRestrictionData.activeSourceLookup, sourceId);
            }
            //filter out homebrew content if the user has it disabled and there is not labelFallback passed in (Label fallback is only used if the item should not be considered Homebrew when sourceId is null)
            if (entityRestrictionData.preferences.useHomebrewContent === false && !labelFallback && !sourceId) {
                return false;
            }
            return true;
        });
    }
    items.forEach((item) => {
        var _a, _b, _c;
        //get the primary sources for each entity (there should only be one)
        const primarySources = ((_a = item.sources) === null || _a === void 0 ? void 0 : _a.filter(CharacterValidators.isPrimarySource)) || [];
        //get the source data for each source contract
        const sources = primarySources
            .map((source) => HelperUtils.lookupDataOrFallback(RuleDataAccessors.getSourceDataLookup(ruleData), source.sourceId))
            .filter(TypeScriptUtils.isNotNullOrUndefined);
        //get the source category name for the first source contract or default to Homebrew
        const label = labelFallback ? labelFallback : 'Homebrew';
        const sourceCategoryName = sources.length > 0 && sources[0].sourceCategory && sources[0].sourceCategory.name
            ? sources[0].sourceCategory.name
            : label;
        const option = {
            label: item.name,
            value: item.id,
            id: item.id,
            description: item.description ? item.description : '',
        };
        // Search the availableGroupedOptions array for the source category
        const index = groupedOptions.findIndex((element) => element.optGroupLabel === sourceCategoryName);
        // If the source category wasn't found, add it as a new option group.
        if (index < 0) {
            groupedOptions.push({
                optGroupLabel: sourceCategoryName,
                sortOrder: (_c = (_b = sources[0]) === null || _b === void 0 ? void 0 : _b.sourceCategory) === null || _c === void 0 ? void 0 : _c.sortOrder,
                options: [option],
            });
            // Otherwise, add the option to the existing source category's array of options.
        }
        else {
            groupedOptions[index].options.push(option);
        }
    });
    // Return ordered category groups with ordered options within each group
    return orderBy(groupedOptions, 'sortOrder').map((group) => {
        //TODO - sort options by lowercase
        return {
            optGroupLabel: group.optGroupLabel,
            options: orderBy(group.options, 'label'),
        };
    });
};
//Given an array of entity Definitions, return an array of SimpleSourceCategoryContracts including Homebrew
export const getSimpleSourceCategoriesData = (items, ruleData, activeSourceCategories) => {
    const filteredCategories = items.flatMap((item) => {
        var _a, _b, _c;
        const sources = item.sources || [];
        // Get the data for the first source category
        const sourceData = sources
            .map((source) => HelperUtils.lookupDataOrFallback(RuleDataAccessors.getSourceDataLookup(ruleData), source.sourceId))
            .find(TypeScriptUtils.isNotNullOrUndefined); //Find the first non-null source data
        // Map source category data to a simple source category object
        const category = {
            id: ((_a = sourceData === null || sourceData === void 0 ? void 0 : sourceData.sourceCategory) === null || _a === void 0 ? void 0 : _a.id) || 0,
            name: ((_b = sourceData === null || sourceData === void 0 ? void 0 : sourceData.sourceCategory) === null || _b === void 0 ? void 0 : _b.name) || 'Homebrew',
            sortOrder: (_c = sourceData === null || sourceData === void 0 ? void 0 : sourceData.sourceCategory) === null || _c === void 0 ? void 0 : _c.sortOrder,
        };
        // Look for the sourceCategory in the user preferences array or include Homebrew if id is 0
        if (category.id === 0 || activeSourceCategories.includes(category.id)) {
            return category;
        }
        // If the source was not found in user preferences ignore it
        return [];
    });
    const uniqueSourceCategories = uniqBy(filteredCategories, (sourceCategory) => sourceCategory.id);
    return orderBy(uniqueSourceCategories, 'sortOrder');
};
