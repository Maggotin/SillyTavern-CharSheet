import { DiceAdjustmentTypeEnum, UsableDiceAdjustmentTypeEnum } from './constants';
/**
 *
 * @param advantageAdjustments
 * @param disadvantageAdjustments
 */
export function deriveUsableDiceAdjustmentType(advantageAdjustments, disadvantageAdjustments) {
    const advantageCount = advantageAdjustments.length;
    const disadvantageCount = disadvantageAdjustments.length;
    const hasAdvantage = advantageCount > 0;
    const hasDisadvantage = disadvantageCount > 0;
    if (hasAdvantage && !hasDisadvantage) {
        return UsableDiceAdjustmentTypeEnum.ADVANTAGE;
    }
    if (!hasAdvantage && hasDisadvantage) {
        return UsableDiceAdjustmentTypeEnum.DISADVANTAGE;
    }
    if (hasAdvantage && hasDisadvantage) {
        const restrictedAdvantageCount = advantageAdjustments.filter((adjustment) => adjustment.restriction).length;
        const restrictedDisadvantageCount = disadvantageAdjustments.filter((adjustment) => adjustment.restriction).length;
        const fullAdvantageCount = advantageCount - restrictedAdvantageCount;
        const fullDisadvantageCount = disadvantageCount - restrictedDisadvantageCount;
        const hasFullAdvantage = fullAdvantageCount > 0;
        const hasFullDisadvantage = fullDisadvantageCount > 0;
        const hasRestrictedAdvantage = restrictedAdvantageCount > 0;
        const hasRestrictedDisadvantage = restrictedDisadvantageCount > 0;
        // Have both full types, means it always cancels and we dont care about restrictions
        if (hasFullAdvantage && hasFullDisadvantage) {
            return UsableDiceAdjustmentTypeEnum.NONE;
        }
        // Have either restricted advantage or disadvantage, you could possible use either, or none
        if (hasRestrictedAdvantage || hasRestrictedDisadvantage) {
            return UsableDiceAdjustmentTypeEnum.ADVANTAGE_DISADVANTAGE;
        }
    }
    return UsableDiceAdjustmentTypeEnum.NONE;
}
/**
 *
 * @param classLevel
 */
export function deriveMartialArtsDamageDie(classLevel) {
    let diceValue = 4;
    switch (classLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
            diceValue = 6;
            break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            diceValue = 8;
            break;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
            diceValue = 10;
            break;
        case 17:
        case 18:
        case 19:
        case 20:
            diceValue = 12;
            break;
    }
    return {
        diceCount: 1,
        diceMultiplier: null,
        diceString: '',
        diceValue,
        fixedValue: null,
    };
}
/**
 *
 * @param type
 */
export function deriveDiceAdjustmentTypeName(type) {
    let name = '';
    switch (type) {
        case DiceAdjustmentTypeEnum.ADVANTAGE:
            name = 'Advantage';
            break;
        case DiceAdjustmentTypeEnum.DISADVANTAGE:
            name = 'Disadvantage';
            break;
        case DiceAdjustmentTypeEnum.BONUS:
            name = 'Bonus';
            break;
        default:
        //not implemented
    }
    return name;
}
