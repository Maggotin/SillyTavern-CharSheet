import * as actionTypes from '../actionTypes';
/**
 *
 * @param modifiers
 */
export function modifiersSet(modifiers) {
    return {
        type: actionTypes.MODIFIERS_SET,
        payload: {
            modifiers,
        },
        meta: {
            commit: {
                type: actionTypes.MODIFIERS_SET_COMMIT,
            },
        },
    };
}
