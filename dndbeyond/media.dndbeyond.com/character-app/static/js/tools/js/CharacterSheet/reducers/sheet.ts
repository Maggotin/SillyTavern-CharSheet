import { SheetAction, sheetActionTypes } from "../actions/sheet";
import { SheetState } from "../typings";

const initialState: SheetState = {
  initFailed: false,
  initError: null,
};
function sheet(
  state: SheetState = initialState,
  action: SheetAction
): SheetState {
  switch (action.type) {
    case sheetActionTypes.CHARACTER_RECEIVE_FAIL:
      return {
        ...state,
        initFailed: true,
        initError: action.payload.error,
      };
  }

  return state;
}

export default sheet;
