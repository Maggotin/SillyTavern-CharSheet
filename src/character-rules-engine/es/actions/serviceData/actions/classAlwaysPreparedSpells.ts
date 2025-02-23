import * as actionTypes from '../actionTypes/classAlwaysPreparedSpells';

interface ClassAlwaysPreparedSpellsSetAction {
    type: typeof actionTypes.CLASS_ALWAYS_PREPARED_SPELLS_SET;
    payload: {
        spells: unknown;
        classId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CLASS_ALWAYS_PREPARED_SPELLS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param spells
 * @param classId
 */
export function classAlwaysPreparedSpellsSet(
    spells: unknown,
    classId: unknown
): ClassAlwaysPreparedSpellsSetAction {
    return {
        type: actionTypes.CLASS_ALWAYS_PREPARED_SPELLS_SET,
        payload: {
            spells,
            classId,
        },
        meta: {
            commit: {
                type: actionTypes.CLASS_ALWAYS_PREPARED_SPELLS_SET_COMMIT,
            },
        },
    };
}