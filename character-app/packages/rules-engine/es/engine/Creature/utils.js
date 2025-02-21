import { orderBy } from 'lodash';
import { HelperUtils } from '../Helper';
import { InfusionAccessors } from '../Infusion';
import { RuleDataUtils } from '../RuleData';
import { getEnvironmentTags, getFlags, getGroupInfo, getInfusion, getMovements, getSavingThrows, getStats, getSubTypeTags, getSwarmInfo, getTags, getTypeId, getTypeTag, isSwarm, } from './accessors';
import { CreatureGroupFlagEnum } from './constants';
/**
 *
 * @param creature
 * @param ruleData
 * @param includeMultiParenthesis
 */
export function getTypeName(creature, ruleData, includeMultiParenthesis = true) {
    const groupInfo = getGroupInfo(creature);
    const typeId = getTypeId(creature);
    let prefix = '';
    let typeName = RuleDataUtils.getMonsterTypeName(typeId, ruleData);
    if (!typeName) {
        typeName = '';
    }
    if (isSwarm(creature)) {
        const swarmInfo = getSwarmInfo(creature);
        if (swarmInfo) {
            const sizeInfo = RuleDataUtils.getCreatureSizeInfo(swarmInfo.sizeId, ruleData);
            typeName = RuleDataUtils.getMonsterTypeName(swarmInfo.typeId, ruleData, undefined, true);
            if (!typeName) {
                typeName = '';
            }
            if (sizeInfo) {
                prefix = `swarm of ${sizeInfo.name} `;
            }
        }
    }
    if (groupInfo && groupInfo.monsterTypes !== null && groupInfo.monsterTypes.length) {
        if (groupInfo.monsterTypes.includes(typeId)) {
            typeName = RuleDataUtils.getMonsterTypeName(typeId, ruleData, undefined, isSwarm(creature));
            if (!typeName) {
                typeName = '';
            }
        }
        else {
            let displayName = '';
            groupInfo.monsterTypes.forEach((monsterTypeId, idx) => {
                const parts = [];
                if (idx !== 0) {
                    parts.push(', ');
                }
                if (groupInfo && groupInfo.monsterTypes !== null && idx === groupInfo.monsterTypes.length - 1) {
                    parts.push('or ');
                }
                const monsterTypeName = RuleDataUtils.getMonsterTypeName(monsterTypeId, ruleData, undefined, isSwarm(creature));
                if (monsterTypeName) {
                    parts.push(monsterTypeName);
                }
                displayName += parts.join('');
            });
            if (includeMultiParenthesis) {
                typeName = `(${displayName})`;
            }
            else {
                typeName = displayName;
            }
        }
    }
    return `${prefix}${typeName}`.trim();
}
/**
 *
 * @param creature
 */
export function getHighestMovementInfo(creature) {
    return HelperUtils.getLast(getMovements(creature), 'speed');
}
/**
 *
 * @param creature
 */
export function getSearchTags(creature) {
    const tags = [...getEnvironmentTags(creature), ...getTags(creature), ...getSubTypeTags(creature)];
    const typeTag = getTypeTag(creature);
    if (typeTag) {
        tags.push(typeTag);
    }
    return tags;
}
/**
 *
 * @param creature
 * @param flag
 */
export function hasGroupFlag(creature, flag) {
    return getFlags(creature).includes(flag);
}
/**
 *
 * @param creature
 * @param stat
 */
export function shouldReplaceWithOwnerStat(creature, stat) {
    var _a, _b;
    const groupInfo = getGroupInfo(creature);
    return (_b = (_a = groupInfo === null || groupInfo === void 0 ? void 0 : groupInfo.ownerStats) === null || _a === void 0 ? void 0 : _a.includes(stat)) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param creature
 * @param inventoryLookup
 */
export function getInfusionItem(creature, inventoryLookup) {
    const infusion = getInfusion(creature);
    if (infusion) {
        return HelperUtils.lookupDataOrFallback(inventoryLookup, InfusionAccessors.getInventoryMappingId(infusion));
    }
    return null;
}
/**
 *
 * @param creature
 * @param statId
 */
export function getStatInfo(creature, statId) {
    return HelperUtils.lookupDataOrFallback(creature.statLookup, statId);
}
/**
 *
 * @param creature
 * @param skillId
 */
export function getSkill(creature, skillId) {
    return HelperUtils.lookupDataOrFallback(creature.skillLookup, skillId);
}
/**
 *
 * @param flagKey
 * @param creature
 */
export function hasFlag(flagKey, creature) {
    const groupInfo = getGroupInfo(creature);
    if (groupInfo !== null) {
        return Boolean(HelperUtils.lookupDataOrFallback(groupInfo.flagInfoLookup, flagKey));
    }
    return false;
}
/**
 *
 * @param creature
 */
export function canUseLairActions(creature) {
    return !hasFlag(CreatureGroupFlagEnum.CANNOT_USE_LAIR_ACTIONS, creature);
}
/**
 *
 * @param creature
 */
export function canUseLegendaryActions(creature) {
    return !hasFlag(CreatureGroupFlagEnum.CANNOT_USE_LEGENDARY_ACTIONS, creature);
}
export function getAbilities(creature) {
    const stats = getStats(creature);
    const savingThrows = getSavingThrows(creature);
    const abilities = stats.map((stat) => {
        var _a, _b;
        const { id, modifier, score, statKey } = stat;
        const saveModifier = (_b = (_a = savingThrows.find((save) => save.statId === id)) === null || _a === void 0 ? void 0 : _a.modifier) !== null && _b !== void 0 ? _b : modifier;
        return {
            id,
            modifier: modifier !== null && modifier !== void 0 ? modifier : 0,
            score: score !== null && score !== void 0 ? score : 0,
            statKey: statKey !== null && statKey !== void 0 ? statKey : '',
            saveModifier: saveModifier !== null && saveModifier !== void 0 ? saveModifier : 0,
        };
    });
    return orderBy(abilities, 'id');
}
