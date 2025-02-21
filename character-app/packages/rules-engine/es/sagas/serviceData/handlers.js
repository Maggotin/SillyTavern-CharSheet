import { call, put, select } from 'redux-saga/effects';
import { characterActions, serviceDataActions } from '../../actions';
import { ApiRequests } from '../../api';
import * as apiShared from '../../api/requests';
import { CampaignAccessors, PartyInventorySharingStateEnum } from '../../engine/Campaign';
import { CreatureAccessors } from '../../engine/Creature';
import { DefinitionAccessors, DefinitionTypeEnum, DefinitionUtils } from '../../engine/Definition';
import { DefinitionPoolUtils } from '../../engine/DefinitionPool';
import { FeatureFlagEnum, FeatureFlagInfoUtils } from '../../engine/FeatureFlagInfo';
import { HelperUtils } from '../../engine/Helper';
import { InfusionAccessors, InfusionTypeEnum } from '../../engine/Infusion';
import { InfusionChoiceAccessors } from '../../engine/InfusionChoice';
import { ItemAccessors, ItemUtils } from '../../engine/Item';
import { KnownInfusionAccessors } from '../../engine/KnownInfusion';
import { ValueAccessors } from '../../engine/Value';
import { VehicleAccessors, VehicleSimulators } from '../../engine/Vehicle';
import { VehicleComponentAccessors } from '../../engine/VehicleComponent';
import { initialCoinState } from '../../reducers/character';
import * as SagaHelpers from '../../sagas/SagaHelpers';
import { characterSelectors, featureFlagInfoSelectors, rulesEngineSelectors, serviceDataSelectors, } from '../../selectors';
import { TypeScriptUtils } from '../../utils';
import { callCommitAction } from '../../utils/ReduxActionUtils';
import { apiCreatureCreate, apiItemsCreate, handleLoadDefinitions } from '../character/handlers';
/**
 *
 * @param action
 */
export function* handleKnownInfusionCreate(action) {
    const newKnownInfusionMapping = yield call(SagaHelpers.getApiRequestData, apiShared.postCharacterKnownInfusion, action.payload);
    yield put(callCommitAction(serviceDataActions.knownInfusionMappingAdd, newKnownInfusionMapping));
}
/**
 *
 * @param action
 */
export function* handleKnownInfusionDestroy(action) {
    const choiceKey = action.payload.choiceKey;
    const knownInfusionLookup = yield select(rulesEngineSelectors.getKnownInfusionLookupByChoiceKey);
    const knownInfusion = HelperUtils.lookupDataOrFallback(knownInfusionLookup, choiceKey);
    if (knownInfusion) {
        const infusionChoiceInfusionLookup = yield select(rulesEngineSelectors.getInfusionChoiceInfusionLookup);
        const infusion = HelperUtils.lookupDataOrFallback(infusionChoiceInfusionLookup, choiceKey);
        if (infusion) {
            const infusionId = InfusionAccessors.getId(infusion);
            if (infusionId !== null) {
                yield call(handleInfusionDestroy, serviceDataActions.infusionMappingDestroy(infusionId, InfusionAccessors.getInventoryMappingId(infusion)));
            }
        }
    }
    const responseData = yield call(SagaHelpers.getApiRequestData, apiShared.deleteCharacterKnownInfusion, action.payload);
    yield put(callCommitAction(serviceDataActions.knownInfusionMappingRemove, action.payload.choiceKey));
}
/**
 *
 * @param action
 */
