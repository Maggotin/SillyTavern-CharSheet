var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { uniqueId } from 'lodash';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as characterSelectors from "../../selectors/character";
import * as types from '../../actions/serviceData/actionTypes';
import { syncTransactionActions } from '../../actions/syncTransaction';
import * as apiShared from '../../api/requests';
import { OverrideApiException } from '../../apiAdapter';
import { CharacterLoadingStatusEnum } from '../../reducers/constants';
import * as characterEnvSelectors from '../../selectors/characterEnv';
import * as syncTransactionSelectors from '../../selectors/syncTransaction';
import { characterSagaHandlers } from '../character';
import * as sagaHandlers from './handlers';
const SYNC_ACTION_LOOKUP = {
    //KNOWN_INFUSION
    [types.KNOWN_INFUSION_MAPPING_CREATE]: true,
    [types.KNOWN_INFUSION_MAPPING_DESTROY]: true,
    //INFUSION
    [types.INFUSION_MAPPING_CREATE]: true,
    [types.INFUSION_MAPPING_DESTROY]: true,
    //VEHICLE
    [types.VEHICLE_MAPPING_CREATE]: true,
};
/**
 *
 * @param action
 */
function isSyncAction(action) {
    return !!SYNC_ACTION_LOOKUP[action.type];
}
/**
 *
 * @param meta
 * //TODO find a better solution for checking props on meta
 */
function isCommonCommitAction(meta) {
    return meta.commit !== undefined;
}
/**
 *
 * @param meta
 * //TODO find a better solution for checking props on meta
 */
function isPostAction(meta) {
    return meta.postAction !== undefined;
}
/**
 *
 */
export default function* saga() {
    yield takeEvery(Object.keys(types).map((key) => types[key]), filter);
}
/**
 *
 * @param action
 */
function* filter(action) {
    var _a;
    const characterLoadingStatus = yield select(characterEnvSelectors.getLoadingStatus);
    const canEdit = yield select(characterSelectors.getCanEdit);
    if (!canEdit && characterLoadingStatus === CharacterLoadingStatusEnum.LOADED) {
        return;
    }
    let transactionInitiatorId = null;
    if (action.meta) {
        transactionInitiatorId = yield call(executeSyncTransactionActivate, action);
        try {
            yield call(executeApi, action);
            yield call(executeHandler, action);
            yield call(executePostAction, action);
            yield call(executeSyncTransactionDeactivate, action, transactionInitiatorId);
        }
        catch (error) {
            if (error instanceof OverrideApiException) {
                yield call(executeSyncTransactionDeactivate, action, transactionInitiatorId);
                if ((_a = action.meta) === null || _a === void 0 ? void 0 : _a.reject) {
                    action.meta.reject();
                }
            }
            else {
                throw error;
            }
        }
    }
}
/**
 *
 * @param action
 */
function* executePostAction(action) {
    if (isPostAction(action.meta)) {
        for (let i = 0; i < action.meta.postAction.type.length; i++) {
            yield put({
                type: action.meta.postAction.type[i],
                payload: action.payload,
            });
        }
    }
}
/**
 *
 * @param action
 */
function* executeSyncTransactionActivate(action) {
    const isSyncTransactionActive = yield select(syncTransactionSelectors.getActive);
    let transactionInitiatorId = null;
    if (isSyncAction(action) && !isSyncTransactionActive) {
        transactionInitiatorId = uniqueId();
        yield put(syncTransactionActions.activate(transactionInitiatorId));
    }
    return transactionInitiatorId;
}
/**
 *
 * @param action
 * @param transactionInitiatorId
 */
function* executeSyncTransactionDeactivate(action, transactionInitiatorId) {
    if (isSyncAction(action)) {
        let syncTransactionInitiator = yield select(syncTransactionSelectors.getInitiator);
        if (syncTransactionInitiator === transactionInitiatorId) {
            yield put(syncTransactionActions.deactivate());
        }
    }
}
/**
 *
 * @param action
 */
