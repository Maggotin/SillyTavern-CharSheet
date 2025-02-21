import { RaceValidators } from '../Race';
import { getEntityRaceId } from './accessors';
/**
 *
 * @param race
 * @param racialTrait
 */
export function isValidRaceRacialTrait(race, racialTrait) {
    return RaceValidators.isValidRaceId(race, getEntityRaceId(racialTrait));
}
