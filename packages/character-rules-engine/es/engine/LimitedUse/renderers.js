import { LimitedUseResetTypeEnum } from './constants';
/**
 *
 * @param resetType
 */
export function renderLimitedUseResetAbbreviation(resetType) {
    switch (resetType) {
        case LimitedUseResetTypeEnum.LONG_REST:
            return 'LR';
        case LimitedUseResetTypeEnum.SHORT_REST:
            return 'SR';
        case LimitedUseResetTypeEnum.DAWN:
            return 'D';
        case LimitedUseResetTypeEnum.OTHER:
            return 'O';
        default:
        // not implemented
    }
    return '';
}
