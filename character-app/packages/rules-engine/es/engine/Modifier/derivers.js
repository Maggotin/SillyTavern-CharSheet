import { AbilityAccessors } from '../Ability';
import { AbilityStatEnum } from '../Core';
import { DiceAdjustmentRollTypeEnum } from '../Dice';
import { HelperUtils } from '../Helper';
import { getBonusTypes, getDataOrigin, getId, getRestriction, getStatId, getSubType, getValue, getValueTotal, } from './accessors';
import { STAT_ABILITY_CHECK_LIST, ModifierBonusTypeEnum, ModifierSubTypeEnum, STAT_SAVING_THROW_LIST, } from './constants';
/**
 *
 * @param modifier
 * @param abilityLookup
 * @param minimumValue
 */
export function deriveStatScaledModifierValue(modifier, abilityLookup, minimumValue = 0) {
    const statId = getStatId(modifier);
    if (abilityLookup === null || statId === null) {
        return 0;
    }
    const stat = abilityLookup[statId];
    if (!stat) {
        return 0;
    }
    const statModifier = AbilityAccessors.getModifier(stat);
    if (statModifier === null) {
        return minimumValue;
    }
    return Math.max(statModifier, minimumValue);
}
/**
 *
 * @param modifier
 * @param defaultValue
 */
export function deriveFixedModifierValue(modifier, defaultValue = 0) {
    const value = getValue(modifier);
    return value === null ? defaultValue : value;
}
/**
 * @deprecated deriveValue
 * @param modifier
 * @param abilityLookup
 * @param minimumValue
 */
export function getModifierValue(modifier, abilityLookup, minimumValue = 0) {
    let value = 0;
    if (abilityLookup !== null && getStatId(modifier) !== null) {
        value += deriveStatScaledModifierValue(modifier, abilityLookup, minimumValue);
    }
    const fixedValue = deriveFixedModifierValue(modifier);
    return value + (fixedValue === null ? 0 : fixedValue);
}
// TODO rename to sumModifierValues
// TODO go through uses of this and remove any places where I am summing scaled and fixed separately outside of this
// TODO go through uses and add stats to sum so stat scaling can be used automagically
/**
 * @deprecated deriveTotalValue
 * @param modifiers
 * @param abilityLookup
 * @param minimumValue
 * @param initialValue
 */
export function sumModifiers(modifiers, abilityLookup = null, minimumValue = 0, initialValue = 0) {
    return modifiers.reduce((acc, modifier) => (acc += getModifierValue(modifier, abilityLookup, minimumValue)), initialValue);
}
/**
 *
 * @param modifier
 * @param modifierData
 * @param minimumValue
 * @param includeBonusTypes
 * @param additionalBonusValueLookup - A lookup that maps an additional ModifierBonusTypeEnum to its bonus value. eg Disciple of Life
 */
export function deriveValue(modifier, modifierData, minimumValue = 0, includeBonusTypes = true, additionalBonusValueLookup = {}) {
    let baseValue = 0;
    if (getStatId(modifier) !== null) {
        baseValue = deriveStatScaledModifierValue(modifier, modifierData.abilityLookup, minimumValue);
    }
    const fixedValue = deriveFixedModifierValue(modifier);
    if (fixedValue !== null) {
        baseValue += fixedValue;
    }
    let bonusValue = 0;
    const modifierBonusTypes = getBonusTypes(modifier);
    if (includeBonusTypes && modifierBonusTypes) {
        if (modifierBonusTypes.includes(ModifierBonusTypeEnum.PROFICIENCY_BONUS)) {
            bonusValue += modifierData.proficiencyBonus;
        }
        if (modifierBonusTypes.includes(ModifierBonusTypeEnum.ATTUNED_ITEM_COUNT)) {
            bonusValue += modifierData.attunedItemCount;
        }
        if (modifierBonusTypes.includes(ModifierBonusTypeEnum.SPELL_LEVEL)) {
            bonusValue += HelperUtils.lookupDataOrFallback(additionalBonusValueLookup, ModifierBonusTypeEnum.SPELL_LEVEL, 0);
        }
    }
    return baseValue + bonusValue;
}
/**
 *
 * @param modifiers
 * @param modifierData
 * @param minimumValue
 * @param initialValue
 */
export function deriveTotalValue(modifiers, modifierData, minimumValue = 0, initialValue = 0) {
    return modifiers.reduce((acc, modifier) => (acc += deriveValue(modifier, modifierData, minimumValue)), initialValue);
}
/**
 *
 * @param modifiers
 * @param modifierData
 * @param minimumValue
 * @param includeBonusTypes
 * @param additionalBonusValueLookup
 */
