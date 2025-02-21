import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors, AbilityUtils } from '../Ability';
import { CharacterDerivers } from '../Character';
import { AbilitySkillEnum, AbilityStatEnum, ProficiencyLevelEnum, } from '../Core';
import { HelperUtils } from '../Helper';
import { InfusionAccessors } from '../Infusion';
import { RuleDataAccessors, RuleDataUtils } from '../RuleData';
import { SkillAccessors } from '../Skill';
import { AdjustmentTypeEnum, ValueHacks, ValueUtils, ValueValidators } from '../Value';
import { getAverageHitPoints, getChallengeProficiencyBonus, getChallengeRatingId, getDamageAdjustments, getDefinitionAlignmentId, getDefinitionArmorClass, getDefinitionConditionImmunities, getDefinitionDamageAdjustments, getDefinitionPassivePerception, getDefinitionSavingThrows, getDefinitionSizeId, getDefinitionSkills, getDefinitionStats, getDefinitionSubTypes, getDefinitionTypeId, getEnvironments, getId, getLairChallengeRatingId, getMappingEntityTypeId, getMappingId, getMovements, getRemoveHitPoints, getTemporaryHitPoints, getTypeId, } from './accessors';
import { CREATURE_CUSTOMIZATION_ADJUSTMENT_TYPES, CreatureGroupFlagEnum } from './constants';
import { getStatInfo, hasGroupFlag, shouldReplaceWithOwnerStat } from './utils';
/**
 *
 * @param creature
 */
export function derivePreOwnerHitPointInfo(creature) {
    const finalTotalHp = Math.max(getAverageHitPoints(creature), 0);
    const finalBaseHp = finalTotalHp;
    const finalRemovedHp = Math.min(finalTotalHp, getRemoveHitPoints(creature));
    return {
        baseHp: finalBaseHp,
        tempHp: 0,
        removedHp: finalRemovedHp,
        bonusHp: 0,
        overrideHp: 0,
        totalHp: finalTotalHp,
        remainingHp: finalTotalHp - finalRemovedHp,
    };
}
/**
 *
 * @param creature
 * @param ownerData
 * @param valueLookup
 * @param ruleData
 */
