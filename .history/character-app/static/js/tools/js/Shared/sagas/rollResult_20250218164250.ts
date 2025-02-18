import { takeEvery, call, put, select } from "redux-saga/effects";

import {
  ApiRequests,
  SagaHelpers,
  UnpackMakeApiResponseData,
  DiceRolls,
  RollGroupContract,
  HelperUtils,
} from "../../character-rules-engine/es";

import { rollResultActions, rollResultActionTypes } from "../actions";
import {
  RollResultAction,
  RollResultComponentGroupPersistAction,
  RollResultComponentSimulatedGroupsPersistAction,
  RollResultDiceRollSetAction,
  RollResultGroupAddAction,
  RollResultGroupCreateAction,
  RollResultGroupDestroyAction,
  RollResultGroupOrderSetAction,
  RollResultGroupRemoveAction,
  RollResultGroupResetAction,
  RollResultGroupsLoadAction,
  RollResultComponentPersistAction,
} from "../actions/rollResult/typings";
import { appSelectors, rollResultSelectors } from "../selectors";
import { RollResultUtils } from "../utils";

export default function* saga() {
  yield takeEvery(
    Object.keys(rollResultActionTypes).map((key) => rollResultActionTypes[key]),
    filter
  );
}

function* filter(action: RollResultAction) {
  switch (action.type) {
    case rollResultActionTypes.ROLL_RESULT_GROUPS_LOAD:
      yield call(handleRollResultGroupsLoad, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_CREATE:
      yield call(handleRollResultGroupCreate, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_ADD:
      yield call(handleRollResultGroupAdd, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_DESTROY:
      yield call(handleRollResultGroupDestroy, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_REMOVE:
      yield call(handleRollResultGroupRemove, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_DICE_ROLL_SET:
      yield call(handleRollResultDiceRollSet, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_ORDER_SET:
      yield call(handleRollResultGroupOrderSet, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_GROUP_RESET:
      yield call(handleRollResultGroupReset, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_COMPONENT_GROUP_PERSIST:
      yield call(handleRollResultPersistGroup, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_COMPONENT_PERSIST:
      yield call(handleRollResultPersist, action);
      break;

    case rollResultActionTypes.ROLL_RESULT_COMPONENT_SIMULATED_GROUPS_PERSIST:
      yield call(handleRollResultPersistSimulatedGroups, action);
      break;

    default:
    //not implemented
  }
}

function* handleRollResultGroupsLoad(action: RollResultGroupsLoadAction) {
  const { componentKey, simulatedGroupCount, simulatedRollResultCount } =
    action.payload;

  const responseData: UnpackMakeApiResponseData<
    typeof ApiRequests.getCharacterRollResultGroups
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.getCharacterRollResultGroups,
    { params: { componentKey } }
  );

  if (responseData === null || responseData.length === 0) {
    if (simulatedGroupCount) {
      let groups: Array<RollGroupContract> = [];

      let lastGroup: RollGroupContract | null = null;
      for (let i = 0; i < simulatedGroupCount; i++) {
        const rollGroupContract = DiceRolls.simulateRollGroupContract(
          {
            componentKey,
            nextGroupKey: lastGroup?.nextGroupKey ?? null,
          },
          simulatedRollResultCount
        );
        groups.push(rollGroupContract);

        lastGroup = rollGroupContract;
      }

      yield put(
        rollResultActions.rollResultComponentSimulatedGroupsSet(
          componentKey,
          groups
        )
      );
    }
  } else {
    yield put(
      rollResultActions.rollResultComponentGroupsSetCommit(
        componentKey,
        responseData
      )
    );
  }
}

function* handleRollResultGroupCreate(action: RollResultGroupCreateAction) {
  const { componentKey, simulatedRollResultCount } = action.payload;

  const simulatedGroupsLookup: ReturnType<
    typeof rollResultSelectors.getRollResultComponentSimulatedGroupsLookup
  > = yield select(
    rollResultSelectors.getRollResultComponentSimulatedGroupsLookup
  );
  const currentSimulatedGroups = RollResultUtils.getComponentOrderedGroups(
    componentKey,
    simulatedGroupsLookup
  );

  if (currentSimulatedGroups.length) {
    const newGroup = DiceRolls.simulateRollGroupContract(
      {
        componentKey,
        nextGroupKey: currentSimulatedGroups[0].groupKey ?? null,
      },
      simulatedRollResultCount
    );

    yield put(
      rollResultActions.rollResultComponentSimulatedGroupsSet(componentKey, [
        newGroup,
        ...currentSimulatedGroups,
      ])
    );

    yield put(
      rollResultActions.rollResultComponentSimulatedGroupsPersist(componentKey)
    );
  } else {
    const currentGroupLookup: ReturnType<
      typeof rollResultSelectors.getRollResultComponentGroupsLookup
    > = yield select(rollResultSelectors.getRollResultComponentGroupsLookup);
    const currentGroups = RollResultUtils.getComponentOrderedGroups(
      componentKey,
      currentGroupLookup
    );

    const newGroup = DiceRolls.simulateRollGroupContract(
      {
        componentKey,
        nextGroupKey: currentGroups[0]?.groupKey ?? null,
      },
      simulatedRollResultCount
    );

    yield put(rollResultActions.rollResultGroupAdd(newGroup));
  }
}

function* handleRollResultGroupAdd(action: RollResultGroupAddAction) {
  const { componentKey, group } = action.payload;

  const responseData: UnpackMakeApiResponseData<
    typeof ApiRequests.postCharacterRollResultGroup
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.postCharacterRollResultGroup,
    group
  );

  if (responseData !== null) {
    yield put(rollResultActions.rollResultGroupAddCommit(group));
  }
}

function* handleRollResultGroupDestroy(action: RollResultGroupDestroyAction) {
  const { groupKey, nextGroupKey, componentKey } = action.payload;

  const currentGroupLookup = yield select(
    rollResultSelectors.getRollResultComponentGroupsLookup
  );
  const currentGroups = RollResultUtils.getGroupsByComponentKey(
    componentKey,
    currentGroupLookup
  );
  const groupToUpdate = currentGroups.find(
    (group) => group.nextGroupKey === groupKey
  );

  yield put(rollResultActions.rollResultGroupRemove(componentKey, groupKey));

  if (groupToUpdate) {
    yield put(
      rollResultActions.rollResultGroupOrderSet(
        componentKey,
        groupToUpdate.groupKey,
        nextGroupKey
      )
    );
  }
}

function* handleRollResultGroupOrderSet(action: RollResultGroupOrderSetAction) {
  const { componentKey, groupKey, nextGroupKey } = action.payload;

  const responseData: UnpackMakeApiResponseData<
    typeof ApiRequests.putCharacterRollResultGroupOrder
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.putCharacterRollResultGroupOrder,
    {
      groupKey,
      componentKey,
      nextGroupKey,
    }
  );

  yield put(
    rollResultActions.rollResultGroupOrderSetCommit(
      componentKey,
      groupKey,
      nextGroupKey
    )
  );
}

function* handleRollResultGroupRemove(action: RollResultGroupRemoveAction) {
  const { componentKey, groupKey } = action.payload;

  const responseData: UnpackMakeApiResponseData<
    typeof ApiRequests.deleteCharacterRollResultGroup
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.deleteCharacterRollResultGroup,
    {
      groupKey,
      componentKey,
    }
  );
  yield put(
    rollResultActions.rollResultGroupRemoveCommit(componentKey, groupKey)
  );
}

function* handleRollResultPersistSimulatedGroups(
  action: RollResultComponentSimulatedGroupsPersistAction
) {
  const { componentKey, groupKey, rollKey, properties } = action.payload;

  const simulatedGroupsLookup: ReturnType<
    typeof rollResultSelectors.getRollResultComponentSimulatedGroupsLookup
  > = yield select(
    rollResultSelectors.getRollResultComponentSimulatedGroupsLookup
  );
  const currentSimulatedGroups = RollResultUtils.getGroupsByComponentKey(
    componentKey,
    simulatedGroupsLookup
  );

  if (currentSimulatedGroups.length) {
    for (let i = 0; i < currentSimulatedGroups.length; i++) {
      const group = currentSimulatedGroups[i];
      if (rollKey && groupKey === group.groupKey) {
        // If an initial roll is with the simulated group
        const rollIndex = group.rollResults.findIndex(
          (rollResult) => rollResult.rollKey === rollKey
        );
        group.rollResults.splice(rollIndex, 1, {
          ...group.rollResults[rollIndex],
          ...properties,
        });
      }

      yield put(rollResultActions.rollResultGroupAdd(group));
    }

    yield put(
      rollResultActions.rollResultComponentSimulatedGroupsSet(componentKey, [])
    );
  }
}

function* handleRollResultPersistGroup(
  action: RollResultComponentGroupPersistAction
) {
  const { componentKey, groupKey, rollResults } = action.payload;

  const currentGroupLookup = yield select(
    rollResultSelectors.getRollResultComponentGroupsLookup
  );
  const currentGroups = RollResultUtils.getGroupsByComponentKey(
    componentKey,
    currentGroupLookup
  );
  const groupToUpdate = currentGroups.find(
    (group) => group.groupKey === groupKey
  );

  if (groupToUpdate) {
    const responseData: UnpackMakeApiResponseData<
      typeof ApiRequests.putCharacterRollResultGroup
    > = yield call(
      SagaHelpers.getApiRequestData,
      ApiRequests.putCharacterRollResultGroup,
      {
        groupKey,
        componentKey,
        rollResults,
      }
    );
  }
}

function* handleRollResultPersist(action: RollResultComponentPersistAction) {
  const {
    componentKey,
    groupKey,
    rollKey,
    properties: { rollTotal, rollValues, assignedValue },
    nextRollKey,
  } = action.payload;

  if (groupKey && rollKey) {
    const responseData: UnpackMakeApiResponseData<
      typeof ApiRequests.putCharacterRollResult
    > = yield call(
      SagaHelpers.getApiRequestData,
      ApiRequests.putCharacterRollResult,
      {
        rollKey,
        nextRollKey,
        rollTotal,
        assignedValue,
        rollValues,
        groupKey,
        componentKey,
      }
    );
  }
}

function* handleRollResultDiceRollSet(action: RollResultDiceRollSetAction) {
  const { rollKey, properties, nextRollKey } = action.payload;

  const parentKeyInfoLookup: ReturnType<
    typeof appSelectors.getRollParentKeyInfoLookup
  > = yield select(appSelectors.getRollParentKeyInfoLookup);
  const simulatedParentKeyInfoLookup: ReturnType<
    typeof appSelectors.getSimulatedRollParentKeyInfoLookup
  > = yield select(appSelectors.getSimulatedRollParentKeyInfoLookup);
  const parentKeyInfo = HelperUtils.lookupDataOrFallback(
    parentKeyInfoLookup,
    rollKey
  );
  const simulatedParentKeyInfo = HelperUtils.lookupDataOrFallback(
    simulatedParentKeyInfoLookup,
    rollKey
  );

  if (parentKeyInfo) {
    const { groupKey, componentKey } = parentKeyInfo;

    yield put(
      rollResultActions.rollResultComponentPersist(
        componentKey,
        groupKey,
        rollKey,
        properties,
        nextRollKey
      )
    );

    yield put(
      rollResultActions.rollResultDiceRollSetCommit(
        componentKey,
        groupKey,
        rollKey,
        properties,
        nextRollKey
      )
    );
  } else if (simulatedParentKeyInfo) {
    const { groupKey, componentKey } = simulatedParentKeyInfo;

    yield put(
      rollResultActions.rollResultComponentSimulatedGroupsPersist(
        componentKey,
        groupKey,
        rollKey,
        properties
      )
    );

    yield put(
      rollResultActions.rollResultComponentSimulatedDiceRollSet(
        componentKey,
        groupKey,
        rollKey,
        properties
      )
    );
  }
}

function* handleRollResultGroupReset(action: RollResultGroupResetAction) {
  const { componentKey, groupKey, rollResults } = action.payload;

  yield put(
    rollResultActions.rollResultComponentGroupPersist(
      componentKey,
      groupKey,
      rollResults
    )
  );

  yield put(
    rollResultActions.rollResultGroupResetCommit(
      componentKey,
      groupKey,
      rollResults
    )
  );
}
