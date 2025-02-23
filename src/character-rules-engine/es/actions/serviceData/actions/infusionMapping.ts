import * as actionTypes from '../actionTypes/infusionMapping';

interface InfusionMappingCreateAction {
    type: typeof actionTypes.INFUSION_MAPPING_CREATE;
    payload: unknown;
    meta: Record<string, never>;
}

/**
 *
 * @param payload
 */
export function infusionMappingCreate(payload: unknown): InfusionMappingCreateAction {
    return {
        type: actionTypes.INFUSION_MAPPING_CREATE,
        payload,
        meta: {},
    };
}

interface InfusionMappingAddAction {
    type: typeof actionTypes.INFUSION_MAPPING_ADD;
    payload: unknown;
    meta: {
        commit: {
            type: typeof actionTypes.INFUSION_MAPPING_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param infusionMapping
 */
export function infusionMappingAdd(infusionMapping: unknown): InfusionMappingAddAction {
    return {
        type: actionTypes.INFUSION_MAPPING_ADD,
        payload: infusionMapping,
        meta: {
            commit: {
                type: actionTypes.INFUSION_MAPPING_ADD_COMMIT,
            },
        },
    };
}

interface InfusionMappingDestroyAction {
    type: typeof actionTypes.INFUSION_MAPPING_DESTROY;
    payload: {
        infusionId: unknown;
        inventoryMappingId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param infusionId
 * @param inventoryMappingId
 */
export function infusionMappingDestroy(
    infusionId: unknown,
    inventoryMappingId: unknown
): InfusionMappingDestroyAction {
    return {
        type: actionTypes.INFUSION_MAPPING_DESTROY,
        payload: {
            infusionId,
            inventoryMappingId,
        },
        meta: {},
    };
}

interface InfusionMappingsDestroyAction {
    type: typeof actionTypes.INFUSION_MAPPINGS_DESTROY;
    payload: {
        ids: unknown[];
    };
    meta: Record<string, never>;
}

/**
 *
 * @param itemMappingIds
 */
export function infusionMappingsDestroy(itemMappingIds: unknown[]): InfusionMappingsDestroyAction {
    return {
        type: actionTypes.INFUSION_MAPPINGS_DESTROY,
        payload: {
            ids: itemMappingIds,
        },
        meta: {},
    };
}

interface InfusionMappingRemoveAction {
    type: typeof actionTypes.INFUSION_MAPPING_REMOVE;
    payload: {
        infusionId: unknown;
        inventoryMappingId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.INFUSION_MAPPING_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param infusionId
 * @param inventoryMappingId
 */
export function infusionMappingRemove(
    infusionId: unknown,
    inventoryMappingId: unknown
): InfusionMappingRemoveAction {
    return {
        type: actionTypes.INFUSION_MAPPING_REMOVE,
        payload: {
            infusionId,
            inventoryMappingId,
        },
        meta: {
            commit: {
                type: actionTypes.INFUSION_MAPPING_REMOVE_COMMIT,
            },
        },
    };
}