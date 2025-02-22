import { ToastMessageMeta } from "../../stores/typings";
import * as actionTypes from "./actionTypes";
import {
  ToastErrorAction,
  ToastRemoveAction,
  ToastSuccessAction,
} from "./typings";

/**
 *
 * @param title
 * @param message
 * @param meta
 */
export function toastSuccess(
  title: string,
  message: string,
  meta?: ToastMessageMeta
): ToastSuccessAction {
  return {
    type: actionTypes.ADD_MESSAGE,
    payload: {
      toast: {
        title,
        message,
      },
      meta: {
        level: "success",
        ...meta,
      },
    },
  };
}

/**
 *
 * @param title
 * @param message
 * @param meta
 */
export function toastError(
  title: string,
  message: string,
  meta?: ToastMessageMeta
): ToastErrorAction {
  return {
    type: actionTypes.ADD_MESSAGE,
    payload: {
      toast: {
        title,
        message,
      },
      meta: {
        level: "error",
        ...meta,
      },
    },
  };
}

/**
 *
 * @param id
 */
export function removeToast(id: number | string): ToastRemoveAction {
  return {
    type: actionTypes.REMOVE_MESSAGE,
    payload: {
      id,
    },
  };
}
