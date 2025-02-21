import { TypeScriptUtils } from '../../utils';
import { ConditionLevelGenerators } from '../ConditionLevel';
import { DataOriginDataInfoKeyEnum, DataOriginTypeEnum } from '../DataOrigin';
import { ModifierGenerators } from '../Modifier';
import { RuleDataUtils } from '../RuleData';
import { getContractId, getContractLevel, getDefinitionLevels, getEntityTypeId, getId, getModifiers, getUniqueKey, } from './accessors';
/**
 *
 * @param conditions
 * @param modifierLookup
 * @param ruleData
 */
export function generateConditions(conditions, modifierLookup, ruleData) {
    return conditions
        .map((characterCondition) => generateCondition(characterCondition, modifierLookup, ruleData))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param condition
 * @param modifierLookup
 * @param ruleData
 */
export function generateCondition(condition, modifierLookup, ruleData) {
    const baseCondition = RuleDataUtils.getConditionInfo(getContractId(condition), ruleData);
    if (baseCondition === null) {
        return null;
    }
    const modifiers = ModifierGenerators.generateModifiers(getId(baseCondition), getEntityTypeId(baseCondition), modifierLookup, DataOriginTypeEnum.CONDITION, baseCondition);
    let allModifiers = [];
    let levels = [];
    if (baseCondition.definition) {
        const levelModifiers = [];
        const foundLevels = getDefinitionLevels(baseCondition).map((level) => {
            let conditionLevel = null;
            if (level) {
                conditionLevel = ConditionLevelGenerators.generateConditionLevel(level, baseCondition, modifierLookup);
                levelModifiers.push(...conditionLevel.modifiers);
            }
            return conditionLevel;
        });
        levels = foundLevels.filter(TypeScriptUtils.isNotNullOrUndefined);
        allModifiers = [...modifiers, ...levelModifiers];
    }
    return Object.assign(Object.assign({}, baseCondition), { level: getContractLevel(condition), modifiers: allModifiers, levels });
}
/**
 *
 * @param conditions
 */
export function generateConditionModifiers(conditions) {
    const modifiers = [];
    if (conditions.length === 0) {
        return modifiers;
    }
    conditions.forEach((condition) => {
        modifiers.push(...getModifiers(condition));
    });
    return modifiers;
}
/**
 *
 * @param conditions
 */
export function generateRefConditionData(conditions) {
    let data = {};
    conditions.forEach((condition) => {
        data[getUniqueKey(condition)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: condition,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    });
    return data;
}
