import * as actionTypes from "../actions/confirmModal/actionTypes";
import { ConfirmModalAction } from "../actions/confirmModal/typings";
import {
  ConfirmModal,
  ConfirmModalData,
  ConfirmModalState,
} from "../stores/typings";

let modalId: number = 0;

const initialModalState: ConfirmModalData = {
  conClsNames: [],
  acceptBtnClsNames: [],
  cancelBtnClsNames: [],
  heading: "",
  content: "",
  onConfirm: () => {},
  onCancel: () => {},
};

/**
 *
 * @param modalData
 */
function createModal(modalData: ConfirmModalData): ConfirmModal {
  return {
    ...initialModalState,
    ...modalData,
    id: modalId++,
  };
}

const initialConfirmModalState: ConfirmModalState = {
  modals: [],
};
/**
 *
 * @param state
 * @param action
 */
export default function confirmModal(
  state: ConfirmModalState = initialConfirmModalState,
  action: ConfirmModalAction
): ConfirmModalState {
  switch (action.type) {
    case actionTypes.CREATE:
      return {
        ...state,
        modals: [...state.modals, createModal(action.payload.modal)],
      };

    case actionTypes.REMOVE:
      return {
        ...state,
        modals: [
          ...state.modals.filter((modal) => modal.id !== action.payload.id),
        ],
      };
  }

  return state;
}
