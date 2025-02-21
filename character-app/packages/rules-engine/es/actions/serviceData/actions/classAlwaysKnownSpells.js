import * as actionTypes from '../actionTypes';
/**
 *
 * @param spells
 * @param classId
 */
export function classAlwaysKnownSpellsSet(spells, classId) {
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
