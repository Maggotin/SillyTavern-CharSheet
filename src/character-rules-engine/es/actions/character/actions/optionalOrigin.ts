import * as actionTypes from '../actionTypes/optionalOrigin';

interface OptionalOriginCreateAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_CREATE;
    payload: {
        racialTraitId: unknown;
        affectedRacialTraitId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function optionalOriginCreate(
    racialTraitId: unknown,
    affectedRacialTraitId: unknown
): OptionalOriginCreateAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_CREATE,
        payload: {
            racialTraitId,
            affectedRacialTraitId,
        },
        meta: {},
    };
}

interface OptionalOriginAddAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_ADD;
    payload: {
        optionalOrigin: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_ORIGIN_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param optionalOrigin
 */
export function optionalOriginAdd(
    optionalOrigin: unknown
): OptionalOriginAddAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_ADD,
        payload: {
            optionalOrigin,
        },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_ORIGIN_ADD_COMMIT,
            },
        },
    };
}

interface OptionalOriginSetRequestAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_SET_REQUEST;
    payload: {
        racialTraitId: unknown;
        affectedRacialTraitId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function optionalOriginSetRequest(
    racialTraitId: unknown,
    affectedRacialTraitId: unknown
): OptionalOriginSetRequestAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_SET_REQUEST,
        payload: {
            racialTraitId,
            affectedRacialTraitId,
        },
        meta: {},
    };
}

interface OptionalOriginSetAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_SET;
    payload: Record<string, unknown>;
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_ORIGIN_SET_COMMIT;
        };
    };
}

/**
 *
 * @param optionalOriginContract
 */
export function optionalOriginSet(
    optionalOriginContract: Record<string, unknown>
): OptionalOriginSetAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_SET,
        payload: { ...optionalOriginContract },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_ORIGIN_SET_COMMIT,
            },
        },
    };
}

interface OptionalOriginDestroyAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_DESTROY;
    payload: {
        racialTraitId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param racialTraitId
 */
export function optionalOriginDestroy(
    racialTraitId: unknown
): OptionalOriginDestroyAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_DESTROY,
        payload: {
            racialTraitId,
        },
        meta: {},
    };
}

interface OptionalOriginRemoveAction {
    type: typeof actionTypes.OPTIONAL_ORIGIN_REMOVE;
    payload: {
        racialTraitId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_ORIGIN_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param racialTraitId
 */
export function optionalOriginRemove(
    racialTraitId: unknown
): OptionalOriginRemoveAction {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_REMOVE,
        payload: {
            racialTraitId,
        },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_ORIGIN_REMOVE_COMMIT,
            },
        },
    };
}