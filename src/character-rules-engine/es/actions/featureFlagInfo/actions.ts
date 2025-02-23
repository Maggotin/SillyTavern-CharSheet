import * as actionTypes from './actionTypes';

interface DataSetAction {
    type: typeof actionTypes.DATA_SET;
    featureFlags: unknown;
}

/**
 *
 * @param featureFlags
 */
export function dataSet(featureFlags: unknown): DataSetAction {
    return {
        type: actionTypes.DATA_SET,
        featureFlags,
    };
}