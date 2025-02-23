import { groupBy } from 'lodash';
import keyBy from 'lodash/keyBy';
import { ProficiencyLevelEnum } from '../Core';
import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
import { ModifierDerivers, ModifierGenerators, ModifierValidators } from '../Modifier';
import { RuleDataAccessors } from '../RuleData';
import { ValueHacks, ValueUtils } from '../Value';
import { getEntityTypeId, getId } from './accessors';
import { deriveAbilitySaveInfo, deriveHighestSetAbilityScore } from './derivers';
import { getBestAbilityScore, getStatScoreModifier } from './utils';
/**
 *
 * @param abilities
 */
export function generateAbilityLookup(abilities) {
    return keyBy(abilities, 'id');
}
/**
 *
 * @param abilities
 */
export function generateAbilityKeyLookup(abilities) {
    return keyBy(abilities, 'name');
}
/**
 *
 * @param stat
 * @param baseStats
 * @param bonusStats
 * @param overrideStats
 * @param raceModifiers
 * @param classesModifiers
 * @param miscModifiers
 * @param modifiers
 * @param proficiencyBonus
 * @param ruleData
 * @param modifierData
 */
export function generateBaseAbility(stat, baseStats, bonusStats, overrideStats, raceModifiers, classesModifiers, miscModifiers, modifiers, proficiencyBonus, ruleData, modifierData) {
    const statKey = stat.key === null ? '' : stat.key.toLowerCase();
    const abilityId = stat.id;
    const entityTypeId = stat.entityTypeId;
    const baseStat = baseStats.find((ability) => ability.id === abilityId);
    const bonusStat = bonusStats.find((ability) => ability.id === abilityId);
    const overrideStat = overrideStats.find((ability) => ability.id === abilityId);
    const racialBonus = ModifierDerivers.deriveTotalValue(ModifierGenerators.generateBonusStatScoreModifiers(raceModifiers, abilityId), modifierData);
    const classBonuses = ModifierDerivers.deriveTotalValue(ModifierGenerators.generateBonusStatScoreModifiers(classesModifiers, abilityId), modifierData);
    const miscBonus = ModifierDerivers.deriveTotalValue(ModifierGenerators.generateBonusStatScoreModifiers(miscModifiers, abilityId), modifierData);
    // generate all stat bonus suppliers
    const allStatBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusStatScoreModifier(modifier, abilityId));
    const allStatBonusSuppliers = generateAbilityScoreSupplierData(allStatBonusModifiers, 'bonus', modifierData);
    //generate setScore and all setScore suppliers
    const setScore = deriveHighestSetAbilityScore(abilityId, miscModifiers);
    const statSetScoreModifiers = modifiers.filter((modifier) => ModifierValidators.isValidSetStatScoreModifier(modifier, abilityId));
    const statSetScoreSuppliers = generateAbilityScoreSupplierData(statSetScoreModifiers, 'set', modifierData);
    //generate maxStatBonus and all maxStatBonus suppliers
    const statMaxBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusStatMaxModifier(modifier, abilityId));
    const statMaxBonus = ModifierDerivers.deriveTotalValue(statMaxBonusModifiers, modifierData);
    const statMaxBonusSuppliers = generateAbilityScoreSupplierData(statMaxBonusModifiers, 'max', modifierData);
    //generate stackingBonus and all stackingBonus suppliers
    const stackingBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isValidStackingBonusStatScoreModifier(modifier, abilityId));
    const stackingBonus = ModifierDerivers.deriveTotalValue(stackingBonusModifiers, modifierData);
    const stackingBonusSuppliers = generateAbilityScoreSupplierData(stackingBonusModifiers, 'stacking', modifierData);
    // calculate baseScore, otherBonus, overrideScore, totalBonusScore, finalScore, and modifier
    const baseScore = baseStat ? baseStat.value : null;
    const otherBonus = bonusStat ? bonusStat.value : null;
    let overrideScore = overrideStat ? overrideStat.value : null;
    if (overrideScore === 0) {
        overrideScore = null;
    }
    let totalBonusScore = null;
    let finalScore = null;
    let modifier = null;
    let maxStatScore = ruleData.basicMaxStatScore;
    if (baseScore !== null) {
        totalBonusScore = baseScore + racialBonus + classBonuses + miscBonus;
        maxStatScore = ruleData.basicMaxStatScore + statMaxBonus;
        totalBonusScore = Math.min(maxStatScore, totalBonusScore);
        totalBonusScore += otherBonus ? otherBonus : 0;
        finalScore = getBestAbilityScore(totalBonusScore, setScore, ruleData);
        if (overrideScore) {
            finalScore = overrideScore;
        }
        if (stackingBonus > 0) {
            finalScore = Math.min(maxStatScore, finalScore + stackingBonus);
        }
        finalScore = Math.max(ruleData.minStatScore, Math.min(ruleData.maxStatScore, finalScore));
        modifier = getStatScoreModifier(finalScore, ruleData);
    }
    return {
        label: stat.name,
        id: stat.id,
        entityTypeId,
        name: statKey,
        statKey,
        totalScore: finalScore,
        score: finalScore,
        maxStatScore,
        isMaxed: !!finalScore && finalScore >= maxStatScore,
        modifier,
        baseScore,
        racialBonus,
        classBonuses,
        miscBonus,
        setScore,
        stackingBonus,
        otherBonus,
        overrideScore,
        allStatBonusSuppliers,
        statSetScoreSuppliers,
        statMaxBonusSuppliers,
        stackingBonusSuppliers,
    };
}
export function generateAbilityScoreSupplierData(abilityModifiers, type, modifierData) {
    const supplierGroups = groupBy(abilityModifiers, (modifier) => `${modifier.componentId}-${modifier.componentTypeId}`);
    return Object.keys(supplierGroups).map((groupKey) => {
        var _a;
        const modifiers = supplierGroups[groupKey];
        const totalValue = ModifierDerivers.deriveTotalValue(modifiers, modifierData);
        let dataOrigin = (_a = modifiers[0]) === null || _a === void 0 ? void 0 : _a.dataOrigin;
        let expandedOriginRef = null;
        if (dataOrigin && dataOrigin.type === DataOriginTypeEnum.FEAT) {
            expandedOriginRef = DataOriginGenerators.generateDataOriginRef(dataOrigin.type, groupKey);
        }
        return {
            key: groupKey,
            dataOrigin,
            expandedOriginRef,
            type,
            value: totalValue,
        };
    });
}
/**
 *
 * @param abilityScore
 * @param proficiencyBonus
 * @param modifiers
 * @param valueLookup
 * @param modifierData
 */
