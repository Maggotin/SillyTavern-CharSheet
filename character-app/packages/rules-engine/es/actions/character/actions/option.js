import * as actionTypes from '../actionTypes';
/**
 *
 * @param options
 */
export function optionsSet(options) {
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
