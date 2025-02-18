import { ProficiencyLevelEnum, ProficiencyRoundingEnum } from '../../Core';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
import { RuleDataUtils } from '../../RuleData';
/**
 *
 * @param level
 * @param modifiers
 * @param ruleData
 */
export function deriveProficiencyBonus(level, modifiers, ruleData) {
    const levelBonus = RuleDataUtils.getLevelProficiencyBonus(level, ruleData);
    const bonusProficiencyBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusProficiencyBonusModifier(modifier));
    const modifierBonusTotal = ModifierDerivers.sumModifiers(bonusProficiencyBonusModifiers);
    return levelBonus + modifierBonusTotal;
}
/**
 *
 * @param proficiencyLevel
 * @param proficiencyBonus
 * @param proficiencyRounding
 */
export function deriveProficiencyBonusAmount(proficiencyLevel, proficiencyBonus, proficiencyRounding = ProficiencyRoundingEnum.DOWN) {
    let proficiencyBonusAmount = 0;
    switch (proficiencyLevel) {
        case ProficiencyLevelEnum.EXPERT:
            proficiencyBonusAmount = proficiencyBonus * 2;
            break;
        case ProficiencyLevelEnum.FULL:
            proficiencyBonusAmount = proficiencyBonus;
            break;
        case ProficiencyLevelEnum.HALF:
            if (proficiencyRounding === ProficiencyRoundingEnum.UP) {
                proficiencyBonusAmount = Math.ceil(proficiencyBonus / 2);
            }
            else {
                proficiencyBonusAmount = Math.floor(proficiencyBonus / 2);
            }
            break;
        default:
        // not implemented
    }
    return proficiencyBonusAmount;
}
