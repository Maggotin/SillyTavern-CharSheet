import { ConfirmModalData } from "../../stores/typings";
import * as actionTypes from "./actionTypes";
import { CreateAction, RemoveAction } from "./typings";

export function create(modal: ConfirmModalData): CreateAction {
  return {
    type: actionTypes.CREATE,
    payload: {
      modal,
    },
  };
}

export function remove(id: number): RemoveAction {
  return {
    type: actionTypes.REMOVE,
    payload: {
      id,
    },
  };
}
