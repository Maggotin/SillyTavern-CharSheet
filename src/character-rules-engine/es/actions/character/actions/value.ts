import * as actionTypes from '../actionTypes/value';

interface ValueSetAction {
    type: typeof actionTypes.VALUE_SET;
    payload: {
        typeId: unknown;
        value: unknown;
        notes: unknown;
        valueId: unknown | null;
        valueTypeId: unknown | null;
        contextId: unknown | null;
        contextTypeId: unknown | null;
        partyId: unknown | null;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VALUE_SET_COMMIT;
        };
        accept: unknown;
        reject: unknown;
    };
}

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
export function valueSet(
    typeId: unknown,
    value: unknown,
    notes: unknown,
    valueId: unknown | null = null,
    valueTypeId: unknown | null = null,
    contextId: unknown | null = null,
    contextTypeId: unknown | null = null,
    partyId: unknown | null = null,
    accept: unknown,
    reject: unknown
): ValueSetAction {
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

interface ValueRemoveAction {
    type: typeof actionTypes.VALUE_REMOVE;
    payload: {
        typeId: unknown;
        valueId: unknown | null;
        valueTypeId: unknown | null;
        contextId: unknown | null;
        contextTypeId: unknown | null;
        partyId: unknown | null;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VALUE_REMOVE_COMMIT;
        };
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
export function valueRemove(
    typeId: unknown,
    valueId: unknown | null = null,
    valueTypeId: unknown | null = null,
    contextId: unknown | null = null,
    contextTypeId: unknown | null = null,
    partyId: unknown | null = null
): ValueRemoveAction {
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

interface EntityValuesRemoveAction {
    type: typeof actionTypes.ENTITY_VALUES_REMOVE;
    payload: {
        valueId: unknown | null;
        valueTypeId: unknown | null;
        contextId: unknown | null;
        contextTypeId: unknown | null;
        partyId: unknown | null;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ENTITY_VALUES_REMOVE_COMMIT;
        };
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
export function entityValuesRemove(
    valueId: unknown | null = null,
    valueTypeId: unknown | null = null,
    contextId: unknown | null = null,
    contextTypeId: unknown | null = null,
    partyId: unknown | null = null
): EntityValuesRemoveAction {
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