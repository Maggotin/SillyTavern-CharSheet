import { Store } from "redux";

import builderSaga from "../../CharacterBuilder/sagas/builder";
import { StateStoreUtils } from "./Shared/stores";
import rootReducer from "../reducers/index";
import sheetSaga from "../sagas/sheet";

let store;
export default function configureStore(initialState?: any): Store {
  let sagaMiddleware: Array<any> = [sheetSaga, builderSaga];
  if (!store) {
    store = StateStoreUtils.configureStore(
      initialState,
      rootReducer,
      sagaMiddleware
    );
  }
  return store;
}
