import { TypeScriptUtils } from '../../utils';
import { CharacterDerivers } from '../Character';
import { ProficiencyLevelEnum } from '../Core';
import { HelperUtils } from '../Helper';
import { ModifierAccessors, ModifierValidators } from '../Modifier';
import { getId, getModifier, getScore } from './accessors';
/**
 *
 * @param abilityId
 * @param modifiers
 * @returns TODORETURN
 */
export function deriveHighestSetAbilityScore(abilityId, modifiers) {
    const statSetScoreModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetStatScoreModifier(modifier, abilityId));
    const statSetScoreModifierValues = statSetScoreModifiers
        .map((modifier) => ModifierAccessors.getValue(modifier))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    if (!statSetScoreModifierValues.length) {
        return 0;
    }
    return Math.max(...statSetScoreModifierValues);
}
/**
 *
 * @param id
 * @param abilityLookup
 * @param defaultValue
 */
export function deriveStatModifier(id, abilityLookup, defaultValue = 0) {
    if (id === null) {
        return defaultValue;
    }
    const ability = HelperUtils.lookupDataOrFallback(abilityLookup, id);
    if (ability === null) {
        return defaultValue;
    }
    const modifier = getModifier(ability);
    if (modifier === null) {
        return defaultValue;
    }
    return modifier;
}
/**
 *
 * @param id
 * @param abilityLookup
 * @param defaultValue
 */
export function deriveStatScore(id, abilityLookup, defaultValue = 0) {
    if (id === null) {
        return defaultValue;
    }
    const ability = HelperUtils.lookupDataOrFallback(abilityLookup, id);
    if (ability === null) {
        return defaultValue;
    }
    const score = getScore(ability);
    if (score === null) {
        return defaultValue;
    }
    return score;
}
/**
 *
 * @param hasSaveProficiency
 * @param proficiencyLevelOverride
 */
export function deriveProficiencyLevel(hasSaveProficiency, proficiencyLevelOverride) {
    let proficiencyLevel = hasSaveProficiency
        ? ProficiencyLevelEnum.FULL
        : ProficiencyLevelEnum.NONE;
    if (proficiencyLevelOverride !== null) {
        proficiencyLevel = proficiencyLevelOverride;
    }
    return proficiencyLevel;
}
/**
 *
 * @param abilityScore
 * @param modifiers
 * @param proficiencyBonus
 * @param proficiencyLevelOverride
 * @param saveOverride
 * @param statBonusSaveModifierTotal
 * @param magicBonus
 * @param miscBonus
 */
export function deriveAbilitySaveInfo(abilityScore, modifiers, proficiencyBonus, proficiencyLevelOverride, saveOverride, statBonusSaveModifierTotal, magicBonus, miscBonus) {
    const abilityId = getId(abilityScore);
    const statProficiencySaveModifiers = modifiers.filter((modifier) => ModifierValidators.isValidProficiencySaveModifier(modifier, abilityId));
    const hasSaveProficiency = statProficiencySaveModifiers.length > 0;
    const proficiencyLevel = deriveProficiencyLevel(hasSaveProficiency, proficiencyLevelOverride);
    const proficiencyBonusAmount = CharacterDerivers.deriveProficiencyBonusAmount(proficiencyLevel, proficiencyBonus);
    let save = 0;
    let saveBonuses = 0;
    if (saveOverride !== null) {
        save = saveOverride;
    }
    else {
        saveBonuses = statBonusSaveModifierTotal + magicBonus + miscBonus;
        const modifier = getModifier(abilityScore);
        save = (modifier ? modifier : 0) + saveBonuses + proficiencyBonusAmount;
    }
    const isSaveOverridden = saveOverride !== null;
    return {
        proficiency: hasSaveProficiency,
        proficiencyLevel,
        isSaveProficiencyModified: proficiencyLevelOverride !== null,
        isSaveModifierModified: !!miscBonus || !!magicBonus || isSaveOverridden,
        save,
        saveBonuses,
        isSaveOverridden,
    };
}
