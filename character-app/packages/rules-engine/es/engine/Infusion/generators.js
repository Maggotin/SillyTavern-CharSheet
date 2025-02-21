import { keyBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { HelperUtils } from '../Helper';
import { getCharacterId, getChoiceKey, getCreatureMappingId, getDefinitionKey, getInventoryMappingId, getUniqueKey, } from './accessors';
import { deriveRequiresItemChoice, deriveRequiresModifierDataChoice, deriveSelectedModifierData } from './derivers';
/**
 *
 * @param infusions
 */
export function generateInventoryInfusionLookup(infusions) {
    return keyBy(infusions, (infusion) => getInventoryMappingId(infusion));
}
/**
 *
 * @param infusions
 */
export function generateInfusionChoiceInfusionLookup(infusions) {
    return HelperUtils.generateNonNullLookup(infusions, getUniqueKey);
}
/**
 *
 * @param infusions
 */
export function generateCreatureInfusionLookup(infusions) {
    return HelperUtils.generateNonNullLookup(infusions, getCreatureMappingId);
}
/**
 *
 * @param infusionMapping
 * @param definition
 */
export function generateBaseInfusion(infusionMapping, definition) {
    const characterId = getCharacterId(infusionMapping);
    const uniqueKey = `${characterId}-${getChoiceKey(infusionMapping)}`;
    return Object.assign(Object.assign({}, infusionMapping), { definition,
        uniqueKey });
}
/**
 *
 * @param infusionMappings
 * @param definitionPool
 */
export function generateInfusions(infusionMappings, definitionPool) {
    return infusionMappings
        .map((infusionMapping) => generateInfusion(infusionMapping, definitionPool))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param infusionMapping
 * @param definitionPool
 */
export function generateInfusion(infusionMapping, definitionPool) {
    const definitionKey = getDefinitionKey(infusionMapping);
    if (definitionKey === null) {
        return null;
    }
    const definition = DefinitionPoolUtils.getInfusionDefinition(definitionKey, definitionPool);
    if (definition === null) {
        return null;
    }
    const baseInfusion = generateBaseInfusion(infusionMapping, definition);
    return Object.assign(Object.assign({}, baseInfusion), { accessType: DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool), selectedModifierData: deriveSelectedModifierData(baseInfusion), requiresItemChoice: deriveRequiresItemChoice(baseInfusion), requiresModifierDataChoice: deriveRequiresModifierDataChoice(baseInfusion) });
}
