import { AbilitySkillEnum, StealthCheckTypeEnum } from '../Core';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { DiceAdjustmentRollTypeEnum, DiceAdjustmentTypeEnum } from '../Dice';
import { ItemAccessors } from '../Item';
import { ModifierDerivers, ModifierValidators } from '../Modifier';
import { hack__updateDisadvantageAdjustments } from './hacks';
/**
 *
 * @param skill
 * @param modifiers
 */
export function deriveAdvantageAdjustments(skill, modifiers) {
    return modifiers
        .filter((modifier) => ModifierValidators.isValidSkillAdvantageModifier(modifier, skill))
        .map((modifier) => ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.ADVANTAGE));
}
/**
 *
 * @param skill
 * @param modifiers
 * @param equippedArmor
 * @param nonProficientEquippedArmor
 */
export function deriveDisadvantageAdjustments(skill, modifiers, equippedArmor, nonProficientEquippedArmor) {
    let skillDiceAdjustments = modifiers
        .filter((modifier) => ModifierValidators.isValidSkillDisadvantageModifier(modifier, skill))
        .map((modifier) => ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.DISADVANTAGE));
    if (skill.id === AbilitySkillEnum.STEALTH) {
        equippedArmor.forEach((item) => {
            if (ItemAccessors.getStealthCheck(item) === StealthCheckTypeEnum.DISADVANTAGE) {
                skillDiceAdjustments.push({
                    type: DiceAdjustmentTypeEnum.DISADVANTAGE,
                    rollType: DiceAdjustmentRollTypeEnum.ABILITY_CHECK,
                    dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.ITEM, item),
                    restriction: 'with armor worn',
                    uniqueKey: [ItemAccessors.getUniqueKey(item), 'INNATE'].join('-'),
                    statId: null,
                    amount: null,
                });
            }
        });
    }
    skillDiceAdjustments = hack__updateDisadvantageAdjustments(skill, skillDiceAdjustments, nonProficientEquippedArmor);
    return skillDiceAdjustments;
}
