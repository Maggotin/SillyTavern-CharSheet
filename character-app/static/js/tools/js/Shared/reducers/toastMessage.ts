import * as actionTypes from "../actions/toastMessage/actionTypes";
import { ToastMessageAction } from "../actions/toastMessage/typings";
import {
  MessageState,
  ToastMessageMetaState,
  ToastMessageState,
  ToastState,
} from "../stores/typings";

const initialMessagePayloadState: ToastState = {
  title: "",
  message: "",
};

/**
 *
 * @param state
 * @param action
 */
function messagePayload(
  state: ToastState = initialMessagePayloadState,
  action: ToastMessageAction
): ToastState {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        ...action.payload.toast,
      };
  }
  return state;
}

const initialMessageMetaState: ToastMessageMetaState = {
  level: "info",
  autoDismiss: 5,
  dismissible: true,
  position: "bc",
};

/**
 *
 * @param state
 * @param action
 */
function messageMeta(
  state: ToastMessageMetaState = initialMessageMetaState,
  action: ToastMessageAction
): ToastMessageMetaState {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        ...action.payload.meta,
      };
  }
  return state;
}

const initialMessageState: MessageState = {
  payload: initialMessagePayloadState,
  meta: {},
};
function message(
  state: MessageState = initialMessageState,
  action: ToastMessageAction
): MessageState {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return {
        ...state,
        payload: messagePayload(undefined, action),
        meta: messageMeta(undefined, action),
      };
  }
  return state;
}

let messageId: number = 0;

/**
 *
 * @param state
 * @param action
 */
function toastMessage(
  state: ToastMessageState = {},
  action: ToastMessageAction
): ToastMessageState {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      messageId++;
      return {
        [messageId]: message(undefined, action),
      };

    case actionTypes.REMOVE_MESSAGE:
      let newState: ToastMessageState = {};
      Object.keys(state).forEach((messageId) => {
        if (messageId !== action.payload.id) {
          newState[messageId] = state[messageId];
        }
      });
      return newState;
  }
  return state;
}

export default toastMessage;