export function deriveHitPointInfo(creature, ownerData, valueLookup, ruleData) {
    const flagLevelMultiplierHpPossibilities = [];
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.MAX_HIT_POINTS_LEVEL_MULTIPLIER_OPTION)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.MAX_HIT_POINTS_LEVEL_MULTIPLIER_OPTION, ruleData);
        if (flagInfo) {
            const contextClassLevel = flagInfo.valueContextId === null ? 0 : ownerData.classLevelLookup[flagInfo.valueContextId];
            const contextValue = flagInfo.value === null ? 1 : flagInfo.value;
            flagLevelMultiplierHpPossibilities.push((contextClassLevel ? contextClassLevel : 0) * contextValue);
        }
    }
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.ARTIFICER_HP_MULTIPLIER)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.ARTIFICER_HP_MULTIPLIER, ruleData);
        if (flagInfo) {
            const contextClassLevel = flagInfo.valueContextId === null ? 0 : ownerData.classLevelLookup[flagInfo.valueContextId];
            const contextValue = flagInfo.value === null ? 1 : flagInfo.value;
            flagLevelMultiplierHpPossibilities.push((contextClassLevel ? contextClassLevel : 0) * contextValue);
        }
    }
    const definitionTotalHp = getAverageHitPoints(creature);
    let finalTotalHp = Math.max(definitionTotalHp, ...flagLevelMultiplierHpPossibilities);
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.MAX_HIT_POINTS_BASE_ARTIFICER_LEVEL)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.MAX_HIT_POINTS_BASE_ARTIFICER_LEVEL, ruleData);
        if (flagInfo && flagInfo.valueContextId !== null) {
            finalTotalHp = HelperUtils.lookupDataOrFallback(ownerData.classLevelLookup, flagInfo.valueContextId, finalTotalHp);
        }
    }
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.MAX_HIT_POINTS_ADD_INT_MODIFIER)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.MAX_HIT_POINTS_ADD_INT_MODIFIER, ruleData);
        if (flagInfo) {
            const contextStatModifier = flagInfo.valueContextId === null ? null : ownerData.abilityLookup[flagInfo.valueContextId];
            let finalModifier = 0;
            if (contextStatModifier && contextStatModifier.modifier) {
                finalModifier = contextStatModifier.modifier;
            }
            finalTotalHp = HelperUtils.clampInt(finalTotalHp + finalModifier, RuleDataAccessors.getMinimumHpTotal(ruleData));
        }
    }
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.MAX_HIT_POINTS_ADD_MONSTER_CON_MODIFIER)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.MAX_HIT_POINTS_ADD_MONSTER_CON_MODIFIER, ruleData);
        if (flagInfo !== null && flagInfo.valueContextId) {
            let contextStatModifier = 0;
            const contextStatInfo = getStatInfo(creature, flagInfo.valueContextId);
            if (contextStatInfo !== null && contextStatInfo.modifier !== null) {
                contextStatModifier = contextStatInfo.modifier;
            }
            finalTotalHp = HelperUtils.clampInt(finalTotalHp + contextStatModifier, ruleData.minimumHpTotal);
        }
    }
    //if there is an override for the creature's hit points, use that instead
    const hpOverride = deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_HIT_POINTS, null, valueLookup);
    if (hpOverride) {
        finalTotalHp = hpOverride;
    }
    const tempHp = getTemporaryHitPoints(creature);
    const finalRemovedHp = Math.min(finalTotalHp, getRemoveHitPoints(creature));
    return {
        baseHp: finalTotalHp,
        tempHp,
        removedHp: finalRemovedHp,
        bonusHp: 0,
        overrideHp: 0,
        totalHp: finalTotalHp,
        remainingHp: finalTotalHp - finalRemovedHp,
    };
}
/**
 *
 * @param creature
 * @param ownerData
 * @param ruleData
 */
export function deriveInitialTempHp(creature, ownerData, ruleData) {
    let initialTempHp = 0;
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.TEMP_HIT_POINTS_BASE_DRUID_LEVEL)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.TEMP_HIT_POINTS_BASE_DRUID_LEVEL, ruleData);
        if (flagInfo) {
            //find the level of the class or subclass id that matches the valueContextId and use it as the initial temp hp
            const contextClassLevel = flagInfo.valueContextId === null ? 0 : ownerData.classLevelLookup[flagInfo.valueContextId];
            initialTempHp = contextClassLevel;
        }
    }
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.TEMP_HIT_POINTS_BASE_DRUID_LEVEL_MULTIPLIER)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.TEMP_HIT_POINTS_BASE_DRUID_LEVEL_MULTIPLIER, ruleData);
        if (flagInfo) {
            //find the level of the class or subclass id that matches the valueContextId and multiply it by the contextValue
            const contextClassLevel = flagInfo.valueContextId === null ? 0 : ownerData.classLevelLookup[flagInfo.valueContextId];
            //only multiply the tempHp if the there is a contextClassLevel
            if (contextClassLevel > 0) {
                const contextValue = flagInfo.value === null ? 1 : flagInfo.value;
                initialTempHp = contextClassLevel * contextValue;
            }
        }
    }
    return initialTempHp;
}
/**
 *
 * @param creature
 */
export function deriveUseOwnerHp(creature) {
    //If this is true, the CreaturePane will use the player HP tracker instead of the Creature HP tracker and MaxHP override should be hidden from creature customization
    return hasGroupFlag(creature, CreatureGroupFlagEnum.USE_OWNER_MAX_HIT_POINTS);
}
/**
 *
 * @param creature
 * @param skill
 * @param ownerData
 * @param ruleData
 */
