import { keyBy } from 'lodash';
import { AbilityDerivers } from '../Ability';
import { CharacterDerivers } from '../Character';
import { ProficiencyLevelEnum, ProficiencyRoundingEnum } from '../Core';
import { DiceDerivers } from '../Dice';
import { ItemUtils, ItemValidators } from '../Item';
import { ModifierDerivers, ModifierValidators } from '../Modifier';
import { RuleDataAccessors } from '../RuleData';
import { AdjustmentTypeEnum, ValueHacks, ValueUtils } from '../Value';
import { getId } from './accessors';
import { deriveAdvantageAdjustments, deriveDisadvantageAdjustments } from './derivers';
/**
 *
 * @param proficiencies
 * @param proficiencyBonus
 * @param abilityLookup
 * @param modifiers
 * @param equippedItems
 */
export function generateCustomSkills(proficiencies, proficiencyBonus, abilityLookup, modifiers, equippedItems) {
    const equippedArmor = equippedItems.filter(ItemUtils.isArmorContract);
    const nonProficientEquippedArmor = equippedItems.filter(ItemValidators.isNonProficientEquippedArmorItem);
    return proficiencies.map((skill) => generateCustomSkill(skill, proficiencyBonus, abilityLookup, modifiers, equippedArmor, nonProficientEquippedArmor));
}
/**
 *
 * @param customSkill
 * @param proficiencyBonus
 * @param abilityLookup
 * @param modifiers
 * @param equippedArmor
 * @param nonProficientEquippedArmor
 */
export function generateCustomSkill(customSkill, proficiencyBonus, abilityLookup, modifiers, equippedArmor, nonProficientEquippedArmor) {
    var _a, _b, _c;
    let modifier = null;
    let statModifier = 0;
    let skillProficiencyBonus = 0;
    const proficiencyLevel = customSkill.proficiencyLevel ? customSkill.proficiencyLevel : ProficiencyLevelEnum.NONE;
    const name = customSkill.name ? customSkill.name : 'Unknown Custom Skill';
    if (customSkill.statId) {
        statModifier = AbilityDerivers.deriveStatModifier(customSkill.statId, abilityLookup);
        if (statModifier !== null) {
            skillProficiencyBonus = CharacterDerivers.deriveProficiencyBonusAmount(proficiencyLevel, proficiencyBonus);
        }
    }
    let modifierBonuses = 0;
    if (customSkill.override !== null) {
        modifier = customSkill.override;
    }
    else if (statModifier !== null) {
        const miscBonus = (_a = customSkill.miscBonus) !== null && _a !== void 0 ? _a : 0;
        const magicBonus = (_b = customSkill.magicBonus) !== null && _b !== void 0 ? _b : 0;
        modifierBonuses = miscBonus + magicBonus;
        modifier = statModifier + skillProficiencyBonus + modifierBonuses;
    }
    const simulatedSkillContract = {
        description: null,
        entityTypeId: -1,
        id: -1,
        name: null,
        stat: (_c = customSkill.statId) !== null && _c !== void 0 ? _c : -1,
    };
    const advantageAdjustments = deriveAdvantageAdjustments(simulatedSkillContract, modifiers);
    const disadvantageAdjustments = deriveDisadvantageAdjustments(simulatedSkillContract, modifiers, equippedArmor, nonProficientEquippedArmor);
    return {
        description: customSkill.description,
        entityTypeId: -1,
        id: customSkill.id,
        name,
        stat: customSkill.statId,
        isOverridden: customSkill.override !== null,
        modifier,
        modifierBonuses,
        expertise: proficiencyLevel === ProficiencyLevelEnum.EXPERT,
        halfProficiency: proficiencyLevel === ProficiencyLevelEnum.HALF,
        proficiency: proficiencyLevel === ProficiencyLevelEnum.FULL,
        proficiencyLevel,
        proficiencyBonus: skillProficiencyBonus,
        notes: customSkill.notes,
        statModifier,
        isCustom: true,
        originalContract: customSkill,
        advantageAdjustments,
        disadvantageAdjustments,
        usableDiceAdjustmentType: DiceDerivers.deriveUsableDiceAdjustmentType(advantageAdjustments, disadvantageAdjustments),
    };
}
/**
 *
 * @param skill
 * @param abilityLookup
 * @param modifiers
 * @param proficiencyBonus
 * @param valueLookup
 * @param equippedArmor
 * @param nonProficientEquippedArmor
 */
