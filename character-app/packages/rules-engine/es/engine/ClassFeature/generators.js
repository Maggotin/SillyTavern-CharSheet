import { ActionGenerators } from '../Action';
import { ChoiceGenerators } from '../Choice';
import { ClassAccessors } from '../Class';
import { CreatureRuleGenerators } from '../CreatureRule';
import { DataOriginDataInfoKeyEnum, DataOriginGenerators, DataOriginTypeEnum, } from '../DataOrigin';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { FeatGenerators } from '../Feat';
import { FeatList } from '../FeatList';
import { InfusionChoiceGenerators } from '../InfusionChoice';
import { ModifierGenerators } from '../Modifier';
import { OptionAccessors, OptionGenerators } from '../Option';
import { SpellGenerators } from '../Spell';
import { getCreatureRules, getDefinitionKey, getEntityTypeId, getFeatListContracts, getId, getInfusionRules, getOptions, getUniqueKey, } from './accessors';
export function generateClassFeature(charClass, classFeature, ruleData, classesLookupData, definitionPool, characterId, choiceComponents, baseFeats) {
    const id = getId(classFeature);
    const entityTypeId = getEntityTypeId(classFeature);
    const { actionLookup, choiceLookup, modifierLookup, spellLookup, valueLookup, featLookup, optionLookup, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, spellListDataOriginLookup, } = classesLookupData;
    const actions = ActionGenerators.generateBaseActions(id, entityTypeId, actionLookup, valueLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass);
    const choices = ChoiceGenerators.generateBaseChoices(id, entityTypeId, choiceLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass);
    const modifiers = ModifierGenerators.generateModifiers(id, entityTypeId, modifierLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass);
    const spells = SpellGenerators.generateBaseSpells(id, entityTypeId, spellLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass, ruleData, spellListDataOriginLookup, valueLookup);
    const feats = FeatGenerators.generateDataOriginFeats(id, entityTypeId, featLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass);
    const options = generateClassFeatureOptions(classFeature, charClass, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData);
    const infusionChoices = InfusionChoiceGenerators.generateInfusionChoices(getInfusionRules(classFeature), DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass, infusionChoiceInfusionLookup, knownInfusionLookupByChoiceKey, characterId);
    const featLists = getFeatListContracts(classFeature).map((contract) => new FeatList(contract, choiceComponents.definitionKeyNameMap, baseFeats));
    return Object.assign(Object.assign({}, classFeature), { actions,
        choices,
        feats,
        modifiers,
        spells,
        options,
        infusionChoices, accessType: DefinitionPoolUtils.getDefinitionAccessType(getDefinitionKey(classFeature), definitionPool), featLists });
}
/**
 *
 * @param classFeature
 * @param charClass
 * @param featLookup
 * @param actionLookup
 * @param spellLookup
 * @param optionLookup
 * @param modifierLookup
 * @param valueLookup
 * @param spellListDataOriginLookup
 * @param ruleData
 */
export function generateClassFeatureOptions(classFeature, charClass, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData) {
    const baseOptions = OptionGenerators.generateDataOriginBaseOptions(getId(classFeature), getEntityTypeId(classFeature), optionLookup, DataOriginTypeEnum.CLASS_FEATURE, classFeature, charClass);
    return OptionGenerators.generateOptions(baseOptions, DataOriginTypeEnum.CLASS_FEATURE, featLookup, actionLookup, spellLookup, optionLookup, modifierLookup, valueLookup, spellListDataOriginLookup, ruleData, classFeature, charClass);
}
/**
 *
 * @param classes
 * @param xpInfo
 * @param ruleData
 */
export function generateClassCreatureRules(classes, xpInfo, ruleData) {
    const rules = [];
    classes.forEach((charClass) => {
        const features = ClassAccessors.getActiveClassFeatures(charClass);
        features.forEach((feature) => {
            const dataOrigin = DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.CLASS_FEATURE, feature, charClass);
            const featureRules = getCreatureRules(feature);
            featureRules.forEach((rule) => {
                rules.push(CreatureRuleGenerators.generateRule(rule, dataOrigin, xpInfo, ruleData));
            });
            const options = getOptions(feature);
            options.forEach((option) => {
                const optionRules = OptionAccessors.getCreatureRules(option);
                optionRules.forEach((rule) => {
                    rules.push(CreatureRuleGenerators.generateRule(rule, dataOrigin, xpInfo, ruleData));
                });
            });
        });
    });
    return rules;
}
/**
 *
 * @param classes
 */
export function generateRefClassFeatureData(classes) {
    let data = {};
    classes.forEach((charClass) => {
        ClassAccessors.getClassFeatures(charClass).forEach((classFeature) => {
            data[getUniqueKey(classFeature)] = {
                [DataOriginDataInfoKeyEnum.PRIMARY]: classFeature,
                [DataOriginDataInfoKeyEnum.PARENT]: charClass,
            };
        });
    });
    return data;
}
