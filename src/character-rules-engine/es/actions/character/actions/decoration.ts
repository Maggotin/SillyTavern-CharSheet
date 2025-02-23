import * as actionTypes from '../actionTypes/decoration';

interface BackdropSetAction {
    type: typeof actionTypes.BACKDROP_SET;
    payload: {
        backdrop: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.BACKDROP_SET_COMMIT;
        };
    };
}

/**
 *
 * @param backdrop
 */
export function backdropSet(backdrop: unknown): BackdropSetAction {
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

interface FrameSetAction {
    type: typeof actionTypes.FRAME_SET;
    payload: {
        frame: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.FRAME_SET_COMMIT;
        };
    };
}

/**
 *
 * @param frame
 */
export function frameSet(frame: unknown): FrameSetAction {
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

interface ThemeSetAction {
    type: typeof actionTypes.THEME_SET;
    payload: {
        themeColor: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.THEME_SET_COMMIT;
        };
    };
}

/**
 *
 * @param themeColor
 */
export function themeSet(themeColor: unknown): ThemeSetAction {
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

interface PortraitSetAction {
    type: typeof actionTypes.PORTRAIT_SET;
    payload: {
        avatarId: unknown;
        avatarUrl: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.PORTRAIT_SET_COMMIT;
        };
    };
}

/**
 *
 * @param avatarId
 * @param avatarUrl
 */
export function portraitSet(avatarId: unknown, avatarUrl: unknown): PortraitSetAction {
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

interface PortraitUploadAction {
    type: typeof actionTypes.PORTRAIT_UPLOAD;
    payload: {
        avatarImage: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param avatarImage
 */
export function portraitUpload(avatarImage: unknown): PortraitUploadAction {
    return {
        type: actionTypes.PORTRAIT_UPLOAD,
        payload: {
            avatarImage,
        },
        meta: {},
    };
}