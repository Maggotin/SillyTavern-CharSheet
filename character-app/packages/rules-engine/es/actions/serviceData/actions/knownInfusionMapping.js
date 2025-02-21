import { DefinitionGenerators, DefinitionTypeEnum } from '../../../engine/Definition';
import * as actionTypes from '../actionTypes';
/**
 *
 * @param choiceKey
 * @param infusionId
 */
export function knownInfusionMappingCreate(choiceKey, infusionId) {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_CREATE,
        payload: {
            choiceKey,
            infusionId,
        },
        meta: {},
    };
}
/**
 *
 * @param infusionKnownMapping
 */
export function knownInfusionMappingAdd(infusionKnownMapping) {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_ADD,
        payload: infusionKnownMapping,
        meta: {
            commit: {
                type: actionTypes.KNOWN_INFUSION_MAPPING_ADD_COMMIT,
            },
        },
    };
}
/**
 *
 * @param choiceKey
 */
export function knownInfusionMappingDestroy(choiceKey) {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_DESTROY,
        payload: {
            choiceKey,
        },
        meta: {},
    };
}
/**
 *
 * @param choiceKey
 * @param infusionId
 * @param itemId
 * @param itemTypeId
 * @param itemName
 */
export function knownInfusionMappingSet(choiceKey, infusionId, itemId, itemTypeId, itemName) {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_SET,
        payload: {
            choiceKey,
            infusionId,
            definitionKey: DefinitionGenerators.generateDefinitionKey(DefinitionTypeEnum.INFUSION, infusionId),
            itemId,
            itemTypeId,
            itemName,
        },
        meta: {
            commit: {
                type: actionTypes.KNOWN_INFUSION_MAPPING_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param choiceKey
 */
export function knownInfusionMappingRemove(choiceKey) {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_REMOVE,
        payload: {
            choiceKey,
        },
        meta: {
            commit: {
                type: actionTypes.KNOWN_INFUSION_MAPPING_REMOVE_COMMIT,
            },
        },
    };
}
