import { groupBy, orderBy, uniqBy } from 'lodash';
import { AbilityDerivers } from '../Ability';
import * as CampaignAccessors from '../Campaign/accessors';
import { AbilityStatEnum } from '../Core';
import { DataOriginGenerators } from '../DataOrigin';
import { HelperUtils } from '../Helper';
import { ItemValidators } from '../Item';
import { RuleDataAccessors } from '../RuleData';
import { getComponentId, getComponentTypeId, getId, getRestriction, getSubType } from './accessors';
import { ModifierSubTypeEnum } from './constants';
import { deriveValue } from './derivers';
import { hack__updateDisadvantageModifiers } from './hacks';
import { isExpertiseModifier, isImmunityModifier, isKenseiWeaponModifier, isLanguageModifier, isProficiencyModifier, isResistanceModifier, isValidAdvantageSaveModifier, isValidBonusSaveModifier, isValidBonusStatScoreModifier, isValidDisadvantageSaveModifier, isVulnerabilityModifier, } from './validators';
/**
 *
 * @param modifier
 */
export function generateDataOriginKey(modifier) {
    return DataOriginGenerators.generateDataOriginKey(getComponentId(modifier), getComponentTypeId(modifier));
}
/**
 *
 * @param modifiers
 */
export function generateModifierComponentLookup(modifiers) {
    return groupBy(modifiers, (modifier) => generateDataOriginKey(modifier));
}
/**
 *
 * @param modifiers
 * @param partyInfo
 */
export function generateItemModifierLookup(modifiers, partyInfo) {
    const partyItemModifiers = partyInfo ? CampaignAccessors.getItemModifiers(partyInfo) : [];
    return generateModifierComponentLookup(uniqBy([...partyItemModifiers, ...modifiers], (modifier) => getId(modifier)));
}
/**
 *
 * @param proficiencyBonus
 * @param attunedItems
 */
export function generateModifierDataPreAbilities(proficiencyBonus, attunedItems) {
    return {
        abilityLookup: null,
        proficiencyBonus,
        attunedItemCount: attunedItems.length,
    };
}
/**
 *
 * @param abilityLookup
 * @param modifierDataPreAbilities
 * @param attunedItems
 */
export function generateModifierData(abilityLookup, modifierDataPreAbilities, attunedItems) {
    return Object.assign(Object.assign({}, modifierDataPreAbilities), { abilityLookup, attunedItemCount: attunedItems.length });
}
/**
 *
 * @param abilityLookup
 */
export function generateDexModifier(abilityLookup) {
    return AbilityDerivers.deriveStatModifier(AbilityStatEnum.DEXTERITY, abilityLookup);
}
/**
 *
 * @param abilityLookup
 */
export function generateConModifier(abilityLookup) {
    return AbilityDerivers.deriveStatModifier(AbilityStatEnum.CONSTITUTION, abilityLookup);
}
/**
 *
 * @param abilityLookup
 */
export function generateStrScore(abilityLookup) {
    return AbilityDerivers.deriveStatScore(AbilityStatEnum.STRENGTH, abilityLookup);
}
/**
 *
 * @param modifiers
 */
export function generateUniqueProficiencyModifiers(modifiers) {
    return uniqBy(modifiers, (modifier) => getSubType(modifier));
}
/**
 *
 * @param modifiers
 * @param modifierData
 * @param ruleData
 */
export function generateBonusSavingThrowModifiers(modifiers, modifierData, ruleData) {
    let saveModifiers = modifiers.filter((modifier) => isValidBonusSaveModifier(modifier));
    RuleDataAccessors.getStats(ruleData).forEach((statData) => {
        saveModifiers = [
            ...saveModifiers,
            ...modifiers.filter((modifier) => isValidBonusSaveModifier(modifier, statData.id)),
        ];
    });
    const orderedSaveModifiers = orderBy(uniqBy(saveModifiers, 'id'), [(modifier) => getSubType(modifier) === ModifierSubTypeEnum.SAVING_THROWS, 'friendlySubtypeName'], ['desc']);
    return orderedSaveModifiers.map((saveModifier) => {
        const valueTotal = deriveValue(saveModifier, modifierData, 1);
        return Object.assign(Object.assign({}, saveModifier), { valueTotal });
    });
}
/**
 *
 * @param modifiers
 * @param ruleData
 */
