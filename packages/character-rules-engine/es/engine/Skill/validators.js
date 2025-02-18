import { UsableDiceAdjustmentTypeEnum } from '../Dice';
import { getUsableDiceAdjustmentType } from './accessors';
/**
 *
 * @param skill
 */
export function isAdvantageUsableDiceAdjustmentType(skill) {
    return getUsableDiceAdjustmentType(skill) === UsableDiceAdjustmentTypeEnum.ADVANTAGE;
}
/**
 *
 * @param skill
 */
export function isDisadvantageUsableDiceAdjustmentType(skill) {
    return getUsableDiceAdjustmentType(skill) === UsableDiceAdjustmentTypeEnum.DISADVANTAGE;
}
/**
 *
 * @param skill
 */
export function isAdvantageDisadvantageUsableDiceAdjustmentType(skill) {
    return getUsableDiceAdjustmentType(skill) === UsableDiceAdjustmentTypeEnum.ADVANTAGE_DISADVANTAGE;
}
