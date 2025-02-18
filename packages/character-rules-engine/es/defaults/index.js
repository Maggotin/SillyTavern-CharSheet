import { fork } from 'redux-saga/effects';
import { characterReducer, ruleDataReducer, characterEnvReducer, featureFlagInfoReducer, serviceDataReducer, syncTransactionReducer, } from '../reducers';
import { characterSaga, serviceDataSaga } from '../sagas';
export const defaultReducers = {
    characterEnv: characterEnvReducer,
    character: characterReducer,
    featureFlagInfo: featureFlagInfoReducer,
    ruleData: ruleDataReducer,
    serviceData: serviceDataReducer,
    syncTransaction: syncTransactionReducer,
};
export function* defaultSaga() {
    yield fork(characterSaga);
    yield fork(serviceDataSaga);
}
