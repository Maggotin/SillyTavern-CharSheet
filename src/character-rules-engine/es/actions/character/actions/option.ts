import * as actionTypes from '../actionTypes/option';

interface OptionsSetAction {
    type: typeof actionTypes.OPTIONS_SET;
    payload: {
        options: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.OPTIONS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param options
 */
export function optionsSet(options: unknown): OptionsSetAction {
    return {
        type: actionTypes.OPTIONS_SET,
        payload: {
            options,
        },
        meta: {
            commit: {
                type: actionTypes.OPTIONS_SET_COMMIT,
            },
        },
    };
}