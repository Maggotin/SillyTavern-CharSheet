import { PreferenceEncumbranceTypeEnum, WeightSpeedTypeEnum } from '../../Core';
import { getCarryCapacity, getEncumberedWeight, getHeavilyEncumberedWeight } from '../utils';
/**
 *
 * @param currentWeight
 * @param strScore
 * @param size
 * @param preferences
 * @param modifiers
 */
export function deriveCurrentWeightSpeedType(currentWeight, strScore, size, preferences, modifiers) {
    if (preferences !== null) {
        if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.VARIANT) {
            if (currentWeight > getHeavilyEncumberedWeight(strScore, size, modifiers)) {
                return WeightSpeedTypeEnum.HEAVILY_ENCUMBERED;
            }
            else if (currentWeight > getEncumberedWeight(strScore, size, modifiers)) {
                return WeightSpeedTypeEnum.ENCUMBERED;
            }
        }
        else if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.ENCUMBRANCE) {
            if (currentWeight > getCarryCapacity(strScore, size, modifiers)) {
                return WeightSpeedTypeEnum.OVER_CARRYING_CAPACITY;
            }
        }
    }
    return WeightSpeedTypeEnum.NORMAL;
}
