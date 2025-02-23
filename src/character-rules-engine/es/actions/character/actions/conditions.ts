import * as actionTypes from '../actionTypes/condition';

interface ConditionAction {
    type: typeof actionTypes.CONDITION_SET | typeof actionTypes.CONDITION_ADD | typeof actionTypes.CONDITION_REMOVE;
    payload: {
        id: unknown;
        level?: unknown | null;
    };
    meta: Record<string, never>;
}

interface ConditionsSetAction {
    type: typeof actionTypes.CONDITIONS_SET;
    payload: {
        conditions: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CONDITIONS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param id
 * @param level
 */
export function conditionSet(id: unknown, level: unknown | null = null): ConditionAction {
    return {
        type: actionTypes.CONDITION_SET,
        payload: {
            id,
            level,
        },
        meta: {},
    };
}

/**
 *
 * @param id
 * @param level
 */
export function conditionAdd(id: unknown, level: unknown | null = null): ConditionAction {
    return {
        type: actionTypes.CONDITION_ADD,
        payload: {
            id,
            level,
        },
        meta: {},
    };
}

/**
 *
 * @param id
 */
export function conditionRemove(id: unknown): ConditionAction {
    return {
        type: actionTypes.CONDITION_REMOVE,
        payload: {
            id,
        },
        meta: {},
    };
}

/**
 *
 * @param conditions
 */
export function conditionsSet(conditions: unknown): ConditionsSetAction {
    return {
        type: actionTypes.CONDITIONS_SET,
        payload: {
            conditions,
        },
        meta: {
            commit: {
                type: actionTypes.CONDITIONS_SET_COMMIT,
            },
        },
    };
}