export function generateAdvantageSavingThrowModifiers(modifiers, ruleData) {
    let saveModifiers = modifiers.filter((modifier) => isValidAdvantageSaveModifier(modifier));
    RuleDataAccessors.getStats(ruleData).forEach((statData) => {
        saveModifiers = [
            ...saveModifiers,
            ...modifiers.filter((modifier) => isValidAdvantageSaveModifier(modifier, statData.id)),
        ];
    });
    return uniqBy(saveModifiers, 'id');
}
/**
 *
 * @param modifiers
 * @param equippedItems
 * @param ruleData
 */
export function generateDisadvantageSavingThrowModifiers(modifiers, equippedItems, ruleData) {
    let saveModifiers = modifiers.filter(isValidDisadvantageSaveModifier);
    RuleDataAccessors.getStats(ruleData).forEach((statData) => {
        saveModifiers = [
            ...saveModifiers,
            ...modifiers.filter((modifier) => isValidDisadvantageSaveModifier(modifier, statData.id)),
        ];
    });
    saveModifiers = hack__updateDisadvantageModifiers(saveModifiers, equippedItems.filter(ItemValidators.isNonProficientEquippedArmorItem));
    return uniqBy(saveModifiers, 'id');
}
/**
 *
 * @param modifiers
 * @param abilityId
 */
export function generateBonusStatScoreModifiers(modifiers, abilityId) {
    return modifiers.filter((modifier) => isValidBonusStatScoreModifier(modifier, abilityId));
}
/**
 *
 * @param modifiers
 */
export function generateProficiencyModifiers(modifiers) {
    return modifiers.filter(isProficiencyModifier);
}
/**
 *
 * @param modifiers
 */
export function generateExpertiseModifiers(modifiers) {
    return modifiers.filter(isExpertiseModifier);
}
/**
 *
 * @param modifiers
 */
export function generateLanguageModifiers(modifiers) {
    return modifiers.filter(isLanguageModifier);
}
/**
 *
 * @param modifiers
 */
export function generateKenseiModifiers(modifiers) {
    return modifiers.filter(isKenseiWeaponModifier);
}
/**
 *
 * @param modifiers
 */
export function generateResistanceModifiers(modifiers) {
    return modifiers.filter(isResistanceModifier);
}
/**
 *
 * @param modifiers
 */
export function generateImmunityModifiers(modifiers) {
    return modifiers.filter(isImmunityModifier);
}
/**
 *
 * @param modifiers
 */
export function generateVulnerabilityModifiers(modifiers) {
    return modifiers.filter(isVulnerabilityModifier);
}
/**
 *
 * @param modifiers
 */
export function generateRestrictedBonusSavingThrowModifiers(modifiers) {
    return modifiers.filter(getRestriction);
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param modifierLookup
 * @param dataOriginType
 * @param primary
 * @param parent
 * @param extraModifiers
 */
export function generateModifiers(id, entityTypeId, modifierLookup, dataOriginType, primary, parent = null, extraModifiers = []) {
    const modifierContractFallback = [];
    const sourceModifierContracts = HelperUtils.lookupDataOrFallback(modifierLookup, DataOriginGenerators.generateDataOriginKey(id, entityTypeId), modifierContractFallback);
    const modifierContracts = [...extraModifiers, ...sourceModifierContracts];
    let modifiers = [];
    if (modifierContracts.length > 0) {
        modifiers = modifierContracts.map((modifier) => generateModifier(modifier, dataOriginType, primary, parent));
    }
    return modifiers;
}
/**
 *
 * @param modifierContract
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateModifier(modifierContract, dataOriginType, primary, parent = null) {
    return Object.assign(Object.assign({}, modifierContract), { dataOrigin: DataOriginGenerators.generateDataOrigin(dataOriginType, primary, parent) });
}
/**
 *
 * @param equipmentModifiers
 * @param featModifiers
 * @param backgroundModifiers
 */
export function generateMiscModifiers(equipmentModifiers, featModifiers, backgroundModifiers) {
    return [...equipmentModifiers, ...featModifiers, ...backgroundModifiers];
}
/**
 *
 * @param raceModifiers
 * @param classModifiers
 * @param featModifiers
 * @param backgroundModifiers
 * @param equipmentModifiers
 * @param conditionModifiers
 */
export function generateValidGlobalModifiers(raceModifiers, classModifiers, featModifiers, backgroundModifiers, equipmentModifiers, conditionModifiers) {
    return [
        ...raceModifiers,
        ...classModifiers,
        ...featModifiers,
        ...backgroundModifiers,
        ...equipmentModifiers,
        ...conditionModifiers,
    ];
}