export function* handleInfusionCreate(action) {
    const infusionId = action.payload.infusionId;
    const choiceKey = action.payload.choiceKey;
    const choiceLookup = yield select(rulesEngineSelectors.getInfusionChoiceLookup);
    if (choiceKey === null) {
        return;
    }
    const infusionChoice = HelperUtils.lookupDataOrFallback(choiceLookup, choiceKey);
    if (infusionChoice === null) {
        return;
    }
    const knownInfusion = InfusionChoiceAccessors.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
        return;
    }
    const simulatedInfusion = KnownInfusionAccessors.getSimulatedInfusion(knownInfusion);
    if (simulatedInfusion === null) {
        return;
    }
    let infusionInventoryMappingId = action.payload.inventoryMappingId;
    let itemId = null;
    let itemEntityTypeId = null;
    let containerEntityId = null;
    let containerEntityTypeId = null;
    if (action.payload.itemId && action.payload.itemTypeId) {
        itemId = action.payload.itemId;
        itemEntityTypeId = action.payload.itemTypeId;
    }
    if (action.payload.containerEntityId && action.payload.containerEntityTypeId) {
        containerEntityId = action.payload.containerEntityId;
        containerEntityTypeId = action.payload.containerEntityTypeId;
    }
    if (itemId !== null && itemEntityTypeId !== null) {
        const addedItems = yield call(apiItemsCreate, {
            equipment: [
                {
                    containerEntityId,
                    containerEntityTypeId,
                    entityId: itemId,
                    entityTypeId: itemEntityTypeId,
                    quantity: 1,
                },
            ],
        });
        infusionInventoryMappingId = addedItems[0].id;
    }
    let creatureMappingId = null;
    if (InfusionAccessors.getType(simulatedInfusion) === InfusionTypeEnum.CREATURE) {
        const creatureData = InfusionAccessors.getCreatureData(simulatedInfusion);
        if (creatureData && creatureData.length) {
            // Hardcoded to first entry until we adjust data to allow for more than 1 monster
            const apiPayload = {
                groupId: creatureData[0].creatureGroupId,
                monsterId: creatureData[0].monsterId,
                names: [null],
            };
            const addedCreatures = yield call(apiCreatureCreate, apiPayload);
            creatureMappingId = CreatureAccessors.getMappingId(addedCreatures[0]);
        }
    }
    if (infusionInventoryMappingId === null) {
        return;
    }
    const payload = {
        infusionId,
        inventoryMappingId: infusionInventoryMappingId,
        creatureMappingId,
        modifierGroupId: action.payload.modifierGroupId,
        choiceKey,
    };
    const infusionResponseData = yield call(SagaHelpers.getApiRequestData, apiShared.postCharacterInfusion, payload);
    yield put(callCommitAction(serviceDataActions.infusionMappingAdd, infusionResponseData));
}
/**
 *
 * @param action
 */
export function* handleInfusionsDestroy(action) {
    const { ids } = action.payload;
    const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
    for (let i = 0; i < ids.length; i++) {
        const foundItem = HelperUtils.lookupDataOrFallback(inventoryLookup, ids[i]);
        if (foundItem) {
            const infusion = ItemAccessors.getInfusion(foundItem);
            if (infusion) {
                const infusionId = InfusionAccessors.getId(infusion);
                if (infusionId !== null) {
                    yield put(serviceDataActions.infusionMappingDestroy(infusionId, ids[i]));
                }
            }
        }
    }
}
/**
 *
 * @param action
 */
export function* handleInfusionDestroy(action) {
    const inventoryInfusionLookup = yield select(rulesEngineSelectors.getInventoryInfusionLookup);
    // If this handler gets anymore complicated, come back and rethink these saga flows
    const foundInfusion = HelperUtils.lookupDataOrFallback(inventoryInfusionLookup, action.payload.inventoryMappingId);
    if (foundInfusion) {
        const infusionType = InfusionAccessors.getType(foundInfusion);
        const creatureMappingId = InfusionAccessors.getCreatureMappingId(foundInfusion);
        if (infusionType === InfusionTypeEnum.CREATURE && creatureMappingId !== null) {
            yield put(characterActions.creatureRemove(creatureMappingId));
        }
        const inventoryMappingId = InfusionAccessors.getInventoryMappingId(foundInfusion);
        //if infused item is a REPLICATE type remove the item from inventory
        //otherwise leave the item but un-attune and reset charges
        if (infusionType === InfusionTypeEnum.REPLICATE && inventoryMappingId !== null) {
            yield put(characterActions.itemRemove(inventoryMappingId, true));
            // Mapping was removed on the backend due to being an item
            // Only call commit action to mirror backend
            yield put(callCommitAction(serviceDataActions.infusionMappingRemove, action.payload.infusionId, action.payload.inventoryMappingId));
        }
        else {
            const inventoryLookup = yield select(rulesEngineSelectors.getInventoryLookup);
            const foundItem = HelperUtils.lookupDataOrFallback(inventoryLookup, action.payload.inventoryMappingId);
            if (foundItem) {
                if (ItemAccessors.isAttuned(foundItem)) {
                    yield put(characterActions.itemAttuneSet(inventoryMappingId, false));
                }
                const limitedUse = ItemAccessors.getLimitedUse(foundItem);
                if (limitedUse !== null) {
                    // TODO IMS Infusions come back here and switch this out
                    yield put(characterActions.itemChargesSet(ItemAccessors.getMappingId(foundItem), 0));
                }
            }
            yield put(serviceDataActions.infusionMappingRemove(action.payload.infusionId, action.payload.inventoryMappingId));
        }
    }
}
/**
 *
 * @param action
 */
