import { orderBy } from 'lodash';
import { TypeScriptUtils } from "../../utils";
import { ClassAccessors } from '../Class';
import { AbilityStatEnum, BuilderChoiceSubtypeEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { EntityUtils } from '../Entity';
import { HelperUtils } from '../Helper';
import { ModifierAccessors } from '../Modifier';
import { SourceUtils } from '../Source';
import { SpellUtils } from '../Spell';
import { getDefaultSubtypes, getOptions, getOptionValue, isOptional } from './accessors';
export function isOnlyDefaultSelected(choice) {
    const defaultSubtypes = getDefaultSubtypes(choice);
    if (defaultSubtypes.length !== 1) {
        return false;
    }
    if (!getOptionValue(choice)) {
        return false;
    }
    const selectedOption = getSelectedOption(choice);
    if (selectedOption) {
        return selectedOption.label === defaultSubtypes[0];
    }
    return false;
}
export function getSelectedOption(choice) {
    return getOptions(choice).find((option) => option.id === getOptionValue(choice));
}
export function isOptionSelected(choice) {
    return !!getSelectedOption(choice);
}
export function isTodo(choice) {
    return !isOptional(choice) && getOptionValue(choice) === null;
}
// Given a Choice, return options for a select element that are potentially grouped by sourceCategory
//used in DetailChoiceFeat.tsx for feat choices
export function getSortedChoiceOptionsInfo(choice, ruleData, entityRestrictionData) {
    var _a;
    const options = getOptions(choice);
    let description;
    // If every option in the array has a null sourceId, ignore sorting by sourceId.
    // If any option has a non-null sourceId, sort by sourceId.
    const shouldSortBySourceId = options.some((option) => option.hasOwnProperty('sourceId') && option.sourceId !== null);
    let featChoiceOptions;
    //If the options have a sourceId, group them by Source Category (for now this should only be BuilderChoiceTypeEnum.ENTITY_SPELL_OPTION - we also have to do this in FeatureChoice for spell options)
    if (shouldSortBySourceId) {
        // Map over the options to mock parts of a DefinitionContract.
        const groupedOptions = SourceUtils.getSimpleSourcedDefinitionContracts(options);
        //If there is a chosen option, set detailChoiceDesc to its description.
        const chosenOption = options.find((option) => option.id === getOptionValue(choice));
        description = (_a = chosenOption === null || chosenOption === void 0 ? void 0 : chosenOption.description) !== null && _a !== void 0 ? _a : '';
        featChoiceOptions = SourceUtils.getGroupedOptionsBySourceCategory(groupedOptions, ruleData, chosenOption === null || chosenOption === void 0 ? void 0 : chosenOption.id, entityRestrictionData);
    }
    else {
        featChoiceOptions = options.map((option) => (Object.assign(Object.assign({}, option), { value: option.id })));
        featChoiceOptions = orderBy(featChoiceOptions, 'label');
    }
    return {
        options: featChoiceOptions,
        description,
    };
}
// filter Choice options based on modifiers and default subtypes that identify when a user has made a choice from another source. We filter those options out or we append the source data origin name next to the option label
export function getRemainingOptions(options, modifiers, defaultSubtypes, showBackgroundProficiencyOptions, optionValue) {
    let remainingSubtypes = [];
    let selectedOption = options.find((option) => option.value === optionValue);
    //if there is a default option set, the default option is granted automatically.
    //defaultSubtypes would be an array of remaining options and we need to filter out anything that is already found in a modifier from another source
    if (defaultSubtypes) {
        if (defaultSubtypes.length > 1) {
            defaultSubtypes.forEach((defaultSubtype) => {
                if (!modifiers.find((modifier) => modifier.friendlySubtypeName === defaultSubtype) ||
                    (selectedOption && selectedOption.label === defaultSubtype)) {
                    remainingSubtypes.push(defaultSubtype);
                }
            });
        }
        else if (defaultSubtypes.length === 1 &&
            !modifiers.find((modifier) => modifier.friendlySubtypeName === defaultSubtypes[0])) {
            remainingSubtypes = [...defaultSubtypes];
        }
    }
    // If there are any remaining subtypes, only show those
    if (remainingSubtypes.length) {
        options = options.filter((option) => remainingSubtypes.includes(option.label ? option.label : '') || optionValue === option.value);
    }
    else {
        // If there aren't any remaining subtype defaults, just show the normal list of options
        if (modifiers.length) {
            options = options.reduce((acc, option) => {
                // Find any existing modifiers that are the current option
                let optionModifiers = modifiers.filter((modifier) => modifier.friendlySubtypeName === option.label);
                let backgroundOptionModifier = null;
                if (showBackgroundProficiencyOptions && optionModifiers.length) {
                    // If there are any existing modifiers, find out if any of them are from a background
                    const foundBackgroundOptionModifier = optionModifiers.find((modifier) => !ModifierAccessors.isGranted(modifier) &&
                        ModifierAccessors.getDataOriginType(modifier) === DataOriginTypeEnum.BACKGROUND);
                    if (foundBackgroundOptionModifier) {
                        backgroundOptionModifier = foundBackgroundOptionModifier;
                    }
                }
                if (!optionModifiers.length || backgroundOptionModifier || optionValue === option.value) {
                    let value = typeof option.value === 'string' ? HelperUtils.parseInputInt(option.value) : option.value;
                    //append the dataOrigin of the modifier (background) to the option label so the user knows where the option was selected
                    if (value !== null) {
                        acc.push(Object.assign(Object.assign({}, option), { value: value, label: backgroundOptionModifier
                                ? `${option.label} (${EntityUtils.getDataOriginName(ModifierAccessors.getDataOrigin(backgroundOptionModifier))})`
                                : option.label }));
                    }
                }
                return acc;
            }, []);
        }
    }
    return options;
}
//TODO this was abstracted from DetailChoice.tsx and needs to be broken down to smaller utils and simplified
//TODO also need to remove the Array<any> type when gathering the renderOptions and fix the typing
export function getSortedRenderOptions(options, classId, subType, entityRestrictionData, languages, ruleData, defaultSubtypes, showBackgroundProficiencyOptions, choiceInfo, optionValue) {
    const { classSpellLists, proficiencyModifiers, languageModifiers, expertiseModifiers, kenseiModifiers, abilityLookup, } = choiceInfo;
    // TODO need to get rid of this any and fix the typing
    // let renderOptions: Array<FeatureChoiceOption | HtmlSelectOptionGroup> = options;
    let renderOptions = options;
    switch (subType) {
        case BuilderChoiceSubtypeEnum.PROFICIENCY:
            renderOptions = getRemainingOptions(renderOptions, [...proficiencyModifiers, ...expertiseModifiers], defaultSubtypes, showBackgroundProficiencyOptions, optionValue);
            break;
        case BuilderChoiceSubtypeEnum.LANGUAGE:
            //handle languages based on other language choices made
            renderOptions = getRemainingOptions(renderOptions, languageModifiers, defaultSubtypes, showBackgroundProficiencyOptions, optionValue);
            //create lookup from ruledata - name: rpgSourceId
            const languageNameLookup = languages.reduce((acc, curr) => {
                var _a;
                return Object.assign(Object.assign({}, acc), { [(_a = curr.name) !== null && _a !== void 0 ? _a : '']: curr.rpgSourceId });
            }, {});
            //transform language options to choiceOptionContracts to attach sourceId for grouping by Source Category
            const choiceOptionContracts = renderOptions.map((option) => {
                return {
                    label: option.label,
                    id: option.id,
                    description: option.description,
                    sourceId: option.label ? HelperUtils.lookupDataOrFallback(languageNameLookup, option.label) : null,
                };
            });
            const groupedOptions = SourceUtils.getSimpleSourcedDefinitionContracts(choiceOptionContracts);
            //group languages by source category
            renderOptions = SourceUtils.getGroupedOptionsBySourceCategory(groupedOptions, ruleData, optionValue, entityRestrictionData, 'Other');
            break;
        case BuilderChoiceSubtypeEnum.KENSEI:
            renderOptions = getRemainingOptions(renderOptions, kenseiModifiers, defaultSubtypes, showBackgroundProficiencyOptions, optionValue);
            break;
        case BuilderChoiceSubtypeEnum.EXPERTISE:
            renderOptions = renderOptions.filter((option) => (proficiencyModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === option.label) &&
                !expertiseModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === option.label)) ||
                optionValue === option.value);
            break;
        case BuilderChoiceSubtypeEnum.EXPERTISE_NO_REQUIREMENT:
            renderOptions = renderOptions.filter((option) => !expertiseModifiers.find((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier) === option.label) || optionValue === option.value);
            break;
        case BuilderChoiceSubtypeEnum.KNOWN_SPELLS:
            const spellList = classSpellLists.find((classSpellList) => ClassAccessors.getId(classSpellList.charClass) === classId);
            if (spellList) {
                renderOptions = renderOptions
                    .map((topOption) => {
                    if ('options' in topOption && topOption.options) {
                        return Object.assign(Object.assign({}, topOption), { options: topOption.options.filter((option) => SpellUtils.isSpellKnown(spellList, Number(option.value)) ||
                                optionValue === option.value) });
                    }
                    else {
                        const singleOption = topOption;
                        return SpellUtils.isSpellKnown(spellList, Number(singleOption.value)) ||
                            optionValue === singleOption.value
                            ? singleOption
                            : null;
                    }
                })
                    .filter(TypeScriptUtils.isNotNullOrUndefined);
            }
            break;
        case BuilderChoiceSubtypeEnum.ABILITY_SCORE: {
            renderOptions = renderOptions.filter((option) => {
                let abilityId = null;
                switch (option.label) {
                    case 'Charisma Score':
                        abilityId = AbilityStatEnum.CHARISMA;
                        break;
                    case 'Constitution Score':
                        abilityId = AbilityStatEnum.CONSTITUTION;
                        break;
                    case 'Dexterity Score':
                        abilityId = AbilityStatEnum.DEXTERITY;
                        break;
                    case 'Intelligence Score':
                        abilityId = AbilityStatEnum.INTELLIGENCE;
                        break;
                    case 'Strength Score':
                        abilityId = AbilityStatEnum.STRENGTH;
                        break;
                    case 'Wisdom Score':
                        abilityId = AbilityStatEnum.WISDOM;
                        break;
                }
                return !abilityId || (abilityId && !abilityLookup[abilityId].isMaxed) || optionValue === option.value;
            });
            break;
        }
    }
    return renderOptions.length > 0 && renderOptions[0].hasOwnProperty('optGroupLabel')
        ? orderBy(renderOptions, 'sortOrder')
        : orderBy(renderOptions, 'label');
}