export function deriveOwnerSkillModifier(creature, skill, ownerData, ruleData) {
    var _a, _b, _c;
    const skillInfo = RuleDataUtils.getSkillInfo(skill.id, ruleData);
    let statModifier = 0;
    let proficiencyBonus = ownerData.proficiencyBonus;
    let otherBonuses = 0;
    if (skillInfo) {
        const statInfo = getStatInfo(creature, skillInfo.stat);
        const ownerSkill = HelperUtils.lookupDataOrFallback(ownerData.skillLookup, skill.id);
        statModifier = (_a = statInfo === null || statInfo === void 0 ? void 0 : statInfo.monster.modifier) !== null && _a !== void 0 ? _a : 0;
        if (ownerSkill !== null) {
            const ownerProficiencyLevel = SkillAccessors.getProficiencyLevel(ownerSkill);
            // Creature gives proficiency bonus if the owner doesn't have any
            let proficiencyLevel = ProficiencyLevelEnum.FULL;
            if (ownerProficiencyLevel !== ProficiencyLevelEnum.NONE) {
                proficiencyLevel = ownerProficiencyLevel;
            }
            proficiencyBonus = CharacterDerivers.deriveProficiencyBonusAmount(proficiencyLevel, ownerData.proficiencyBonus);
            if (shouldReplaceWithOwnerStat(creature, skillInfo.stat)) {
                if (SkillAccessors.getIsOverridden(ownerSkill)) {
                    statModifier = (_b = SkillAccessors.getModifier(ownerSkill)) !== null && _b !== void 0 ? _b : 0;
                    proficiencyBonus = 0;
                }
                else {
                    statModifier = SkillAccessors.getStatModifier(ownerSkill);
                    otherBonuses = SkillAccessors.getModifierBonuses(ownerSkill);
                }
            }
            else {
                const statInfo = getStatInfo(creature, skillInfo.stat);
                statModifier = (_c = statInfo === null || statInfo === void 0 ? void 0 : statInfo.monster.modifier) !== null && _c !== void 0 ? _c : 0;
            }
        }
    }
    return statModifier + proficiencyBonus + otherBonuses;
}
/**
 *
 * @param creature
 * @param stat
 * @param ownerData
 */
export function deriveOwnerSaveModifier(creature, stat, ownerData) {
    var _a, _b, _c;
    const statInfo = getStatInfo(creature, stat.id);
    let statModifier = 0;
    let proficiencyBonus = ownerData.proficiencyBonus;
    let otherBonuses = 0;
    const ownerAbility = HelperUtils.lookupDataOrFallback(ownerData.abilityLookup, stat.id);
    if (ownerAbility !== null) {
        const ownerProficiencyLevel = AbilityAccessors.getProficiencyLevel(ownerAbility);
        // Creature gives proficiency bonus if the owner doesn't have any
        let proficiencyLevel = ProficiencyLevelEnum.FULL;
        if (ownerProficiencyLevel !== ProficiencyLevelEnum.NONE) {
            proficiencyLevel = ownerProficiencyLevel;
        }
        proficiencyBonus = CharacterDerivers.deriveProficiencyBonusAmount(proficiencyLevel, ownerData.proficiencyBonus);
        if (shouldReplaceWithOwnerStat(creature, stat.id)) {
            if (AbilityAccessors.getIsSaveOverridden(ownerAbility)) {
                statModifier = (_a = AbilityAccessors.getSave(ownerAbility)) !== null && _a !== void 0 ? _a : 0;
                proficiencyBonus = 0;
            }
            else {
                statModifier = (_b = AbilityAccessors.getModifier(ownerAbility)) !== null && _b !== void 0 ? _b : 0;
                otherBonuses = AbilityAccessors.getSaveBonuses(ownerAbility);
            }
        }
        else {
            statModifier = (_c = statInfo === null || statInfo === void 0 ? void 0 : statInfo.monster.modifier) !== null && _c !== void 0 ? _c : 0;
        }
    }
    return statModifier + proficiencyBonus + otherBonuses;
}
/**
 *
 * @param creature
 * @param skill
 * @param ruleData
 */
