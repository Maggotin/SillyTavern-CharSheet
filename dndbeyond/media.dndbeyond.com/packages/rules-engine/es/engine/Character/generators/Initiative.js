import { AbilityAccessors } from '../../Ability';
import { AbilityStatEnum } from '../../Core';
import { ModifierBonusTypeEnum, ModifierDerivers, ModifierUtils, ModifierValidators } from '../../Modifier';
/**
 *
 * @param modifiers
 * @param abilityLookup
 * @param profBonus
 */
export function getInitiative(modifiers, abilityLookup, profBonus) {
    const bonusInitiativeModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusInitiativeModifier(modifier));
    const bonusInitiativeModifierTotal = abilityLookup
        ? ModifierDerivers.sumModifiers(bonusInitiativeModifiers, abilityLookup)
        : 0;
    const includeProficiencyBonus = ModifierUtils.countModifierBonusTypes(bonusInitiativeModifiers, ModifierBonusTypeEnum.PROFICIENCY_BONUS) > 0;
    let halfProficiency = false;
    if (modifiers.filter((modifier) => ModifierValidators.isHalfProficiencyInitiativeModifier(modifier)).length) {
        halfProficiency = true;
    }
    let halfProficiencyRoundUp = false;
    if (modifiers.filter((modifier) => ModifierValidators.isHalfProficiencyRoundUpInitiativeModifier(modifier)).length) {
        halfProficiencyRoundUp = true;
    }
    let modifierProficiencyBonus = 0;
    if (includeProficiencyBonus) {
        modifierProficiencyBonus = profBonus;
    }
    else if (halfProficiencyRoundUp) {
        modifierProficiencyBonus = Math.ceil(profBonus / 2);
    }
    else if (halfProficiency) {
        modifierProficiencyBonus = Math.floor(profBonus / 2);
    }
    let dexAbility;
    let dexAbilityModifier;
    if (Object.keys(abilityLookup).length) {
        dexAbility = abilityLookup[AbilityStatEnum.DEXTERITY];
        dexAbilityModifier = AbilityAccessors.getModifier(dexAbility) || 0;
    }
    return dexAbilityModifier + bonusInitiativeModifierTotal + modifierProficiencyBonus;
}
/**
 *
 * @param processedInitiative
 * @param initiativeScore
 *
 * @returns number
 */
export function getStaticInitiative(processedInitiative, initiativeScore) {
    return processedInitiative + initiativeScore.amount;
}
/**
 * //TODO use array.some prototype
 * @param modifiers
 */
export function generateHasInitiativeAdvantage(modifiers) {
    return modifiers.filter((modifier) => ModifierValidators.isAdvantageInitiativeModifier(modifier)).length > 0;
}
