import {
  RollGroupContract,
  RollResultContract,
  DiceRolls,
} from "../../character-rules-engine/es";

import * as actionTypes from "../actions/rollResult/actionTypes";
import { RollResultAction } from "../actions/rollResult/typings";
import {
  RollResultComponentGroupsState,
  RollResultState,
} from "../stores/typings";

const initialRollState: RollResultContract = {
  rollKey: "",
  nextRollKey: null,
  assignedValue: null,
  rollTotal: null,
  rollValues: [],
};
function rollReducer(
  state: RollResultContract = initialRollState,
  action: RollResultAction
): RollResultContract {
  switch (action.type) {
    case actionTypes.ROLL_RESULT_DICE_ROLL_SET_COMMIT:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET: {
      return {
        ...state,
        ...action.payload.properties,
      };
    }

    case actionTypes.ROLL_RESULT_GROUP_RESET_COMMIT: {
      return DiceRolls.simulateRollResultContract({
        rollKey: state.rollKey,
        nextRollKey: state.nextRollKey,
      });
    }
    default:
    //not implemented
  }

  return state;
}

const initialGroupRollsState: Array<RollResultContract> = [];
function groupRollsReducer(
  state: Array<RollResultContract> = initialGroupRollsState,
  action: RollResultAction
): Array<RollResultContract> {
  switch (action.type) {
    case actionTypes.ROLL_RESULT_GROUP_RESET_COMMIT: {
      return state.map((roll) => rollReducer(roll, action));
    }

    case actionTypes.ROLL_RESULT_DICE_ROLL_SET_COMMIT:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET: {
      const rollIdx = state.findIndex(
        (roll) => roll.rollKey === action.payload.rollKey
      );
      return [
        ...state.slice(0, rollIdx),
        rollReducer(state[rollIdx], action),
        ...state.slice(rollIdx + 1),
      ];
    }

    default:
    //not implemented
  }

  return state;
}

const initialGroupState: RollGroupContract = {
  componentKey: "",
  groupKey: "",
  nextGroupKey: null,
  rollResults: [],
};
function groupReducer(
  state: RollGroupContract = initialGroupState,
  action: RollResultAction
): RollGroupContract {
  switch (action.type) {
    case actionTypes.ROLL_RESULT_GROUP_DICE_ROLLS_SET_COMMIT:
      return {
        ...state,
        rollResults: action.payload.rollResults,
      };

    case actionTypes.ROLL_RESULT_GROUP_ORDER_SET_COMMIT:
      return {
        ...state,
        nextGroupKey: action.payload.nextGroupKey,
      };

    case actionTypes.ROLL_RESULT_GROUP_RESET_COMMIT:
    case actionTypes.ROLL_RESULT_DICE_ROLL_SET_COMMIT:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET:
      return {
        ...state,
        rollResults: groupRollsReducer(state.rollResults, action),
      };

    default:
    // not implemented
  }

  return state;
}

const initialComponentGroupsState: RollResultComponentGroupsState = [];
function componentGroupsReducer(
  state: RollResultComponentGroupsState = initialComponentGroupsState,
  action: RollResultAction
): RollResultComponentGroupsState {
  switch (action.type) {
    case actionTypes.ROLL_RESULT_COMPONENT_GROUPS_SET_COMMIT:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_GROUPS_SET: {
      return [...action.payload.groups];
    }

    case actionTypes.ROLL_RESULT_GROUP_ADD_COMMIT:
      return [...state, action.payload.group];

    case actionTypes.ROLL_RESULT_GROUP_REMOVE_COMMIT:
      return state.filter(
        (group) => group.groupKey !== action.payload.groupKey
      );

    case actionTypes.ROLL_RESULT_GROUP_DICE_ROLLS_SET_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_ORDER_SET_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_RESET_COMMIT:
    case actionTypes.ROLL_RESULT_DICE_ROLL_SET_COMMIT:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET: {
      const groupIndex = state.findIndex(
        (group) => group.groupKey === action.payload.groupKey
      );
      return [
        ...state.slice(0, groupIndex),
        groupReducer(state[groupIndex], action),
        ...state.slice(groupIndex + 1),
      ];
    }

    default:
    // not implemented
  }

  return state;
}

const initialRollResultState: RollResultState = {
  data: {},
  simulatedData: {},
  dataStatus: {},
};
function rollResult(
  state: RollResultState = initialRollResultState,
  action: RollResultAction
): RollResultState {
  switch (action.type) {
    case actionTypes.ROLL_RESULT_COMPONENT_GROUPS_SET_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_ADD_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_DICE_ROLLS_SET_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_ORDER_SET_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_REMOVE_COMMIT:
    case actionTypes.ROLL_RESULT_GROUP_RESET_COMMIT:
    case actionTypes.ROLL_RESULT_DICE_ROLL_SET_COMMIT: {
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.componentKey]: componentGroupsReducer(
            state.data[action.payload.componentKey],
            action
          ),
        },
      };
    }

    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_GROUPS_SET:
    case actionTypes.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET: {
      return {
        ...state,
        simulatedData: {
          ...state.simulatedData,
          [action.payload.componentKey]: componentGroupsReducer(
            state.simulatedData[action.payload.componentKey],
            action
          ),
        },
      };
    }

    case actionTypes.ROLL_RESULT_DICE_ROLL_STATUS_SET: {
      return {
        ...state,
        dataStatus: {
          ...state.dataStatus,
          [action.payload.rollKey]: action.payload.loadingStatus,
        },
      };
    }

    default:
    // not implemented
  }

  return state;
}

export default rollResult;