export function* handleVehicleCreate(action) {
    const data = yield call(SagaHelpers.getApiRequestData, apiShared.postCharacterVehicle, action.payload);
    let newVehicleMapping = data;
    yield put(callCommitAction(serviceDataActions.vehicleMappingAdd, newVehicleMapping));
    let definitionPool = yield select(serviceDataSelectors.getDefinitionPool);
    let ruleData = yield select(rulesEngineSelectors.getRuleData);
    let definitionKey = VehicleAccessors.getDefinitionKey(newVehicleMapping);
    if (definitionKey === null) {
        return;
    }
    let vehicleDefinition = DefinitionPoolUtils.getVehicleDefinition(definitionKey, definitionPool);
    if (vehicleDefinition === null) {
        return;
    }
    let simulatedVehicle = VehicleSimulators.simulateVehicle(vehicleDefinition, definitionPool, ruleData);
    if (simulatedVehicle === null) {
        return;
    }
    let vehicleComponents = VehicleAccessors.getDefinitionComponents(simulatedVehicle);
    let componentIds = vehicleComponents
        .map((component) => DefinitionUtils.getDefinitionKeyId(DefinitionAccessors.getDefinitionKey(component)))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    const componentsData = yield call(SagaHelpers.getApiRequestData, apiShared.postCharacterVehicleComponent, {
        vehicleMappingId: VehicleAccessors.getMappingId(newVehicleMapping),
        componentIds,
    });
    const componentMappings = componentsData;
    for (let i = 0; i < componentMappings.length; i++) {
        let componentMapping = componentMappings[i];
        yield put(callCommitAction(serviceDataActions.vehicleComponentMappingAdd, componentMapping));
    }
    if (action.meta.accept) {
        action.meta.accept();
    }
}
/**
 *
 * @param action
 */
