import * as actionTypes from '../actionTypes/vehicleComponentMapping';

interface VehicleComponentMappingAddAction {
    type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_ADD;
    payload: {
        component: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param component
 */
export function vehicleComponentMappingAdd(component: unknown): VehicleComponentMappingAddAction {
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

interface VehicleComponentMappingRemoveAction {
    type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_REMOVE;
    payload: {
        id: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param id
 */
export function vehicleComponentMappingRemove(id: unknown): VehicleComponentMappingRemoveAction {
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

interface VehicleComponentMappingHitPointsSetAction {
    type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET;
    payload: {
        id: unknown;
        removedHitPoints: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param removedHitPoints
 */
export function vehicleComponentMappingHitPointsSet(
    id: unknown,
    removedHitPoints: unknown
): VehicleComponentMappingHitPointsSetAction {
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