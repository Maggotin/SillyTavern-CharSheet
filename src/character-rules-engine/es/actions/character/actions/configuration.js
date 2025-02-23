import * as actionTypes from '../actionTypes';
/**
 *
 * @param showHelpText
 */
export function showHelpTextSet(showHelpText) {
    return {
        type: actionTypes.SHOW_HELP_TEXT_SET,
        payload: {
            showHelpText,
        },
        meta: {},
    };
}
/**
 *
 * @param showHelpText
 */
export function showHelpTextSetRequest(showHelpText) {
    return {
        type: actionTypes.SHOW_HELP_TEXT_SET_REQUEST,
        payload: {
            showHelpText,
        },
        meta: {},
    };
}
/**
 *
 * @param startingEquipmentType
 */
export function startingEquipmentTypeSet(startingEquipmentType) {
    return {
        type: actionTypes.STARTING_EQUIPMENT_TYPE_SET,
        payload: {
            startingEquipmentType,
        },
        meta: {},
    };
}
/**
 *
 * @param payload
 */
export function startingEquipmentTypeSetCommit(payload) {
    return {
        type: actionTypes.STARTING_EQUIPMENT_TYPE_SET_COMMIT,
        payload,
        meta: {},
    };
}
/**
 *
 * @param abilityScoreType
 */
export function abilityScoreTypeSetRequest(abilityScoreType) {
    return {
        type: actionTypes.ABILITY_SCORE_TYPE_SET_REQUEST,
        payload: {
            abilityScoreType,
        },
        meta: {},
    };
}
/**
 *
 * @param abilityScoreType
 */
export function abilityScoreTypeSetCommit(abilityScoreType) {
    return {
        type: actionTypes.ABILITY_SCORE_TYPE_SET_COMMIT,
        payload: {
            abilityScoreType,
        },
        meta: {},
    };
}
