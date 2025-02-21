import * as actionTypes from '../actionTypes';
/**
 *
 * @param payload
 */
export function infusionMappingCreate(payload) {
    return {
        type: actionTypes.INFUSION_MAPPING_CREATE,
        payload,
        meta: {},
    };
}
/**
 *
 * @param infusionMapping
 */
export function infusionMappingAdd(infusionMapping) {
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
/**
 *
 * @param infusionId
 * @param inventoryMappingId
 */
export function infusionMappingDestroy(infusionId, inventoryMappingId) {
    return {
        type: actionTypes.INFUSION_MAPPING_DESTROY,
        payload: {
            infusionId,
            inventoryMappingId,
        },
        meta: {},
    };
}
/**
 *
 * @param itemMappingIds
 */
export function infusionMappingsDestroy(itemMappingIds) {
    return {
        type: actionTypes.INFUSION_MAPPINGS_DESTROY,
        payload: {
            ids: itemMappingIds,
        },
        meta: {},
    };
}
/**
 *
 * @param infusionId
 * @param inventoryMappingId
 */
export function infusionMappingRemove(infusionId, inventoryMappingId) {
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
