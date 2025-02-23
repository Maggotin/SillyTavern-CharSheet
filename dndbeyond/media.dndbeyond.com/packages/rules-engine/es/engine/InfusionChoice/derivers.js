import { orderBy } from 'lodash';
import { ClassAccessors } from '../Class';
import { DataOriginTypeEnum } from '../DataOrigin';
import { InfusionAccessors, InfusionModifierDataTypeEnum, InfusionTypeEnum } from '../Infusion';
import { KnownInfusionAccessors } from '../KnownInfusion';
import { getKnownInfusion, getDataOrigin, getDataOriginType } from './accessors';
/**
 *
 * @param infusionChoice
 */
export function deriveForcedModifierData(infusionChoice) {
    const knownInfusion = getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
        return null;
    }
    const simulatedInfusion = KnownInfusionAccessors.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
        return null;
    }
    const modifierData = InfusionAccessors.getModifierData(simulatedInfusion);
    const modifierDataType = InfusionAccessors.getModifierDataType(simulatedInfusion);
    const dataOriginType = getDataOriginType(infusionChoice);
    if (dataOriginType === DataOriginTypeEnum.CLASS_FEATURE &&
        modifierDataType === InfusionModifierDataTypeEnum.CLASS_LEVEL) {
        const dataOrigin = getDataOrigin(infusionChoice);
        const charClass = dataOrigin.parent;
        const classLevel = ClassAccessors.getLevel(charClass);
        const orderedModifierData = orderBy(modifierData, (data) => data.value, 'desc');
        const foundModifierData = orderedModifierData.find((data) => data.value !== null && classLevel >= data.value);
        return foundModifierData ? foundModifierData : null;
    }
    return null;
}
/**
 *
 * @param infusionChoice
 */
export function deriveCanInfuse(infusionChoice) {
    const knownInfusion = getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
        return false;
    }
    const simulatedInfusion = KnownInfusionAccessors.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
        return false;
    }
    if (InfusionAccessors.getType(simulatedInfusion) === InfusionTypeEnum.REPLICATE) {
        const itemId = KnownInfusionAccessors.getItemId(knownInfusion);
        return itemId !== null;
    }
    return true;
}
