import { TypeScriptUtils } from '../../../utils';
import { ConditionAccessors } from '../../Condition';
import { DamageAdjustmentTypeEnum, DefenseAdjustmentTypeEnum } from '../../Core';
import { FormatUtils } from '../../Format';
import { HelperUtils } from '../../Helper';
import { ModifierAccessors } from '../../Modifier';
import { RuleDataAccessors, RuleDataUtils } from '../../RuleData';
import { deriveCustomConditionDefenseAdjustmentDataOrigin, deriveCustomDefenseAdjustmentDataOrigin } from '../derivers';
import { isImmunityDamageAdjustment, isResistanceDamageAdjustment, isVulnerabilityDamageAdjustment, } from '../validators';
/**
 *
 * @param customDamageAdjustments
 * @param modifiers
 * @param ruleData
 */
export function generateActiveResistances(customDamageAdjustments, modifiers, ruleData) {
    const damageAdjustments = [];
    customDamageAdjustments.forEach((adjustment) => {
        damageAdjustments.push({
            name: adjustment.name === null ? '' : adjustment.name,
            dataOrigin: deriveCustomDefenseAdjustmentDataOrigin(adjustment),
            isCustom: true,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(adjustment.name),
        });
    });
    modifiers.forEach((modifier) => {
        const damageAdjustment = RuleDataUtils.getDamageAdjustmentBySlug(ModifierAccessors.getSubType(modifier), DamageAdjustmentTypeEnum.RESISTANCE, ruleData);
        let name = '';
        if (damageAdjustment) {
            name = damageAdjustment.name === null ? '' : damageAdjustment.name;
        }
        else {
            const subtypeName = ModifierAccessors.getFriendlySubtypeName(modifier);
            name = subtypeName === null ? '' : subtypeName;
        }
        damageAdjustments.push({
            name,
            dataOrigin: ModifierAccessors.getDataOrigin(modifier),
            isCustom: false,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(name),
        });
    });
    return damageAdjustments;
}
/**
 *
 * @param customDamageAdjustments
 * @param customConditionAdjustments
 * @param modifiers
 * @param ruleData
 */
export function generateActiveImmunities(customDamageAdjustments, customConditionAdjustments, modifiers, ruleData) {
    const defenseAdjustments = [];
    customDamageAdjustments.forEach((adjustment) => {
        defenseAdjustments.push({
            name: adjustment.name === null ? '' : adjustment.name,
            dataOrigin: deriveCustomDefenseAdjustmentDataOrigin(adjustment),
            isCustom: true,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(adjustment.name),
        });
    });
    customConditionAdjustments.forEach((adjustment) => {
        defenseAdjustments.push({
            name: ConditionAccessors.getName(adjustment),
            dataOrigin: deriveCustomConditionDefenseAdjustmentDataOrigin(adjustment),
            isCustom: true,
            type: DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT,
            slug: FormatUtils.slugify(ConditionAccessors.getName(adjustment)),
        });
    });
    modifiers.forEach((modifier) => {
        const damageAdjustment = RuleDataUtils.getDamageAdjustmentBySlug(ModifierAccessors.getSubType(modifier), DamageAdjustmentTypeEnum.IMMUNITY, ruleData);
        if (damageAdjustment) {
            defenseAdjustments.push({
                name: damageAdjustment.name === null ? '' : damageAdjustment.name,
                dataOrigin: ModifierAccessors.getDataOrigin(modifier),
                isCustom: false,
                type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
                slug: FormatUtils.slugify(damageAdjustment.name),
            });
            return;
        }
        const condition = RuleDataUtils.getConditionBySlug(ModifierAccessors.getSubType(modifier), ruleData);
        if (condition) {
            defenseAdjustments.push({
                name: ConditionAccessors.getName(condition),
                dataOrigin: ModifierAccessors.getDataOrigin(modifier),
                isCustom: false,
                type: DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT,
                slug: ConditionAccessors.getSlug(condition),
            });
            return;
        }
        const subtypeName = ModifierAccessors.getFriendlySubtypeName(modifier);
        defenseAdjustments.push({
            name: subtypeName === null ? '' : subtypeName,
            dataOrigin: ModifierAccessors.getDataOrigin(modifier),
            isCustom: false,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(ModifierAccessors.getFriendlySubtypeName(modifier)),
        });
    });
    return defenseAdjustments;
}
/**
 *
 * @param customDamageAdjustments
 * @param modifiers
 * @param ruleData
 */
