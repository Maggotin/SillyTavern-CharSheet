import { isLimitedUseContract } from './utils';
/**
 *
 * @param limitedUse
 */
export function getName(limitedUse) {
    return limitedUse.name;
}
/**
 *
 * @param limitedUse
 */
export function getResetType(limitedUse) {
    return limitedUse.resetType;
}
/**
 *
 * @param limitedUse
 */
export function getOperator(limitedUse) {
    return limitedUse.operator;
}
/**
 *
 * @param limitedUse
 */
export function getInitialMaxUses(limitedUse) {
    var _a;
    return (_a = limitedUse.maxUses) !== null && _a !== void 0 ? _a : 0;
}
/**
 *
 * @param limitedUse
 */
export function getNumberUsed(limitedUse) {
    return limitedUse.numberUsed;
}
/**
 *
 * @param limitedUse
 */
export function getMinNumberConsumed(limitedUse) {
    var _a;
    const definitionMin = (_a = limitedUse.minNumberConsumed) !== null && _a !== void 0 ? _a : getMaxNumberConsumed(limitedUse);
    return Math.max(1, definitionMin);
}
/**
 *
 * @param limitedUse
 */
export function getMaxNumberConsumed(limitedUse) {
    return limitedUse.maxNumberConsumed;
}
/**
 *
 * @param limitedUse
 */
export function getStatModifierUsesId(limitedUse) {
    if (isLimitedUseContract(limitedUse)) {
        return limitedUse.statModifierUsesId;
    }
    return null;
}
/**
 *
 * @param limitedUse
 */
export function getResetTypeName(limitedUse) {
    return limitedUse.resetType;
}
/**
 *
 * @param limitedUse
 */
export function getResetTypeDescription(limitedUse) {
    return limitedUse.resetTypeDescription;
}
/**
 *
 * @param limitedUse
 */
export function getUseProficiencyBonus(limitedUse) {
    return limitedUse.useProficiencyBonus;
}
/**
 *
 * @param limitedUse
 */
export function getProficiencyBonusOperator(limitedUse) {
    return limitedUse.proficiencyBonusOperator;
}
