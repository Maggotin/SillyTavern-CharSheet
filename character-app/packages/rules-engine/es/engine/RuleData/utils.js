import { has, keyBy, orderBy, sortBy, uniqBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { ActivationAccessors } from '../Activation';
import { ConditionAccessors } from '../Condition';
import { AttackTypeRangeEnum, CoreUtils, CustomProficiencyTypeEnum, DisplayConfigurationValueEnum, MovementTypeEnum, NoteKeyEnum, ProficiencyLevelEnum, SenseTypeEnum, SpeedMovementKeyEnum, TraitTypeEnum, WeightSpeedTypeEnum, } from '../Core';
import { HelperUtils } from '../Helper';
import { ModifierSubTypeEnum } from '../Modifier';
import { getAdjustmentTypesLookup, getAoeTypeLookup, getArmor, getBasicActions, getBasicActionsLookup, getBuilderHelperText, getComponentTypeLookup, getConditionLookup, getConditions, getCreatureGroupLookup, getDamageAdjustments, getDamageTypeLookup, getLanguageLookup, getLanguages, getLevelProficiencyBonusesLookup, getLimitedUseResetTypeLookup, getMovementLookup, getObjectTypeLookup, getRangeTypeLookup, getRuleLookup, getSenseLookup, getSourceDataLookup, getSpellComponentsLookup, getSpellRangeTypeLookup, getStatKeyLookup, getStatsLookup, getTools, getVehicleMovementLookup, getWeaponCategoryLookup, getWeaponLookupByEntityId, getWeaponProperties, getWeapons, } from './accessors';
/**
 *
 * @param abilityId
 * @param ruleData
 */
export function getStatInfo(abilityId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.statsLookup, abilityId, null);
}
/**
 *
 * @param activationType
 * @param ruleData
 */
export function getActivationTypeInfo(activationType, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.activationTypesLookup, activationType, null);
}
/**
 *
 * @param conditionId
 * @param ruleData
 */
export function getConditionInfo(conditionId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.conditionLookup, conditionId, null);
}
/**
 *
 * @param monsterTypeId
 * @param ruleData
 */
export function getMonsterTypeInfo(monsterTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.monsterTypeLookup, monsterTypeId, null);
}
/**
 *
 * @param monsterTypeId
 * @param ruleData
 * @param fallback
 * @param pluralize
 */
export function getMonsterTypeName(monsterTypeId, ruleData, fallback = '', pluralize = false) {
    const typeInfo = getMonsterTypeInfo(monsterTypeId, ruleData);
    let name = fallback;
    if (typeInfo) {
        name = pluralize ? typeInfo.pluralizedName : typeInfo.name;
    }
    return name;
}
/**
 *
 * @param monsterSubTypeId
 * @param ruleData
 */
export function getMonsterSubTypeInfo(monsterSubTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.monsterSubTypeLookup, monsterSubTypeId, null);
}
/**
 *
 * @param creatureSizeId
 * @param ruleData
 */
export function getCreatureSizeInfo(creatureSizeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.creatureSizeLookup, creatureSizeId, null);
}
/**
 *
 * @param creatureGroupCategoryId
 * @param ruleData
 */
export function getCreatureGroupCategoryInfo(creatureGroupCategoryId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.creatureGroupCategoryLookup, creatureGroupCategoryId, null);
}
/**
 *
 * @param creatureGroupFlagKey
 * @param ruleData
 */
export function getCreatureGroupFlagInfo(creatureGroupFlagKey, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.creatureGroupFlagLookup, creatureGroupFlagKey, null);
}
/**
 *
 * @param alignmentId
 * @param ruleData
 */
export function getAlignmentInfo(alignmentId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.alignmentLookup, alignmentId, null);
}
/**
 *
 * @param skillId
 * @param ruleData
 */
export function getSkillInfo(skillId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.abilitySkillLookup, skillId, null);
}
/**
 *
 * @param creatureGroupId
 * @param ruleData
 */
