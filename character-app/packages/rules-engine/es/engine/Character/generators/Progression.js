import { ClassAccessors } from '../../Class';
import { ClassFeatureUtils } from '../../ClassFeature';
import { PreferenceProgressionTypeEnum } from '../../Core';
import { ItemUtils } from '../../Item';
import { deriveCurrentLevelXp, deriveNextLevelXp, deriveXpLevel } from '../derivers';
/**
 *
 * @param xp
 * @param preferences
 * @param totalClassLevel
 * @param ruleData
 */
export function generateCurrentLevel(xp, preferences, totalClassLevel, ruleData) {
    if (preferences !== null && preferences.progressionType === PreferenceProgressionTypeEnum.XP) {
        return deriveXpLevel(xp, ruleData);
    }
    return totalClassLevel;
}
/**
 *
 * @param classLevel
 * @param currentLevel
 * @param currentLevelXp
 * @param ruleData
 */
export function generateExperienceInfo(classLevel, currentLevel, currentLevelXp, ruleData) {
    return {
        classLevel,
        currentLevel,
        currentLevelXp,
        currentLevelStartingXp: deriveCurrentLevelXp(currentLevel, ruleData),
        nextLevelXp: deriveNextLevelXp(currentLevel, ruleData),
    };
}
/**
 *
 * @param classes
 * @param equippedItems
 */
export function generateMartialArtsLevel(classes, equippedItems) {
    if (equippedItems.filter(ItemUtils.isArmorContract).length) {
        return null;
    }
    const martialArtsClass = classes.find((charClass) => ClassAccessors.getClassFeatures(charClass).filter((feature) => ClassFeatureUtils.doesEnableMartialArts(feature)).length > 0);
    if (martialArtsClass) {
        return ClassAccessors.getLevel(martialArtsClass);
    }
    return null;
}
