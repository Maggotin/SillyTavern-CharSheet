import { deriveDefinitionKey } from './derivers';
/**
 *
 * @param racialTraitId
 * @param affectedRacialTraitId
 */
export function simulateOptionalOriginContract(racialTraitId, affectedRacialTraitId) {
    return {
        affectedRacialTraitId,
        affectedRacialTraitDefinitionKey: affectedRacialTraitId ? deriveDefinitionKey(affectedRacialTraitId) : null,
        racialTraitDefinitionKey: racialTraitId ? deriveDefinitionKey(racialTraitId) : null,
        racialTraitId,
    };
}
