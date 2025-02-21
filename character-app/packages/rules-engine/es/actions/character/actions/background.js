import * as actionTypes from '../actionTypes';
/**
 *
 * @param backgroundId
 */
export function backgroundChoose(backgroundId) {
    return {
        type: actionTypes.BACKGROUND_CHOOSE,
        payload: {
            backgroundId,
        },
        meta: {},
    };
}
/**
 *
 * @param background
 */
export function backgroundSet(background) {
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
/**
 *
 * @param choiceType
 * @param choiceId
 * @param optionValue
 */
export function backgroundChoiceSetRequest(choiceType, choiceId, optionValue) {
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
/**
 *
 * @param hasCustomBackground
 */
export function backgroundHasCustomSet(hasCustomBackground) {
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
/**
 *
 * @param hasCustomBackground
 */
export function backgroundHasCustomSetRequest(hasCustomBackground) {
    return {
        type: actionTypes.BACKGROUND_HAS_CUSTOM_SET_REQUEST,
        payload: {
            hasCustomBackground,
        },
        meta: {},
    };
}
/**
 *
 * @param properties
 */
export function backgroundCustomSetRequest(properties) {
    return {
        type: actionTypes.BACKGROUND_CUSTOM_SET_REQUEST,
        payload: {
            properties,
        },
        meta: {},
    };
}
