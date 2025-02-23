import * as actionTypes from '../actionTypes/creature';

interface CreatureCreateAction {
    type: typeof actionTypes.CREATURE_CREATE;
    payload: {
        groupId: unknown;
        monsterId: unknown;
        names: unknown;
    };
    meta: {
        accept: unknown;
        reject: unknown;
    };
}

/**
 *
 * @param groupId
 * @param monsterId
 * @param names
 * @param accept
 * @param reject
 */
export function creatureCreate(
    groupId: unknown,
    monsterId: unknown,
    names: unknown,
    accept: unknown,
    reject: unknown
): CreatureCreateAction {
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

interface CreatureAddAction {
    type: typeof actionTypes.CREATURE_ADD;
    payload: {
        creature: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CREATURE_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param creature
 */
export function creatureAdd(creature: unknown): CreatureAddAction {
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

interface CreatureRemoveAction {
    type: typeof actionTypes.CREATURE_REMOVE;
    payload: {
        id: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CREATURE_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param id
 */
export function creatureRemove(id: unknown): CreatureRemoveAction {
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

interface CreatureDataSetAction {
    type: typeof actionTypes.CREATURE_DATA_SET;
    payload: {
        id: unknown;
        properties: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CREATURE_DATA_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param properties
 */
export function creatureDataSet(id: unknown, properties: unknown): CreatureDataSetAction {
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

interface CreatureHitPointsSetAction {
    type: typeof actionTypes.CREATURE_HIT_POINTS_SET;
    payload: {
        id: unknown;
        removedHitPoints: unknown;
        temporaryHitPoints: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CREATURE_HIT_POINTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param removedHitPoints
 * @param temporaryHitPoints
 */
export function creatureHitPointsSet(
    id: unknown,
    removedHitPoints: unknown,
    temporaryHitPoints: unknown
): CreatureHitPointsSetAction {
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

interface CreatureActiveSetAction {
    type: typeof actionTypes.CREATURE_ACTIVE_SET;
    payload: {
        id: unknown;
        isActive: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CREATURE_ACTIVE_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param isActive
 */
export function creatureActiveSet(id: unknown, isActive: unknown): CreatureActiveSetAction {
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

interface CreatureCustomizationsDeleteAction {
    type: typeof actionTypes.CREATURE_CUSTOMIZATIONS_DELETE;
    payload: {
        mappingId: unknown;
        mappingEntityTypeId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param mappingId
 * @param mappingEntityTypeId
 */
export function creatureCustomizationsDelete(
    mappingId: unknown,
    mappingEntityTypeId: unknown
): CreatureCustomizationsDeleteAction {
    return {
        type: actionTypes.CREATURE_CUSTOMIZATIONS_DELETE,
        payload: {
            mappingId,
            mappingEntityTypeId,
        },
        meta: {},
    };
}