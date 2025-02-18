import { deriveChallengeInfo, deriveLairChallengeInfo, deriveLevel, deriveTypeTag } from './derivers';
import { generateBaseCreature } from './generators';
/**
 *
 * @param creatureDefinition
 * @param groupId
 * @param ruleData
 */
export function simulateCreature(creatureDefinition, groupId, ruleData) {
    const creature = {
        definition: Object.assign({}, creatureDefinition),
        description: null,
        entityTypeId: -1,
        groupId,
        id: -1,
        isActive: false,
        name: null,
        removedHitPoints: 0,
        temporaryHitPoints: 0,
    };
    const baseCreature = generateBaseCreature(creature, ruleData);
    return Object.assign(Object.assign({}, baseCreature), { level: deriveLevel(baseCreature, ruleData), challengeInfo: deriveChallengeInfo(baseCreature, ruleData), lairChallengeInfo: deriveLairChallengeInfo(baseCreature, ruleData), typeTag: deriveTypeTag(baseCreature, ruleData), statLookup: {}, stats: [], damageImmunities: [], damageResistances: [], damageVulnerabilities: [], passivePerception: null, savingThrowLookup: {}, savingThrows: [], skillLookup: {}, skills: [], isCustomized: false, hitPointInfo: Object.assign({}, baseCreature.hitPointInfo), initialTempHp: 0, useOwnerHp: false });
}
