import AppErrorTypeEnum from "../../constants/AppErrorTypeEnum";
import * as types from "./actionTypes";
import { ErrorSetAction } from "./typings";

/**
 *
 * @param appErrorType
 * @param errorId
 */
export function errorSet(
  appErrorType: AppErrorTypeEnum,
  errorId: string | null = null
): ErrorSetAction {
  return {
    type: types.ERROR_SET,
    payload: {
      appErrorType: appErrorType,
      errorId,
    },
  };
}