export function deriveCreatureSkillModifier(creature, skill, ruleData) {
    var _a, _b;
    const skillInfo = RuleDataUtils.getSkillInfo(skill.skillId, ruleData);
    let statModifier = 0;
    if (skillInfo) {
        const statInfo = getStatInfo(creature, skillInfo.stat);
        statModifier = (_a = statInfo === null || statInfo === void 0 ? void 0 : statInfo.monster.modifier) !== null && _a !== void 0 ? _a : 0;
    }
    const proficiencyBonus = getChallengeProficiencyBonus(creature);
    const otherBonuses = (_b = skill.additionalBonus) !== null && _b !== void 0 ? _b : 0;
    return statModifier + proficiencyBonus + otherBonuses;
}
/**
 *
 * @param creature
 * @param savingThrow
 */
export function deriveCreatureSaveModifier(creature, savingThrow) {
    var _a, _b;
    const statInfo = getStatInfo(creature, savingThrow.statId);
    const statModifier = (_a = statInfo === null || statInfo === void 0 ? void 0 : statInfo.monster.modifier) !== null && _a !== void 0 ? _a : 0;
    const proficiencyBonus = getChallengeProficiencyBonus(creature);
    const otherBonuses = (_b = savingThrow.bonusModifier) !== null && _b !== void 0 ? _b : 0;
    return statModifier + proficiencyBonus + otherBonuses;
}
/**
 *
 * @param creature
 * @param ownerData
 * @param ruleData
 */
