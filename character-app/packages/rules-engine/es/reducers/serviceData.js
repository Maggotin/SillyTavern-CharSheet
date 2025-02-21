import * as actionTypes from '../actions/serviceData/actionTypes';
import { DefinitionTypeEnum, DefinitionUtils } from '../engine/Definition';
import { InfusionAccessors } from '../engine/Infusion';
import { KnownInfusionAccessors } from '../engine/KnownInfusion';
import { RuleDataTypeEnum } from '../engine/RuleData';
import { VehicleAccessors } from '../engine/Vehicle';
import { VehicleComponentAccessors } from '../engine/VehicleComponent';
import { currencies, initialCoinState, inventory } from './character';
const initialKnownInfusionState = {
    characterId: -1,
    choiceKey: null,
    definitionKey: null,
    id: -1,
    itemId: null,
    itemName: null,
    itemTypeId: null,
    legacyItemTypeId: -1,
};
function knownInfusionEntity(state = initialKnownInfusionState, action) {
    switch (action.type) {
        case actionTypes.KNOWN_INFUSION_MAPPING_SET_COMMIT:
            return Object.assign(Object.assign({}, state), action.payload);
    }
    return state;
}
const initialVehicleEntityState = {
    id: -1,
    characterId: -1,
    definitionKey: null,
    name: null,
    description: null,
    conditions: [],
    remainingFuel: 0,
};
function vehicleEntity(state = initialVehicleEntityState, action) {
    switch (action.type) {
        case actionTypes.VEHICLE_MAPPING_DATA_SET_COMMIT:
            return Object.assign(Object.assign({}, state), action.payload.properties);
        case actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { remainingFuel: action.payload.remainingFuel });
        case actionTypes.VEHICLE_MAPPING_CONDITION_ADD_COMMIT:
            if (state.conditions === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { conditions: [...state.conditions, action.payload.mappingContract] });
        case actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE_COMMIT:
            if (state.conditions === null) {
                return state;
            }
            return Object.assign(Object.assign({}, state), { conditions: state.conditions.filter((condition) => condition.conditionId !== action.payload.conditionId) });
        case actionTypes.VEHICLE_MAPPING_CONDITION_SET_COMMIT:
            if (state.conditions === null) {
                return state;
            }
            let conditionIdx = state.conditions.findIndex((condition) => condition.conditionId === action.payload.mappingContract.conditionId);
            return Object.assign(Object.assign({}, state), { conditions: [
                    ...state.conditions.slice(0, conditionIdx),
                    action.payload.mappingContract,
                    ...state.conditions.slice(conditionIdx + 1),
                ] });
    }
    return state;
}
const initialComponentEntityState = {
    id: -1,
    characterId: -1,
    componentId: '',
    definitionKey: null,
    removedHitPoints: 0,
    name: null,
    description: null,
    vehicleMappingId: null,
    vehicleLevelId: null,
};
function componentEntity(state = initialComponentEntityState, action) {
    switch (action.type) {
        case actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { removedHitPoints: action.payload.removedHitPoints });
    }
    return state;
}
const initialPoolTypeState = {
    definitionLookup: {},
    accessTypeLookup: {},
};
function definitionPoolType(state = initialPoolTypeState, action) {
    switch (action.type) {
        case actionTypes.DEFINITION_POOL_ADD_COMMIT:
            return Object.assign(Object.assign({}, state), { definitionLookup: Object.assign(Object.assign({}, state.definitionLookup), action.payload.definitions), accessTypeLookup: Object.assign(Object.assign({}, state.accessTypeLookup), action.payload.definitionAccessTypeLookup) });
        default:
        // not implemented
    }
    return state;
}
const initialInfusionPoolState = {
    definitionLookup: {},
    accessTypeLookup: {},
};
const initialVehiclePoolState = {
    definitionLookup: {},
    accessTypeLookup: {},
};
const initialClassFeaturePoolState = {
    definitionLookup: {},
    accessTypeLookup: {},
};
const initialRacialTraitPoolState = {
    definitionLookup: {},
    accessTypeLookup: {},
};
const initialPoolState = {
    [DefinitionTypeEnum.INFUSION]: initialInfusionPoolState,
    [DefinitionTypeEnum.VEHICLE]: initialVehiclePoolState,
    [DefinitionTypeEnum.CLASS_FEATURE]: initialClassFeaturePoolState,
    [DefinitionTypeEnum.RACIAL_TRAIT]: initialRacialTraitPoolState,
};
function definitionPoolPool(state = initialPoolState, action) {
    switch (action.type) {
        case actionTypes.DEFINITION_POOL_ADD_COMMIT:
            return Object.assign(Object.assign({}, state), { [action.payload.type]: definitionPoolType(state[action.payload.type], action) });
        default:
        // not implemented
    }
    return state;
}
const initialPartyInfoState = {
    characters: null,
    coin: initialCoinState,
    description: null,
    dmUserId: -1,
    dmUsername: null,
    id: -1,
    link: null,
    name: null,
    publicNotes: null,
    partyInventory: [],
    sharingState: 0,
    modifiers: null,
    spells: null,
};
function partyInfo(partyInfoState = initialPartyInfoState, action) {
    switch (action.type) {
        case actionTypes.PARTY_ITEM_ADD_COMMIT:
        case actionTypes.PARTY_ITEM_REMOVE_COMMIT:
        case actionTypes.PARTY_ITEM_EQUIPPED_SET_COMMIT:
        case actionTypes.PARTY_ITEM_ATTUNE_SET_COMMIT:
        case actionTypes.PARTY_ITEM_QUANTITY_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CHARGES_SET_COMMIT:
        case actionTypes.PARTY_ITEM_MOVE_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT:
            if (partyInfoState) {
                return Object.assign(Object.assign({}, partyInfoState), { partyInventory: inventory(partyInfoState.partyInventory, action) });
            }
            return null;
        case actionTypes.PARTY_CURRENCIES_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_PLATINUM_SET_COMMIT:
            if (partyInfoState) {
                return Object.assign(Object.assign({}, partyInfoState), { coin: currencies(partyInfoState.coin, action) });
            }
            return null;
        case actionTypes.PARTY_CAMPAIGN_INFO_SET:
            return action.payload
                ? Object.assign(Object.assign({}, partyInfoState), action.payload) : partyInfoState;
        default:
            return null;
    }
}
export const initialState = {
    classAlwaysKnownSpells: {},
    classAlwaysPreparedSpells: {},
    definitionPool: initialPoolState,
    infusionsMappings: [],
    knownInfusionsMappings: [],
    vehicleComponentMappings: [],
    vehicleMappings: [],
    ruleDataPool: {
        [RuleDataTypeEnum.VEHICLE]: null,
    },
    partyInfo: null,
    campaignSettings: [],
};
function serviceData(state = initialState, action) {
    var _a;
    switch (action.type) {
        case actionTypes.DEFINITION_POOL_ADD_COMMIT:
            return Object.assign(Object.assign({}, state), { definitionPool: definitionPoolPool(state.definitionPool, action) });
        case actionTypes.RULE_DATA_POOL_KEY_SET_COMMIT:
            return Object.assign(Object.assign({}, state), { ruleDataPool: Object.assign(Object.assign({}, state.ruleDataPool), { [action.payload.key]: action.payload.data }) });
        case actionTypes.VEHICLE_MAPPING_ADD_COMMIT:
            // Check if vehicle already exists in the mapping list
            if (state.vehicleMappings.some((v) => v.id === action.payload.vehicle.id))
                return state;
            // Add the vehicle to the list
            return Object.assign(Object.assign({}, state), { vehicleMappings: [...state.vehicleMappings, action.payload.vehicle] });
        case actionTypes.VEHICLE_MAPPING_REMOVE_COMMIT:
            return Object.assign(Object.assign({}, state), { vehicleMappings: state.vehicleMappings.filter((vehicle) => action.payload.id !== VehicleAccessors.getMappingId(vehicle)) });
        case actionTypes.VEHICLE_MAPPING_REMAINING_FUEL_SET_COMMIT:
        case actionTypes.VEHICLE_MAPPING_CONDITION_ADD_COMMIT:
        case actionTypes.VEHICLE_MAPPING_CONDITION_SET_COMMIT:
        case actionTypes.VEHICLE_MAPPING_CONDITION_REMOVE_COMMIT: {
            let idx = state.vehicleMappings.findIndex((vehicle) => action.payload.vehicleMappingId === VehicleAccessors.getMappingId(vehicle));
            return Object.assign(Object.assign({}, state), { vehicleMappings: [
                    ...state.vehicleMappings.slice(0, idx),
                    vehicleEntity(state.vehicleMappings[idx], action),
                    ...state.vehicleMappings.slice(idx + 1),
                ] });
        }
        case actionTypes.VEHICLE_MAPPING_DATA_SET_COMMIT: {
            let idx = state.vehicleMappings.findIndex((vehicle) => action.payload.id === VehicleAccessors.getMappingId(vehicle));
            return Object.assign(Object.assign({}, state), { vehicleMappings: [
                    ...state.vehicleMappings.slice(0, idx),
                    vehicleEntity(state.vehicleMappings[idx], action),
                    ...state.vehicleMappings.slice(idx + 1),
                ] });
        }
        case actionTypes.VEHICLE_COMPONENT_MAPPING_ADD_COMMIT: {
            // Check if the component already exists in the mapping list
            if (state.vehicleComponentMappings.some((component) => action.payload.component.id === component.id &&
                action.payload.component.vehicleMappingId === component.vehicleMappingId))
                return state;
            return Object.assign(Object.assign({}, state), { vehicleComponentMappings: [...state.vehicleComponentMappings, action.payload.component] });
        }
        case actionTypes.VEHICLE_COMPONENT_MAPPING_REMOVE_COMMIT: {
            return Object.assign(Object.assign({}, state), { vehicleComponentMappings: state.vehicleComponentMappings.filter((component) => VehicleComponentAccessors.getMappingId(component) !== action.payload.id) });
        }
        case actionTypes.VEHICLE_COMPONENT_MAPPING_HIT_POINTS_SET_COMMIT: {
            let idx = state.vehicleComponentMappings.findIndex((component) => action.payload.id === VehicleComponentAccessors.getMappingId(component));
            return Object.assign(Object.assign({}, state), { vehicleComponentMappings: [
                    ...state.vehicleComponentMappings.slice(0, idx),
                    componentEntity(state.vehicleComponentMappings[idx], action),
                    ...state.vehicleComponentMappings.slice(idx + 1),
                ] });
        }
        case actionTypes.KNOWN_INFUSION_MAPPING_REMOVE_COMMIT: {
            return Object.assign(Object.assign({}, state), { knownInfusionsMappings: state.knownInfusionsMappings.filter((knownInfusion) => KnownInfusionAccessors.getChoiceKey(knownInfusion) !== action.payload.choiceKey) });
        }
        case actionTypes.KNOWN_INFUSION_MAPPING_ADD_COMMIT: {
            // Check if the known infusion already exists in the mapping list
            if (state.infusionsMappings.some((infusion) => infusion.inventoryMappingId === action.payload.id))
                return state;
            // Add the known infusion to the list
            return Object.assign(Object.assign({}, state), { knownInfusionsMappings: [...state.knownInfusionsMappings, action.payload] });
        }
        case actionTypes.KNOWN_INFUSION_MAPPING_SET_COMMIT: {
            let idx = state.knownInfusionsMappings.findIndex((knownInfusion) => KnownInfusionAccessors.getChoiceKey(knownInfusion) === action.payload.choiceKey);
            return Object.assign(Object.assign({}, state), { knownInfusionsMappings: [
                    ...state.knownInfusionsMappings.slice(0, idx),
                    knownInfusionEntity(state.knownInfusionsMappings[idx], action),
                    ...state.knownInfusionsMappings.slice(idx + 1),
                ] });
        }
        case actionTypes.INFUSION_MAPPING_ADD_COMMIT:
            // Check if the infusion already exists in the mapping list
            if (state.infusionsMappings.some((infusion) => infusion.inventoryMappingId === action.payload.inventoryMappingId &&
                infusion.creatureMappingId === action.payload.creatureMappingId))
                return state;
            // Add the infusion to the list
            return Object.assign(Object.assign({}, state), { infusionsMappings: [...state.infusionsMappings, action.payload] });
        case actionTypes.INFUSION_MAPPING_REMOVE_COMMIT: {
            return Object.assign(Object.assign({}, state), { infusionsMappings: state.infusionsMappings.filter((infusion) => {
                    const definitionKey = InfusionAccessors.getDefinitionKey(infusion);
                    if (definitionKey === null) {
                        return false;
                    }
                    if (DefinitionUtils.getDefinitionKeyId(definitionKey) === action.payload.infusionId &&
                        InfusionAccessors.getInventoryMappingId(infusion) === action.payload.inventoryMappingId) {
                        return false;
                    }
                    return true;
                }) });
        }
        case actionTypes.CLASS_ALWAYS_KNOWN_SPELLS_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), { classAlwaysKnownSpells: Object.assign(Object.assign({}, state.classAlwaysKnownSpells), { [action.payload.classId]: action.payload.spells }) });
        }
        case actionTypes.CLASS_ALWAYS_PREPARED_SPELLS_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), { classAlwaysPreparedSpells: Object.assign(Object.assign({}, state.classAlwaysPreparedSpells), { [action.payload.classId]: action.payload.spells }) });
        }
        case actionTypes.PARTY_CAMPAIGN_INFO_SET:
        case actionTypes.PARTY_CURRENCIES_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.PARTY_CURRENCY_PLATINUM_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_SILVER_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_GOLD_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_ELECTRUM_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_COPPER_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CURRENCY_PLATINUM_SET_COMMIT:
        case actionTypes.PARTY_ITEM_ADD_COMMIT:
        case actionTypes.PARTY_ITEM_REMOVE_COMMIT:
        case actionTypes.PARTY_ITEM_EQUIPPED_SET_COMMIT:
        case actionTypes.PARTY_ITEM_CHARGES_SET_COMMIT:
        case actionTypes.PARTY_ITEM_QUANTITY_SET_COMMIT:
        case actionTypes.PARTY_ITEM_ATTUNE_SET_COMMIT:
        case actionTypes.PARTY_ITEM_MOVE_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), { partyInfo: (_a = partyInfo(state.partyInfo, action)) !== null && _a !== void 0 ? _a : null });
        }
        case actionTypes.CAMPAIGN_SETTINGS_SET_COMMIT: {
            return Object.assign(Object.assign({}, state), { campaignSettings: action.payload });
        }
        default:
        // not implemented
    }
    return state;
}
export default serviceData;
