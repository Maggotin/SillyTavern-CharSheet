import { getModifierData, getModifierDataType, getModifierGroupId, getType } from './accessors';
import { InfusionModifierDataTypeEnum, InfusionTypeEnum } from './constants';
/**
 * TODO this needs to consider item information for knownInfusions to be true.
 * see hack__requiresItemChoice() for more info
 *
 * @param infusion
 */
export function deriveRequiresItemChoice(infusion) {
    return getType(infusion) !== InfusionTypeEnum.REPLICATE;
}
/**
 *
 * @param infusion
 */
export function deriveRequiresModifierDataChoice(infusion) {
    const modifierDataType = getModifierDataType(infusion);
    if (modifierDataType === null || modifierDataType === InfusionModifierDataTypeEnum.GRANTED) {
        return false;
    }
    return true;
}
/**
 *
 * @param infusion
 */
export function deriveSelectedModifierData(infusion) {
    const modifierGroupId = getModifierGroupId(infusion);
    const modifierData = getModifierData(infusion);
    const modifierDataType = getModifierDataType(infusion);
    switch (modifierDataType) {
        case InfusionModifierDataTypeEnum.GRANTED:
            return modifierData[0];
        case InfusionModifierDataTypeEnum.CLASS_LEVEL:
        case InfusionModifierDataTypeEnum.DAMAGE_TYPE_CHOICE:
            const foundModifierGroup = modifierData.find((dataItem) => dataItem.id === modifierGroupId);
            return foundModifierGroup ? foundModifierGroup : null;
        default:
        // not implemented
    }
    return null;
}
