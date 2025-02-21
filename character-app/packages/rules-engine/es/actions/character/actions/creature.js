import * as actionTypes from '../actionTypes';
/**
 *
 * @param groupId
 * @param monsterId
 * @param names
 * @param accept
 * @param reject
 */
export function creatureCreate(groupId, monsterId, names, accept, reject) {
    return {
        type: actionTypes.CREATURE_CREATE,
        payload: {
            groupId,
            monsterId,
            names,
        },
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param creature
 */
export function creatureAdd(creature) {
    return {
        type: actionTypes.CREATURE_ADD,
        payload: {
            creature,
        },
        meta: {
            commit: {
                type: actionTypes.CREATURE_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 */
export function creatureRemove(id) {
    return {
        type: actionTypes.CREATURE_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.CREATURE_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param properties
 */
export function creatureDataSet(id, properties) {
    return {
        type: actionTypes.CREATURE_DATA_SET,
        payload: {
            id,
            properties,
        },
        meta: {
            commit: {
                type: actionTypes.CREATURE_DATA_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param removedHitPoints
 * @param temporaryHitPoints
 */
export function creatureHitPointsSet(id, removedHitPoints, temporaryHitPoints) {
    return {
        type: actionTypes.CREATURE_HIT_POINTS_SET,
        payload: {
            id,
            removedHitPoints,
            temporaryHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.CREATURE_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param isActive
 */
export function creatureActiveSet(id, isActive) {
    return {
        type: actionTypes.CREATURE_ACTIVE_SET,
        payload: {
            id,
            isActive,
        },
        meta: {
            commit: {
                type: actionTypes.CREATURE_ACTIVE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 */
export function creatureCustomizationsDelete(mappingId, mappingEntityTypeId) {
    return {
        type: actionTypes.CREATURE_CUSTOMIZATIONS_DELETE,
        payload: {
            mappingId,
            mappingEntityTypeId,
        },
        meta: {},
    };
}
