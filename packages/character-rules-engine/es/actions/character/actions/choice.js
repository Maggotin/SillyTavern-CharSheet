import * as actionTypes from '../actionTypes';
/**
 *
 * @param {array} choices
 * @param {array} choices.background
 * @param {array} choices.class
 * @param {array} choices.feat
 * @param {array} choices.race
 */
export function choicesSet(choices) {
    return {
        type: actionTypes.CHOICES_SET,
        payload: {
            choices,
        },
        meta: {
            commit: {
                type: actionTypes.CHOICES_SET_COMMIT,
            },
        },
    };
}