export function deriveSkills(creature, ownerData, ruleData) {
    const skills = RuleDataAccessors.getAbilitySkills(ruleData);
    return skills
        .map((skillInfo) => {
        var _a;
        const statInfo = RuleDataUtils.getStatInfo(skillInfo.stat, ruleData);
        const creatureSkill = getDefinitionSkills(creature).find((skill) => skill.skillId === skillInfo.id);
        const isCreatureProficient = !!creatureSkill;
        const potentialModifiers = [];
        if (hasGroupFlag(creature, CreatureGroupFlagEnum.EVALUATE_OWNER_SKILL_PROFICIENCIES)) {
            const ownerSkill = HelperUtils.lookupDataOrFallback(ownerData.skillLookup, skillInfo.id);
            const isOwnerProficient = ownerSkill !== null && SkillAccessors.getProficiencyLevel(ownerSkill) !== ProficiencyLevelEnum.NONE;
            if (isCreatureProficient || isOwnerProficient) {
                potentialModifiers.push(deriveOwnerSkillModifier(creature, skillInfo, ownerData, ruleData));
            }
            // Can potentially use creatures modifier if the owner is "proficient"
            if (creatureSkill && isCreatureProficient && isOwnerProficient) {
                potentialModifiers.push(deriveCreatureSkillModifier(creature, creatureSkill, ruleData));
            }
        }
        else if (creatureSkill && isCreatureProficient) {
            potentialModifiers.push(deriveCreatureSkillModifier(creature, creatureSkill, ruleData));
        }
        // if we didn't generate any potential modifiers, exit early and null will be filtered out
        if (!potentialModifiers.length) {
            return null;
        }
        const modifier = Math.max(...potentialModifiers);
        let bonuses = 0;
        if (hasGroupFlag(creature, CreatureGroupFlagEnum.PROFICIENT_SKILLS_ADD_PROFICIENCY_BONUS)) {
            bonuses += ownerData.proficiencyBonus;
        }
        return {
            id: skillInfo.id,
            modifier: modifier + bonuses,
            statKey: (_a = statInfo === null || statInfo === void 0 ? void 0 : statInfo.key) !== null && _a !== void 0 ? _a : 'UNK',
        };
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ownerData
 * @param ruleData
 */
export function deriveSavingThrows(creature, ownerData, ruleData) {
    const stats = RuleDataAccessors.getStats(ruleData);
    return stats
        .map((stat) => {
        var _a;
        const creatureSavingThrow = getDefinitionSavingThrows(creature).find((savingThrow) => savingThrow.statId === stat.id);
        const isCreatureProficient = !!creatureSavingThrow;
        const potentialModifiers = [];
        if (hasGroupFlag(creature, CreatureGroupFlagEnum.EVALUATE_OWNER_SAVE_PROFICIENCIES)) {
            const ownerAbility = HelperUtils.lookupDataOrFallback(ownerData.abilityLookup, stat.id);
            const isOwnerProficient = ownerAbility !== null &&
                AbilityAccessors.getProficiencyLevel(ownerAbility) !== ProficiencyLevelEnum.NONE;
            if (isCreatureProficient || isOwnerProficient) {
                potentialModifiers.push(deriveOwnerSaveModifier(creature, stat, ownerData));
            }
            // Can potentially use creatures modifier if the owner is "proficient"
            if (creatureSavingThrow && isCreatureProficient && isOwnerProficient) {
                potentialModifiers.push(deriveCreatureSaveModifier(creature, creatureSavingThrow));
            }
        }
        else if (creatureSavingThrow && isCreatureProficient) {
            potentialModifiers.push(deriveCreatureSaveModifier(creature, creatureSavingThrow));
        }
        // if we didn't generate any potential modifiers, exit early and null will be filtered out
        if (!potentialModifiers.length) {
            return null;
        }
        const modifier = Math.max(...potentialModifiers);
        let bonuses = 0;
        if (hasGroupFlag(creature, CreatureGroupFlagEnum.PROFICIENT_SAVING_THROWS_ADD_PROFICIENCY_BONUS)) {
            bonuses += ownerData.proficiencyBonus;
        }
        return {
            statId: stat.id,
            modifier: modifier + bonuses,
            statKey: (_a = stat.key) !== null && _a !== void 0 ? _a : '',
        };
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ownerData
 * @param ruleData
 */
export function deriveStats(creature, ownerData, ruleData) {
    return getDefinitionStats(creature).map((stat) => {
        var _a;
        const originalScore = stat.value;
        let score = stat.value;
        if (shouldReplaceWithOwnerStat(creature, stat.statId)) {
            const ownerAbility = HelperUtils.lookupDataOrFallback(ownerData.abilityLookup, stat.statId);
            if (ownerAbility !== null) {
                score = AbilityAccessors.getScore(ownerAbility);
            }
        }
        const statInfo = RuleDataUtils.getStatInfo(stat.statId, ruleData);
        const statKey = (_a = statInfo === null || statInfo === void 0 ? void 0 : statInfo.key) !== null && _a !== void 0 ? _a : null;
        const modifier = score === null ? null : AbilityUtils.getStatScoreModifier(score, ruleData);
        const originalModifier = originalScore === null ? null : AbilityUtils.getStatScoreModifier(originalScore, ruleData);
        return {
            id: stat.statId,
            score,
            modifier,
            statKey,
            monster: {
                score: originalScore,
                modifier: originalModifier,
            },
        };
    });
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveDamageAdjustments(creature, ruleData) {
    return getDefinitionDamageAdjustments(creature)
        .map((damageAdjustmentId) => RuleDataUtils.getDamageAdjustmentInfo(damageAdjustmentId, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveConditionImmunities(creature, ruleData) {
    return getDefinitionConditionImmunities(creature)
        .map((conditionId) => RuleDataUtils.getConditionInfo(conditionId, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param damageAdjustmentType
 * @param creature
 */
export function deriveDamageAdjustmentType(damageAdjustmentType, creature) {
    return getDamageAdjustments(creature).filter((damageAdjustment) => damageAdjustment.type === damageAdjustmentType);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveSubTypes(creature, ruleData) {
    const subTypes = getDefinitionSubTypes(creature);
    return subTypes
        .map((subTypeId) => RuleDataUtils.getMonsterSubTypeInfo(subTypeId, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ownerData
 * @param skillLookup
 * @param ruleData
 */
export function derivePassivePerception(creature, ownerData, skillLookup, ruleData) {
    if (!hasGroupFlag(creature, CreatureGroupFlagEnum.EVALUATE_UPDATED_PASSIVE_PERCEPTION)) {
        return getDefinitionPassivePerception(creature);
    }
    let skillModifier = 0;
    const perceptionInfo = skillLookup[AbilitySkillEnum.PERCEPTION];
    if (perceptionInfo) {
        skillModifier = perceptionInfo.modifier;
    }
    else {
        // fallback to perception's stat modifier if perception isn't called out
        const skillInfo = RuleDataUtils.getSkillInfo(AbilitySkillEnum.PERCEPTION, ruleData);
        if (skillInfo) {
            const statInfo = getStatInfo(creature, skillInfo.stat);
            skillModifier = statInfo && statInfo.modifier !== null ? statInfo.modifier : 0;
        }
    }
    const derivedPassivePerception = CharacterDerivers.derivePassiveSkill(skillModifier);
    const passivePerceptionPossibilities = [derivedPassivePerception];
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.EVALUATE_OWNER_PASSIVE_PERCEPTION)) {
        if (ownerData.passivePerception !== null) {
            passivePerceptionPossibilities.push(ownerData.passivePerception);
        }
    }
    return Math.max(...passivePerceptionPossibilities);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveEnvironmentTags(creature, ruleData) {
    const envs = getEnvironments(creature);
    return envs
        .map((envId) => {
        const envInfo = RuleDataUtils.getEnvironmentInfo(envId, ruleData);
        if (envInfo) {
            return envInfo.name;
        }
        return null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveSubTypeTags(creature, ruleData) {
    const subTypes = getDefinitionSubTypes(creature);
    return subTypes
        .map((subTypeId) => {
        const info = RuleDataUtils.getMonsterSubTypeInfo(subTypeId, ruleData);
        if (info) {
            return info.name;
        }
        return null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveTypeTag(creature, ruleData) {
    return RuleDataUtils.getMonsterTypeName(getTypeId(creature), ruleData, null);
}
/**
 *
 * @param creature
 */
export function deriveMovementIds(creature) {
    return getMovements(creature).map((movement) => movement.movementId);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveMovementNames(creature, ruleData) {
    return getMovements(creature).map((movement) => RuleDataUtils.getMovementDescription(movement.movementId, ruleData));
}
/**
 *
 * @param creature
 * @param ownerData
 * @param valueLookup
 */
export function deriveArmorClass(creature, ownerData, valueLookup, ruleData) {
    var _a;
    const armorOverride = deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_AC, null, valueLookup);
    if (armorOverride) {
        return armorOverride;
    }
    let bonuses = 0;
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.ARMOR_ADD_PROFICIENCY_BONUS)) {
        bonuses += ownerData.proficiencyBonus;
    }
    let armorClass = getDefinitionArmorClass(creature);
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.ARMOR_ADD_OWNER_WIS_PLUS_FIXED_VALUE)) {
        const flagInfo = RuleDataUtils.getCreatureGroupFlagInfo(CreatureGroupFlagEnum.ARMOR_ADD_OWNER_WIS_PLUS_FIXED_VALUE, ruleData);
        if (flagInfo) {
            const contextClassLevel = flagInfo.valueContextId === null ? 0 : ownerData.classLevelLookup[flagInfo.valueContextId];
            //Check if the owner has a matching class or subclass to the contextValueId
            if (contextClassLevel > 0) {
                const ownerWisdomModifier = (_a = ownerData.abilityLookup[AbilityStatEnum.WISDOM].modifier) !== null && _a !== void 0 ? _a : 0;
                const contextValue = flagInfo.value === null ? 0 : flagInfo.value;
                //AC will should be the highest value between the current AC and the owner's wisdom modifier + the context value
                armorClass = Math.max(armorClass, contextValue + ownerWisdomModifier);
            }
        }
    }
    //Add any final bonuses to the AC;
    return armorClass + bonuses;
}
/**
 *
 * @param creature
 * @param valueTypeId
 * @param fallback
 * @param valueLookup
 */
function deriveOverridenValue(creature, valueTypeId, fallback, valueLookup) {
    if (valueLookup) {
        const override = ValueUtils.getKeyValue(valueLookup, valueTypeId, ValueHacks.hack__toString(getMappingId(creature)), ValueHacks.hack__toString(getMappingEntityTypeId(creature)));
        if (override) {
            return override;
        }
    }
    return fallback;
}
/**
 *
 * @param creature
 * @param valueLookup
 */
export function deriveSizeId(creature, valueLookup) {
    return deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_SIZE, getDefinitionSizeId(creature), valueLookup);
}
/**
 *
 * @param creature
 * @param valueLookup
 */
export function deriveTypeId(creature, valueLookup) {
    return deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_TYPE_OVERRIDE, getDefinitionTypeId(creature), valueLookup);
}
/**
 *
 * @param creature
 * @param valueLookup
 */
export function deriveAlignmentId(creature, valueLookup) {
    return deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_ALIGNMENT, getDefinitionAlignmentId(creature), valueLookup);
}
/**
 *
 * @param creature
 * @param valueLookup
 */
export function deriveNotes(creature, valueLookup) {
    return deriveOverridenValue(creature, AdjustmentTypeEnum.CREATURE_NOTES, null, valueLookup);
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveLevel(creature, ruleData) {
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.USE_CHALLENGE_RATING_AS_LEVEL)) {
        const challengeInfo = RuleDataUtils.getChallengeInfo(getChallengeRatingId(creature), ruleData);
        const level = challengeInfo ? challengeInfo.value : 0;
        const maxCharLevel = RuleDataAccessors.getMaxCharacterLevel(ruleData);
        return HelperUtils.clampInt(level, 1, maxCharLevel);
    }
    return null;
}
/**
 *
 * @param creature
 * @param ruleData
 */
export function deriveChallengeInfo(creature, ruleData) {
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.USE_CHALLENGE_RATING_AS_LEVEL)) {
        return null;
    }
    return RuleDataUtils.getChallengeInfo(getChallengeRatingId(creature), ruleData);
}
export function deriveLairChallengeInfo(creature, ruleData) {
    if (hasGroupFlag(creature, CreatureGroupFlagEnum.USE_CHALLENGE_RATING_AS_LEVEL)) {
        return null;
    }
    return RuleDataUtils.getChallengeInfo(getLairChallengeRatingId(creature), ruleData);
}
/**
 *
 * @param creature
 * @param groupInfo
 * @param infusion
 */
export function deriveFlags(creature, groupInfo, infusion) {
    const flags = [];
    if (groupInfo && groupInfo.flags !== null) {
        flags.push(...groupInfo.flags);
    }
    if (infusion) {
        const creatureData = InfusionAccessors.getCreatureData(infusion);
        if (creatureData) {
            const foundCreatureData = creatureData.find((creatureDataEntry) => creatureDataEntry.monsterId === getId(creature));
            if (foundCreatureData && foundCreatureData.flags !== null) {
                flags.push(...foundCreatureData.flags);
            }
        }
    }
    return flags;
}
/**
 *
 * @param creature
 * @param valueLookup
 */
export function deriveIsCustomized(creature, valueLookup) {
    let isCustomized = ValueValidators.validateHasCustomization(CREATURE_CUSTOMIZATION_ADJUSTMENT_TYPES, valueLookup, ValueHacks.hack__toString(getMappingId(creature)), ValueHacks.hack__toString(getMappingEntityTypeId(creature)));
    if (!isCustomized) {
        if (creature.name !== null && creature.name !== '') {
            isCustomized = true;
        }
    }
    return isCustomized;
}
