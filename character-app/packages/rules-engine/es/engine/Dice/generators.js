import { ModifierDerivers } from '../Modifier';
import { DiceAdjustmentTypeEnum } from './constants';
/**
 *
 * @param bonusSavingThrowModifiers
 * @param advantageSavingThrowModifiers
 * @param disadvantageSavingThrowModifiers
 */
export function generateSavingThrowDiceAdjustments(bonusSavingThrowModifiers, advantageSavingThrowModifiers, disadvantageSavingThrowModifiers) {
    let diceAdjustments = [];
    bonusSavingThrowModifiers.forEach((modifier) => {
        diceAdjustments.push(ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.BONUS));
    });
    advantageSavingThrowModifiers.forEach((modifier) => {
        diceAdjustments.push(ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.ADVANTAGE));
    });
    disadvantageSavingThrowModifiers.forEach((modifier) => {
        diceAdjustments.push(ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.DISADVANTAGE));
    });
    return diceAdjustments;
}
