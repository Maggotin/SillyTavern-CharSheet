import { ClassFeatureAccessors } from '../ClassFeature';
import { FeatureTypeEnum } from '../Core';
import { getAffectedClassFeatureId, getClassFeature } from './accessors';
/**
 *
 * @param optionalClassFeature
 */
export function getOptionalClassFeatureSpellListIds(optionalClassFeature) {
    const spellListIds = [];
    const classFeature = getClassFeature(optionalClassFeature);
    if (classFeature) {
        spellListIds.push(...ClassFeatureAccessors.getSpellListIds(classFeature));
    }
    return spellListIds;
}
/**
 *
 * @param optionalClassFeature
 * @param data
 */
export function getUpdateMappingSpellListIdsToRemove(optionalClassFeature, data) {
    const spellListIds = [];
    const existingAffectedClassFeatureId = getAffectedClassFeatureId(optionalClassFeature);
    const classFeature = getClassFeature(optionalClassFeature);
    if (classFeature &&
        ClassFeatureAccessors.getFeatureType(classFeature) === FeatureTypeEnum.REPLACEMENT &&
        existingAffectedClassFeatureId !== null &&
        data.affectedClassFeatureId === null) {
        spellListIds.push(...getOptionalClassFeatureSpellListIds(optionalClassFeature));
    }
    return spellListIds;
}
/**
 *
 * @param optionalClassFeature
 */
export function getRemoveMappingSpellListIds(optionalClassFeature) {
    return getOptionalClassFeatureSpellListIds(optionalClassFeature);
}
