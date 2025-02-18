import { uniqueId } from "lodash";
import { call, put, select, takeEvery } from "redux-saga/effects";

import {
  rulesEngineSelectors,
  characterActionTypes,
  characterActions,
  syncTransactionActions,
  syncTransactionSelectors,
  ApiAdapterUtils,
  ApiRequests,
  UnpackMakeApiResponseData,
  ruleDataActions,
  SagaHelpers,
  characterEnvSelectors,
  Constants,
  RaceUtils,
} from "../../rules-engine/es";

import { BuilderMethod, RouteKey } from "~/subApps/builder/constants";

import { appEnvActions } from "../../Shared/actions";
import { appEnvSelectors } from "../../Shared/selectors";
import appConfig from "../../config";
import {
  builderActions,
  builderActionTypes,
  BuilderAction,
  BuilderMethodSetAction,
  QuickBuildRequestAction,
  RandomBuildRequestAction,
  StepBuildRequestAction,
  SuggestedNamesRequestAction,
} from "../actions";
import * as navConfig from "../config/navigation";
import { getRouteDefPath } from "../config/navigation";
import { builderSelectors } from "../selectors";
import { NavigationUtils } from "../utils";

const syncActions = [
  builderActionTypes.CHARACTER_LOAD_REQUEST,
  builderActionTypes.QUICK_BUILD_REQUEST,
  builderActionTypes.RANDOM_BUILD_REQUEST,
  builderActionTypes.STEP_BUILD_REQUEST,
  builderActionTypes.BUILDER_METHOD_SET,
  builderActionTypes.SUGGESTED_NAMES_REQUEST,
];

export default function* saga() {
  yield takeEvery(syncActions, syncFilter);
  yield takeEvery(
    Object.keys(characterActionTypes).map((key) => characterActionTypes[key]),
    characterTypesFilter
  );
  yield takeEvery(
    Object.keys(builderActionTypes).map((key) => builderActionTypes[key]),
    filter
  );
}

function* characterTypesFilter(action: any) {
  switch (action.type) {
    case characterActionTypes.RACE_CHOOSE_POST_ACTION: {
      // yield put(push(getRouteDefPath(RouteKey.RACE_MANAGE)));
      const characterId = yield select((state: any) =>
        rulesEngineSelectors.getId(state)
      );
      const navigate = yield select(
        (state: any) => state.routeControls.navigate
      );
      navigate(
        getRouteDefPath(RouteKey.RACE_MANAGE).replace(
          ":characterId",
          characterId
        )
      );
      break;
    }

    case characterActionTypes.CLASS_ADD_POST_ACTION: {
      // yield put(push(getRouteDefPath(RouteKey.CLASS_MANAGE)));
      const characterId = yield select((state: any) =>
        rulesEngineSelectors.getId(state)
      );
      const navigate = yield select(
        (state: any) => state.routeControls.navigate
      );
      navigate(
        getRouteDefPath(RouteKey.CLASS_MANAGE).replace(
          ":characterId",
          characterId
        )
      );
      break;
    }

    case characterActionTypes.CLASS_REMOVE_POST_ACTION: {
      let classes = yield select(rulesEngineSelectors.getClasses);
      if (classes.length === 0) {
        // yield put(push(getRouteDefPath(RouteKey.CLASS_CHOOSE)));
        const characterId = yield select((state: any) =>
          rulesEngineSelectors.getId(state)
        );
        const navigate = yield select(
          (state: any) => state.routeControls.navigate
        );
        navigate(
          getRouteDefPath(RouteKey.CLASS_CHOOSE).replace(
            ":characterId",
            characterId
          )
        );
      }
      break;
    }

    case characterActionTypes.CHARACTER_LOAD_POST_ACTION: {
      yield put(builderActions.characterLoadingSetCommit(false));
      yield put(builderActions.characterLoadedSetCommit(true));

      const builderMethod: ReturnType<
        typeof builderSelectors.getBuilderMethod
      > = yield select(builderSelectors.getBuilderMethod);
      const context: ReturnType<typeof characterEnvSelectors.getContext> =
        yield select(characterEnvSelectors.getContext);

      if (
        builderMethod === BuilderMethod.STEP_BY_STEP &&
        context === Constants.AppContextTypeEnum.BUILDER
      ) {
        const configuration: ReturnType<
          typeof rulesEngineSelectors.getCharacterConfiguration
        > = yield select(rulesEngineSelectors.getCharacterConfiguration);
        const stepByStepInitialPage = configuration.showHelpText
          ? RouteKey.HOME_HELP
          : RouteKey.HOME_BASIC_INFO;

        const isCurrentRouteInRoutePathing = yield select(
          NavigationUtils.checkIsCurrentRouteInRoutePathing
        );

        // TODO routes this needs fixed
        // yield put(push(navConfig.getRouteDefPath(stepByStepInitialPage)));
        if (!isCurrentRouteInRoutePathing) {
          const navigate = yield select(
            (state: any) => state.routeControls.navigate
          );
          navigate(
            navConfig
              .getRouteDefPath(stepByStepInitialPage)
              .replace(":characterId", action.payload.characterId)
          );
        }
        // window.location = navConfig.getRouteDefPath(stepByStepInitialPage).replace(':characterId', action.payload.characterId);
        // }
      }
      break;
    }
  }
}

