import { LimitedUseResetTypeEnum } from './constants';
/**
 *
 * @param limitedUse
 */
export function isLimitedUseContract(limitedUse) {
    return limitedUse.statModifierUsesId !== undefined;
}
export function getResetTypeIdByName(name) {
    if (name !== null && LimitedUseResetTypeEnum[name]) {
        return LimitedUseResetTypeEnum[name];
    }
    return LimitedUseResetTypeEnum.OTHER;
}
