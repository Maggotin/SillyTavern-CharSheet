import { has, keyBy, orderBy, sortBy } from 'lodash';
import { AttackSubtypeEnum } from '../Action';
import { ConditionAccessors } from '../Condition';
import { DamageAdjustmentTypeEnum, ProficiencyLevelEnum, } from '../Core';
import { FormatUtils } from '../Format';
import { RuleDataPoolAccessors } from '../RuleDataPool';
import { getAbilitySkills, getActivationTypes, getAdjustmentDataTypes, getAdjustmentTypes, getAlignments, getAoeTypes, getArmor, getArmorTypes, getBasicActions, getChallengeRatings, getComponentTypes, getConditions, getCoverTypes, getCreatureGroupCategories, getCreatureGroupFlags, getCreatureGroups, getCreatureSizes, getCurrencyData, getDamageAdjustments, getDamageTypes, getDiceValues, getEnvironments, getLanguages, getLifestyles, getLimitedUseResetTypes, getMonsterSubTypes, getMonsterTypes, getMovements, getObjectTypes, getRangeTypes, getRules, getSenses, getSourceCategories, getSources, getSpellComponents, getSpellRangeTypes, getStats, getStealthCheckTypes, getTools, getVehicleMovementTypes, getWeaponCategories, getWeaponProperties, getWeapons, } from './accessors';
import { RuleDataTypeEnum } from './constants';
import { deriveDamageAdjustmentsByType, deriveLevelProficiencyBonusesLookup, deriveStatKeyLookup, deriveStatModifiersLookup, deriveVersatileDieLookup, } from './derivers';
import { getCreatureGroupInfo, getProficiencyLevelName, getWeaponCategoryName } from './utils';
/**
 *
 * @param ruleDataContract
 * @param ruleDataPool
 */
export function generateRuleData(ruleDataContract, ruleDataPool) {
    const ruleDataStageOne = Object.assign(Object.assign({}, ruleDataContract), { vehicleRuleData: RuleDataPoolAccessors.getRuleData(RuleDataTypeEnum.VEHICLE, ruleDataPool) });
    let sourceData = generateSourceData(ruleDataContract);
    let sourceCategories = getSourceCategories(ruleDataContract);
    return Object.assign(Object.assign({}, ruleDataStageOne), { abilitySkillLookup: keyBy(getAbilitySkills(ruleDataContract), 'id'), activationTypesLookup: keyBy(getActivationTypes(ruleDataContract), 'id'), adjustmentDataTypeLookup: keyBy(getAdjustmentDataTypes(ruleDataContract), 'id'), adjustmentTypeLookup: keyBy(getAdjustmentTypes(ruleDataContract), 'id'), alignmentLookup: keyBy(getAlignments(ruleDataContract), 'id'), aoeTypeLookup: keyBy(getAoeTypes(ruleDataContract), 'id'), armorTypeLookup: keyBy(getArmorTypes(ruleDataContract), (armorType) => armorType.id), basicActionLookup: keyBy(getBasicActions(ruleDataContract), 'id'), challengeRatingLookup: keyBy(getChallengeRatings(ruleDataContract), 'id'), componentTypeLookup: keyBy(getComponentTypes(ruleDataStageOne), 'type'), conditionLookup: keyBy(getConditions(ruleDataContract), (condition) => ConditionAccessors.getId(condition)), coverTypeLookup: keyBy(getCoverTypes(ruleDataContract), 'type'), creatureGroupCategoryLookup: keyBy(getCreatureGroupCategories(ruleDataContract), 'id'), creatureGroupFlagLookup: keyBy(getCreatureGroupFlags(ruleDataContract), 'key'), creatureGroupLookup: keyBy(getCreatureGroups(ruleDataContract), 'id'), creatureSizeLookup: keyBy(getCreatureSizes(ruleDataContract), 'id'), currencyDataLookup: keyBy(getCurrencyData(ruleDataContract), 'name'), damageAdjustmentsLookup: keyBy(getDamageAdjustments(ruleDataContract), 'id'), damageTypeLookup: keyBy(getDamageTypes(ruleDataContract), 'id'), environmentLookup: keyBy(getEnvironments(ruleDataContract), 'id'), immunityDamageAdjustments: deriveDamageAdjustmentsByType(DamageAdjustmentTypeEnum.IMMUNITY, ruleDataContract), languageLookup: keyBy(getLanguages(ruleDataContract), 'id'), levelProficiencyBonusesLookup: deriveLevelProficiencyBonusesLookup(ruleDataContract), lifestyleLookup: keyBy(getLifestyles(ruleDataContract), 'id'), limitedUseResetTypeLookup: keyBy(getLimitedUseResetTypes(ruleDataContract), 'id'), monsterSubTypeLookup: keyBy(getMonsterSubTypes(ruleDataContract), 'id'), monsterTypeLookup: keyBy(getMonsterTypes(ruleDataContract), 'id'), movementLookup: keyBy(getMovements(ruleDataContract), 'id'), objectTypeLookup: keyBy(getObjectTypes(ruleDataStageOne), 'type'), rangeTypeLookup: keyBy(getRangeTypes(ruleDataContract), 'id'), resistanceDamageAdjustments: deriveDamageAdjustmentsByType(DamageAdjustmentTypeEnum.RESISTANCE, ruleDataContract), ruleLookup: keyBy(getRules(ruleDataContract), 'name'), senseLookup: keyBy(getSenses(ruleDataContract), 'id'), sourceData, sourceDataLookup: generateSourceDataLookup(sourceData), sourceCategoryLookup: generateSourceCategoryLookup(sourceCategories), spellComponentsLookup: keyBy(getSpellComponents(ruleDataContract), 'id'), spellRangeTypeLookup: keyBy(getSpellRangeTypes(ruleDataContract), 'id'), statModifiersLookup: deriveStatModifiersLookup(ruleDataContract), statsLookup: keyBy(getStats(ruleDataContract), 'id'), statKeyLookup: deriveStatKeyLookup(ruleDataContract), stealthCheckTypeLookup: keyBy(getStealthCheckTypes(ruleDataContract), 'id'), vulnerabilityDamageAdjustments: deriveDamageAdjustmentsByType(DamageAdjustmentTypeEnum.VULNERABILITY, ruleDataContract), vehicleMovementLookup: keyBy(getVehicleMovementTypes(ruleDataStageOne), 'type'), versatileDieLookup: deriveVersatileDieLookup(ruleDataContract), weaponCategoryLookup: keyBy(getWeaponCategories(ruleDataContract), 'id'), weaponLookupByEntityId: keyBy(getWeapons(ruleDataContract), (weapon) => `${weapon.entityTypeId}-${weapon.id}`), weaponPropertyLookup: keyBy(getWeaponProperties(ruleDataContract), (weaponProperty) => weaponProperty.id) });
}
/**
 *
 * @param ruleData
 */
