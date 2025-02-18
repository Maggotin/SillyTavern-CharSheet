import * as actionTypes from '../actionTypes';
export function premadeInfoSetCommit(premadeInfo) {
    return {
        type: actionTypes.PREMADE_INFO_SET_COMMIT,
        payload: premadeInfo,
        meta: {},
    };
}
export function premadeInfoAdd(premadeInfo) {
    return {
        type: actionTypes.PREMADE_INFO_ADD,
        payload: premadeInfo,
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}
export function premadeInfoGet(characterId) {
    return {
        type: actionTypes.PREMADE_INFO_GET,
        payload: {
            characterId,
        },
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}
export function premadeInfoUpdate(premadeInfo) {
    return {
        type: actionTypes.PREMADE_INFO_UPDATE,
        payload: premadeInfo,
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_SET_COMMIT,
            },
        },
    };
}
export function premadeInfoDelete(characterId) {
    return {
        type: actionTypes.PREMADE_INFO_DELETE,
        payload: {
            characterId,
        },
        meta: {
            commit: {
                type: actionTypes.PREMADE_INFO_REMOVE_COMMIT,
            },
        },
    };
}
