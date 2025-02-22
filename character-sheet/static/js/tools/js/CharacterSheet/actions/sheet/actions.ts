import {
  CharacterInitAction,
  CharacterReceiveFailAction,
  sheetActionTypes,
} from "../sheet";

/**
 *
 */
export function characterInit(): CharacterInitAction {
  return {
    type: sheetActionTypes.CHARACTER_INIT,
    payload: {},
  };
}

/**
 *
 * @param error
 */
export function characterReceiveFail(error: Error): CharacterReceiveFailAction {
  return {
    type: sheetActionTypes.CHARACTER_RECEIVE_FAIL,
    payload: {
      error,
    },
  };
}
