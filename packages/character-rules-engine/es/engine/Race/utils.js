import { difference } from 'lodash';
import { getOptionalOrigins, getSpellListIds } from './accessors';
import { deriveConsolidatedRacialTraits, deriveSpellListIds } from './derivers';
/**
 *
 * @param race
 * @param newEnableOptionalOrigins
 */
export function getUpdateEnableOptionalOriginsSpellListIdsToRemove(race, newEnableOptionalOrigins) {
    const existingSpellListIds = getSpellListIds(race);
    const newRacialTraits = deriveConsolidatedRacialTraits(race, getOptionalOrigins(race), newEnableOptionalOrigins);
    const newSpellListIds = deriveSpellListIds(newRacialTraits);
    return difference(existingSpellListIds, newSpellListIds);
}
