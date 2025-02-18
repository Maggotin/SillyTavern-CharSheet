import { deriveDefinitionKey } from './derivers';
/**
 *
 * @param classFeatureId
 * @param affectedClassFeatureId
 */
export function simulateOptionalClassFeatureContract(classFeatureId, affectedClassFeatureId) {
    return {
        affectedClassFeatureId,
        affectedClassFeatureDefinitionKey: affectedClassFeatureId ? deriveDefinitionKey(affectedClassFeatureId) : null,
        classFeatureDefinitionKey: classFeatureId ? deriveDefinitionKey(classFeatureId) : null,
        classFeatureId,
    };
}
