import { RuleDataAccessors } from '../../RuleData';
/**
 *
 * @param xp
 * @param ruleData
 */
export function deriveXpLevel(xp, ruleData) {
    let level = 0;
    if (xp === 0) {
        return 1;
    }
    if (xp >= deriveMaxXp(ruleData)) {
        return RuleDataAccessors.getMaxCharacterLevel(ruleData);
    }
    const levelExperiencePoints = RuleDataAccessors.getLevelExperiencePoints(ruleData);
    levelExperiencePoints.forEach((levelXpAmount, levelIdx) => {
        if (level === 0 && xp < levelXpAmount) {
            level = levelIdx;
        }
    });
    return level;
}
/**
 *
 * @param level
 * @param ruleData
 */
export function deriveCurrentLevelXp(level, ruleData) {
    const levelExperiencePoints = RuleDataAccessors.getLevelExperiencePoints(ruleData);
    return levelExperiencePoints[Math.max(0, level - 1)];
}
/**
 *
 * @param level
 * @param ruleData
 */
export function deriveNextLevelXp(level, ruleData) {
    const levelExperiencePoints = RuleDataAccessors.getLevelExperiencePoints(ruleData);
    return levelExperiencePoints[Math.min(levelExperiencePoints.length - 1, level)];
}
/**
 *
 * @param ruleData
 */
export function deriveMaxXp(ruleData) {
    const levelExperiencePoints = RuleDataAccessors.getLevelExperiencePoints(ruleData);
    return levelExperiencePoints[levelExperiencePoints.length - 1];
}
