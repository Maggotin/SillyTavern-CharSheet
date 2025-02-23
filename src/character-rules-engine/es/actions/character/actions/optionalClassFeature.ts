import * as actionTypes from '../actionTypes/optionalClassFeature';

interface OptionalClassFeatureCreateAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_CREATE;
    payload: {
        classFeatureId: unknown;
        affectedClassFeatureId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param classFeatureId
 * @param affectedClassFeatureId
 */
export function optionalClassFeatureCreate(
    classFeatureId: unknown,
    affectedClassFeatureId: unknown
): OptionalClassFeatureCreateAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_CREATE,
        payload: {
            classFeatureId,
            affectedClassFeatureId,
        },
        meta: {},
    };
}

interface OptionalClassFeatureAddAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_ADD;
    payload: {
        optionalClassFeature: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param optionalClassFeature
 */
export function optionalClassFeatureAdd(
    optionalClassFeature: unknown
): OptionalClassFeatureAddAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_ADD,
        payload: {
            optionalClassFeature,
        },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_CLASS_FEATURE_ADD_COMMIT,
            },
        },
    };
}

interface OptionalClassFeatureSetRequestAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_SET_REQUEST;
    payload: {
        classFeatureId: unknown;
        affectedClassFeatureId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param classFeatureId
 * @param affectedClassFeatureId
 */
export function optionalClassFeatureSetRequest(
    classFeatureId: unknown,
    affectedClassFeatureId: unknown
): OptionalClassFeatureSetRequestAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_SET_REQUEST,
        payload: {
            classFeatureId,
            affectedClassFeatureId,
        },
        meta: {},
    };
}

interface OptionalClassFeatureSetAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_SET;
    payload: Record<string, unknown>;
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT;
        };
    };
}

/**
 *
 * @param optionalClassFeatureProps
 */
export function optionalClassFeatureSet(
    optionalClassFeatureProps: Record<string, unknown>
): OptionalClassFeatureSetAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_SET,
        payload: { ...optionalClassFeatureProps },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT,
            },
        },
    };
}

interface OptionalClassFeatureDestroyAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_DESTROY;
    payload: {
        classFeatureId: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param classFeatureId
 */
export function optionalClassFeatureDestroy(
    classFeatureId: unknown
): OptionalClassFeatureDestroyAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_DESTROY,
        payload: {
            classFeatureId,
        },
        meta: {},
    };
}

interface OptionalClassFeatureRemoveAction {
    type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE;
    payload: {
        classFeatureId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE_COMMIT;
        };
    };
}

/**
 *
 * @param classFeatureId
 */
export function optionalClassFeatureRemove(
    classFeatureId: unknown
): OptionalClassFeatureRemoveAction {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE,
        payload: {
            classFeatureId,
        },
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_CLASS_FEATURE_REMOVE_COMMIT,
            },
        },
    };
}