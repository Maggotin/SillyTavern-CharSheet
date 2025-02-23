import { appInfoActionTypes } from "../actions/appInfo";
import { AppInfoAction } from "../actions/appInfo/typings";
import { AppInfoState } from "../stores/typings";

const initialState: AppInfoState = {
  error: null,
};
function appInfo(
  state: AppInfoState = initialState,
  action: AppInfoAction
): AppInfoState {
  switch (action.type) {
    case appInfoActionTypes.ERROR_SET:
      return {
        ...state,
        error: {
          type: action.payload.appErrorType,
          errorId: action.payload.errorId,
        },
      };

    default:
    // not implemented
  }

  return state;
}

export default appInfo;
