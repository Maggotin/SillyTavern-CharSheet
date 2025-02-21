import { keyBy } from 'lodash';
import { SenseTypeEnum } from '../../Core';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
import { RuleDataUtils } from '../../RuleData';
import { derivePassiveInsight, derivePassiveInvestigation, derivePassivePerception } from '../derivers';
/**
 *
 * @param senseKey
 * @param modifiers
 * @param abilityLookup
 * @param customSenseLookup
 */
export function getSenseDistanceByKeyBonusTakeHighest(senseKey, modifiers, abilityLookup, customSenseLookup) {
    const customSenseData = customSenseLookup[senseKey];
    if (customSenseData) {
        const customDistance = customSenseData.distance;
        if (customDistance !== null) {
            return customDistance;
        }
    }
    const typeModifierKey = RuleDataUtils.getSenseTypeModifierKey(senseKey);
    const setSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetSenseModifier(modifier, typeModifierKey));
    if (setSenseModifiers.length) {
        return ModifierDerivers.deriveHighestModifierValue(setSenseModifiers, abilityLookup);
    }
    const baseSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetBaseSenseModifier(modifier, typeModifierKey));
    const highestBaseSenseModifierValue = ModifierDerivers.deriveHighestModifierValue(baseSenseModifiers, abilityLookup);
    const bonusSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSenseModifier(modifier, typeModifierKey) ||
        ModifierValidators.isValidBonusSenseModifier(modifier, typeModifierKey));
    const highestBonusSenseModifierValue = ModifierDerivers.deriveHighestModifierValue(bonusSenseModifiers, abilityLookup);
    return highestBaseSenseModifierValue + highestBonusSenseModifierValue;
}
/**
 * @deprecated use getSenseDistanceByKeyBonusTakeHighest
 */
export const getSenseDistanceByKey = getSenseDistanceByKeyBonusTakeHighest;
/**
 *
 * @param senseKey
 * @param modifiers
 * @param abilityLookup
 * @param customSenseLookup
 */
export function getSenseDistanceByKeyBonusTakeAll(senseKey, modifiers, abilityLookup, customSenseLookup) {
    const customSenseData = customSenseLookup[senseKey];
    if (customSenseData) {
        const customDistance = customSenseData.distance;
        if (customDistance !== null) {
            return customDistance;
        }
    }
    const typeModifierKey = RuleDataUtils.getSenseTypeModifierKey(senseKey);
    const setSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetSenseModifier(modifier, typeModifierKey));
    if (setSenseModifiers.length) {
        return ModifierDerivers.deriveHighestModifierValue(setSenseModifiers, abilityLookup);
    }
    const baseSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetBaseSenseModifier(modifier, typeModifierKey));
    const highestBaseSenseModifierValue = ModifierDerivers.deriveHighestModifierValue(baseSenseModifiers, abilityLookup);
    const bonusSenseModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSenseModifier(modifier, typeModifierKey) ||
        ModifierValidators.isValidBonusSenseModifier(modifier, typeModifierKey));
    const totalBonusSenseModifierValue = bonusSenseModifiers.reduce((total, modifier) => total + ModifierDerivers.getModifierValue(modifier, abilityLookup), 0);
    return highestBaseSenseModifierValue + totalBonusSenseModifierValue;
}
/**
 *
 * @param modifiers
 * @param abilityLookup
 * @param customSenseLookup
 */
export function generateSenseInfo(modifiers, abilityLookup, customSenseLookup) {
    return {
        [SenseTypeEnum.BLINDSIGHT]: getSenseDistanceByKeyBonusTakeHighest(SenseTypeEnum.BLINDSIGHT, modifiers, abilityLookup, customSenseLookup),
        [SenseTypeEnum.DARKVISION]: getSenseDistanceByKeyBonusTakeAll(SenseTypeEnum.DARKVISION, modifiers, abilityLookup, customSenseLookup),
        [SenseTypeEnum.PASSIVE_PERCEPTION]: getSenseDistanceByKeyBonusTakeHighest(SenseTypeEnum.PASSIVE_PERCEPTION, modifiers, abilityLookup, customSenseLookup),
        [SenseTypeEnum.TREMORSENSE]: getSenseDistanceByKeyBonusTakeHighest(SenseTypeEnum.TREMORSENSE, modifiers, abilityLookup, customSenseLookup),
        [SenseTypeEnum.TRUESIGHT]: getSenseDistanceByKeyBonusTakeHighest(SenseTypeEnum.TRUESIGHT, modifiers, abilityLookup, customSenseLookup),
    };
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 * @param overrideValue
 */
export function generatePassivePerception(skills, modifiers, abilityLookup, overrideValue) {
    if (overrideValue !== null) {
        return overrideValue;
    }
    return derivePassivePerception(skills, modifiers, abilityLookup);
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 * @param overrideValue
 */
export function generatePassiveInvestigation(skills, modifiers, abilityLookup, overrideValue) {
    if (overrideValue !== null) {
        return overrideValue;
    }
    return derivePassiveInvestigation(skills, modifiers, abilityLookup);
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 * @param overrideValue
 */
export function generatePassiveInsight(skills, modifiers, abilityLookup, overrideValue) {
    if (overrideValue !== null) {
        return overrideValue;
    }
    return derivePassiveInsight(skills, modifiers, abilityLookup);
}
/**
 *
 * @param senses
 */
export function generateCustomSenseLookup(senses) {
    return keyBy(senses, 'senseId');
}
