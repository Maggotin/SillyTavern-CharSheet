import { getDamageAdjustments, getDiceValues, getLevelProficiencyBonuses, getStatModifiers, getStats, } from './accessors';
/**
 *
 * @param ruleData
 */
export function deriveStatKeyLookup(ruleData) {
    return getStats(ruleData).reduce((acc, stat) => {
        acc[stat.id] = stat.key === null ? '' : stat.key.toLowerCase();
        return acc;
    }, {});
}
/**
 *
 * @param adjustmentType
 * @param ruleData
 */
export function deriveDamageAdjustmentsByType(adjustmentType, ruleData) {
    return getDamageAdjustments(ruleData).filter((adjustment) => adjustment.type === adjustmentType);
}
/**
 *
 * @param ruleData
 */
export function deriveLevelProficiencyBonusesLookup(ruleData) {
    return getLevelProficiencyBonuses(ruleData).reduce((acc, item) => {
        acc[item.level] = item.bonus;
        return acc;
    }, {});
}
/**
 *
 * @param ruleData
 */
export function deriveStatModifiersLookup(ruleData) {
    return getStatModifiers(ruleData).reduce((acc, item) => {
        acc[item.value] = item.modifier;
        return acc;
    }, {});
}
/**
 *
 * @param ruleData
 */
export function deriveVersatileDieLookup(ruleData) {
    return getDiceValues(ruleData).reduce((acc, dieValue) => {
        const diceValues = getDiceValues(ruleData);
        const versatileIdx = Math.min(diceValues.length - 1, diceValues.indexOf(dieValue) + 1);
        acc[dieValue] = diceValues[versatileIdx];
        return acc;
    }, {});
}