export function deriveHighestValue(modifiers, modifierData, minimumValue = 0, includeBonusTypes = true, additionalBonusValueLookup = {}) {
    if (!modifiers.length) {
        return 0;
    }
    return Math.max(...modifiers.map((modifier) => deriveValue(modifier, modifierData, minimumValue, includeBonusTypes, additionalBonusValueLookup)));
}
/**
 *
 * @param modifiers
 * @param modifierData
 * @param fallback
 */
export function deriveHighestValueModifier(modifiers, modifierData, fallback = null) {
    if (!modifiers.length) {
        return fallback;
    }
    return HelperUtils.getLast(modifiers, (modifier) => deriveValue(modifier, modifierData));
}
/**
 * @deprecated deriveHighestValue
 * @param modifiers
 * @param abilityLookup
 */
export function deriveHighestModifierValue(modifiers, abilityLookup = null) {
    if (!modifiers.length) {
        return 0;
    }
    return Math.max(...modifiers.map((modifier) => getModifierValue(modifier, abilityLookup)));
}
/**
 *
 * @param modifier
 * @param type
 */
export function deriveDiceAdjustment(modifier, type) {
    var _a;
    return {
        type,
        rollType: deriveRollType(modifier),
        statId: deriveStatId(modifier),
        dataOrigin: getDataOrigin(modifier),
        restriction: getRestriction(modifier),
        uniqueKey: (_a = getId(modifier)) !== null && _a !== void 0 ? _a : HelperUtils.generateGuid(),
        amount: getValueTotal(modifier),
    };
}
/**
 *
 * @param modifier
 */
export function deriveRollType(modifier) {
    const subType = getSubType(modifier);
    if (subType === null) {
        return DiceAdjustmentRollTypeEnum.NONE;
    }
    switch (subType) {
        case ModifierSubTypeEnum.SAVING_THROWS:
            return DiceAdjustmentRollTypeEnum.SAVE;
        case ModifierSubTypeEnum.DEATH_SAVING_THROWS:
            return DiceAdjustmentRollTypeEnum.DEATH_SAVE;
        case ModifierSubTypeEnum.ABILITY_CHECKS:
            return DiceAdjustmentRollTypeEnum.ABILITY_CHECK;
        default:
        //not implemented
    }
    if (STAT_SAVING_THROW_LIST.includes(subType)) {
        return DiceAdjustmentRollTypeEnum.STAT_SAVE;
    }
    else if (STAT_ABILITY_CHECK_LIST.includes(subType)) {
        return DiceAdjustmentRollTypeEnum.ABILITY_CHECK;
    }
    return DiceAdjustmentRollTypeEnum.NONE;
}
/**
 *
 * @param modifier
 */
export function deriveStatId(modifier) {
    let statId = null;
    switch (getSubType(modifier)) {
        case ModifierSubTypeEnum.STRENGTH_SAVING_THROWS:
            statId = AbilityStatEnum.STRENGTH;
            break;
        case ModifierSubTypeEnum.DEXTERITY_SAVING_THROWS:
            statId = AbilityStatEnum.DEXTERITY;
            break;
        case ModifierSubTypeEnum.CONSTITUTION_SAVING_THROWS:
            statId = AbilityStatEnum.CONSTITUTION;
            break;
        case ModifierSubTypeEnum.INTELLIGENCE_SAVING_THROWS:
            statId = AbilityStatEnum.INTELLIGENCE;
            break;
        case ModifierSubTypeEnum.WISDOM_SAVING_THROWS:
            statId = AbilityStatEnum.WISDOM;
            break;
        case ModifierSubTypeEnum.CHARISMA_SAVING_THROWS:
            statId = AbilityStatEnum.CHARISMA;
            break;
        default:
        // not implemented
    }
    return statId;
}
/**
 *
 * @param modifier
 */
export function deriveSavingThrowModifierAbilityName(modifier) {
    let abilityName = '';
    switch (getSubType(modifier)) {
        case ModifierSubTypeEnum.STRENGTH_SAVING_THROWS:
            abilityName = 'STR';
            break;
        case ModifierSubTypeEnum.DEXTERITY_SAVING_THROWS:
            abilityName = 'DEX';
            break;
        case ModifierSubTypeEnum.CONSTITUTION_SAVING_THROWS:
            abilityName = 'CON';
            break;
        case ModifierSubTypeEnum.INTELLIGENCE_SAVING_THROWS:
            abilityName = 'INT';
            break;
        case ModifierSubTypeEnum.WISDOM_SAVING_THROWS:
            abilityName = 'WIS';
            break;
        case ModifierSubTypeEnum.CHARISMA_SAVING_THROWS:
            abilityName = 'CHA';
            break;
        default:
        // not implemented
    }
    return abilityName;
}
