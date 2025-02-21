import * as actionTypes from './actionTypes';
/**
 *
 * @param featureFlags
 */
export function dataSet(data) {
    return {
        type: actionTypes.DATA_SET,
        payload: data,
    };
}
