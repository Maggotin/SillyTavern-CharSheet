import * as actionTypes from "./actionTypes";
import { CloseAction, OpenAction } from "./typings";

export const open = (key: string): OpenAction => {
  return {
    type: actionTypes.OPEN,
    payload: {
      key,
    },
  };
};

export const close = (key: string): CloseAction => {
  return {
    type: actionTypes.CLOSE,
    payload: {
      key,
    },
  };
};
