import { keyBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { ActionGenerators } from '../Action';
import { ConditionAccessors } from '../Condition';
import { ConditionLevelGenerators } from '../ConditionLevel';
import { DataOriginDataInfoKeyEnum, DataOriginGenerators, DataOriginTypeEnum, } from '../DataOrigin';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { RuleDataUtils } from '../RuleData';
import { VehicleComponentAccessors, VehicleComponentGenerators } from '../VehicleComponent';
import { getActions, getAllComponentsData, getConditions, getDefinitionFeatures, getDefinitionFuelData, getDefinitionKey, getFeatures, getMappingId, getRemainingFuel, getUniqueKey, } from './accessors';
import { VehicleConfigurationDisplayTypeEnum, VehicleConfigurationKeyEnum, VehicleConfigurationPrimaryComponentManageTypeEnum, VehicleConfigurationSizeTypeEnum, } from './constants';
import { deriveAbilities, deriveAccessType, deriveActions, deriveComponentListsByGroupType, deriveConditionImmunities, deriveConfigurationValueLookupValue, deriveCreatureCapacityDescriptions, deriveDamageImmunities, deriveDefinitionId, deriveModifierData, deriveMovementKeys, deriveMovementNames, deriveNotes, deriveObjectTypeInfo, deriveSizeId, deriveSizeInfo, deriveStats, } from './derivers';
/**
 *
 * @param vehicle
 */
export function generateUniqueKey(vehicle) {
    return `${getMappingId(vehicle)}-${getDefinitionKey(vehicle)}`;
}
/**
 *
 * @param vehicle
 * @param action
 * @param ruleData
 */
export function generateVehicleAction(vehicle, action, ruleData) {
    const baseAction = ActionGenerators.generateBaseAction(action, {});
    const dataOriginBaseAction = Object.assign(Object.assign({}, baseAction), { dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.VEHICLE, vehicle) });
    const abilities = deriveAbilities(vehicle, ruleData);
    const abilityLookup = keyBy(abilities, 'id');
    const modifierData = deriveModifierData(abilityLookup);
    const proficiencyBonus = 0;
    const modifiers = [];
    const valueLookup = {};
    const martialArtsLevel = 0;
    return ActionGenerators.generateAction(dataOriginBaseAction, proficiencyBonus, abilityLookup, modifiers, valueLookup, martialArtsLevel, ruleData, modifierData);
}
/**
 *
 * @param conditionMapping
 * @param ruleData
 */
export function generateVehicleCondition(conditionMapping, ruleData) {
    const baseCondition = RuleDataUtils.getConditionInfo(conditionMapping.conditionId, ruleData);
    if (baseCondition === null) {
        return null;
    }
    const decoratedCondition = {
        definition: baseCondition.definition,
    };
    let levels = [];
    if (baseCondition.definition !== null) {
        const foundLevels = ConditionAccessors.getDefinitionLevels(decoratedCondition).map((level) => {
            let decoratedLevel = null;
            if (level) {
                decoratedLevel = ConditionLevelGenerators.generateConditionLevel(level, decoratedCondition, {});
            }
            return decoratedLevel;
        });
        levels = foundLevels.filter(TypeScriptUtils.isNotNullOrUndefined);
    }
    return Object.assign(Object.assign({}, decoratedCondition), { level: conditionMapping.level, levels, modifiers: [] });
}
/**
 *
 * @param vehicleDefinition
 */
export function generateConfigurationLookup(vehicleDefinition) {
    const lookup = {};
    if (vehicleDefinition.configurations === null) {
        return lookup;
    }
    vehicleDefinition.configurations.forEach((configInfo) => {
        if (configInfo.key !== null) {
            lookup[configInfo.key] = configInfo;
        }
    });
    return lookup;
}
/**
 *
 * @param vehicleDefinition
 */
export function generateConfigurationValueLookup(vehicleDefinition) {
    const configurationLookup = generateConfigurationLookup(vehicleDefinition);
    return {
        [VehicleConfigurationKeyEnum.DISPLAY_TYPE]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.DISPLAY_TYPE, VehicleConfigurationDisplayTypeEnum.SHIP),
        [VehicleConfigurationKeyEnum.SIZE_TYPE]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.SIZE_TYPE, VehicleConfigurationSizeTypeEnum.DIMENSION),
        [VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.PRIMARY_COMPONENT_MANAGE_TYPE, VehicleConfigurationPrimaryComponentManageTypeEnum.COMPONENT),
        [VehicleConfigurationKeyEnum.ENABLE_TRAVEL_PACE]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_TRAVEL_PACE, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENTS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENTS, true),
        [VehicleConfigurationKeyEnum.ENABLE_ACTION_STATIONS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_ACTION_STATIONS, false),
        [VehicleConfigurationKeyEnum.ENABLE_LEVELS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_LEVELS, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_SPEEDS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_SPEEDS, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_MISHAP_THRESHOLD]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_MISHAP_THRESHOLD, false),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_DAMAGE_THRESHOLD]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_DAMAGE_THRESHOLD, true),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS_MOTIONLESS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_ARMOR_CLASS_MOTIONLESS, false),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_CREW_REQUIREMENTS]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_CREW_REQUIREMENTS, false),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_COVER]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_COVER, false),
        [VehicleConfigurationKeyEnum.ENABLE_COMPONENT_REMOVAL]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_COMPONENT_REMOVAL, true),
        [VehicleConfigurationKeyEnum.ENABLE_FEATURES]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_FEATURES, false),
        [VehicleConfigurationKeyEnum.ENABLE_CONDITIONS_TRACKING]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_CONDITIONS_TRACKING, false),
        [VehicleConfigurationKeyEnum.ENABLE_FUEL_TRACKING]: deriveConfigurationValueLookupValue(configurationLookup, VehicleConfigurationKeyEnum.ENABLE_FUEL_TRACKING, false),
    };
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function generateFeatures(vehicle, ruleData) {
    const features = getDefinitionFeatures(vehicle);
    return features.map((feature) => {
        let actions = null;
        if (feature.actions !== null) {
            actions = feature.actions.map((action) => generateVehicleAction(vehicle, action, ruleData));
        }
        return Object.assign(Object.assign({}, feature), { actions });
    });
}
/**
 *
 * @param vehicleMapping
 * @param ruleData
 */
