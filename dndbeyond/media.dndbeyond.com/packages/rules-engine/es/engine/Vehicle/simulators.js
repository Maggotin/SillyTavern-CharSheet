import { keyBy } from 'lodash';
import { VehicleComponentAccessors, VehicleComponentSimulators } from '../VehicleComponent';
import { deriveAccessType, deriveActions, deriveComponentListsByGroupType, deriveConditionImmunities, deriveCreatureCapacityDescriptions, deriveDamageImmunities, deriveDefinitionId, deriveMovementKeys, deriveMovementNames, deriveNotes, deriveObjectTypeInfo, deriveSizeId, deriveSizeInfo, deriveStats, } from './derivers';
import { generateAggregatedActions, generateConfigurationLookup, generateConfigurationValueLookup, generateFeatures, generateUniqueKey, } from './generators';
/**
 *
 * @param vehicleDefinition
 * @param definitionPool
 * @param ruleData
 */
export function simulateVehicle(vehicleDefinition, definitionPool, ruleData) {
    const { definitionKey, name } = vehicleDefinition;
    if (definitionKey === null) {
        return null;
    }
    const simulatedMapping = {
        characterId: -1,
        definitionKey,
        id: -1,
        name,
        description: null,
        conditions: [],
        remainingFuel: 0,
    };
    const stats = deriveStats(vehicleDefinition, ruleData);
    const baseVehicle = Object.assign(Object.assign({}, simulatedMapping), { stats, statLookup: keyBy(stats, 'id'), definition: vehicleDefinition, activeConditions: [], activeConditionLookup: {}, configurationLookup: generateConfigurationLookup(vehicleDefinition), configurationValueLookup: generateConfigurationValueLookup(vehicleDefinition), definitionId: deriveDefinitionId(simulatedMapping), accessType: deriveAccessType(simulatedMapping, definitionPool) });
    const simulatedComponents = VehicleComponentSimulators.simulateVehicleComponents(baseVehicle, ruleData);
    const primaryComponent = simulatedComponents.find((component) => VehicleComponentAccessors.getIsPrimary(component));
    if (!primaryComponent) {
        return null;
    }
    const groupedComponents = deriveComponentListsByGroupType(simulatedComponents);
    const componentizedVehicle = Object.assign(Object.assign(Object.assign({}, baseVehicle), groupedComponents), { primaryComponent, uniqueKey: generateUniqueKey(baseVehicle), damageImmunityInfos: deriveDamageImmunities(baseVehicle, ruleData), conditionImmunityInfos: deriveConditionImmunities(baseVehicle, ruleData), creatureCapacityDescriptions: deriveCreatureCapacityDescriptions(baseVehicle, ruleData), sizeId: deriveSizeId(baseVehicle, ruleData), sizeInfo: deriveSizeInfo(baseVehicle, ruleData), notes: deriveNotes(baseVehicle), objectTypeInfo: deriveObjectTypeInfo(baseVehicle, ruleData), actions: deriveActions(baseVehicle, ruleData), features: generateFeatures(baseVehicle, ruleData), fuelData: null });
    return Object.assign(Object.assign({}, componentizedVehicle), { movementKeys: deriveMovementKeys(componentizedVehicle), movementNames: deriveMovementNames(componentizedVehicle, ruleData), allActions: generateAggregatedActions(componentizedVehicle) });
}
