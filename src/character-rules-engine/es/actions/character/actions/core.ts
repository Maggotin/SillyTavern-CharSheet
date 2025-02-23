import * as actionTypes from '../actionTypes/core';

// TODO needs commit flow
interface CharacterSetAction {
    type: typeof actionTypes.CHARACTER_SET;
    payload: Record<string, unknown>;
    meta: Record<string, never>;
}

/**
 *
 * @param data
 */
export function characterSet(data: Record<string, unknown>): CharacterSetAction {
    return {
        type: actionTypes.CHARACTER_SET,
        payload: { ...data },
        meta: {},
    };
}

interface ActiveSourceCategoriesSetAction {
    type: typeof actionTypes.ACTIVE_SOURCE_CATEGORIES_SET;
    payload: {
        activeSourceCategories: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ACTIVE_SOURCE_CATEGORIES_SET_COMMIT;
        };
    };
}

/**
 *
 * @param activeSourceCategories
 */
export function activeSourceCategoriesSet(activeSourceCategories: unknown): ActiveSourceCategoriesSetAction {
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

interface ActiveSourcesSetAction {
    type: typeof actionTypes.ACTIVE_SOURCES_SET;
    payload: {
        enabledSourceIds: unknown;
        campaignSettingId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.ACTIVE_SOURCES_SET_COMMIT;
        };
    };
}

export function activeSourcesSet(enabledSourceIds: unknown, campaignSettingId: unknown): ActiveSourcesSetAction {
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

interface PreferenceChooseAction {
    type: typeof actionTypes.PREFERENCE_CHOOSE;
    payload: {
        key: unknown;
        value: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param key
 * @param value
 */
export function preferenceChoose(key: unknown, value: unknown): PreferenceChooseAction {
    return {
        type: actionTypes.PREFERENCE_CHOOSE,
        payload: {
            key,
            value,
        },
        meta: {},
    };
}

interface PreferenceSetAction {
    type: typeof actionTypes.PREFERENCE_SET;
    payload: Record<string, unknown>;
    meta: {
        commit: {
            type: typeof actionTypes.PREFERENCE_SET_COMMIT;
        };
    };
}

/**
 *
 * @param key
 * @param value
 */
export function preferenceSet(key: string, value: unknown): PreferenceSetAction {
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

interface CharacterComponentsSetAction {
    type: typeof actionTypes.CHARACTER_COMPONENTS_SET;
    payload: Record<string, unknown>;
    meta: {
        commit: {
            type: typeof actionTypes.CHARACTER_COMPONENTS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param components
 */
export function characterComponentsSet(components: Record<string, unknown>): CharacterComponentsSetAction {
    return {
        type: actionTypes.CHARACTER_COMPONENTS_SET,
        payload: { ...components },
        meta: {
            commit: {
                type: actionTypes.CHARACTER_COMPONENTS_SET_COMMIT,
            },
        },
    };
}

interface SendSocialImageDataAction {
    type: typeof actionTypes.SEND_SOCIAL_IMAGE_DATA;
    payload: Record<string, never>;
    meta: Record<string, never>;
}

/**
 *
 * @param socialImageData
 */
export function SendSocialImageData(): SendSocialImageDataAction {
    return {
        type: actionTypes.SEND_SOCIAL_IMAGE_DATA,
        payload: {},
        meta: {},
    };
}