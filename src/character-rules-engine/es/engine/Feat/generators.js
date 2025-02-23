import { groupBy, keyBy } from 'lodash';
import { FeatAccessors } from '.';
import { ActionGenerators } from '../Action';
import { BackgroundAccessors } from '../Background';
import { ChoiceGenerators } from '../Choice';
import { ClassAccessors } from '../Class';
import { ClassFeatureAccessors } from '../ClassFeature';
import { EntityTypeEnum, INITIAL_ASI_TAG_NAME, DISPLAY_WITH_DATA_ORIGIN_TAG_NAME, BuilderChoiceTypeEnum, } from '../Core';
import { CreatureRuleGenerators } from '../CreatureRule';
import { DataOriginDataInfoKeyEnum, DataOriginGenerators, DataOriginTypeEnum, } from '../DataOrigin';
import { tryGetParentId, tryGetPrimaryId } from '../Entity/utils';
import { HelperUtils } from '../Helper';
import { ModifierGenerators } from '../Modifier';
import { OptionAccessors, OptionGenerators } from '../Option';
import { RaceAccessors } from '../Race';
import { SpellGenerators } from '../Spell';
import { getComponentId, getComponentTypeId, getCreatureRules, getEntityTypeId, getId, getModifiers, getOptions, getUniqueKey, } from './accessors';
/**
 *
 * @param feat
 */
export function generateDataOriginKey(feat) {
    const componentId = getComponentId(feat);
    const componentTypeId = getComponentTypeId(feat);
    return DataOriginGenerators.generateDataOriginKey(componentId ? componentId : -1, componentTypeId ? componentTypeId : -1);
}
/**
 *
 * @param feats
 * @param optionLookup
 * @param actionLookup
 * @param choiceLookup
 * @param modifierLookup
 * @param spellLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 */
export function generateBaseFeats(feats, optionLookup, actionLookup, choiceLookup, modifierLookup, spellLookup, valueLookup, spellListDataOriginLookup, ruleData) {
    return feats.map((feat) => generateBaseFeat(feat, optionLookup, actionLookup, choiceLookup, modifierLookup, spellLookup, valueLookup, spellListDataOriginLookup, ruleData));
}
/**
 *
 * @param feat
 * @param optionLookup
 * @param actionLookup
 * @param choiceLookup
 * @param modifierLookup
 * @param spellLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 */
export function generateBaseFeat(feat, optionLookup, actionLookup, choiceLookup, modifierLookup, spellLookup, valueLookup, spellListDataOriginLookup, ruleData) {
    const id = getId(feat);
    const entityTypeId = getEntityTypeId(feat);
    const actions = ActionGenerators.generateBaseActions(id, entityTypeId, actionLookup, valueLookup, DataOriginTypeEnum.FEAT, feat);
    const choices = ChoiceGenerators.generateBaseChoices(id, entityTypeId, choiceLookup, DataOriginTypeEnum.FEAT, feat);
    const spells = SpellGenerators.generateBaseSpells(id, entityTypeId, spellLookup, DataOriginTypeEnum.FEAT, feat, feat, ruleData, spellListDataOriginLookup, valueLookup);
    const modifiers = ModifierGenerators.generateModifiers(id, entityTypeId, modifierLookup, DataOriginTypeEnum.FEAT, feat, feat);
    const options = generateBaseFeatOptions(feat, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData);
    return Object.assign(Object.assign({}, feat), { actions,
        choices,
        spells,
        modifiers,
        options });
}
/**
 * Returns a lookup mapping of Feat List Contracts by Feat List ID,
 * for any Feat Lists that come from the Background.
 */
function getBackgroundFeatListsById(background) {
    const mapping = new Map();
    if (!background)
        return mapping;
    for (const featList of BackgroundAccessors.getFeatListContracts(background)) {
        mapping.set(featList.id, featList);
    }
    return mapping;
}
/**
 * Returns a lookup mapping of Feat List Contracts by Feat List ID,
 * for any Feat Lists that come from Class Features.
 */
function getClassFeatureFeatListsById(classes) {
    const mapping = new Map();
    for (const cls of classes) {
        for (const clsFeature of ClassAccessors.getClassFeatures(cls)) {
            const featLists = ClassFeatureAccessors.getFeatListContracts(clsFeature);
            for (const featList of featLists) {
                mapping.set(featList.id, featList);
            }
        }
    }
    return mapping;
}
/**
 * Returns a lookup mapping of Class Features by Feat List ID,
 * for any Feat Lists that come from Class Features.
 */
