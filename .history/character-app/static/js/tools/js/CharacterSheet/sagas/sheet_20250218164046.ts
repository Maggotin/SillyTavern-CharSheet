import { call, put, select, takeEvery } from "redux-saga/effects";

import { characterActions } from "../../rules-engine/es";

import { appEnvSelectors } from "../../Shared/selectors";
import appConfig from "../../config";
import {
  CharacterInitAction,
  SheetAction,
  sheetActions,
  sheetActionTypes,
} from "../actions/sheet";

export default function* saga() {
  yield takeEvery(
    Object.keys(sheetActionTypes).map((key) => sheetActionTypes[key]),
    filter
  );
}

function* filter(action: SheetAction) {
  switch (action.type) {
    case sheetActionTypes.CHARACTER_INIT:
      yield call(initCurrentCharacter, action);
      break;

    default:
    // not implemented
  }
}

function* initCurrentCharacter(action: CharacterInitAction) {
  const characterId: ReturnType<typeof appEnvSelectors.getCharacterId> =
    yield select(appEnvSelectors.getCharacterId);
  if (characterId === null) {
    yield put(
      sheetActions.characterReceiveFail(new Error("Missing Character Id"))
    );
    return;
  }

  try {
    yield put(
      characterActions.characterLoad(characterId, { v: appConfig.version })
    );
  } catch (error) {
    yield put(sheetActions.characterReceiveFail(error));
  }
}
