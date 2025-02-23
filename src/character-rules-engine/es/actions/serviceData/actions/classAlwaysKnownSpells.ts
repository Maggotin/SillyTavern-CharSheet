import * as actionTypes from '../actionTypes/classAlwaysKnownSpells';

interface ClassAlwaysKnownSpellsSetAction {
    type: typeof actionTypes.CLASS_ALWAYS_KNOWN_SPELLS_SET;
    payload: {
        spells: unknown;
        classId: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CLASS_ALWAYS_KNOWN_SPELLS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param spells
 * @param classId
 */
export function classAlwaysKnownSpellsSet(
    spells: unknown,
    classId: unknown
): ClassAlwaysKnownSpellsSetAction {
    return {
        type: actionTypes.CLASS_ALWAYS_KNOWN_SPELLS_SET,
        payload: {
            spells,
            classId,
        },
        meta: {
            commit: {
                type: actionTypes.CLASS_ALWAYS_KNOWN_SPELLS_SET_COMMIT,
            },
        },
    };
}