import { HelperUtils } from '../Helper';
import { RuleDataAccessors } from '../RuleData';
/**
 *
 * @param score
 * @param ruleData
 */
export function getStatScoreModifier(score, ruleData) {
    return HelperUtils.lookupDataOrFallback(RuleDataAccessors.getStatModifiersLookup(ruleData), score, 0);
}
/**
 *
 * @param totalBonusScore
 * @param highestSetScore
 * @param ruleData
 */
export function getBestAbilityScore(totalBonusScore, highestSetScore, ruleData) {
    return Math.min(RuleDataAccessors.getMaxStatScore(ruleData), Math.max(totalBonusScore, highestSetScore));
}
