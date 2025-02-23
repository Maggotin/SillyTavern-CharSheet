import { DefinitionGenerators, DefinitionTypeEnum } from '../../../engine/Definition';
import * as actionTypes from '../actionTypes/knownInfusionMapping';

interface KnownInfusionMappingCreateAction {
    type: typeof actionTypes.KNOWN_INFUSION_MAPPING_CREATE;
    payload: {
        choiceKey: unknown;
        infusionId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param choiceKey
 * @param infusionId
 */
export function knownInfusionMappingCreate(
    choiceKey: unknown,
    infusionId: unknown
): KnownInfusionMappingCreateAction {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_CREATE,
        payload: {
            choiceKey,
            infusionId,
        },
        meta: {},
    };
}

interface KnownInfusionMappingAddAction {
    type: typeof actionTypes.KNOWN_INFUSION_MAPPING_ADD;
    payload: unknown;
    meta: {
        commit: {
            type: typeof actionTypes.KNOWN_INFUSION_MAPPING_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param infusionKnownMapping
 */
export function knownInfusionMappingAdd(infusionKnownMapping: unknown): KnownInfusionMappingAddAction {
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

interface KnownInfusionMappingDestroyAction {
    type: typeof actionTypes.KNOWN_INFUSION_MAPPING_DESTROY;
    payload: {
        choiceKey: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param choiceKey
 */
export function knownInfusionMappingDestroy(choiceKey: unknown): KnownInfusionMappingDestroyAction {
    return {
        type: actionTypes.KNOWN_INFUSION_MAPPING_DESTROY,
        payload: {
            choiceKey,
        },
        meta: {},
    };
}

interface KnownInfusionMappingSetAction {
    type: typeof actionTypes.KNOWN_INFUSION_MAPPING_SET;
    payload: {
        choiceKey: unknown;
        infusionId: unknown;
        definitionKey: ReturnType<typeof DefinitionGenerators.generateDefinitionKey>;
        itemId: unknown;
        itemTypeId: unknown;
        itemName: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.KNOWN_INFUSION_MAPPING_SET_COMMIT;
        };
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
export function knownInfusionMappingSet(
    choiceKey: unknown,
    infusionId: unknown,
    itemId: unknown,
    itemTypeId: unknown,
    itemName: unknown
): KnownInfusionMappingSetAction {
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

interface KnownInfusionMappingRemoveAction {
    type: typeof actionTypes.KNOWN_INFUSION_MAPPING_REMOVE;
    payload: {
        choiceKey: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.KNOWN_INFUSION_MAPPING_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param choiceKey
 */
export function knownInfusionMappingRemove(choiceKey: unknown): KnownInfusionMappingRemoveAction {
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