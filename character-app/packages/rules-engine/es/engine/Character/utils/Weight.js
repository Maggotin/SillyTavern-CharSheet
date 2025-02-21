import { CreatureSizeEnum } from '../../Core';
import { ModifierAccessors, ModifierDerivers, ModifierSubTypeEnum, ModifierValidators } from '../../Modifier';
/**
 *
 * @param sizeId
 * @param modifiers
 */
export function getEncumbranceSize(sizeId, modifiers) {
    let encumbranceSize = sizeId;
    let isSmallerOverride = false;
    let isLargerOverride = false;
    const carryingCapacitySizeModifiers = modifiers.filter((modifier) => ModifierValidators.isCarryingCapacitySizeModifier(modifier));
    carryingCapacitySizeModifiers.forEach((modifier) => {
        switch (ModifierAccessors.getSubType(modifier)) {
            case ModifierSubTypeEnum.TINY:
                isSmallerOverride = true;
                break;
            case ModifierSubTypeEnum.LARGE:
            case ModifierSubTypeEnum.HUGE:
            case ModifierSubTypeEnum.GARGANTUAN:
                isLargerOverride = true;
                break;
            default:
            // not implemented
        }
    });
    if (isSmallerOverride) {
        encumbranceSize = CreatureSizeEnum.TINY;
    }
    if (isLargerOverride) {
        encumbranceSize = CreatureSizeEnum.LARGE;
    }
    return encumbranceSize;
}
/**
 *
 * @param value
 * @param encumbranceSizeId
 */
export function getEncumbranceSizeScaledValue(value, encumbranceSizeId) {
    switch (encumbranceSizeId) {
        case CreatureSizeEnum.TINY:
            return value / 2;
        case CreatureSizeEnum.LARGE:
        case CreatureSizeEnum.HUGE:
        case CreatureSizeEnum.GARGANTUAN:
            return value * 2;
        default:
        // not implemented
    }
    return value;
}
/**
 *
 * @param value
 * @param modifiers
 */
export function getCarryCapacityModifierScaledValue(value, modifiers) {
    // get weight multiplied by any multipliers, positive is times, negative is division (ex: 2 is times two, -3 is divide by 3)
    const carryingCapacityMultiplierModifiers = modifiers.filter((modifier) => ModifierValidators.isCarringCapacityMultiplierModifier(modifier));
    const highestCarryingCapacityMultiplier = ModifierDerivers.deriveHighestModifierValue(carryingCapacityMultiplierModifiers);
    if (highestCarryingCapacityMultiplier) {
        if (highestCarryingCapacityMultiplier < 0) {
            return (value /= Math.abs(highestCarryingCapacityMultiplier));
        }
        return (value *= highestCarryingCapacityMultiplier);
    }
    return value;
}
/**
 *
 * @param strengthScale
 * @param strScore
 * @param size
 * @param modifiers
 */
export function getStrengthScaledCarryCapacity(strengthScale, strScore, size, modifiers) {
    const sizeId = size ? size.id : null;
    const baseWeight = strScore * strengthScale;
    const encumbranceSize = getEncumbranceSize(sizeId, modifiers);
    let weight = getEncumbranceSizeScaledValue(baseWeight, encumbranceSize);
    weight = getCarryCapacityModifierScaledValue(weight, modifiers);
    return weight;
}
/**
 *
 * @param strScore
 * @param size
 * @param modifiers
 */
export function getCarryCapacity(strScore, size, modifiers) {
    return getStrengthScaledCarryCapacity(15, strScore, size, modifiers);
}
/**
 *
 * @param carryCapacity
 */
export function getPushDragLiftWeight(carryCapacity) {
    return carryCapacity * 2;
}
/**
 *
 * @param strScore
 * @param size
 * @param modifiers
 */
export function getEncumberedWeight(strScore, size, modifiers) {
    return getStrengthScaledCarryCapacity(5, strScore, size, modifiers);
}
/**
 *
 * @param strScore
 * @param size
 * @param modifiers
 */
export function getHeavilyEncumberedWeight(strScore, size, modifiers) {
    return getStrengthScaledCarryCapacity(10, strScore, size, modifiers);
}
