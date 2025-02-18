import * as actionTypes from '../actionTypes';
/**
 *
 * @param classFeatureId
 * @param affectedClassFeatureId
 */
export function optionalClassFeatureCreate(classFeatureId, affectedClassFeatureId) {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_CREATE,
        payload: {
            classFeatureId,
            affectedClassFeatureId,
        },
        meta: {},
    };
}
/**
 *
 * @param optionalClassFeature
 */
export function optionalClassFeatureAdd(optionalClassFeature) {
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
/**
 *
 * @param classFeatureId
 * @param affectedClassFeatureId
 */
export function optionalClassFeatureSetRequest(classFeatureId, affectedClassFeatureId) {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_SET_REQUEST,
        payload: {
            classFeatureId,
            affectedClassFeatureId,
        },
        meta: {},
    };
}
/**
 *
 * @param optionalClassFeatureProps
 */
export function optionalClassFeatureSet(optionalClassFeatureProps) {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_SET,
        payload: Object.assign({}, optionalClassFeatureProps),
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_CLASS_FEATURE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param classFeatureId
 */
export function optionalClassFeatureDestroy(classFeatureId) {
    return {
        type: actionTypes.OPTIONAL_CLASS_FEATURE_DESTROY,
        payload: {
            classFeatureId,
        },
        meta: {},
    };
}
/**
 *
 * @param classFeatureId
 */
export function optionalClassFeatureRemove(classFeatureId) {
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
