import { DataOriginGenerators, DataOriginTypeEnum } from '../../DataOrigin';
/**
 *
 * @param adjustment
 */
export function deriveCustomDefenseAdjustmentDataOrigin(adjustment) {
    return DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.CUSTOM, adjustment.source ? adjustment.source : 'Custom');
}
/**
 *
 * @param adjustment
 */
export function deriveCustomConditionDefenseAdjustmentDataOrigin(adjustment) {
    return DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.CUSTOM, adjustment.source ? adjustment.source : 'Custom');
}
