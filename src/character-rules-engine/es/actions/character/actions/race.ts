import * as actionTypes from '../actionTypes/race';

interface Race {
    // Define the structure of race here
    // For now, we'll use Record<string, unknown>
}

interface RaceChooseAction {
    type: typeof actionTypes.RACE_CHOOSE;
    payload: {
        race: Race;
    };
    meta: {
        postAction: {
            type: [typeof actionTypes.RACE_CHOOSE_POST_ACTION];
        };
    };
}

/**
 *
 * @param race
 */
export function raceChoose(race: Race): RaceChooseAction {
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

interface RaceSetAction {
    type: typeof actionTypes.RACE_SET;
    payload: {
        race: Race;
    };
    meta: {
        commit: {
            type: typeof actionTypes.RACE_SET_COMMIT;
        };
    };
}

/**
 *
 * @param race
 */
export function raceSet(race: Race): RaceSetAction {
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