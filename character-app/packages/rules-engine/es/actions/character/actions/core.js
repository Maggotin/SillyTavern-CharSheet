import * as actionTypes from '../actionTypes';
// TODO needs commit flow
/**
 *
 * @param data
 */
export function characterSet(data) {
    return {
        type: actionTypes.CHARACTER_SET,
        payload: Object.assign({}, data),
        meta: {},
    };
}
/**
 *
 * @param activeSourceCategories
 */
export function activeSourceCategoriesSet(activeSourceCategories) {
    return {
        type: actionTypes.ACTIVE_SOURCE_CATEGORIES_SET,
        payload: {
            activeSourceCategories,
        },
        meta: {
            commit: {
                type: actionTypes.ACTIVE_SOURCE_CATEGORIES_SET_COMMIT,
            },
        },
    };
}
export function activeSourcesSet(enabledSourceIds, campaignSettingId) {
    return {
        type: actionTypes.ACTIVE_SOURCES_SET,
        payload: {
            enabledSourceIds,
            campaignSettingId,
        },
        meta: {
            commit: {
                type: actionTypes.ACTIVE_SOURCES_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param key
 * @param value
 */
export function preferenceChoose(key, value) {
    return {
        type: actionTypes.PREFERENCE_CHOOSE,
        payload: {
            key,
            value,
        },
        meta: {},
    };
}
/**
 *
 * @param key
 * @param value
 */
export function preferenceSet(key, value) {
    return {
        type: actionTypes.PREFERENCE_SET,
        payload: {
            [key]: value,
        },
        meta: {
            commit: {
                type: actionTypes.PREFERENCE_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param components
 */
export function characterComponentsSet(components) {
    return {
        type: actionTypes.CHARACTER_COMPONENTS_SET,
        payload: Object.assign({}, components),
        meta: {
            commit: {
                type: actionTypes.CHARACTER_COMPONENTS_SET_COMMIT,
            },
        },
    };
}
/**
 *
 * @param socialImageData
 */
export function SendSocialImageData() {
    return {
        type: actionTypes.SEND_SOCIAL_IMAGE_DATA,
        payload: {},
        meta: {},
    };
}
