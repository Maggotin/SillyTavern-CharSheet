import * as actionTypes from '../actionTypes/choice';

interface Choices {
    background: unknown[];
    class: unknown[];
    feat: unknown[];
    race: unknown[];
}

interface ChoicesSetAction {
    type: typeof actionTypes.CHOICES_SET;
    payload: {
        choices: Choices;
    };
    meta: {
        commit: {
            type: typeof actionTypes.CHOICES_SET_COMMIT;
        };
    };
}

/**
 *
 * @param {Choices} choices
 * @param {unknown[]} choices.background
 * @param {unknown[]} choices.class
 * @param {unknown[]} choices.feat
 * @param {unknown[]} choices.race
 */
export function choicesSet(choices: Choices): ChoicesSetAction {
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