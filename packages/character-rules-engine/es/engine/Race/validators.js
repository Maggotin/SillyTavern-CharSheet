import { getBaseRaceId, getEntityRaceId } from './accessors';
/**
 *
 * @param race
 * @param id
 */
export function isValidRaceId(race, id) {
    return id === getBaseRaceId(race) || id === getEntityRaceId(race);
}
