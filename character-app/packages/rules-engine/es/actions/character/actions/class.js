import * as actionTypes from '../actionTypes';
/**
 *
 * @param charClass
 * @param level
 */
export function classAddRequest(charClass, level) {
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
/**
 *
 * @param characterClassId
 * @param newCharacterXp
 */
export function classRemoveRequest(characterClassId, newCharacterXp = null) {
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
/**
 *
 * @param classId
 * @param level
 * @param newCharacterXp
 */
export function classLevelSetRequest(classId, level, newCharacterXp = null) {
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
/**
 *
 * @param charClass
 */
export function classAdd(charClass) {
    return {
        type: actionTypes.CLASS_ADD,
        payload: {
            charClass,
        },
        meta: {},
    };
}
// TODO needs commit workflow
/**
 *
 * @param classes
 */
export function classesSet(classes) {
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
/**
 *
 * @param charClass
 */
export function classSet(charClass) {
    return {
        type: actionTypes.CLASS_SET,
        payload: Object.assign({}, charClass),
        meta: {
            commit: {
                type: actionTypes.CLASS_SET_COMMIT,
            },
        },
    };
}
