import * as actionTypes from '../actionTypes/modifier';

interface ModifiersSetAction {
    type: typeof actionTypes.MODIFIERS_SET;
    payload: {
        modifiers: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.MODIFIERS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param modifiers
 */
export function modifiersSet(modifiers: unknown): ModifiersSetAction {
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