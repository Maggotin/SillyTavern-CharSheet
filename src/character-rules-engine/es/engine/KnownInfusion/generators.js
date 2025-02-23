import { TypeScriptUtils } from '../../utils';
import { HelperUtils } from '../Helper';
import { InfusionAccessors, InfusionSimulators, InfusionTypeEnum } from '../Infusion';
import { getUniqueKey, getDefinitionKey, getItemDefinitionKey, getSimulatedInfusion, getChoiceKey } from './accessors';
import { deriveItemDefinitionKey } from './derivers';
/**
 *
 * @param knownInfusions
 */
export function generateKnownInfusionLookupByChoiceKey(knownInfusions) {
    return HelperUtils.generateNonNullLookup(knownInfusions, getUniqueKey);
}
/**
 *
 * @param knownInfusions
 */
export function generateKnownInfusionLookup(knownInfusions) {
    return HelperUtils.generateNonNullLookup(knownInfusions, getDefinitionKey);
}
/**
 *
 * @param knownInfusions
 */
export function generateKnownReplicatedItems(knownInfusions) {
    return knownInfusions.reduce((acc, knownInfusion) => {
        const simulatedInfusion = getSimulatedInfusion(knownInfusion);
        if (simulatedInfusion !== null && InfusionAccessors.getType(simulatedInfusion) === InfusionTypeEnum.REPLICATE) {
            const itemDefinitionKey = getItemDefinitionKey(knownInfusion);
            if (itemDefinitionKey !== null) {
                acc = [...acc, itemDefinitionKey];
            }
        }
        return acc;
    }, []);
}
/**
 *
 * @param knownInfusions
 * @param definitionPool
 */
export function generateKnownInfusions(knownInfusions, definitionPool, characterId) {
    return knownInfusions
        .map((knownInfusionMapping) => generateKnownInfusion(knownInfusionMapping, definitionPool, characterId))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param knownInfusionMapping
 * @param definitionPool
 */
export function generateKnownInfusion(knownInfusionMapping, definitionPool, characterId) {
    const definitionKey = getDefinitionKey(knownInfusionMapping);
    if (!definitionKey) {
        return null;
    }
    const uniqueKey = `${characterId}-${getChoiceKey(knownInfusionMapping)}`;
    return Object.assign(Object.assign({}, knownInfusionMapping), { simulatedInfusion: InfusionSimulators.simulateInfusion(definitionKey, definitionPool), itemDefinitionKey: deriveItemDefinitionKey(knownInfusionMapping), uniqueKey });
}