export function* handleVehicleRemove(action) {
    const vehicles = yield select(rulesEngineSelectors.getVehicles);
    const responseData = yield call(SagaHelpers.getApiRequestData, apiShared.deleteCharacterVehicle, action.payload);
    let vehicle = vehicles.find((vehicle) => VehicleAccessors.getMappingId(vehicle) === action.payload.id);
    if (vehicle) {
        let vehicleComponents = VehicleAccessors.getAllComponentsData(vehicle);
        yield put(callCommitAction(serviceDataActions.vehicleMappingRemove, action.payload.id));
        for (let i = 0; i < vehicleComponents.length; i++) {
            yield put(callCommitAction(serviceDataActions.vehicleComponentMappingRemove, VehicleComponentAccessors.getMappingId(vehicleComponents[i])));
        }
    }
}
export function* handlePartyInventoryRequest(action) {
    var _a, _b, _c, _d, _e, _f;
    const featureFlagInfo = yield select(featureFlagInfoSelectors.getFeatureFlagInfo);
    const partyFlag = FeatureFlagInfoUtils.getFeatureFlagInfoValue(FeatureFlagEnum.RELEASE_GATE_IMS, featureFlagInfo);
    // Party Inventory
    if (partyFlag) {
        const campaignInfo = yield select(characterSelectors.getCampaign);
        if (campaignInfo) {
            const data = yield call(SagaHelpers.getApiRequestData, apiShared.getPartyInventory, { campaignId: CampaignAccessors.getId(campaignInfo) });
            // This sets the data in the serviceData.partyInfo state
            yield put(serviceDataActions.partyCampaignInfoSet(Object.assign(Object.assign({}, campaignInfo), { sharingState: (_a = data === null || data === void 0 ? void 0 : data.sharingState) !== null && _a !== void 0 ? _a : PartyInventorySharingStateEnum.OFF, partyInventory: (_b = data === null || data === void 0 ? void 0 : data.partyItems) !== null && _b !== void 0 ? _b : [], spells: (_c = data === null || data === void 0 ? void 0 : data.spells) !== null && _c !== void 0 ? _c : null, modifiers: (_d = data === null || data === void 0 ? void 0 : data.modifiers) !== null && _d !== void 0 ? _d : null, coin: (_e = data === null || data === void 0 ? void 0 : data.currency) !== null && _e !== void 0 ? _e : initialCoinState })));
            yield call(handleUpdatePartyInventoryValues, data);
            // Party infusions set into serviceData
            if ((_f = data.partyInfusions) === null || _f === void 0 ? void 0 : _f.length) {
                let infusionDefinitionIds = new Set();
                for (let i = 0; i < data.partyInfusions.length; i++) {
                    const mapping = data.partyInfusions[i];
                    yield put(callCommitAction(serviceDataActions.infusionMappingAdd, mapping));
                    const definitionKey = InfusionAccessors.getDefinitionKey(mapping);
                    if (definitionKey !== null) {
                        infusionDefinitionIds.add(DefinitionUtils.getDefinitionKeyId(definitionKey));
                    }
                }
                if (infusionDefinitionIds.size > 0) {
                    yield call(handleLoadDefinitions, DefinitionTypeEnum.INFUSION, Array.from(infusionDefinitionIds));
                }
            }
        }
    }
}
function* handleUpdatePartyInventoryValues(data) {
    if (data === null || data === void 0 ? void 0 : data.partyValues) {
        for (let i = 0; i < data.partyValues.length; i++) {
            const valueContract = data.partyValues[i];
            yield put(callCommitAction(characterActions.valueSet, ValueAccessors.getTypeId(valueContract), ValueAccessors.getValue(valueContract), ValueAccessors.getNotes(valueContract), ValueAccessors.getValueId(valueContract), ValueAccessors.getValueTypeId(valueContract), ValueAccessors.getContextId(valueContract), ValueAccessors.getContextTypeId(valueContract)));
        }
        const characterValueLookupByEntity = yield select(characterSelectors.getCharacterValueLookupByEntity);
        const characterValueLookup = yield select(characterSelectors.getCharacterValueLookup);
        const partyItemValuesContracts = ItemUtils.getInventoryValuesMappings(characterValueLookupByEntity, data.partyItems);
        const currentPartyItemValueKeys = partyItemValuesContracts.map((value) => ValueAccessors.getUniqueKey(value));
        const newPartyItemValueKeys = data.partyValues.map((value) => ValueAccessors.getUniqueKey(value));
        for (let i = 0; i < currentPartyItemValueKeys.length; i++) {
            const valueContractKey = currentPartyItemValueKeys[i];
            const valueContract = HelperUtils.lookupDataOrFallback(characterValueLookup, valueContractKey);
            if (valueContract && !newPartyItemValueKeys.includes(currentPartyItemValueKeys[i])) {
                yield put(callCommitAction(characterActions.valueRemove, valueContract.typeId, valueContract.valueId, valueContract.valueTypeId, valueContract.contextId, valueContract.contextTypeId));
            }
        }
    }
}
export function* handlePartyCurrencyCopperSet(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencyCopper, action.payload);
    if (data) {
        yield call(handlePartyCoinUpdate, data, action.payload.destinationEntityId);
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
export function* handlePartyCurrencySilverSet(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencySilver, action.payload);
    if (data) {
        yield call(handlePartyCoinUpdate, data, action.payload.destinationEntityId);
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
export function* handlePartyCurrencyElectrumSet(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencyElectrum, action.payload);
    if (data) {
        yield call(handlePartyCoinUpdate, data, action.payload.destinationEntityId);
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
export function* handlePartyCurrencyPlatinumSet(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencyPlatinum, action.payload);
    if (data) {
        yield call(handlePartyCoinUpdate, data, action.payload.destinationEntityId);
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
export function* handlePartyCurrencyGoldSet(action) {
    const data = yield call(SagaHelpers.getApiRequestData, ApiRequests.putCharacterInventoryCurrencyGold, action.payload);
    if (data) {
        yield call(handlePartyCoinUpdate, data, action.payload.destinationEntityId);
        if (action.meta.accept) {
            action.meta.accept();
        }
    }
}
function* handlePartyCoinUpdate(data, destinationEntityId) {
    if (destinationEntityId) {
        yield put(callCommitAction(serviceDataActions.partyItemCurrencySet, data, destinationEntityId));
    }
    else {
        yield put(callCommitAction(serviceDataActions.partyCurrenciesSet, data));
    }
}
