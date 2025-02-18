import { groupBy, keyBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { DefinitionAccessors } from '../Definition';
import { HelperUtils } from '../Helper';
import { VehicleAccessors } from '../Vehicle';
import { getCosts, getDefinitionKey, getMappingId, getName, getTypes, getVehicleMappingId } from './accessors';
import { deriveActions, deriveArmorClassInfo, deriveHitPointInfo, deriveHitPointSpeedAdjustments, deriveSpeedInfos, deriveTypeNames, } from './derivers';
/**
 *
 * @param components
 */
export function generateVehicleComponentLookup(components) {
    return groupBy(components, (component) => getVehicleMappingId(component));
}
/**
 *
 * @param component
 */
export function generateUniqueKey(component) {
    const types = getTypes(component).map((type) => (type.type ? type.type : ''));
    const id = getMappingId(component);
    return `${id}-${types.join('-')}-${getName(component)}`;
}
/**
 *
 * @param component
 */
export function generateUniquenessFactor(component) {
    const factors = [];
    const name = getName(component);
    if (name) {
        factors.push(name);
    }
    getTypes(component).forEach((type) => {
        if (type.type) {
            factors.push(type.type);
        }
    });
    return factors.join('|');
}
/**
 *
 * @param vehicleMapping
 * @param vehicle
 * @param vehicleComponentLookup
 * @param ruleData
 */
export function generateVehicleComponents(vehicleMapping, vehicle, vehicleComponentLookup, ruleData) {
    const componentDefinitionMappingLookup = keyBy(VehicleAccessors.getDefinitionComponents(vehicle), (componentDefinition) => DefinitionAccessors.getDefinitionKey(componentDefinition));
    const chracterVehicleComponentMappings = HelperUtils.lookupDataOrFallback(vehicleComponentLookup, VehicleAccessors.getMappingId(vehicleMapping), []);
    return chracterVehicleComponentMappings
        .map((componentMapping) => {
        const componentDefinitionMapping = HelperUtils.lookupDataOrFallback(componentDefinitionMappingLookup, getDefinitionKey(componentMapping), null);
        return generateVehicleComponent(componentMapping, componentDefinitionMapping, ruleData, vehicle);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param componentMapping
 * @param componentDefinitionMapping
 * @param ruleData
 * @param vehicle
 */
export function generateVehicleComponent(componentMapping, componentDefinitionMapping, ruleData, vehicle) {
    if (componentDefinitionMapping === null) {
        return null;
    }
    const baseVehicleComponent = Object.assign(Object.assign({}, componentMapping), componentDefinitionMapping);
    return Object.assign(Object.assign({}, baseVehicleComponent), { armorClassInfo: deriveArmorClassInfo(baseVehicleComponent, vehicle), costs: getCosts(baseVehicleComponent), uniqueKey: generateUniqueKey(baseVehicleComponent), uniquenessFactor: generateUniquenessFactor(baseVehicleComponent), hitPointSpeedAdjustments: deriveHitPointSpeedAdjustments(baseVehicleComponent), actions: deriveActions(baseVehicleComponent, ruleData, vehicle), hitPointInfo: deriveHitPointInfo(baseVehicleComponent), typeNames: deriveTypeNames(baseVehicleComponent, ruleData), speedInfos: deriveSpeedInfos(baseVehicleComponent, ruleData) });
}
