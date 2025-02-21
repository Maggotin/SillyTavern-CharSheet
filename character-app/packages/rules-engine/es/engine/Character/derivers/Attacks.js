import { AbilityAccessors } from '../../Ability';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
/**
 *
 * @param proficiencyBonus
 * @param abilityModifier
 */
export function deriveAttackSaveValue(proficiencyBonus, abilityModifier) {
    return 8 + proficiencyBonus + abilityModifier;
}
/**
 *
 * @param proficiencyBonus
 * @param abilityModifier
 */
export function deriveAttackModifier(proficiencyBonus, abilityModifier) {
    return proficiencyBonus + abilityModifier;
}
/**
 *
 * @param availableAbilities
 * @param modifiers
 * @param proficiencyBonus
 * @param abilityLookup
 */
export function deriveAttackAbilityPossibilities(availableAbilities, modifiers, proficiencyBonus, abilityLookup) {
    return availableAbilities.map((abilityId) => {
        const ability = abilityLookup[abilityId];
        // get bonus stat attack modifiers
        const bonusStatToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusStatAttackModifier(modifier, abilityId));
        const bonusStatToHitModifierTotal = ModifierDerivers.sumModifiers(bonusStatToHitModifiers, abilityLookup);
        // get damage stat attack modifiers
        const damageStatAttackModifiers = modifiers.filter((modifier) => ModifierValidators.isValidDamageStatAttackModifier(modifier, abilityId));
        const damageStatAttackModifierTotal = ModifierDerivers.sumModifiers(damageStatAttackModifiers, abilityLookup);
        const abilityModifier = ability ? AbilityAccessors.getModifier(ability) : null;
        const modifier = abilityModifier ? abilityModifier : 0;
        const toHit = modifier + proficiencyBonus + bonusStatToHitModifierTotal;
        return {
            abilityId,
            toHit,
            modifier,
            damageBonus: damageStatAttackModifierTotal + modifier,
        };
    });
}