function getClassFeaturesByFeatListId(classes) {
    // this assumes a feat list only belongs to one class feature
    const mapping = new Map();
    for (const cls of classes) {
        for (const clsFeature of ClassAccessors.getClassFeatures(cls)) {
            const featLists = ClassFeatureAccessors.getFeatListContracts(clsFeature);
            for (const featList of featLists) {
                mapping.set(featList.id, clsFeature);
            }
        }
    }
    return mapping;
}
export function generateAggregatedFeats(baseFeats, classes, race, background, choicesFromClasses) {
    const feats = [];
    classes.forEach((charClass) => {
        feats.push(...ClassAccessors.getFeats(charClass));
    });
    if (race) {
        feats.push(...RaceAccessors.getFeats(race));
    }
    // Group entities by FeatList ID
    const backgroundFeatListsById = getBackgroundFeatListsById(background);
    const classFeatureFeatListsById = getClassFeatureFeatListsById(classes);
    const classFeaturesByFeatListId = getClassFeaturesByFeatListId(classes);
    baseFeats.forEach((feat) => {
        if (feat.componentId === null) {
            feats.push(Object.assign(Object.assign({}, feat), { dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.ADHOC, feat) }));
        }
        else if (feat.componentTypeId === EntityTypeEnum.FEAT_LIST) {
            // Find which entity this feat list comes from
            const featListId = feat.componentId;
            if (backgroundFeatListsById.has(featListId)) {
                const featListContract = backgroundFeatListsById.get(featListId);
                feats.push(Object.assign(Object.assign({}, feat), { dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.FEAT_LIST, featListContract, // primary
                    background, // parent
                    DataOriginTypeEnum.BACKGROUND) }));
            }
            else if (classFeatureFeatListsById.has(featListId)) {
                const featListContract = classFeatureFeatListsById.get(featListId);
                const classFeature = classFeaturesByFeatListId.get(featListId);
                feats.push(Object.assign(Object.assign({}, feat), { dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.FEAT_LIST, featListContract, // primary
                    classFeature, // parent
                    DataOriginTypeEnum.CLASS_FEATURE) }));
            }
        }
        else if (feat.componentTypeId === EntityTypeEnum.CLASS_FEATURE_OPTION_KNOWN) {
            // These are feats that come from class feature options.
            // Primary data origin is the class feature.
            // Parent data origin is the class.
            const dataOrigin = findClassFeatureOptionFeatDataOrigin(feat, classes, choicesFromClasses);
            if (dataOrigin) {
                feats.push(Object.assign(Object.assign({}, feat), { dataOrigin }));
            }
        }
    });
    return feats;
}
function findClassFeatureOptionFeatDataOrigin(feat, classes, choicesFromClasses) {
    // It's not exactly a hack, but it is tricky to find the data origin
    // for Feats that come from Class Feature Options.
    // Search for the corresponding builder choice for this feat id.
    const featId = FeatAccessors.getId(feat);
    const choice = choicesFromClasses.find((c) => c.type === BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION && c.optionValue === featId);
    // Ensure that the builder choice has a parent, and the component type is the expected kind.
    if ((choice === null || choice === void 0 ? void 0 : choice.parentChoiceId) && choice.componentTypeId === EntityTypeEnum.CLASS_FEATURE) {
        // The parent choice key has the slot id in the second part.
        const slotId = parseChoiceKey(choice.parentChoiceId)[1];
        // Confirm that this slot matches the component id of the feat
        if (slotId && feat.componentId === slotId) {
            // The class feature id is the component id of the builder choice.
            const classFeatureId = choice.componentId;
            // Find the class and class feature that it came from
            for (const cls of classes) {
                for (const classFeature of ClassAccessors.getClassFeatures(cls)) {
                    if (ClassFeatureAccessors.getId(classFeature) === classFeatureId) {
                        // Make the data origin. Finally!
                        return DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.CLASS_FEATURE, // primary type
                        classFeature, // primary
                        cls, // parent
                        DataOriginTypeEnum.CLASS);
                    }
                }
            }
        }
    }
    return null;
}
function parseChoiceKey(choiceKey) {
    // choice keys are hyphen separated strings of numbers, with 1, 2, or 3 parts.
    return choiceKey.split('-').map((part) => parseInt(part));
}
/**
 *
 * @param feats
 */
export function generateFeatComponentLookup(feats) {
    return groupBy(feats, (feat) => generateDataOriginKey(feat));
}
/**
 *
 * @param feats
 */
export function generateFeatLookup(feats) {
    return keyBy(feats, (feat) => getId(feat));
}
/**
 *
 * @param feats
 * @param xpInfo
 * @param ruleData
 */
