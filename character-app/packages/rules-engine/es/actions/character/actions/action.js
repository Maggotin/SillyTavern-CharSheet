import * as actionTypes from '../actionTypes';
/**
 *
 * @param name
 * @param actionType
 */
export function customActionCreate(name, actionType) {
    return {
        type: actionTypes.CUSTOM_ACTION_CREATE,
        payload: {
            name,
            actionType,
        },
        meta: {},
    };
}
/**
 *
 * @param actions
 */
export function actionsSet(actions) {
    return {
        type: actionTypes.ACTIONS_SET,
        payload: {
            actions,
        },
        meta: {
            commit: {
                type: actionTypes.ACTIONS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param uses
 * @param dataOriginType
 */
export function actionUseSet(id, entityTypeId, uses, dataOriginType) {
    return {
        type: actionTypes.ACTION_USE_SET,
        payload: {
            id,
            entityTypeId,
            uses,
            dataOriginType,
        },
        meta: {
            commit: {
                type: actionTypes.ACTION_USE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param action
 */
export function customActionAdd(action) {
    return {
        type: actionTypes.CUSTOM_ACTION_ADD,
        payload: {
            action,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ACTION_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 */
export function customActionRemove(id) {
    return {
        type: actionTypes.CUSTOM_ACTION_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ACTION_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param properties
 */
export function customActionSet(id, properties) {
    return {
        type: actionTypes.CUSTOM_ACTION_SET,
        payload: {
            id,
            properties,
        },
        meta: {
            commit: {
                type: actionTypes.CUSTOM_ACTION_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 */
export function actionCustomizationsDelete(mappingId, mappingEntityTypeId) {
    return {
        type: actionTypes.ACTION_CUSTOMIZATIONS_DELETE,
        payload: {
            mappingId,
            mappingEntityTypeId,
        },
        meta: {},
    };
}