function* executeApi(action) {
    let apiLookup = {
        //KNOWN_INFUSION
        [types.KNOWN_INFUSION_MAPPING_SET]: apiShared.putCharacterKnownInfusion,
        [types.KNOWN_INFUSION_MAPPING_REMOVE]: apiShared.deleteCharacterKnownInfusion,
        //INFUSION
        [types.INFUSION_MAPPING_REMOVE]: apiShared.deleteCharacterInfusion,
        //VEHICLE_COMPONENT
        [types.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET]: apiShared.putCharacterVehicleComponentHp,
        //VEHICLE
        [types.VEHICLE_MAPPING_DATA_SET]: apiShared.putCharacterVehicle,
        [types.VEHICLE_MAPPING_CONDITION_REMOVE]: apiShared.deleteCharacterVehicleCondition,
        [types.VEHICLE_MAPPING_CONDITION_ADD]: apiShared.postCharacterVehicleCondition,
        [types.VEHICLE_MAPPING_CONDITION_SET]: apiShared.putCharacterVehicleCondition,
        [types.VEHICLE_MAPPING_REMAINING_FUEL_SET]: apiShared.putCharacterVehicleFuel,
        //PARTY_ITEM
        [types.PARTY_ITEM_REMOVE]: apiShared.deleteCharacterInventoryItem,
    };
    let apiPayload = action.payload;
    //transforming payloads where api payload is different from action payload
    switch (action.type) {
        //KNOWN_INFUSION
        case types.KNOWN_INFUSION_MAPPING_SET: {
            const _a = action.payload, { definitionKey } = _a, knownInfusionSetPayload = __rest(_a, ["definitionKey"]);
            const payload = knownInfusionSetPayload;
            apiPayload = payload;
            break;
        }
        //VEHICLE
        case types.VEHICLE_MAPPING_DATA_SET: {
            const payload = Object.assign({ id: action.payload.id }, action.payload.properties);
            apiPayload = payload;
            break;
        }
        case types.VEHICLE_MAPPING_REMAINING_FUEL_SET: {
            const payload = {
                id: action.payload.vehicleMappingId,
                remainingFuel: action.payload.remainingFuel,
            };
            apiPayload = payload;
            break;
        }
        case types.VEHICLE_MAPPING_CONDITION_SET: {
            const payload = Object.assign({ vehicleMappingId: action.payload.vehicleMappingId }, action.payload.mappingContract);
            apiPayload = payload;
            break;
        }
        case types.VEHICLE_MAPPING_CONDITION_ADD: {
            const payload = Object.assign({ vehicleMappingId: action.payload.vehicleMappingId }, action.payload.mappingContract);
            apiPayload = payload;
            break;
        }
        default:
        // not implemented
    }
    let apiRequest = apiLookup[action.type] ? apiLookup[action.type] : null;
    if (isCommonCommitAction(action.meta)) {
        yield put({
            type: action.meta.commit.type,
            payload: action.payload,
            meta: {},
        });
        if (apiRequest !== null && action.meta.accept) {
            action.meta.accept();
        }
    }
    if (apiRequest !== null) {
        yield call(apiRequest, apiPayload);
    }
}
function* executeHandler(action) {
    let handlerLookup = {
        //KNOWN_INFUSION
        [types.KNOWN_INFUSION_MAPPING_CREATE]: sagaHandlers.handleKnownInfusionCreate,
        [types.KNOWN_INFUSION_MAPPING_DESTROY]: sagaHandlers.handleKnownInfusionDestroy,
        //INFUSION
        [types.INFUSION_MAPPING_CREATE]: sagaHandlers.handleInfusionCreate,
        [types.INFUSION_MAPPING_DESTROY]: sagaHandlers.handleInfusionDestroy,
        [types.INFUSION_MAPPINGS_DESTROY]: sagaHandlers.handleInfusionsDestroy,
        //VEHICLE
        [types.VEHICLE_MAPPING_CREATE]: sagaHandlers.handleVehicleCreate,
        [types.VEHICLE_MAPPING_REMOVE]: sagaHandlers.handleVehicleRemove,
        //PARTY INVENTORY
        [types.PARTY_INVENTORY_REQUEST]: sagaHandlers.handlePartyInventoryRequest,
        [types.PARTY_CURRENCY_TRANSACTION_SET]: characterSagaHandlers.handleCurrencyTransactionSet,
        [types.PARTY_CURRENCY_COPPER_SET]: sagaHandlers.handlePartyCurrencyCopperSet,
        [types.PARTY_CURRENCY_ELECTRUM_SET]: sagaHandlers.handlePartyCurrencyElectrumSet,
        [types.PARTY_CURRENCY_GOLD_SET]: sagaHandlers.handlePartyCurrencyGoldSet,
        [types.PARTY_CURRENCY_PLATINUM_SET]: sagaHandlers.handlePartyCurrencyPlatinumSet,
        [types.PARTY_CURRENCY_SILVER_SET]: sagaHandlers.handlePartyCurrencySilverSet,
        [types.PARTY_ITEM_CURRENCY_COPPER_SET]: sagaHandlers.handlePartyCurrencyCopperSet,
        [types.PARTY_ITEM_CURRENCY_ELECTRUM_SET]: sagaHandlers.handlePartyCurrencyElectrumSet,
        [types.PARTY_ITEM_CURRENCY_GOLD_SET]: sagaHandlers.handlePartyCurrencyGoldSet,
        [types.PARTY_ITEM_CURRENCY_PLATINUM_SET]: sagaHandlers.handlePartyCurrencyPlatinumSet,
        [types.PARTY_ITEM_CURRENCY_SILVER_SET]: sagaHandlers.handlePartyCurrencySilverSet,
    };
    let handler = handlerLookup[action.type] ? handlerLookup[action.type] : null;
    if (handler !== null) {
        yield call(handler, action);
    }
}