export function generateFeatCreatureRules(feats, xpInfo, ruleData) {
    const rules = [];
    feats.forEach((feat) => {
        const dataOrigin = DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.FEAT, feat);
        const featureRules = getCreatureRules(feat);
        featureRules.forEach((rule) => {
            rules.push(CreatureRuleGenerators.generateRule(rule, dataOrigin, xpInfo, ruleData));
        });
    });
    return rules;
}
/**
 *
 * @param feat
 * @param actionLookup
 * @param spellLookup
 * @param optionLookup
 * @param modifierLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 */
export function generateBaseFeatOptions(feat, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData) {
    const featId = getId(feat);
    const featEntityTypeId = getEntityTypeId(feat);
    const baseOptions = OptionGenerators.generateDataOriginBaseOptions(featId, featEntityTypeId, optionLookup, DataOriginTypeEnum.FEAT, feat);
    return OptionGenerators.generateOptions(baseOptions, DataOriginTypeEnum.FEAT, {}, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData, feat);
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param featLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateDataOriginFeats(id, entityTypeId, featLookup, dataOriginType, primary, parent = null) {
    const feats = HelperUtils.lookupDataOrFallback(featLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId));
    if (!feats) {
        return [];
    }
    return feats.map((feat) => (Object.assign(Object.assign({}, feat), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent) })));
}
/**
 *
 * @param feats
 */
export function generateFeatModifiers(feats) {
    const modifiers = [];
    if (feats.length === 0) {
        return modifiers;
    }
    feats.forEach((feat) => {
        modifiers.push(...getModifiers(feat));
        getOptions(feat).forEach((option) => {
            modifiers.push(...OptionAccessors.getModifiers(option));
        });
    });
    return modifiers;
}
/**
 *
 * @param feats
 */
export function generateRefFeatData(feats) {
    let data = {};
    feats.forEach((feat) => {
        data[getUniqueKey(feat)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: feat,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    });
    return data;
}
export function generateIsInitialAsiFromFeat(feats) {
    return feats.some((feat) => FeatAccessors.getCategories(feat).some((cat) => cat.tagName === INITIAL_ASI_TAG_NAME));
}
export function generateStandardFeats(feats) {
    return feats.filter((feat) => !FeatAccessors.getCategories(feat).some((cat) => cat.tagName === DISPLAY_WITH_DATA_ORIGIN_TAG_NAME));
}
const makeLookup = () => ({
    [DataOriginTypeEnum.ADHOC]: {},
    [DataOriginTypeEnum.BACKGROUND]: {},
    [DataOriginTypeEnum.CLASS]: {},
    [DataOriginTypeEnum.CLASS_FEATURE]: {},
    [DataOriginTypeEnum.CONDITION]: {},
    [DataOriginTypeEnum.CUSTOM]: {},
    [DataOriginTypeEnum.FEAT]: {},
    [DataOriginTypeEnum.ITEM]: {},
    [DataOriginTypeEnum.RACE]: {},
    [DataOriginTypeEnum.RULE_DATA]: {},
    [DataOriginTypeEnum.SIMULATED]: {},
    [DataOriginTypeEnum.UNKNOWN]: {},
    [DataOriginTypeEnum.VEHICLE]: {},
    [DataOriginTypeEnum.FEAT_LIST]: {},
});
/**
 * Builds a multilayered lookup object for feats that are tagged as data origin only.
 */
export function generateDataOriginPairedFeats(feats) {
    const dataOriginOnly = feats.filter((feat) => FeatAccessors.getCategories(feat).some((cat) => cat.tagName === DISPLAY_WITH_DATA_ORIGIN_TAG_NAME));
    const lookup = { byPrimary: makeLookup(), byParent: makeLookup() };
    for (const feat of dataOriginOnly) {
        const dataOrigin = FeatAccessors.getDataOrigin(feat);
        // primary
        if (dataOrigin.primary) {
            const id = tryGetPrimaryId(dataOrigin);
            if (id) {
                if (!lookup.byPrimary[dataOrigin.type].hasOwnProperty(id)) {
                    lookup.byPrimary[dataOrigin.type][id] = [feat];
                }
                else {
                    lookup.byPrimary[dataOrigin.type][id].push(feat);
                }
            }
        }
        // parent
        if (dataOrigin.parent && dataOrigin.parentType) {
            const id = tryGetParentId(dataOrigin);
            if (id) {
                if (!lookup.byParent[dataOrigin.parentType].hasOwnProperty(id)) {
                    lookup.byParent[dataOrigin.parentType][id] = [feat];
                }
                else {
                    lookup.byParent[dataOrigin.parentType][id].push(feat);
                }
            }
        }
    }
    return lookup;
}
