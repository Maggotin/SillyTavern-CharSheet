import * as actionTypes from '../actionTypes';
/**
 *
 * @param backdrop
 */
export function backdropSet(backdrop) {
    return {
        type: actionTypes.BACKDROP_SET,
        payload: {
            backdrop,
        },
        meta: {
            commit: {
                type: actionTypes.BACKDROP_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param frame
 */
export function frameSet(frame) {
    return {
        type: actionTypes.FRAME_SET,
        payload: {
            frame,
        },
        meta: {
            commit: {
                type: actionTypes.FRAME_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param themeColor
 */
export function themeSet(themeColor) {
    return {
        type: actionTypes.THEME_SET,
        payload: {
            themeColor,
        },
        meta: {
            commit: {
                type: actionTypes.THEME_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param avatarId
 * @param avatarUrl
 */
export function portraitSet(avatarId, avatarUrl) {
    return {
        type: actionTypes.PORTRAIT_SET,
        payload: {
            avatarId,
            avatarUrl,
        },
        meta: {
            commit: {
                type: actionTypes.PORTRAIT_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param avatarImage
 */
export function portraitUpload(avatarImage) {
    return {
        type: actionTypes.PORTRAIT_UPLOAD,
        payload: {
            avatarImage,
        },
        meta: {},
    };
}