export function getCreatureGroupInfo(creatureGroupId, ruleData) {
    const definitionInfo = HelperUtils.lookupDataOrFallback(getCreatureGroupLookup(ruleData), creatureGroupId, null);
    if (definitionInfo !== null && definitionInfo.flags !== null) {
        const flagInfos = definitionInfo.flags
            .map((flagKey) => getCreatureGroupFlagInfo(flagKey, ruleData))
            .filter(TypeScriptUtils.isNotNullOrUndefined);
        return Object.assign(Object.assign({}, definitionInfo), { categoryInfo: getCreatureGroupCategoryInfo(definitionInfo.categoryId, ruleData), flagInfos, flagInfoLookup: keyBy(flagInfos, 'key') });
    }
    return null;
}
/**
 *
 * @param challengeRatingId
 * @param ruleData
 */
export function getChallengeInfo(challengeRatingId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.challengeRatingLookup, challengeRatingId, null);
}
/**
 *
 * @param damageAdjustmentId
 * @param ruleData
 */
export function getDamageAdjustmentInfo(damageAdjustmentId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.damageAdjustmentsLookup, damageAdjustmentId, null);
}
/**
 *
 * @param environmentId
 * @param ruleData
 */
export function getEnvironmentInfo(environmentId, ruleData) {
    return HelperUtils.lookupDataOrFallback(ruleData.environmentLookup, environmentId, null);
}
/**
 *
 * @param environmentId
 * @param ruleData
 * @param fallback
 */
export function getEnvironmentName(environmentId, ruleData, fallback = '') {
    const info = getEnvironmentInfo(environmentId, ruleData);
    let name = fallback;
    if (info && info.name !== null) {
        name = info.name;
    }
    return name;
}
/**
 *
 * @param categoryId
 * @param ruleData
 */
export function getWeaponCategoryInfo(categoryId, ruleData) {
    if (categoryId !== null) {
        return HelperUtils.lookupDataOrFallback(getWeaponCategoryLookup(ruleData), categoryId, null);
    }
    return null;
}
/**
 *
 * @param propertyId
 * @param ruleData
 */
export function getWeaponPropertyInfo(propertyId, ruleData) {
    const propertyInfo = getWeaponProperties(ruleData).find((propertyItem) => propertyItem.id === propertyId);
    return propertyInfo ? propertyInfo : null;
}
/**
 * @deprecated Use getAbilityShortName
 * @param abilityId
 * @param ruleData
 */
export function getAbilityKey(abilityId, ruleData) {
    if (abilityId === null) {
        return null;
    }
    return HelperUtils.lookupDataOrFallback(getStatKeyLookup(ruleData), abilityId, null);
}
/**
 *
 * @param abilityId
 * @param ruleData
 */
export function getAbilityShortName(abilityId, ruleData) {
    if (abilityId === null) {
        return null;
    }
    const key = HelperUtils.lookupDataOrFallback(getStatKeyLookup(ruleData), abilityId, null);
    if (!key) {
        return null;
    }
    return key.toUpperCase();
}
/**
 *
 * @param damageTypeId
 * @param ruleData
 */
export function getDamageType(damageTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getDamageTypeLookup(ruleData), damageTypeId, null);
}
/**
 *
 * @param abilityId
 * @param ruleData
 * @param useFullname
 */
export function getStatNameById(abilityId, ruleData, useFullname = false) {
    const stat = HelperUtils.lookupDataOrFallback(getStatsLookup(ruleData), abilityId, null);
    if (!stat) {
        return null;
    }
    return useFullname ? stat.name : stat.key;
}
/**
 *
 * @param rangeTypeId
 * @param ruleData
 */
export function getAttackRangeType(rangeTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getRangeTypeLookup(ruleData), rangeTypeId, null);
}
/**
 *
 * @param id
 */