export function generateActiveVulnerabilities(customDamageAdjustments, modifiers, ruleData) {
    const damageAdjustments = [];
    customDamageAdjustments.forEach((adjustment) => {
        damageAdjustments.push({
            name: adjustment.name === null ? '' : adjustment.name,
            dataOrigin: deriveCustomDefenseAdjustmentDataOrigin(adjustment),
            isCustom: true,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(adjustment.name),
        });
    });
    modifiers.forEach((modifier) => {
        let name;
        const damageAdjustment = RuleDataUtils.getDamageAdjustmentBySlug(ModifierAccessors.getSubType(modifier), DamageAdjustmentTypeEnum.VULNERABILITY, ruleData);
        if (damageAdjustment) {
            name = damageAdjustment.name;
        }
        else {
            name = ModifierAccessors.getFriendlySubtypeName(modifier);
        }
        damageAdjustments.push({
            name,
            dataOrigin: ModifierAccessors.getDataOrigin(modifier),
            isCustom: false,
            type: DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT,
            slug: FormatUtils.slugify(name),
        });
    });
    return damageAdjustments;
}
/**
 *
 * @param ruleData
 */
export function generateResistanceData(ruleData) {
    return RuleDataAccessors.getDamageAdjustments(ruleData).filter(isResistanceDamageAdjustment);
}
/**
 *
 * @param ruleData
 */
export function generateVulnerabilityData(ruleData) {
    return RuleDataAccessors.getDamageAdjustments(ruleData).filter(isVulnerabilityDamageAdjustment);
}
/**
 *
 * @param ruleData
 */
export function generateImmunityData(ruleData) {
    return RuleDataAccessors.getDamageAdjustments(ruleData).filter(isImmunityDamageAdjustment);
}
/**
 *
 * @param customDamageAdjustments
 */
export function generateCustomResistanceDamageAdjustments(customDamageAdjustments) {
    return customDamageAdjustments.filter(isResistanceDamageAdjustment);
}
/**
 *
 * @param customDamageAdjustments
 */
export function generateCustomImmunityDamageAdjustments(customDamageAdjustments) {
    return customDamageAdjustments.filter(isImmunityDamageAdjustment);
}
/**
 *
 * @param customDamageAdjustments
 */
export function generateCustomVulnerabilityDamageAdjustments(customDamageAdjustments) {
    return customDamageAdjustments.filter(isVulnerabilityDamageAdjustment);
}
/**
 *
 * @param customDefenseAdjustments
 * @param ruleData
 */
export function generateCustomDamageAdjustments(customDefenseAdjustments, ruleData) {
    const damageAdjustmentLookup = RuleDataAccessors.getDamageAdjustmentsLookup(ruleData);
    return customDefenseAdjustments
        .filter((adjustment) => adjustment.type === DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT)
        .map((adjustment) => {
        const damageAdjustmentData = HelperUtils.lookupDataOrFallback(damageAdjustmentLookup, adjustment.adjustmentId);
        if (damageAdjustmentData !== null) {
            return Object.assign(Object.assign({}, damageAdjustmentData), { source: adjustment.source === null ? '' : adjustment.source });
        }
        return null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param customDefenseAdjustments
 * @param ruleData
 */
export function generateCustomConditionAdjustments(customDefenseAdjustments, ruleData) {
    const conditionDataLookup = RuleDataAccessors.getConditionLookup(ruleData);
    return customDefenseAdjustments
        .filter((adjustment) => adjustment.type === DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT)
        .map((adjustment) => {
        const conditionData = HelperUtils.lookupDataOrFallback(conditionDataLookup, adjustment.adjustmentId);
        if (conditionData !== null) {
            return Object.assign(Object.assign({}, conditionData), { source: adjustment.source === null ? '' : adjustment.source });
        }
        return null;
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
