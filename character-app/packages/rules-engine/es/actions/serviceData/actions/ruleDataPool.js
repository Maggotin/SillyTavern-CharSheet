import * as actionTypes from '../actionTypes';
export function ruleDataPoolKeySet(key, data) {
    return {
        type: actionTypes.RULE_DATA_POOL_KEY_SET,
        payload: {
            key,
            data,
        },
        meta: {
            commit: {
                type: actionTypes.RULE_DATA_POOL_KEY_SET_COMMIT,
            },
        },
    };
}
