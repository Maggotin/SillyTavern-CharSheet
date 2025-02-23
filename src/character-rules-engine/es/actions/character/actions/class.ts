import * as actionTypes from '../actionTypes/class';
    
interface ClassAddRequestAction {
    type: typeof actionTypes.CLASS_ADD_REQUEST;
    payload: {
        charClass: unknown;
        level: unknown;
    };
    meta: {
        postAction: {
            type: typeof actionTypes.CLASS_ADD_POST_ACTION[];
        };
    };
}

/**
 *
 * @param charClass
 * @param level
 */
export function classAddRequest(charClass: unknown, level: unknown): ClassAddRequestAction {
    return {
        type: actionTypes.CLASS_ADD_REQUEST,
        payload: {
            charClass,
            level,
        },
        meta: {
            postAction: {
                type: [actionTypes.CLASS_ADD_POST_ACTION],
            },
        },
    };
}

interface ClassRemoveRequestAction {
    type: typeof actionTypes.CLASS_REMOVE_REQUEST;
    payload: {
        characterClassId: unknown;
        newCharacterXp: unknown | null;
    };
    meta: {
        postAction: {
            type: typeof actionTypes.CLASS_REMOVE_POST_ACTION[];
        };
    };
}

/**
 *
 * @param characterClassId
 * @param newCharacterXp
 */
export function classRemoveRequest(characterClassId: unknown, newCharacterXp: unknown | null = null): ClassRemoveRequestAction {
    return {
        type: actionTypes.CLASS_REMOVE_REQUEST,
        payload: {
            characterClassId,
            newCharacterXp,
        },
        meta: {
            postAction: {
                type: [actionTypes.CLASS_REMOVE_POST_ACTION],
            },
        },
    };
}

interface ClassLevelSetRequestAction {
    type: typeof actionTypes.CLASS_LEVEL_SET_REQUEST;
    payload: {
        classId: unknown;
        level: unknown;
        newCharacterXp: unknown | null;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param classId
 * @param level
 * @param newCharacterXp
 */
export function classLevelSetRequest(classId: unknown, level: unknown, newCharacterXp: unknown | null = null): ClassLevelSetRequestAction {
    return {
        type: actionTypes.CLASS_LEVEL_SET_REQUEST,
        payload: {
            classId,
            level,
            newCharacterXp,
        },
        meta: {},
    };
}

// TODO needs commit workflow
interface ClassAddAction {
    type: typeof actionTypes.CLASS_ADD;
    payload: {
        charClass: unknown;
    };
    meta: Record<string, never>;
}

/**
 *
 * @param charClass
 */
export function classAdd(charClass: unknown): ClassAddAction {
    return {
        type: actionTypes.CLASS_ADD,
        payload: {
            charClass,
        },
        meta: {},
    };
}

// TODO needs commit workflow
interface ClassesSetAction {
    type: typeof actionTypes.CLASSES_SET;
    payload: {
        classes: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CLASSES_SET_COMMIT;
        };
    };
}

/**
 *
 * @param classes
 */
export function classesSet(classes: unknown): ClassesSetAction {
    return {
        type: actionTypes.CLASSES_SET,
        payload: {
            classes,
        },
        meta: {
            commit: {
                type: actionTypes.CLASSES_SET_COMMIT,
            },
        },
    };
}

// TODO needs commit workflow
interface ClassSetAction {
    type: typeof actionTypes.CLASS_SET;
    payload: Record<string, unknown>;
    meta: {
        commit: {
            type: typeof actionTypes.CLASS_SET_COMMIT;
        };
    };
}

/**
 *
 * @param charClass
 */
export function classSet(charClass: Record<string, unknown>): ClassSetAction {
    return {
        type: actionTypes.CLASS_SET,
        payload: { ...charClass },
        meta: {
            commit: {
                type: actionTypes.CLASS_SET_COMMIT,
            },
        },
    };
}