export function generateAbility(abilityScore, proficiencyBonus, modifiers, valueLookup, modifierData) {
    const abilityId = getId(abilityScore);
    const abilityIdString = ValueHacks.hack__toString(abilityId);
    const abilityEntityTypeId = getEntityTypeId(abilityScore);
    const abilityEntityTypeIdString = ValueHacks.hack__toString(abilityEntityTypeId);
    const miscBonus = ValueUtils.getSavingThrowMiscBonusValue(valueLookup, abilityIdString, abilityEntityTypeIdString);
    const magicBonus = ValueUtils.getSavingThrowMagicBonusValue(valueLookup, abilityIdString, abilityEntityTypeIdString);
    const saveOverride = ValueUtils.getSavingThrowOverrideValue(valueLookup, abilityIdString, abilityEntityTypeIdString);
    const proficiencyLevelOverride = ValueUtils.getSavingThrowProficiencyLevelValue(valueLookup, abilityIdString, abilityEntityTypeIdString);
    const statBonusSaveModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusSaveModifier(modifier, abilityId));
    const statBonusSaveModifierTotal = ModifierDerivers.deriveTotalValue(statBonusSaveModifiers, modifierData, 1);
    const abilitySaveInfo = deriveAbilitySaveInfo(abilityScore, modifiers, proficiencyBonus, proficiencyLevelOverride, saveOverride, statBonusSaveModifierTotal, magicBonus, miscBonus);
    return Object.assign(Object.assign({}, abilityScore), abilitySaveInfo);
}
/**
 *
 * @param baseStats
 * @param bonusStats
 * @param overrideStats
 * @param raceModifiers
 * @param classesModifiers
 * @param miscModifiers
 * @param modifiers
 * @param proficiencyBonus
 * @param modifierData
 * @param ruleData
 * @param valueLookup
 */
export function generateAbilities(baseStats, bonusStats, overrideStats, raceModifiers, classesModifiers, miscModifiers, modifiers, proficiencyBonus, modifierData, ruleData, valueLookup) {
    const abilityScores = RuleDataAccessors.getStats(ruleData).map((stat) => generateBaseAbility(stat, baseStats, bonusStats, overrideStats, raceModifiers, classesModifiers, miscModifiers, modifiers, proficiencyBonus, ruleData, modifierData));
    const simulatedAbilities = abilityScores.map((ability) => (Object.assign(Object.assign({}, ability), { proficiency: false, proficiencyLevel: ProficiencyLevelEnum.NONE, isSaveProficiencyModified: false, isSaveModifierModified: false, save: 0, saveBonuses: 0, isSaveOverridden: false })));
    const abilityScoresLookup = generateAbilityLookup(simulatedAbilities);
    const updatedModifierData = Object.assign(Object.assign({}, modifierData), { abilityLookup: abilityScoresLookup });
    return abilityScores.map((abilityScore) => generateAbility(abilityScore, proficiencyBonus, modifiers, valueLookup, updatedModifierData));
}
