import * as actionTypes from '../actionTypes';
/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function optionalOriginCreate(racialTraitId, affectedRacialTraitId) {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_CREATE,
        payload: {
            racialTraitId,
            affectedRacialTraitId,
        },
        meta: {},
    };
}
/**
 *
 * @param optionalOrigin
 */
export function optionalOriginAdd(optionalOrigin) {
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
/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function optionalOriginSetRequest(racialTraitId, affectedRacialTraitId) {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_SET_REQUEST,
        payload: {
            racialTraitId,
            affectedRacialTraitId,
        },
        meta: {},
    };
}
/**
 *
 * @param optionalOriginContract
 */
export function optionalOriginSet(optionalOriginContract) {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_SET,
        payload: Object.assign({}, optionalOriginContract),
        meta: {
            commit: {
                type: actionTypes.OPTIONAL_ORIGIN_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param racialTraitId
 */
export function optionalOriginDestroy(racialTraitId) {
    return {
        type: actionTypes.OPTIONAL_ORIGIN_DESTROY,
        payload: {
            racialTraitId,
        },
        meta: {},
    };
}
/**
 *
 * @param racialTraitId
 */
export function optionalOriginRemove(racialTraitId) {
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