export function generateActiveConditions(vehicleMapping, ruleData) {
    const conditions = getConditions(vehicleMapping);
    if (conditions === null) {
        return [];
    }
    return conditions
        .map((conditionInfo) => generateVehicleCondition(conditionInfo, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicle
 */
export function generateFuelData(vehicle) {
    const remainingFuel = getRemainingFuel(vehicle);
    const fuelData = getDefinitionFuelData(vehicle);
    if (fuelData === null) {
        return null;
    }
    return Object.assign(Object.assign({}, fuelData), { remainingFuel });
}
/**
 *
 * @param vehicle
 */
export function generateAggregatedActions(vehicle) {
    const allActions = [...getActions(vehicle)];
    const features = getFeatures(vehicle);
    if (features) {
        features.forEach((feature) => {
            if (feature.actions !== null) {
                feature.actions.forEach((action) => {
                    allActions.push(action);
                });
            }
        });
    }
    getAllComponentsData(vehicle).forEach((component) => {
        VehicleComponentAccessors.getActions(component).forEach((action) => {
            allActions.push(action);
        });
    });
    return allActions;
}
/**
 *
 * @param vehicles
 * @param vehicleComponentLookup
 * @param definitionPool
 * @param ruleData
 */
export function generateVehicles(vehicles, vehicleComponentLookup, definitionPool, ruleData) {
    return vehicles
        .map((vehicle) => generateVehicle(vehicle, vehicleComponentLookup, definitionPool, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicleMapping
 * @param vehicleComponentLookup
 * @param definitionPool
 * @param ruleData
 */
export function generateVehicle(vehicleMapping, vehicleComponentLookup, definitionPool, ruleData) {
    const definitionKey = getDefinitionKey(vehicleMapping);
    if (definitionKey === null) {
        return null;
    }
    const definition = DefinitionPoolUtils.getVehicleDefinition(definitionKey, definitionPool);
    if (definition === null) {
        return null;
    }
    const stats = deriveStats(definition, ruleData);
    const activeConditions = generateActiveConditions(vehicleMapping, ruleData);
    const baseVehicle = Object.assign(Object.assign({}, vehicleMapping), { definition, definitionId: deriveDefinitionId(vehicleMapping), accessType: deriveAccessType(vehicleMapping, definitionPool), stats, statLookup: keyBy(stats, 'id'), configurationLookup: generateConfigurationLookup(definition), configurationValueLookup: generateConfigurationValueLookup(definition), activeConditions, activeConditionLookup: keyBy(activeConditions, (condition) => ConditionAccessors.getId(condition)) });
    const generatedComponents = VehicleComponentGenerators.generateVehicleComponents(vehicleMapping, baseVehicle, vehicleComponentLookup, ruleData);
    const primaryComponent = generatedComponents.find((component) => VehicleComponentAccessors.getIsPrimary(component));
    if (!primaryComponent) {
        return null;
    }
    const groupedComponents = deriveComponentListsByGroupType(generatedComponents);
    const componentizedVehicle = Object.assign(Object.assign(Object.assign({}, baseVehicle), groupedComponents), { primaryComponent, uniqueKey: generateUniqueKey(baseVehicle), damageImmunityInfos: deriveDamageImmunities(baseVehicle, ruleData), conditionImmunityInfos: deriveConditionImmunities(baseVehicle, ruleData), creatureCapacityDescriptions: deriveCreatureCapacityDescriptions(baseVehicle, ruleData), sizeId: deriveSizeId(baseVehicle, ruleData), sizeInfo: deriveSizeInfo(baseVehicle, ruleData), notes: deriveNotes(baseVehicle), objectTypeInfo: deriveObjectTypeInfo(baseVehicle, ruleData), actions: deriveActions(baseVehicle, ruleData), features: generateFeatures(baseVehicle, ruleData), fuelData: generateFuelData(baseVehicle) });
    return Object.assign(Object.assign({}, componentizedVehicle), { movementKeys: deriveMovementKeys(componentizedVehicle), movementNames: deriveMovementNames(componentizedVehicle, ruleData), allActions: generateAggregatedActions(componentizedVehicle) });
}
/**
 *
 * @param vehicles
 */
export function generateRefVehicleData(vehicles) {
    let data = {};
    vehicles.forEach((vehicle) => {
        data[getUniqueKey(vehicle)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: vehicle,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    });
    return data;
}
/**
 *
 * @param vehicles
 */
export function generateVehicleLookup(vehicles) {
    return keyBy(vehicles, (vehicle) => getMappingId(vehicle));
}
