import * as actionTypes from './actionTypes';

interface DataSetAction {
    type: typeof actionTypes.DATA_SET;
    payload: unknown;
}

/**
 *
 * @param payload
 */
export function dataSet(payload: unknown): DataSetAction {
    return {
        type: actionTypes.DATA_SET,
        payload,
    };
}