export function getSpeedMovementKeyById(id) {
    switch (id) {
        case MovementTypeEnum.WALK:
            return SpeedMovementKeyEnum.WALK;
        case MovementTypeEnum.FLY:
            return SpeedMovementKeyEnum.FLY;
        case MovementTypeEnum.SWIM:
            return SpeedMovementKeyEnum.SWIM;
        case MovementTypeEnum.CLIMB:
            return SpeedMovementKeyEnum.CLIMB;
        case MovementTypeEnum.BURROW:
            return SpeedMovementKeyEnum.BURROW;
        default:
            return '';
    }
}
/**
 *
 * @param key
 */
export function getMovementTypeBySpeedMovementKey(key) {
    switch (key) {
        case SpeedMovementKeyEnum.WALK:
            return MovementTypeEnum.WALK;
        case SpeedMovementKeyEnum.FLY:
            return MovementTypeEnum.FLY;
        case SpeedMovementKeyEnum.SWIM:
            return MovementTypeEnum.SWIM;
        case SpeedMovementKeyEnum.CLIMB:
            return MovementTypeEnum.CLIMB;
        case SpeedMovementKeyEnum.BURROW:
            return MovementTypeEnum.BURROW;
        default:
        // not implemented
    }
    return null;
}
/**
 *
 * @param key
 * @param ruleData
 */
export function getSpeedMovementKeyLabel(key, ruleData) {
    const movementTypeId = getMovementTypeBySpeedMovementKey(key);
    return getMovementDescription(movementTypeId, ruleData);
}
/**
 *
 * @param movementId
 * @param ruleData
 */
export function getMovementName(movementId, ruleData) {
    const movementInfo = getMovementInfo(movementId, ruleData);
    if (movementInfo !== null && movementInfo.name !== null) {
        return movementInfo.name;
    }
    return '';
}
/**
 *
 * @param movementId
 * @param ruleData
 */
export function getMovementInfo(movementId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getMovementLookup(ruleData), movementId);
}
/**
 *
 * @param movementId
 * @param ruleData
 */
export function getMovementDescription(movementId, ruleData) {
    if (movementId === null) {
        return '';
    }
    const movementInfo = getMovementInfo(movementId, ruleData);
    if (movementInfo !== null && movementInfo.description !== null) {
        return movementInfo.description;
    }
    return '';
}
/**
 * @deprecated use getSenseInfo()
 * @param key
 */
export function getSenseTypeLabel(key) {
    switch (key) {
        case SenseTypeEnum.BLINDSIGHT:
            return 'Blindsight';
        case SenseTypeEnum.DARKVISION:
            return 'Darkvision';
        case SenseTypeEnum.TREMORSENSE:
            return 'Tremorsense';
        case SenseTypeEnum.TRUESIGHT:
            return 'Truesight';
        case SenseTypeEnum.PASSIVE_PERCEPTION:
        default:
            return 'Passive Perception';
    }
}
/**
 *
 * @param senseId
 * @param ruleData
 */
export function getSenseInfo(senseId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getSenseLookup(ruleData), senseId, null);
}
/**
 *
 * @param key
 */
export function getSenseTypeModifierKey(key) {
    switch (key) {
        case SenseTypeEnum.BLINDSIGHT:
            return ModifierSubTypeEnum.BLINDSIGHT;
        case SenseTypeEnum.DARKVISION:
            return ModifierSubTypeEnum.DARKVISION;
        case SenseTypeEnum.TREMORSENSE:
            return ModifierSubTypeEnum.TREMORSENSE;
        case SenseTypeEnum.TRUESIGHT:
            return ModifierSubTypeEnum.TRUESIGHT;
        case SenseTypeEnum.PASSIVE_PERCEPTION:
            return ModifierSubTypeEnum.PASSIVE_PERCEPTION;
        default:
            return '';
    }
}
/**
 *
 * @param noteKey
 */
