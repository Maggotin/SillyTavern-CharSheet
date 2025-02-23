import { intersection, union, groupBy } from 'lodash';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { RuleDataUtils } from '../RuleData';
import { getContextLevelChallengeMax, getCreatureGroupId, getMaxChallengeRatingId, getMaxChallengeValue, getMonsterTypeId, getMovementIds, getSizeIds, } from './accessors';
import { deriveContextLevelChallengeMax } from './derivers';
/**
 *
 * @param rule
 * @param dataOrigin
 * @param xpInfo
 * @param ruleData
 */
export function generateRule(rule, dataOrigin, xpInfo, ruleData) {
    const maxChallengeRatingId = getMaxChallengeRatingId(rule);
    let maxChallengeInfo = null;
    if (maxChallengeRatingId) {
        maxChallengeInfo = RuleDataUtils.getChallengeInfo(maxChallengeRatingId, ruleData);
    }
    const contextLevelChallengeMax = deriveContextLevelChallengeMax(rule, dataOrigin, xpInfo);
    let maxChallengeValue = null;
    const possibleMaxes = [];
    if (maxChallengeInfo !== null) {
        possibleMaxes.push(maxChallengeInfo.value);
    }
    if (contextLevelChallengeMax != null) {
        possibleMaxes.push(contextLevelChallengeMax);
    }
    if (possibleMaxes.length) {
        maxChallengeValue = Math.max(...possibleMaxes);
    }
    const ruleInfo = Object.assign(Object.assign({}, rule), { maxChallengeInfo,
        contextLevelChallengeMax,
        maxChallengeValue });
    return Object.assign(Object.assign({}, ruleInfo), { dataOrigin });
}
/**
 *
 * @param rules
 */
export function generateConsolidatedSingleTypeRule(rules) {
    if (rules.length === 1) {
        return rules[0];
    }
    const movementIdsGroups = [];
    const sizeIdsGroups = [];
    const maxChallengeValues = [];
    const contextLevelChallengeMaxValues = [];
    rules.forEach((rule) => {
        movementIdsGroups.push(getMovementIds(rule));
        sizeIdsGroups.push(getSizeIds(rule));
        const maxChallengeValue = getMaxChallengeValue(rule);
        if (maxChallengeValue !== null) {
            maxChallengeValues.push(maxChallengeValue);
        }
        const contextLevelChallengeMax = getContextLevelChallengeMax(rule);
        if (contextLevelChallengeMax !== null) {
            contextLevelChallengeMaxValues.push(contextLevelChallengeMax);
        }
    });
    const consolidatedRule = {
        contextLevelChallengeMax: contextLevelChallengeMaxValues.length
            ? Math.max(...contextLevelChallengeMaxValues)
            : null,
        creatureGroupId: getCreatureGroupId(rules[0]),
        levelDivisor: null,
        maxChallengeRatingId: null,
        maxChallengeInfo: null,
        monsterIds: [],
        monsterTypeId: getMonsterTypeId(rules[0]),
        movementIds: intersection(...movementIdsGroups),
        sizeIds: union(...sizeIdsGroups),
        maxChallengeValue: maxChallengeValues.length ? Math.max(...maxChallengeValues) : null,
    };
    return Object.assign({ dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.SIMULATED) }, consolidatedRule);
}
/**
 *
 * @param rules
 */
export function consolidateRules(rules) {
    const consolidatedRules = [];
    const rulesByGroup = groupBy(rules, (rule) => getCreatureGroupId(rule));
    Object.keys(rulesByGroup).forEach((groupId) => {
        const groupRules = rulesByGroup[groupId];
        const rulesByTypes = groupBy(groupRules, (rule) => getMonsterTypeId(rule));
        Object.keys(rulesByTypes).forEach((typeId) => {
            const rules = rulesByTypes[typeId];
            // null is cast to string when it groups by null
            if (typeId === 'null') {
                consolidatedRules.push(...rules);
            }
            else {
                consolidatedRules.push(generateConsolidatedSingleTypeRule(rules));
            }
        });
    });
    return consolidatedRules;
}
/**
 *
 * @param classRules
 * @param raceRules
 * @param featRules
 */
export function generateCreatureRules(classRules, raceRules, featRules) {
    const allRules = [...classRules, ...raceRules, ...featRules];
    return consolidateRules(allRules);
}
/**
 *
 * @param creatureRules
 */
export function generateCreatureGroupRulesLookup(creatureRules) {
    return groupBy(creatureRules, (rule) => getCreatureGroupId(rule));
}
