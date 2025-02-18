import { applyMiddleware, createStore, Reducer, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import {
  defaultSaga,
  ApiAdapterException,
  OverrideApiException,
} from "../../character-rules-engine/es";

import { rollResultSaga } from "../sagas";
import { AppLoggerUtils } from "../utils";

let store: Store | null = null;

export function getAppStore(): Store | null {
  return store;
}

export function configureStore(
  initialState: any,
  rootReducer: Reducer,
  sagaMiddleware: Array<any> = [],
  middleware: Array<any> = []
): Store {
  const storeSagaMiddleware = createSagaMiddleware({
    onError: (error, errorInfo) => {
      // ApiAdapterException errors are handled by the AppApiAdapter
      if (!(error instanceof ApiAdapterException)) {
        AppLoggerUtils.logError(error);
      }
    },
  });

  let storeMiddleware: Array<any> = [];
  storeMiddleware.push(...middleware);
  storeMiddleware.push(storeSagaMiddleware);

  store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...storeMiddleware))
  );

  storeSagaMiddleware.run(defaultSaga);
  storeSagaMiddleware.run(rollResultSaga);
  for (let i = 0; i < sagaMiddleware.length; i++) {
    storeSagaMiddleware.run(sagaMiddleware[i]);
  }

  return store;
}
