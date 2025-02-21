import { TypeScriptUtils } from '../../utils';
import { ClassFeatureSimulators } from '../ClassFeature';
import { DefinitionPoolUtils } from '../DefinitionPool';
import { HelperUtils } from '../Helper';
import { getDefinitionKey } from './accessors';
export function generateOptionalClassFeatures(optionalClassFeatureMappings, definitionPool, classes, choiceComponents, baseFeats) {
    return optionalClassFeatureMappings
        .map((mapping) => generateOptionalClassFeature(mapping, definitionPool, classes, choiceComponents, baseFeats))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
export function generateOptionalClassFeature(optionalClassFeatureMapping, definitionPool, classes, choiceComponents, baseFeats) {
    const definitionKey = getDefinitionKey(optionalClassFeatureMapping);
    if (definitionKey === null) {
        return null;
    }
    return Object.assign(Object.assign({}, optionalClassFeatureMapping), { classFeature: ClassFeatureSimulators.simulateClassFeature(definitionKey, definitionPool, classes, choiceComponents, baseFeats), accessType: DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool) });
}
/**
 *
 * @param optionalClassFeatures
 */
export function generateOptionalClassFeatureLookup(optionalClassFeatures) {
    return HelperUtils.generateNonNullLookup(optionalClassFeatures, getDefinitionKey);
}
