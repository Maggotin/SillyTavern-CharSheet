import * as actionTypes from '../actionTypes';
/**
 *
 * @param typeId
 * @param value
 * @param notes
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @param partyId
 * @param accept
 * @param reject
 */
export function valueSet(typeId, value, notes, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null, partyId = null, accept, reject) {
    return {
        type: actionTypes.VALUE_SET,
        payload: {
            typeId,
            value,
            notes,
            valueId,
            valueTypeId,
            contextId,
            contextTypeId,
            partyId,
        },
        meta: {
            commit: {
                type: actionTypes.VALUE_SET_COMMIT,
            },
            accept,
            reject,
        },
    };
}
/**
 * @param typeId
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @param partyId
 */
export function valueRemove(typeId, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null, partyId = null) {
    return {
        type: actionTypes.VALUE_REMOVE,
        payload: {
            typeId,
            valueId,
            valueTypeId,
            contextId,
            contextTypeId,
            partyId,
        },
        meta: {
            commit: {
                type: actionTypes.VALUE_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @param partyId
 */
export function entityValuesRemove(valueId = null, valueTypeId = null, contextId = null, contextTypeId = null, partyId = null) {
    return {
        type: actionTypes.ENTITY_VALUES_REMOVE,
        payload: {
            valueId,
            valueTypeId,
            contextId,
            contextTypeId,
            partyId,
        },
        meta: {
            commit: {
                type: actionTypes.ENTITY_VALUES_REMOVE_COMMIT,
            },
        },
    };
}
