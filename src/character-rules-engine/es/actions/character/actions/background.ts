import * as actionTypes from '../actionTypes';

interface BackgroundChooseAction {
    type: typeof actionTypes.BACKGROUND_CHOOSE;
    payload: {
        backgroundId: string | number;
    };
    meta: {};
}

export function backgroundChoose(backgroundId: string | number): BackgroundChooseAction {
    return {
        type: actionTypes.BACKGROUND_CHOOSE,
        payload: {
            backgroundId,
        },
        meta: {},
    };
}

interface Background {
    // Define the structure of the background object
    // This is an assumption and may need to be adjusted based on actual usage
    id: string | number;
    // Add other properties as needed
}

interface BackgroundSetAction {
    type: typeof actionTypes.BACKGROUND_SET;
    payload: {
        background: Background;
    };
    meta: {
        commit: {
            type: typeof actionTypes.BACKGROUND_SET_COMMIT;
        };
    };
}

export function backgroundSet(background: Background): BackgroundSetAction {
    return {
        type: actionTypes.BACKGROUND_SET,
        payload: {
            background,
        },
        meta: {
            commit: {
                type: actionTypes.BACKGROUND_SET_COMMIT,
            },
        },
    };
}

interface BackgroundChoiceSetRequestAction {
    type: typeof actionTypes.BACKGROUND_CHOICE_SET_REQUEST;
    payload: {
        choiceType: string;
        choiceId: string | number;
        optionValue: any; // This could be more specific depending on actual usage
    };
    meta: {};
}

export function backgroundChoiceSetRequest(
    choiceType: string,
    choiceId: string | number,
    optionValue: any
): BackgroundChoiceSetRequestAction {
    return {
        type: actionTypes.BACKGROUND_CHOICE_SET_REQUEST,
        payload: {
            choiceType,
            choiceId,
            optionValue,
        },
        meta: {},
    };
}

interface BackgroundHasCustomSetAction {
    type: typeof actionTypes.BACKGROUND_HAS_CUSTOM_SET;
    payload: {
        hasCustomBackground: boolean;
    };
    meta: {
        commit: {
            type: typeof actionTypes.BACKGROUND_HAS_CUSTOM_SET_COMMIT;
        };
    };
}

export function backgroundHasCustomSet(hasCustomBackground: boolean): BackgroundHasCustomSetAction {
    return {
        type: actionTypes.BACKGROUND_HAS_CUSTOM_SET,
        payload: {
            hasCustomBackground,
        },
        meta: {
            commit: {
                type: actionTypes.BACKGROUND_HAS_CUSTOM_SET_COMMIT,
            },
        },
    };
}

interface BackgroundHasCustomSetRequestAction {
    type: typeof actionTypes.BACKGROUND_HAS_CUSTOM_SET_REQUEST;
    payload: {
        hasCustomBackground: boolean;
    };
    meta: {};
}

export function backgroundHasCustomSetRequest(hasCustomBackground: boolean): BackgroundHasCustomSetRequestAction {
    return {
        type: actionTypes.BACKGROUND_HAS_CUSTOM_SET_REQUEST,
        payload: {
            hasCustomBackground,
        },
        meta: {},
    };
}

interface BackgroundCustomSetRequestAction {
    type: typeof actionTypes.BACKGROUND_CUSTOM_SET_REQUEST;
    payload: {
        properties: Record<string, any>; // This could be more specific depending on actual usage
    };
    meta: {};
}

export function backgroundCustomSetRequest(properties: Record<string, any>): BackgroundCustomSetRequestAction {
    return {
        type: actionTypes.BACKGROUND_CUSTOM_SET_REQUEST,
        payload: {
            properties,
        },
        meta: {},
    };
}