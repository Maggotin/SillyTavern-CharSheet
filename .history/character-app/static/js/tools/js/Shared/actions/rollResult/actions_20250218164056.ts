import {
  RollGroupContract,
  RollResultContract,
} from "../../rules-engine/es";

import * as types from "./actionTypes";
import {
  RollResultGroupAddAction,
  RollResultGroupsLoadAction,
  RollResultGroupRemoveAction,
  RollResultGroupDiceRollsSetAction,
  RollResultComponentGroupsSetAction,
  RollResultGroupOrderSetAction,
  RollResultGroupCreateAction,
  RollResultGroupDestroyAction,
  RollResultComponentGroupsSetCommitAction,
  RollResultGroupAddCommitAction,
  RollResultGroupRemoveCommitAction,
  RollResultGroupDiceRollsSetCommitAction,
  RollResultGroupOrderSetCommitAction,
  RollResultGroupResetAction,
  RollResultGroupResetCommitAction,
  RollResultDiceRollSetAction,
  RollResultDiceRollSetCommitAction,
  RollResultDiceRollStatusSetAction,
  RollResultComponentSimulatedGroupsSetAction,
  RollResultComponentSimulatedGroupsPersistAction,
  RollResultComponentSimulatedDiceRollSetAction,
  RollResultComponentGroupPersistAction,
  RollResultComponentPersistAction,
} from "./typings";

/**
 *
 * @param componentKey
 * @param simulatedGroupCount
 * @param simulatedRollResultCount
 */
export function rollResultGroupsLoad(
  componentKey: string,
  simulatedGroupCount: number | null,
  simulatedRollResultCount?: number
): RollResultGroupsLoadAction {
  return {
    type: types.ROLL_RESULT_GROUPS_LOAD,
    payload: {
      componentKey,
      simulatedGroupCount,
      simulatedRollResultCount,
    },
  };
}

/**
 *
 * @param componentKey
 * @param simulatedRollResultCount
 */
