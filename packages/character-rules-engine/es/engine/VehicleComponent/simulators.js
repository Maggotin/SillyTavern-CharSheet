import { keyBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { DefinitionAccessors, DefinitionUtils } from '../Definition';
import { HelperUtils } from '../Helper';
import { VehicleAccessors } from '../Vehicle';
import { getCosts, getDefinitionName } from './accessors';
import { deriveActions, deriveArmorClassInfo, deriveHitPointInfo, deriveHitPointSpeedAdjustments, deriveSpeedInfos, deriveTypeNames, } from './derivers';
import { generateUniqueKey, generateUniquenessFactor } from './generators';
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function simulateVehicleComponents(vehicle, ruleData) {
    const definitionComponents = VehicleAccessors.getDefinitionComponents(vehicle);
    const componentDefinitionLookup = keyBy(definitionComponents, (componentDefinition) => DefinitionAccessors.getDefinitionKey(componentDefinition));
    return definitionComponents
        .map((componentMapping) => {
        const definitionMapping = HelperUtils.lookupDataOrFallback(componentDefinitionLookup, DefinitionAccessors.getDefinitionKey(componentMapping), null);
        if (definitionMapping === null) {
            return null;
        }
        return simulateVehicleComponent(definitionMapping, vehicle, ruleData);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param componentDefinitionMapping
 * @param vehicle
 * @param ruleData
 */
export function simulateVehicleComponent(componentDefinitionMapping, vehicle, ruleData) {
    const definitionKey = DefinitionAccessors.getDefinitionKey(componentDefinitionMapping);
    const baseVehicleComponent = Object.assign(Object.assign({}, componentDefinitionMapping), { characterId: -1, id: -1, definitionKey, componentId: DefinitionUtils.getDefinitionKeyId(definitionKey), vehicleLevelId: null, vehicleMappingId: VehicleAccessors.getMappingId(vehicle), name: getDefinitionName(componentDefinitionMapping), removedHitPoints: 0 });
    return Object.assign(Object.assign({}, baseVehicleComponent), { uniqueKey: generateUniqueKey(baseVehicleComponent), costs: getCosts(baseVehicleComponent), armorClassInfo: deriveArmorClassInfo(baseVehicleComponent, vehicle), uniquenessFactor: generateUniquenessFactor(baseVehicleComponent), hitPointSpeedAdjustments: deriveHitPointSpeedAdjustments(baseVehicleComponent), actions: deriveActions(baseVehicleComponent, ruleData, vehicle), hitPointInfo: deriveHitPointInfo(baseVehicleComponent), typeNames: deriveTypeNames(baseVehicleComponent, ruleData), speedInfos: deriveSpeedInfos(baseVehicleComponent, ruleData) });
}