export function generateSourceData(ruleData) {
    const sources = getSources(ruleData);
    const sourceCategories = getSourceCategories(ruleData);
    return sources.map((data) => {
        const sourceCategory = sourceCategories.find((cat) => cat.id === data.sourceCategoryId);
        return Object.assign(Object.assign({}, data), { sourceCategory: sourceCategory ? sourceCategory : null });
    });
}
/**
 * @param sourceData
 */
export function generateSourceDataLookup(sourceData) {
    return keyBy(sourceData, 'id');
}
/**
 * @param sourceData
 */
export function generateSourceCategoryLookup(sourceCategories) {
    return keyBy(sourceCategories, 'id');
}
/**
 *
 * @param ruleData
 */
export function getDamageTypeOptions(ruleData) {
    return sortBy(getDamageTypes(ruleData), 'name').map((type) => ({
        label: type.name,
        value: type.id,
    }));
}
/**
 *
 * @param ruleData
 * @param useFullname
 */
export function getStatOptions(ruleData, useFullname = false) {
    return getStats(ruleData).map((stat) => ({
        label: useFullname ? stat.name : stat.key,
        value: stat.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getChallengeOptions(ruleData) {
    return getChallengeRatings(ruleData).map((challengeRating) => ({
        label: FormatUtils.renderChallengeRating(challengeRating.value),
        value: challengeRating.value,
    }));
}
/**
 *
 * @param ruleData
 */
export function getCreatureGroupGroupedOptions(ruleData) {
    const primaryGroups = [];
    const otherGroups = [];
    getCreatureGroups(ruleData).forEach((group) => {
        const groupInfo = getCreatureGroupInfo(group.id, ruleData);
        if (groupInfo) {
            if (groupInfo.isPrimary) {
                primaryGroups.push(group);
            }
            else {
                otherGroups.push(group);
            }
        }
    });
    const options = [
        ...orderBy(primaryGroups.map((group) => ({
            label: group.name,
            value: group.id,
        })), 'label'),
        ...otherGroups.map((group) => ({
            label: group.name,
            value: group.id,
        })),
    ];
    return options;
}
/**
 *
 * @param ruleData
 */
export function getMonsterTypeOptions(ruleData) {
    return getMonsterTypes(ruleData).map((monsterType) => ({
        label: monsterType.name,
        value: monsterType.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getCreatureSizeOptions(ruleData) {
    return getCreatureSizes(ruleData).map((size) => ({
        label: size.name,
        value: size.id,
    }));
}
/**
 *
 * @param ruleData
 * @param includeNonCharacterAlignments
 */
export function getAlignmentOptions(ruleData, includeNonCharacterAlignments = false) {
    const options = getAlignments(ruleData)
        .filter((alignment) => {
        if (includeNonCharacterAlignments && !alignment.availableToCharacter) {
            return true;
        }
        return alignment.availableToCharacter;
    })
        .map((alignment) => ({
        label: alignment.name,
        value: alignment.id,
    }));
    return orderBy(options, 'label');
}
/**
 *
 * @param ruleData
 */
export function getCreatureGroupOptions(ruleData) {
    const options = getCreatureGroups(ruleData).map((group) => ({
        label: group.name,
        value: group.id,
    }));
    return orderBy(options, 'label');
}
/**
 *
 * @param ruleData
 */
export function getAttackRangeTypeOptions(ruleData) {
    return getRangeTypes(ruleData).map((type) => ({
        label: type.name,
        value: type.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getDieTypeOptions(ruleData) {
    return getDiceValues(ruleData).map((dieValue) => ({
        label: FormatUtils.renderLocaleNumber(dieValue),
        value: dieValue,
    }));
}
/**
 *
 * @param ruleData
 */
export function getActivationTypeOptions(ruleData) {
    return getActivationTypes(ruleData).map((activationType) => ({
        label: activationType.name,
        value: activationType.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getSpellRangeTypeOptions(ruleData) {
    return getSpellRangeTypes(ruleData).map((spellRangeType) => ({
        label: spellRangeType.name,
        value: spellRangeType.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getAoeTypeOptions(ruleData) {
    return getAoeTypes(ruleData).map((aoeType) => ({
        label: aoeType.name,
        value: aoeType.id,
    }));
}
/**
 *
 * @param ruleData
 */
export function getAttackSubtypeOptions(ruleData) {
    return [
        {
            label: 'Natural',
            value: AttackSubtypeEnum.NATURAL,
        },
        {
            label: 'Unarmed Strike',
            value: AttackSubtypeEnum.UNARMED,
        },
    ];
}
/**
 *
 * @param ruleData
 */
export function getProficiencyLevelOptions(ruleData) {
    const levels = [
        ProficiencyLevelEnum.NONE,
        ProficiencyLevelEnum.HALF,
        ProficiencyLevelEnum.FULL,
        ProficiencyLevelEnum.EXPERT,
    ];
    return levels.map((level) => ({
        label: getProficiencyLevelName(level),
        value: level,
    }));
}
/**
 *
 * @param ruleData
 * @param excludeIds
 */
export function getArmorOptions(ruleData, excludeIds = []) {
    const filteredArmor = getArmor(ruleData).filter((item) => !excludeIds.includes(item.id));
    const sortedArmor = orderBy(filteredArmor, 'name');
    return sortedArmor.map((item) => ({
        label: item.name,
        value: item.id,
    }));
}
/**
 *
 * @param ruleData
 * @param excludeIds
 */
export function getWeaponOptions(ruleData, excludeIds = []) {
    const filteredWeapons = getWeapons(ruleData).filter((item) => !excludeIds.includes(item.id));
    return getWeaponCategories(ruleData).map((category) => {
        const categoryWeapons = filteredWeapons.filter((weapon) => weapon.categoryId === category.id);
        const orderedWeapons = orderBy(categoryWeapons, 'name');
        return {
            optGroupLabel: getWeaponCategoryName(category.id, ruleData),
            options: orderedWeapons.map((weapon) => ({
                label: weapon.name,
                value: weapon.id,
            })),
        };
    });
}
/**
 *
 * @param ruleData
 * @param excludeIds
 */
export function getLanguageOptions(ruleData, excludeIds = [], entityRestrictionData) {
    const filtered = getLanguages(ruleData).filter((item) => {
        // If restriction data is provided, filter out sources not in the activeSourceLookup
        if ((entityRestrictionData === null || entityRestrictionData === void 0 ? void 0 : entityRestrictionData.activeSourceLookup) && item.rpgSourceId) {
            return !excludeIds.includes(item.id) && has(entityRestrictionData.activeSourceLookup, item.rpgSourceId);
        }
        return !excludeIds.includes(item.id);
    });
    const sorted = orderBy(filtered, 'name');
    return sorted.map((item) => ({
        label: item.name,
        value: item.id,
    }));
}
/**
 *
 * @param ruleData
 * @param excludeIds
 */
export function getToolOptions(ruleData, excludeIds = []) {
    const filtered = getTools(ruleData).filter((item) => !excludeIds.includes(item.id));
    const sorted = orderBy(filtered, 'name');
    return sorted.map((item) => ({
        label: item.name,
        value: item.id,
    }));
}
