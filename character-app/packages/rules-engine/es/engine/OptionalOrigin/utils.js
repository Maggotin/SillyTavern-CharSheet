import { FeatureTypeEnum } from '../Core';
import { RacialTraitAccessors } from '../RacialTrait';
import { getAffectedRacialTraitId, getRacialTrait } from './accessors';
/**
 *
 * @param optionalOrigin
 */
export function getOptionalOriginSpellListIds(optionalOrigin) {
    const spellListIds = [];
    const racialTrait = getRacialTrait(optionalOrigin);
    if (racialTrait) {
        spellListIds.push(...RacialTraitAccessors.getSpellListIds(racialTrait));
    }
    return spellListIds;
}
/**
 *
 * @param optionalOrigin
 * @param data
 */
export function getUpdateMappingSpellListIdsToRemove(optionalOrigin, data) {
    const spellListIds = [];
    const existingAffectedRacialTraitId = getAffectedRacialTraitId(optionalOrigin);
    const racialTrait = getRacialTrait(optionalOrigin);
    if (racialTrait &&
        RacialTraitAccessors.getFeatureType(racialTrait) === FeatureTypeEnum.REPLACEMENT &&
        existingAffectedRacialTraitId !== null &&
        data.affectedRacialTraitId === null) {
        spellListIds.push(...getOptionalOriginSpellListIds(optionalOrigin));
    }
    return spellListIds;
}
/**
 *
 * @param optionalOrigin
 */
export function getRemoveMappingSpellListIds(optionalOrigin) {
    return getOptionalOriginSpellListIds(optionalOrigin);
}
