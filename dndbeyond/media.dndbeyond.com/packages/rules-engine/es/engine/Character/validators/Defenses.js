import { DamageAdjustmentTypeEnum } from '../../Core';
/**
 *
 * @param damageAdjustment
 */
export function isResistanceDamageAdjustment(damageAdjustment) {
    return damageAdjustment.type === DamageAdjustmentTypeEnum.RESISTANCE;
}
/**
 *
 * @param damageAdjustment
 */
export function isVulnerabilityDamageAdjustment(damageAdjustment) {
    return damageAdjustment.type === DamageAdjustmentTypeEnum.VULNERABILITY;
}
/**
 *
 * @param damageAdjustment
 */
export function isImmunityDamageAdjustment(damageAdjustment) {
    return damageAdjustment.type === DamageAdjustmentTypeEnum.IMMUNITY;
}
