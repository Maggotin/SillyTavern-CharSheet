import * as actionTypes from '../actionTypes';
/**
 *
 * @param id
 * @param level
 */
export function conditionSet(id, level = null) {
    return {
        type: actionTypes.CONDITION_SET,
        payload: {
            id,
            level,
        },
        meta: {},
    };
}
/**
 *
 * @param id
 * @param level
 */
export function conditionAdd(id, level = null) {
    return {
        type: actionTypes.CONDITION_ADD,
        payload: {
            id,
            level,
        },
        meta: {},
    };
}
/**
 *
 * @param id
 */
export function conditionRemove(id) {
    return {
        type: actionTypes.CONDITION_REMOVE,
        payload: {
            id,
        },
        meta: {},
    };
}
/**
 *
 * @param conditions
 */
export function conditionsSet(conditions) {
    return {
        type: actionTypes.CONDITIONS_SET,
        payload: {
            conditions,
        },
        meta: {
            commit: {
                type: actionTypes.CONDITIONS_SET_COMMIT,
            },
        },
    };
}
