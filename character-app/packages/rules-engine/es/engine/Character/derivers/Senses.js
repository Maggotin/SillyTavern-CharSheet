import { AbilitySkillEnum } from '../../Core';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
import { SkillAccessors } from '../../Skill';
/**
 *
 * @param skillModifier
 * @param bonuses
 */
export function derivePassiveSkill(skillModifier, bonuses = 0) {
    return 10 + skillModifier + bonuses;
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 */
export function derivePassivePerception(skills, modifiers, abilityLookup) {
    const skill = skills.find((skill) => SkillAccessors.getId(skill) === AbilitySkillEnum.PERCEPTION);
    const skillModifier = skill ? SkillAccessors.getModifier(skill) : null;
    if (!skill || skillModifier === null) {
        return 0;
    }
    const bonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusPassivePerceptionModifier(modifier));
    const bonusModifierTotal = ModifierDerivers.sumModifiers(bonusModifiers, abilityLookup);
    return derivePassiveSkill(skillModifier, bonusModifierTotal);
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 */
export function derivePassiveInvestigation(skills, modifiers, abilityLookup) {
    const skill = skills.find((skill) => SkillAccessors.getId(skill) === AbilitySkillEnum.INVESTIGATION);
    const skillModifier = skill ? SkillAccessors.getModifier(skill) : null;
    if (!skill || skillModifier === null) {
        return 0;
    }
    const bonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusPassiveInvestigationModifier(modifier));
    const bonusModifierTotal = ModifierDerivers.sumModifiers(bonusModifiers, abilityLookup);
    return derivePassiveSkill(skillModifier, bonusModifierTotal);
}
/**
 *
 * @param skills
 * @param modifiers
 * @param abilityLookup
 */
export function derivePassiveInsight(skills, modifiers, abilityLookup) {
    const skill = skills.find((skill) => SkillAccessors.getId(skill) === AbilitySkillEnum.INSIGHT);
    const skillModifier = skill ? SkillAccessors.getModifier(skill) : null;
    if (!skill || skillModifier === null) {
        return 0;
    }
    const bonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusPassiveInsightModifier(modifier));
    const bonusModifierTotal = ModifierDerivers.sumModifiers(bonusModifiers, abilityLookup);
    return derivePassiveSkill(skillModifier, bonusModifierTotal);
}