export function getNoteKeyName(noteKey) {
    switch (noteKey) {
        case NoteKeyEnum.ORGANIZATIONS:
            return 'Organizations';
        case NoteKeyEnum.ALLIES:
            return 'Allies';
        case NoteKeyEnum.BACKSTORY:
            return 'Backstory';
        case NoteKeyEnum.ENEMIES:
            return 'Enemies';
        case NoteKeyEnum.OTHER:
            return 'Other';
        case NoteKeyEnum.OTHER_HOLDINGS:
            return 'Other Holdings';
        case NoteKeyEnum.PERSONAL_POSSESSIONS:
            return 'Other Possessions';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param type
 */
export function getTraitTypeName(type) {
    switch (type) {
        case TraitTypeEnum.APPEARANCE:
            return 'Appearance';
        case TraitTypeEnum.BONDS:
            return 'Bonds';
        case TraitTypeEnum.FLAWS:
            return 'Flaws';
        case TraitTypeEnum.IDEALS:
            return 'Ideals';
        case TraitTypeEnum.PERSONALITY_TRAITS:
            return 'Personality Traits';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param weightSpeedType
 */
export function getWeightSpeedTypeLabel(weightSpeedType) {
    switch (weightSpeedType) {
        case WeightSpeedTypeEnum.NORMAL:
            return 'Unencumbered';
        case WeightSpeedTypeEnum.ENCUMBERED:
            return 'Encumbered';
        case WeightSpeedTypeEnum.HEAVILY_ENCUMBERED:
            return 'Heavily Encumbered';
        case WeightSpeedTypeEnum.PUSH_DRAG_LIFT:
            return 'Push, Drag, Lift';
        case WeightSpeedTypeEnum.OVER_CARRYING_CAPACITY:
            return 'Over Carrying Capacity';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param type
 */
export function getProficiencyTypeLabel(type) {
    switch (type) {
        case CustomProficiencyTypeEnum.SKILL:
            return 'Skill';
        case CustomProficiencyTypeEnum.TOOL:
            return 'Tool';
        case CustomProficiencyTypeEnum.LANGUAGE:
            return 'Language';
        case CustomProficiencyTypeEnum.ARMOR:
            return 'Armor';
        case CustomProficiencyTypeEnum.WEAPON:
            return 'Weapon';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param actionTypeRange
 */
export function getAttackTypeRangeName(actionTypeRange) {
    switch (actionTypeRange) {
        case AttackTypeRangeEnum.RANGED:
            return 'Ranged';
        case AttackTypeRangeEnum.MELEE:
            return 'Melee';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param componentId
 * @param ruleData
 */
export function getSpellComponentInfo(componentId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getSpellComponentsLookup(ruleData), componentId, null);
}
/**
 *
 * @param ruleKey
 * @param ruleData
 */
export function getRule(ruleKey, ruleData) {
    return HelperUtils.lookupDataOrFallback(getRuleLookup(ruleData), ruleKey, null);
}
/**
 *
 * @param aoeTypeId
 * @param ruleData
 */
export function getAoeType(aoeTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getAoeTypeLookup(ruleData), aoeTypeId, null);
}
/**
 *
 * @param spellRangeTypeId
 * @param ruleData
 */
export function getSpellRangeType(spellRangeTypeId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getSpellRangeTypeLookup(ruleData), spellRangeTypeId, null);
}
/**
 *
 * @param conditionId
 * @param ruleData
 */
export function getCondition(conditionId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getConditionLookup(ruleData), conditionId, null);
}
/**
 *
 * @param proficiencyLevel
 */
export function getProficiencyLevelName(proficiencyLevel) {
    switch (proficiencyLevel) {
        case ProficiencyLevelEnum.NONE:
            return 'Not Proficient';
        case ProficiencyLevelEnum.HALF:
            return 'Half Proficient';
        case ProficiencyLevelEnum.FULL:
            return 'Proficient';
        case ProficiencyLevelEnum.EXPERT:
            return 'Expertise';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param id
 * @param ruleData
 */
export function getAdjustmentDataType(id, ruleData) {
    const adjustmentType = HelperUtils.lookupDataOrFallback(getAdjustmentTypesLookup(ruleData), id, null);
    if (adjustmentType) {
        return adjustmentType.dataType;
    }
    return null;
}
/**
 *
 * @param id
 * @param ruleData
 */
export function getAdjustmentName(id, ruleData) {
    const adjustmentType = HelperUtils.lookupDataOrFallback(getAdjustmentTypesLookup(ruleData), id, null);
    if (adjustmentType) {
        return adjustmentType.name;
    }
    return null;
}
/**
 *
 * @param id
 * @param ruleData
 */
export function getAdjustmentConstraintLookup(id, ruleData) {
    const adjustmentType = HelperUtils.lookupDataOrFallback(getAdjustmentTypesLookup(ruleData), id, null);
    if (adjustmentType) {
        return keyBy(adjustmentType.constraints, 'id');
    }
    return {};
}
/**
 *
 * @param ruleData
 */
export function getArmorNameLookup(ruleData) {
    const sortedArmor = orderBy(getArmor(ruleData), 'name');
    const lookup = {};
    sortedArmor.forEach((item) => {
        if (item.id !== null) {
            lookup[item.id] = item.name === null ? '' : item.name;
        }
    });
    return lookup;
}
/**
 *
 * @param categoryId
 * @param ruleData
 */
export function getWeaponCategory(categoryId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getWeaponCategoryLookup(ruleData), categoryId, null);
}
/**
 *
 * @param categoryId
 * @param ruleData
 * @param fallback
 */
export function getWeaponCategoryName(categoryId, ruleData, fallback = '') {
    const weaponCategory = getWeaponCategory(categoryId, ruleData);
    if (weaponCategory !== null && weaponCategory.name !== null) {
        return weaponCategory.name;
    }
    return fallback;
}
/**
 *
 * @param ruleData
 */
export function getWeaponNameLookup(ruleData) {
    const sortedWeapons = orderBy(getWeapons(ruleData), 'name');
    const lookup = {};
    sortedWeapons.forEach((item) => {
        if (item.id !== null) {
            lookup[item.id] = item.name === null ? '' : item.name;
        }
    });
    return lookup;
}
/**
 *
 * @param ruleData
 */
export function getLanguageNameLookup(ruleData) {
    const lookup = {};
    getLanguages(ruleData).forEach((language) => {
        if (language.id !== null) {
            lookup[language.id] = language.name === null ? '' : language.name;
        }
    });
    return lookup;
}
/**
 *
 * @param languageId
 * @param ruleData
 * @param fallback
 */
export function getLanguageName(languageId, ruleData, fallback = '') {
    const language = HelperUtils.lookupDataOrFallback(getLanguageLookup(ruleData), languageId, null);
    if (language !== null && language.name !== null) {
        return language.name;
    }
    return fallback;
}
/**
 *
 * @param ruleData
 */
export function getToolNameLookup(ruleData) {
    const sorted = orderBy(getTools(ruleData), 'name');
    const lookup = {};
    sorted.forEach((item) => {
        if (item.id !== null) {
            lookup[item.id] = item.name === null ? '' : item.name;
        }
    });
    return lookup;
}
/**
 *
 * @param id
 * @param entityTypeId
 * @param ruleData
 */
export function getWeaponByEntityId(id, entityTypeId, ruleData) {
    if (id === null || entityTypeId === null) {
        return null;
    }
    return HelperUtils.lookupDataOrFallback(getWeaponLookupByEntityId(ruleData), `${entityTypeId}-${id}`, null);
}
/**
 *
 * @param basicActionId
 * @param ruleData
 */
export function getBasicAction(basicActionId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getBasicActionsLookup(ruleData), basicActionId, null);
}
/**
 *
 * @param resetTypeId
 * @param ruleData
 */
export function getLimitedUseResetTypeName(resetTypeId, ruleData) {
    const resetType = HelperUtils.lookupDataOrFallback(getLimitedUseResetTypeLookup(ruleData), resetTypeId);
    if (resetType !== null && resetType.name !== null) {
        return resetType.name;
    }
    return 'Special';
}
/**
 *
 * @param activationType
 * @param ruleData
 */
export function getActivationTypeBasicActions(activationType, ruleData) {
    const basicActions = getBasicActions(ruleData);
    return basicActions.filter((basicAction) => ActivationAccessors.getType(basicAction.activation) === activationType);
}
/**
 *
 * @param level
 * @param ruleData
 */
export function getLevelProficiencyBonus(level, ruleData) {
    return HelperUtils.lookupDataOrFallback(getLevelProficiencyBonusesLookup(ruleData), level, 0);
}
/**
 *
 * @param slug
 * @param ruleData
 */
export function getConditionBySlug(slug, ruleData) {
    if (slug === null) {
        return null;
    }
    const conditionData = getConditions(ruleData);
    const condition = conditionData.find((condition) => ConditionAccessors.getSlug(condition) === slug);
    if (condition) {
        return condition;
    }
    return null;
}
/**
 *
 * @param slug
 * @param damageAdjustmentType
 * @param ruleData
 */
export function getDamageAdjustmentBySlug(slug, damageAdjustmentType, ruleData) {
    if (slug === null) {
        return slug;
    }
    const damageAdjustmentData = getDamageAdjustments(ruleData);
    const damageAdjustment = damageAdjustmentData.find((adjustment) => adjustment.type === damageAdjustmentType && adjustment.slug === slug);
    if (damageAdjustment) {
        return damageAdjustment;
    }
    return null;
}
/**
 *
 * @param movementType
 * @param ruleData
 * @param fallback
 */
export function getVehicleMovementName(movementType, ruleData, fallback = null) {
    const movementInfo = HelperUtils.lookupDataOrFallback(getVehicleMovementLookup(ruleData), movementType, null);
    if (movementInfo) {
        return movementInfo.name;
    }
    return fallback;
}
/**
 *
 * @param type
 * @param ruleData
 */
export function getObjectTypeInfo(type, ruleData) {
    return HelperUtils.lookupDataOrFallback(getObjectTypeLookup(ruleData), type);
}
/**
 *
 * @param type
 * @param ruleData
 * @param fallback
 */
export function getObjectTypeName(type, ruleData, fallback = null) {
    const objectType = getObjectTypeInfo(type, ruleData);
    if (objectType) {
        return objectType.name;
    }
    return fallback;
}
/**
 *
 * @param sourceId
 * @param ruleData
 */
export function getSourceDataInfo(sourceId, ruleData) {
    return HelperUtils.lookupDataOrFallback(getSourceDataLookup(ruleData), sourceId);
}
/**
 *
 * @param type
 * @param ruleData
 * @param fallback
 */
export function getComponentTypeName(type, ruleData, fallback = null) {
    const componentTypeInfo = HelperUtils.lookupDataOrFallback(getComponentTypeLookup(ruleData), type);
    if (componentTypeInfo) {
        return componentTypeInfo.name;
    }
    return fallback;
}
export function getBuilderHelperTextByDefinitionKey(definitionKey, ruleData, displayConfigurationType) {
    const builderHelperText = getBuilderHelperText(ruleData);
    return builderHelperText
        .filter((builderText) => {
        if ((has(builderText, 'isInclusive') && builderText.isInclusive) || !has(builderText, 'isInclusive')) {
            return builderText.definitionKeys.includes(definitionKey);
        }
        return !builderText.definitionKeys.includes(definitionKey);
    })
        .filter((builderText) => CoreUtils.getDisplayConfigurationValue(displayConfigurationType, builderText.displayConfiguration) ===
        DisplayConfigurationValueEnum.ON);
}
export function getBuilderHelperTextByDefinitionKeys(definitionKeys, ruleData, displayConfigurationType) {
    let builderTexts = [];
    definitionKeys.forEach((definitionKey) => {
        builderTexts = builderTexts.concat(getBuilderHelperTextByDefinitionKey(definitionKey, ruleData, displayConfigurationType));
    });
    return sortBy(uniqBy(builderTexts, 'id'), 'displayOrder');
}
