import { CreatureSizeEnum, CreatureSizeNameEnum, DB_STRING_VERDAN, INITIAL_ASI_TAG_NAME, } from '../Core';
import { RacialTraitAccessors } from '../RacialTrait';
import { getSize, getSizeId } from './accessors';
//temp hack handles specific race size for granted level size changes - need to set up logic for that
/**
 *
 * @param race
 * @param experienceInfo
 */
export function hack__deriveRaceSize(race, experienceInfo) {
    let sizeId = getSizeId(race);
    let size = getSize(race);
    if (race.baseName === DB_STRING_VERDAN && experienceInfo.currentLevel >= 5 && !race.isHomebrew) {
        sizeId = CreatureSizeEnum.MEDIUM;
        size = CreatureSizeNameEnum.MEDIUM;
    }
    return [sizeId, size];
}
export function hack__filterOutAsi(traits, isInitialAsiFromFeat) {
    if (!isInitialAsiFromFeat) {
        // no changes needed if the initial ASI isn't coming from a Background Feat
        return traits;
    }
    // Keep traits that aren't the initial ASI
    return traits.filter((trait) => !RacialTraitAccessors.getCategories(trait).some((cat) => cat.tagName === INITIAL_ASI_TAG_NAME));
}
