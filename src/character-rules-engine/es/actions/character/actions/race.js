import * as actionTypes from '../actionTypes';
/**
 *
 * @param race
 */
export function raceChoose(race) {
    return {
        type: actionTypes.RACE_CHOOSE,
        payload: {
            race,
        },
        meta: {
            postAction: {
                type: [actionTypes.RACE_CHOOSE_POST_ACTION],
            },
        },
    };
}
/**
 *
 * @param race
 */
export function raceSet(race) {
    return {
        type: actionTypes.RACE_SET,
        payload: {
            race,
        },
        meta: {
            commit: {
                type: actionTypes.RACE_SET_COMMIT,
            },
        },
    };
}
