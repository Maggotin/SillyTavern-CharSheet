import * as actionTypes from '../actionTypes';
/**
 *
 * @param vehicleId
 * @param name
 * @param accept
 * @param reject
 */
export function vehicleMappingCreate(vehicleId, name, accept, reject) {
    return {
        type: actionTypes.VEHICLE_MAPPING_CREATE,
        payload: {
            vehicleId,
            name,
        },
        meta: {
            accept,
            reject,
        },
    };
}
/**
 *
 * @param vehicle
 */
export function vehicleMappingAdd(vehicle) {
    return {
        type: actionTypes.VEHICLE_MAPPING_ADD,
        payload: {
            vehicle,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 */
export function vehicleMappingRemove(id) {
    return {
        type: actionTypes.VEHICLE_MAPPING_REMOVE,
        payload: {
            id,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_REMOVE_COMMIT,
            },
        },
    };
}
/**
 *
 * @param id
 * @param properties
 */
export function vehicleMappingDataSet(id, properties) {
    return {
        type: actionTypes.VEHICLE_MAPPING_DATA_SET,
        payload: {
            id,
            properties,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_DATA_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param vehicleMappingId
 * @param remainingFuel
 */
export function vehicleMappingRemainingFuelSet(vehicleMappingId, remainingFuel) {
    return {
        type: actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET,
        payload: {
            vehicleMappingId,
            remainingFuel,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param vehicleMappingId
 * @param conditionId
 * @param level
 */
export function vehicleMappingConditionSet(vehicleMappingId, conditionId, level) {
    return {
        type: actionTypes.VEHICLE_MAPPING_CONDITION_SET,
        payload: {
            vehicleMappingId,
            mappingContract: {
                conditionId,
                level,
            },
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_CONDITION_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param vehicleMappingId
 * @param conditionId
 * @param level
 */
export function vehicleMappingConditionAdd(vehicleMappingId, conditionId, level) {
    return {
        type: actionTypes.VEHICLE_MAPPING_CONDITION_ADD,
        payload: {
            vehicleMappingId,
            mappingContract: {
                conditionId,
                level,
            },
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_CONDITION_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param vehicleMappingId
 * @param conditionId
 */
export function vehicleMappingConditionRemove(vehicleMappingId, conditionId) {
    return {
        type: actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE,
        payload: {
            vehicleMappingId,
            conditionId,
        },
        meta: {
            commit: {
                type: actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE_COMMIT,
            },
        },
    };
}
