import * as actionTypes from '../actionTypes/ruleDataPool';

interface RuleDataPoolKeySetAction {
    type: typeof actionTypes.RULE_DATA_POOL_KEY_SET;
    payload: {
        key: unknown;
        data: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.RULE_DATA_POOL_KEY_SET_COMMIT;
        };
    };
}

export function ruleDataPoolKeySet(key: unknown, data: unknown): RuleDataPoolKeySetAction {
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