function* filter(action: BuilderAction) {
  switch (action.type) {
    case builderActionTypes.SHOW_HELP_TEXT_SET:
      yield call(ApiRequests.putCharacterHelpText, action.payload);
      yield put(characterActions.showHelpTextSet(action.payload.showHelpText));

      if (action.payload.showHelpText) {
        const currentSectionHelpRoutePath = yield select(
          NavigationUtils.getCurrentSectionHelpRoutePath
        );
        if (currentSectionHelpRoutePath !== null) {
          const characterId = yield select((state: any) =>
            rulesEngineSelectors.getId(state)
          );
          const navigate = yield select(
            (state: any) => state.routeControls.navigate
          );
          navigate(
            currentSectionHelpRoutePath.replace(":characterId", characterId)
          );
          // yield put(push(currentSectionHelpRoutePath));
        }
      } else {
        const availablePathRedirect = yield select(
          NavigationUtils.getAvailablePathRedirect
        );
        if (availablePathRedirect !== null) {
          const characterId = yield select((state: any) =>
            rulesEngineSelectors.getId(state)
          );
          const navigate = yield select(
            (state: any) => state.routeControls.navigate
          );
          navigate(availablePathRedirect.replace(":characterId", characterId));
          // yield put(push(availablePathRedirect));
        }
      }
      break;
  }
}

function* syncFilter(action: BuilderAction) {
  const isSyncTransactionActive = yield select(
    syncTransactionSelectors.getActive
  );
  let transactionInitiatorId;

  if (!isSyncTransactionActive) {
    transactionInitiatorId = uniqueId();
    yield put(syncTransactionActions.activate(transactionInitiatorId));
  }

  switch (action.type) {
    case builderActionTypes.QUICK_BUILD_REQUEST:
      yield call(handleQuickBuildRequest, action);
      break;

    case builderActionTypes.RANDOM_BUILD_REQUEST:
      yield call(handleRandomBuildRequest, action);
      break;

    case builderActionTypes.STEP_BUILD_REQUEST:
      yield call(handleStepBuildRequest, action);
      break;

    case builderActionTypes.CHARACTER_LOAD_REQUEST:
      yield call(handleLoadCharacterRequest, action);
      break;

    case builderActionTypes.BUILDER_METHOD_SET:
      yield call(handleBuilderMethodSet, action);
      break;

    case builderActionTypes.SUGGESTED_NAMES_REQUEST:
      yield call(handleSuggestedNamesRequest, action);
      break;
  }

  switch (action.type) {
    case builderActionTypes.QUICK_BUILD_REQUEST:
    case builderActionTypes.RANDOM_BUILD_REQUEST:
      break;
    default:
      let syncTransactionInitiator = yield select(
        syncTransactionSelectors.getInitiator
      );
      if (syncTransactionInitiator === transactionInitiatorId) {
        yield put(syncTransactionActions.deactivate());
      }
      break;
  }
}

