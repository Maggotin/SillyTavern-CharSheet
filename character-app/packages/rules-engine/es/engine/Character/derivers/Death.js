import { DiceAdjustmentTypeEnum } from '../../Dice';
import { ModifierDerivers, ModifierValidators } from '../../Modifier';
/**
 *
 * @param modifiers
 */
export function deriveAdvantageDeathSavesAdjustments(modifiers) {
    return modifiers
        .filter((modifier) => ModifierValidators.isAdvantageDeathSavesModifier(modifier))
        .map((modifier) => ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.ADVANTAGE));
}
/**
 *
 * @param modifiers
 */
export function deriveDisadvantageDeathSavesAdjustments(modifiers) {
    return modifiers
        .filter((modifier) => ModifierValidators.isDisadvantageDeathSavesModifier(modifier))
        .map((modifier) => ModifierDerivers.deriveDiceAdjustment(modifier, DiceAdjustmentTypeEnum.DISADVANTAGE));
}
