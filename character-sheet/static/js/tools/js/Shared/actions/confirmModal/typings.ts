import { ConfirmModalData } from "../../stores/typings";

export interface CreateAction {
  type: string;
  payload: {
    modal: ConfirmModalData;
  };
}

export interface RemoveAction {
  type: string;
  payload: {
    id: number;
  };
} 