function* handleBuilderMethodSet(action: BuilderMethodSetAction) {
  const response = yield call(ApiRequests.getCharacterRuleData, {
    params: { v: appConfig.version },
  });
  const data: UnpackMakeApiResponseData<
    typeof ApiRequests.getCharacterRuleData
  > | null = ApiAdapterUtils.getResponseData(response);

  if (data !== null) {
    yield put(ruleDataActions.dataSet(data));
  }
  yield put(builderActions.builderMethodSetCommit(action.payload));
}

function* handleQuickBuildRequest(action: QuickBuildRequestAction) {
  const characterId: UnpackMakeApiResponseData<
    typeof ApiRequests.postCharacterBuilderQuickBuild
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.postCharacterBuilderQuickBuild,
    action.payload
  );

  // if (data.success) {
  const characterUrl = NavigationUtils.getCharacterBuilderUrl(characterId);
  const initialPath = navConfig.getRouteDefPath(RouteKey.WHATS_NEXT);
  // todo just a soft navigation
  window.location = `${characterUrl}${initialPath}` as any;
  // } else {
  //TODO do something with error
  // }
}

function* handleRandomBuildRequest(action: RandomBuildRequestAction) {
  const characterId: UnpackMakeApiResponseData<
    typeof ApiRequests.postCharacterBuilderRandomBuild
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.postCharacterBuilderRandomBuild,
    action.payload
  );

  // if (data.success) {
  const characterUrl = NavigationUtils.getCharacterBuilderUrl(characterId);
  const initialPath = navConfig.getRouteDefPath(RouteKey.WHATS_NEXT);
  window.location = `${characterUrl}#${initialPath}` as any;
  // } else {
  //TODO do something with error
  // }
}

function* handleStepBuildRequest(action: StepBuildRequestAction) {
  yield put(builderActions.characterLoadingSetCommit(true));

  //TODO fix with common refactor for populating character
  const characterId: UnpackMakeApiResponseData<
    typeof ApiRequests.postCharacterBuilderStandardBuild
  > = yield call(
    SagaHelpers.getApiRequestData,
    ApiRequests.postCharacterBuilderStandardBuild,
    action.payload
  );

  yield put(appEnvActions.dataSet({ characterId }));
  yield put(
    builderActions.builderMethodSetCommit({
      method: BuilderMethod.STEP_BY_STEP,
    })
  );
  yield select(appEnvSelectors.getUsername);
  /* eslint-disable-next-line */
  yield put(
    characterActions.characterLoad(characterId, { v: appConfig.version })
  );
}

function* handleLoadCharacterRequest(action: BuilderAction) {
  yield put(builderActions.characterLoadingSetCommit(true));
  const characterId: ReturnType<typeof appEnvSelectors.getCharacterId> =
    yield select(appEnvSelectors.getCharacterId);

  if (characterId === null) {
    // TODO do something
    return;
  }

  try {
    yield put(
      builderActions.builderMethodSetCommit({
        method: BuilderMethod.STEP_BY_STEP,
      })
    );
    yield put(
      characterActions.characterLoad(characterId, { v: appConfig.version })
    );
  } catch (e) {
    // TODO handle failure in builder init process
  }
}

/**
 *
 * @param action
 */
export function* handleSuggestedNamesRequest(
  action: SuggestedNamesRequestAction
) {
  const species: ReturnType<typeof rulesEngineSelectors.getRace> = yield select(
    rulesEngineSelectors.getRace
  );
  let reqParams: ApiRequests.GetSuggestedNames_RequestData = {
    count: 5,
  };

  if (species !== null) {
    reqParams = {
      ...reqParams,
      raceDefinitionKey: RaceUtils.getDefinitionKey(species),
    };
  }

  const names: UnpackMakeApiResponseData<typeof ApiRequests.getSuggestedNames> =
    yield call(SagaHelpers.getApiRequestData, ApiRequests.getSuggestedNames, {
      params: reqParams,
    });
  yield put(builderActions.suggestedNamesSet(names));
}
