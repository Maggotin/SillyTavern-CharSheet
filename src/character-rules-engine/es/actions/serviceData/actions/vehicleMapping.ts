import * as actionTypes from '../actionTypes/vehicleMapping';

interface VehicleMappingCreateAction {
    type: typeof actionTypes.VEHICLE_MAPPING_CREATE;
    payload: {
        vehicleId: unknown;
        name: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param vehicleId
 * @param name
 * @param accept
 * @param reject
 */
export function vehicleMappingCreate(
    vehicleId: unknown,
    name: unknown,
    accept: unknown,
    reject: unknown
): VehicleMappingCreateAction {
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

interface VehicleMappingAddAction {
    type: typeof actionTypes.VEHICLE_MAPPING_ADD;
    payload: {
        vehicle: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param vehicle
 */
export function vehicleMappingAdd(vehicle: unknown): VehicleMappingAddAction {
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

interface VehicleMappingRemoveAction {
    type: typeof actionTypes.VEHICLE_MAPPING_REMOVE;
    payload: {
        id: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param id
 */
export function vehicleMappingRemove(id: unknown): VehicleMappingRemoveAction {
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

interface VehicleMappingDataSetAction {
    type: typeof actionTypes.VEHICLE_MAPPING_DATA_SET;
    payload: {
        id: unknown;
        properties: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_DATA_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param properties
 */
export function vehicleMappingDataSet(id: unknown, properties: unknown): VehicleMappingDataSetAction {
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

interface VehicleMappingRemainingFuelSetAction {
    type: typeof actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET;
    payload: {
        vehicleMappingId: unknown;
        remainingFuel: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET_COMMIT;
        };
    };
}

/**
 *
 * @param vehicleMappingId
 * @param remainingFuel
 */
export function vehicleMappingRemainingFuelSet(
    vehicleMappingId: unknown,
    remainingFuel: unknown
): VehicleMappingRemainingFuelSetAction {
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

interface VehicleMappingConditionSetAction {
    type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_SET;
    payload: {
        vehicleMappingId: unknown;
        mappingContract: {
            conditionId: unknown;
            level: unknown;
        };
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_SET_COMMIT;
        };
    };
}

/**
 *
 * @param vehicleMappingId
 * @param conditionId
 * @param level
 */
export function vehicleMappingConditionSet(
    vehicleMappingId: unknown,
    conditionId: unknown,
    level: unknown
): VehicleMappingConditionSetAction {
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

interface VehicleMappingConditionAddAction {
    type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_ADD;
    payload: {
        vehicleMappingId: unknown;
        mappingContract: {
            conditionId: unknown;
            level: unknown;
        };
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param vehicleMappingId
 * @param conditionId
 * @param level
 */
export function vehicleMappingConditionAdd(
    vehicleMappingId: unknown,
    conditionId: unknown,
    level: unknown
): VehicleMappingConditionAddAction {
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

interface VehicleMappingConditionRemoveAction {
    type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE;
    payload: {
        vehicleMappingId: unknown;
        conditionId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param vehicleMappingId
 * @param conditionId
 */
export function vehicleMappingConditionRemove(
    vehicleMappingId: unknown,
    conditionId: unknown
): VehicleMappingConditionRemoveAction {
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