export function rollResultGroupCreate(
  componentKey: string,
  simulatedRollResultCount?: number
): RollResultGroupCreateAction {
  return {
    type: types.ROLL_RESULT_GROUP_CREATE,
    payload: {
      componentKey,
      simulatedRollResultCount,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param nextGroupKey
 */
export function rollResultGroupDestroy(
  componentKey: string,
  groupKey: string,
  nextGroupKey: string | null
): RollResultGroupDestroyAction {
  return {
    type: types.ROLL_RESULT_GROUP_DESTROY,
    payload: {
      componentKey,
      groupKey,
      nextGroupKey,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groups
 */
export function rollResultComponentGroupsSet(
  componentKey: string,
  groups: Array<RollGroupContract>
): RollResultComponentGroupsSetAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_GROUPS_SET,
    payload: {
      componentKey,
      groups,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groups
 */
export function rollResultComponentGroupsSetCommit(
  componentKey: string,
  groups: Array<RollGroupContract>
): RollResultComponentGroupsSetCommitAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_GROUPS_SET_COMMIT,
    payload: {
      componentKey,
      groups,
    },
  };
}

/**
 *
 * @param group
 */
export function rollResultGroupAdd(
  group: RollGroupContract
): RollResultGroupAddAction {
  return {
    type: types.ROLL_RESULT_GROUP_ADD,
    payload: {
      group,
      componentKey: group.componentKey,
    },
  };
}
/**
 *
 * @param group
 */
export function rollResultGroupAddCommit(
  group: RollGroupContract
): RollResultGroupAddCommitAction {
  return {
    type: types.ROLL_RESULT_GROUP_ADD_COMMIT,
    payload: {
      group,
      componentKey: group.componentKey,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 */
export function rollResultGroupRemove(
  componentKey: string,
  groupKey: string
): RollResultGroupRemoveAction {
  return {
    type: types.ROLL_RESULT_GROUP_REMOVE,
    payload: {
      componentKey,
      groupKey,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groupKey
 */
export function rollResultGroupRemoveCommit(
  componentKey: string,
  groupKey: string
): RollResultGroupRemoveCommitAction {
  return {
    type: types.ROLL_RESULT_GROUP_REMOVE_COMMIT,
    payload: {
      componentKey,
      groupKey,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollResults
 */
export function rollResultGroupDiceRollsSet(
  componentKey: string,
  groupKey: string,
  rollResults: Array<RollResultContract>
): RollResultGroupDiceRollsSetAction {
  return {
    type: types.ROLL_RESULT_GROUP_DICE_ROLLS_SET,
    payload: {
      componentKey,
      groupKey,
      rollResults,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollResults
 */
export function rollResultGroupDiceRollsSetCommit(
  componentKey: string,
  groupKey: string,
  rollResults: Array<RollResultContract>
): RollResultGroupDiceRollsSetCommitAction {
  return {
    type: types.ROLL_RESULT_GROUP_DICE_ROLLS_SET_COMMIT,
    payload: {
      componentKey,
      groupKey,
      rollResults,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param nextGroupKey
 */
export function rollResultGroupOrderSet(
  componentKey: string,
  groupKey: string,
  nextGroupKey: string | null
): RollResultGroupOrderSetAction {
  return {
    type: types.ROLL_RESULT_GROUP_ORDER_SET,
    payload: {
      componentKey,
      groupKey,
      nextGroupKey,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groupKey
 * @param nextGroupKey
 */
export function rollResultGroupOrderSetCommit(
  componentKey: string,
  groupKey: string,
  nextGroupKey: string | null
): RollResultGroupOrderSetCommitAction {
  return {
    type: types.ROLL_RESULT_GROUP_ORDER_SET_COMMIT,
    payload: {
      componentKey,
      groupKey,
      nextGroupKey,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 */
export function rollResultGroupReset(
  componentKey: string,
  groupKey: string,
  rollResults: Array<RollResultContract>
): RollResultGroupResetAction {
  return {
    type: types.ROLL_RESULT_GROUP_RESET,
    payload: {
      componentKey,
      groupKey,
      rollResults,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groupKey
 */
export function rollResultGroupResetCommit(
  componentKey: string,
  groupKey: string,
  rollResults: Array<RollResultContract>
): RollResultGroupResetCommitAction {
  return {
    type: types.ROLL_RESULT_GROUP_RESET_COMMIT,
    payload: {
      componentKey,
      groupKey,
      rollResults,
    },
  };
}

/**
 *
 * @param rollKey
 * @param properties
 * @param nextRollKey
 */
export function rollResultDiceRollSet(
  rollKey: string,
  properties: Omit<Partial<RollResultContract>, "rollKey">,
  nextRollKey: string | null
): RollResultDiceRollSetAction {
  return {
    type: types.ROLL_RESULT_DICE_ROLL_SET,
    payload: {
      rollKey,
      properties,
      nextRollKey,
    },
  };
}
/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollKey
 * @param properties
 */
export function rollResultDiceRollSetCommit(
  componentKey: string,
  groupKey: string,
  rollKey: string,
  properties: Omit<Partial<RollResultContract>, "rollKey">,
  nextRollKey: string | null
): RollResultDiceRollSetCommitAction {
  return {
    type: types.ROLL_RESULT_DICE_ROLL_SET_COMMIT,
    payload: {
      componentKey,
      groupKey,
      rollKey,
      properties,
      nextRollKey,
    },
  };
}

/**
 *
 * @param rollKey
 * @param loadingStatus
 */
export function rollResultDiceRollStatusSet(
  rollKey,
  loadingStatus
): RollResultDiceRollStatusSetAction {
  return {
    type: types.ROLL_RESULT_DICE_ROLL_STATUS_SET,
    payload: {
      rollKey,
      loadingStatus,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollResults
 */
export function rollResultComponentGroupPersist(
  componentKey: string,
  groupKey: string,
  rollResults: Array<RollResultContract>
): RollResultComponentGroupPersistAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_GROUP_PERSIST,
    payload: {
      componentKey,
      groupKey,
      rollResults,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollKey
 * @param properties
 * @param nextRollKey
 */
export function rollResultComponentPersist(
  componentKey: string,
  groupKey: string,
  rollKey: string,
  properties: Partial<RollResultContract>,
  nextRollKey: string | null
): RollResultComponentPersistAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_PERSIST,
    payload: {
      componentKey,
      groupKey,
      rollKey,
      properties,
      nextRollKey,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groups
 */
export function rollResultComponentSimulatedGroupsSet(
  componentKey: string,
  groups: Array<RollGroupContract>
): RollResultComponentSimulatedGroupsSetAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_SIMULATED_GROUPS_SET,
    payload: {
      componentKey,
      groups,
    },
  };
}

/**
 *
 * @param componentKey
 */
export function rollResultComponentSimulatedGroupsPersist(
  componentKey: string,
  groupKey?: string,
  rollKey?: string,
  properties?: Partial<RollResultContract>
): RollResultComponentSimulatedGroupsPersistAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_SIMULATED_GROUPS_PERSIST,
    payload: {
      componentKey,
      groupKey,
      rollKey,
      properties,
    },
  };
}

/**
 *
 * @param componentKey
 * @param groupKey
 * @param rollKey
 * @param properties
 */
export function rollResultComponentSimulatedDiceRollSet(
  componentKey: string,
  groupKey: string,
  rollKey: string,
  properties: Omit<Partial<RollResultContract>, "rollKey">
): RollResultComponentSimulatedDiceRollSetAction {
  return {
    type: types.ROLL_RESULT_COMPONENT_SIMULATED_DICE_ROLL_SET,
    payload: {
      componentKey,
      groupKey,
      rollKey,
      properties,
    },
  };
}
