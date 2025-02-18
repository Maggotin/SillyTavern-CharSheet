import { TypeScriptUtils } from '../../utils';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { HelperUtils } from '../Helper';
import { RacialTraitSimulators } from '../RacialTrait';
import { getDefinitionKey } from './accessors';
/**
 *
 * @param optionalOriginMappings
 * @param definitionPool
 */
export function generateOptionalOrigins(optionalOriginMappings, definitionPool) {
    return optionalOriginMappings
        .map((mapping) => generateOptionalOrigin(mapping, definitionPool))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param optionalOriginMapping
 * @param definitionPool
 */
export function generateOptionalOrigin(optionalOriginMapping, definitionPool) {
    const definitionKey = getDefinitionKey(optionalOriginMapping);
    if (definitionKey === null) {
        return null;
    }
    return Object.assign(Object.assign({}, optionalOriginMapping), { racialTrait: RacialTraitSimulators.simulateRacialTrait(definitionKey, definitionPool), accessType: DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool) });
}
/**
 *
 * @param optionalOrigins
 */
export function generateOptionalOriginLookup(optionalOrigins) {
    return HelperUtils.generateNonNullLookup(optionalOrigins, getDefinitionKey);
}
