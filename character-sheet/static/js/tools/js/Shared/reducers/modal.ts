import * as actionTypes from "../actions/modal/actionTypes";
import { ModalAction } from "../actions/modal/typings";
import { ModalState } from "../stores/typings";

const initialModalState: ModalState = {
  open: {},
};

/**
 *
 * @param state
 * @param action
 */
function modal(
  state: ModalState = initialModalState,
  action: ModalAction
): ModalState {
  switch (action.type) {
    case actionTypes.OPEN:
      return {
        ...state,
        open: {
          ...state.open,
          [action.payload.key]: true,
        },
      };

    case actionTypes.CLOSE:
      return {
        ...state,
        open: {
          ...state.open,
          [action.payload.key]: false,
        },
      };
  }

  return state;
}

export default modal;
