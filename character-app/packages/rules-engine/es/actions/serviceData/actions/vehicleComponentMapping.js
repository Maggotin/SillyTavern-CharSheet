import * as actionTypes from '../actionTypes';
/**
 *
 * @param component
 */
export function vehicleComponentMappingAdd(component) {
    return {
        type: actionTypes.VEHICLE_COMPONENT_MAPPING_ADD,
        payload: {
            component,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_COMPONENT_MAPPING_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 */
export function vehicleComponentMappingRemove(id) {
    return {
        type: actionTypes.VEHICLE_COMPONENT_MAPPING_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_COMPONENT_MAPPING_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param removedHitPoints
 */
export function vehicleComponentMappingHitPointsSet(id, removedHitPoints) {
    return {
        type: actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET,
        payload: {
            id,
            removedHitPoints,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET_COMMIT,
            },
        },
    };
}