export function generateSkill(skill, abilityLookup, modifiers, proficiencyBonus, valueLookup, equippedArmor, nonProficientEquippedArmor) {
    let stat = skill.stat;
    const statOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SKILL_STAT_OVERRIDE, ValueHacks.hack__toString(skill.id), ValueHacks.hack__toString(skill.entityTypeId));
    if (statOverride !== null) {
        stat = statOverride;
    }
    const statModifier = AbilityDerivers.deriveStatModifier(stat, abilityLookup);
    // This is done so that Modifier validators can check for correct stat ID
    const overriddenSkill = Object.assign(Object.assign({}, skill), { stat });
    let proficiencyLevel = ProficiencyLevelEnum.NONE;
    let proficiencyRounding = ProficiencyRoundingEnum.DOWN;
    let halfProficiency = false;
    if (modifiers.filter((modifier) => ModifierValidators.isValidAbilitySkillHalfProficiencyModifier(modifier, overriddenSkill)).length) {
        halfProficiency = true;
        proficiencyLevel = ProficiencyLevelEnum.HALF;
    }
    if (modifiers.filter((modifier) => ModifierValidators.isValidAbilitySkillHalfProficiencyRoundUpModifier(modifier, overriddenSkill)).length) {
        halfProficiency = true;
        proficiencyRounding = ProficiencyRoundingEnum.UP;
        proficiencyLevel = ProficiencyLevelEnum.HALF;
    }
    let proficiency = false;
    if (modifiers.filter((modifier) => ModifierValidators.isValidAbilitySkillProficiencyModifier(modifier, overriddenSkill)).length) {
        proficiency = true;
        proficiencyLevel = ProficiencyLevelEnum.FULL;
    }
    let expertise = false;
    if (modifiers.filter((modifier) => ModifierValidators.isValidAbilitySkillExpertiseModifier(modifier, overriddenSkill)).length) {
        expertise = true;
        proficiencyLevel = ProficiencyLevelEnum.EXPERT;
    }
    const levelOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL, ValueHacks.hack__toString(overriddenSkill.id), ValueHacks.hack__toString(overriddenSkill.entityTypeId));
    if (levelOverride !== null) {
        // TODO need to fix this ugliness to be based on proficiency level (components and half round up need to be considered)
        switch (levelOverride) {
            case ProficiencyLevelEnum.EXPERT:
                halfProficiency = false;
                proficiencyRounding = ProficiencyRoundingEnum.DOWN;
                proficiency = false;
                expertise = true;
                break;
            case ProficiencyLevelEnum.FULL:
                halfProficiency = false;
                proficiencyRounding = ProficiencyRoundingEnum.DOWN;
                proficiency = true;
                expertise = false;
                break;
            case ProficiencyLevelEnum.HALF:
                halfProficiency = true;
                proficiencyRounding = ProficiencyRoundingEnum.DOWN;
                proficiency = false;
                expertise = false;
                break;
            case ProficiencyLevelEnum.NONE:
                halfProficiency = false;
                proficiencyRounding = ProficiencyRoundingEnum.DOWN;
                proficiency = false;
                expertise = false;
                break;
            default:
            // not implemented
        }
        proficiencyLevel = levelOverride;
    }
    const overrideValue = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SKILL_OVERRIDE, ValueHacks.hack__toString(overriddenSkill.id), ValueHacks.hack__toString(overriddenSkill.entityTypeId));
    let modifier = 0;
    let modifierBonuses = 0;
    let skillProficiencyBonus = 0;
    const isOverridden = overrideValue !== null;
    if (!isOverridden) {
        const bonusAbilitySkillModifiers = modifiers.filter((modifier) => ModifierValidators.isValidAbilitySkillBonusModifier(modifier, overriddenSkill));
        const bonusAbilitySkillModifierTotal = ModifierDerivers.sumModifiers(bonusAbilitySkillModifiers, abilityLookup);
        const miscBonus = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SKILL_MISC_BONUS, ValueHacks.hack__toString(overriddenSkill.id), ValueHacks.hack__toString(overriddenSkill.entityTypeId), 0);
        const magicBonus = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.SKILL_MAGIC_BONUS, ValueHacks.hack__toString(overriddenSkill.id), ValueHacks.hack__toString(overriddenSkill.entityTypeId), 0);
        modifierBonuses = miscBonus + magicBonus + bonusAbilitySkillModifierTotal;
        skillProficiencyBonus = CharacterDerivers.deriveProficiencyBonusAmount(proficiencyLevel, proficiencyBonus, proficiencyRounding);
        modifier = statModifier + skillProficiencyBonus + modifierBonuses;
    }
    else {
        modifier = overrideValue;
    }
    const advantageAdjustments = deriveAdvantageAdjustments(overriddenSkill, modifiers);
    const disadvantageAdjustments = deriveDisadvantageAdjustments(overriddenSkill, modifiers, equippedArmor, nonProficientEquippedArmor);
    return Object.assign(Object.assign({}, overriddenSkill), { statModifier,
        modifier,
        modifierBonuses, proficiencyBonus: skillProficiencyBonus, proficiencyLevel,
        proficiency,
        halfProficiency,
        expertise,
        isOverridden, isCustom: false, notes: null, originalContract: null, advantageAdjustments,
        disadvantageAdjustments, usableDiceAdjustmentType: DiceDerivers.deriveUsableDiceAdjustmentType(advantageAdjustments, disadvantageAdjustments) });
}
/**
 *
 * @param abilityLookup
 * @param modifiers
 * @param proficiencyBonus
 * @param ruleData
 * @param valueLookup
 * @param equippedItems
 */
export function generateSkills(abilityLookup, modifiers, proficiencyBonus, ruleData, valueLookup, equippedItems) {
    const equippedArmor = equippedItems.filter(ItemUtils.isArmorContract);
    const nonProficientEquippedArmor = equippedItems.filter(ItemValidators.isNonProficientEquippedArmorItem);
    return RuleDataAccessors.getAbilitySkills(ruleData).map((skill) => generateSkill(skill, abilityLookup, modifiers, proficiencyBonus, valueLookup, equippedArmor, nonProficientEquippedArmor));
}
/**
 *
 * @param skills
 */
export function generateSkillLookup(skills) {
    return keyBy(skills, (skill) => getId(skill));
}
