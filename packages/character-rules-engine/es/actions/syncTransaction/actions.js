import * as actionTypes from './actionTypes';
/**
 *
 * @param initiator
 */
export function activate(initiator) {
    return {
        type: actionTypes.ACTIVATE,
        payload: {
            initiator,
        },
    };
}
/**
 *
 */
export function deactivate() {
    return {
        type: actionTypes.DEACTIVATE,
    };
}
