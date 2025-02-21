import * as actionTypes from './actionTypes';
/**
 *
 * @param payload
 */
export function dataSet(payload) {
    return {
        type: actionTypes.DATA_SET,
        payload,
    };
}
