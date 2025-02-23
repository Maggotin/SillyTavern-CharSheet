import { intersection } from 'lodash';
import { CreatureAccessors } from '../Creature';
import { getCreatureGroupId, getMaxChallengeValue, getMonsterIds, getMonsterTypeId, getMovementIds, getSizeIds, } from './accessors';
export function isRuleGroup(rule, groupId) {
    return getCreatureGroupId(rule) === groupId;
}
export function isValidCreature(creature, rule) {
    const challengeInfo = CreatureAccessors.getChallengeInfo(creature);
    // max challenge rating
    const maxChallengeValue = getMaxChallengeValue(rule);
    if (maxChallengeValue !== null && challengeInfo !== null && challengeInfo.value > maxChallengeValue) {
        return false;
    }
    // specific monster id
    const monsterIds = getMonsterIds(rule);
    if (monsterIds.length && !monsterIds.includes(CreatureAccessors.getId(creature))) {
        return false;
    }
    // monster type
    if (getMonsterTypeId(rule) !== null && CreatureAccessors.getTypeId(creature) !== getMonsterTypeId(rule)) {
        return false;
    }
    // size
    const sizeIds = getSizeIds(rule);
    if (sizeIds.length && !sizeIds.includes(CreatureAccessors.getSizeId(creature))) {
        return false;
    }
    // excluded movements
    const excludedMovementIds = getMovementIds(rule);
    if (excludedMovementIds.length &&
        intersection(CreatureAccessors.getMovementIds(creature), excludedMovementIds).length) {
        return false;
    }
    return true;
}
