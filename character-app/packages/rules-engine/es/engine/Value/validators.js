import { ValueUtils } from './index';
/**
 *
 * @param customizationTypes
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 */
export function validateHasCustomization(customizationTypes, valueLookup, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null) {
    return customizationTypes.some((typeId) => {
        const value = ValueUtils.getKeyValue(valueLookup, typeId, valueId, valueTypeId, null, contextId, contextTypeId);
        if (value !== null && value !== '') {
            return true;
        }
        const notes = ValueUtils.getKeyNotes(valueLookup, typeId, valueId, valueTypeId, null, contextId, contextTypeId);
        if (notes !== null && notes !== '') {
            return true;
        }
    });
}
