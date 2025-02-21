import { keyBy } from 'lodash';
import { ClassGenerators } from '../Class';
import { DamageAdjustmentTypeEnum } from '../Core';
import { HelperUtils } from '../Helper';
import { RuleDataUtils } from '../RuleData';
import { getDefinitionArmorClass, getGroupId, getMappingId } from './accessors';
import { deriveAlignmentId, deriveArmorClass, deriveChallengeInfo, deriveConditionImmunities, deriveDamageAdjustments, deriveDamageAdjustmentType, deriveEnvironmentTags, deriveFlags, deriveHitPointInfo, deriveInitialTempHp, deriveUseOwnerHp, deriveIsCustomized, deriveLairChallengeInfo, deriveLevel, deriveMovementIds, deriveMovementNames, deriveNotes, derivePassivePerception, derivePreOwnerHitPointInfo, deriveSavingThrows, deriveSizeId, deriveSkills, deriveStats, deriveSubTypes, deriveSubTypeTags, deriveTypeId, deriveTypeTag, } from './derivers';
/**
 *
 * @param creatures
 * @param ownerData
 * @param valueLookup
 * @param creatureInfusionLookup
 * @param ruleData
 */
export function generateCreatures(creatures, ownerData, valueLookup, creatureInfusionLookup, ruleData) {
    return creatures.map((creature) => generateCreature(creature, ownerData, valueLookup, creatureInfusionLookup, ruleData));
}
/**
 *
 * @param creature
 * @param ruleData
 * @param valueLookup
 * @param creatureInfusionLookup
 */
export function generateBaseCreature(creature, ruleData, valueLookup = {}, creatureInfusionLookup = {}) {
    const sizeId = deriveSizeId(creature, valueLookup);
    const groupInfo = RuleDataUtils.getCreatureGroupInfo(getGroupId(creature), ruleData);
    const infusion = HelperUtils.lookupDataOrFallback(creatureInfusionLookup, getMappingId(creature));
    return Object.assign(Object.assign({}, creature), { sizeId,
        infusion,
        groupInfo, typeId: deriveTypeId(creature, valueLookup), alignmentId: deriveAlignmentId(creature, valueLookup), flags: deriveFlags(creature, groupInfo, infusion), sizeInfo: RuleDataUtils.getCreatureSizeInfo(sizeId, ruleData), damageAdjustments: deriveDamageAdjustments(creature, ruleData), conditionImmunities: deriveConditionImmunities(creature, ruleData), subTypes: deriveSubTypes(creature, ruleData), environmentTags: deriveEnvironmentTags(creature, ruleData), subTypeTags: deriveSubTypeTags(creature, ruleData), hitPointInfo: derivePreOwnerHitPointInfo(creature), movementIds: deriveMovementIds(creature), movementNames: deriveMovementNames(creature, ruleData), armorClass: getDefinitionArmorClass(creature), notes: deriveNotes(creature, valueLookup) });
}
/**
 *
 * @param creature
 * @param ownerData
 * @param valueLookup
 * @param creatureInfusionLookup
 * @param ruleData
 */
export function generateCreature(creature, ownerData, valueLookup, creatureInfusionLookup, ruleData) {
    // Generate all base non dependent, but still relevant data on the creature
    const baseCreature = generateBaseCreature(creature, ruleData, valueLookup, creatureInfusionLookup);
    // Generate all dependent data that is used to derive other properties
    const stats = deriveStats(baseCreature, ownerData, ruleData);
    const creatureStageOne = Object.assign(Object.assign({}, baseCreature), { stats, statLookup: keyBy(stats, 'id'), level: deriveLevel(baseCreature, ruleData), challengeInfo: deriveChallengeInfo(baseCreature, ruleData), lairChallengeInfo: deriveLairChallengeInfo(baseCreature, ruleData), typeTag: deriveTypeTag(baseCreature, ruleData) });
    const savingThrows = deriveSavingThrows(creatureStageOne, ownerData, ruleData);
    const skills = deriveSkills(creatureStageOne, ownerData, ruleData);
    const skillLookup = keyBy(skills, 'id');
    // return final generated creature with full derived data
    return Object.assign(Object.assign({}, creatureStageOne), { damageVulnerabilities: deriveDamageAdjustmentType(DamageAdjustmentTypeEnum.VULNERABILITY, creatureStageOne), damageResistances: deriveDamageAdjustmentType(DamageAdjustmentTypeEnum.RESISTANCE, creatureStageOne), damageImmunities: deriveDamageAdjustmentType(DamageAdjustmentTypeEnum.IMMUNITY, creatureStageOne), savingThrows, savingThrowLookup: keyBy(savingThrows, 'statId'), skills,
        skillLookup, passivePerception: derivePassivePerception(creatureStageOne, ownerData, skillLookup, ruleData), armorClass: deriveArmorClass(creatureStageOne, ownerData, valueLookup, ruleData), hitPointInfo: deriveHitPointInfo(creatureStageOne, ownerData, valueLookup, ruleData), initialTempHp: deriveInitialTempHp(creatureStageOne, ownerData, ruleData), useOwnerHp: deriveUseOwnerHp(creatureStageOne), isCustomized: deriveIsCustomized(creatureStageOne, valueLookup) });
}
/**
 *
 * @param classLevelLookup
 * @param skillLookup
 * @param proficiencyBonus
 * @param abilityLookup
 * @param passivePerception
 */
export function generateCreatureOwnerData(classes, skillLookup, proficiencyBonus, abilityLookup, passivePerception) {
    return {
        abilityLookup,
        proficiencyBonus,
        skillLookup,
        classLevelLookup: ClassGenerators.generateClassLevelLookup(classes),
        passivePerception,
    };
}
/**
 *
 * @param creatures
 */
export function generateCreatureLookup(creatures) {
    return keyBy(creatures, (creature) => getMappingId(creature));
}
