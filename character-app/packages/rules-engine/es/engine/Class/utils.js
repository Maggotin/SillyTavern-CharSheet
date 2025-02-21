import { difference } from 'lodash';
import { getLevel, getOptionalClassFeatures, getSpellListIds } from './accessors';
import { deriveConsolidatedClassFeatures, deriveSpellListIds } from './derivers';
/**
 *
 * @param classes
 * @param newEnableOptionalClassFeatures
 */
export function getUpdateEnableOptionalClassFeaturesSpellListIdsToRemove(classes, newEnableOptionalClassFeatures) {
    const spellListIdsToRemove = [];
    classes.forEach((charClass) => {
        const existingSpellListIds = getSpellListIds(charClass);
        const newClassFeatures = deriveConsolidatedClassFeatures(charClass, getOptionalClassFeatures(charClass), newEnableOptionalClassFeatures);
        const newSpellListIds = deriveSpellListIds(newClassFeatures, getLevel(charClass));
        spellListIdsToRemove.push(...difference(existingSpellListIds, newSpellListIds));
    });
    return spellListIdsToRemove;
}
