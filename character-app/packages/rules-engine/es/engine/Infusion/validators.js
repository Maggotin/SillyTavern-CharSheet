import { ItemAccessors } from '../Item';
import { getLevel } from './accessors';
import { InfusionItemDataRuleTypeEnum } from './constants';
/**
 *
 * @param rule
 * @param item
 */
export function validateItemByCost(rule, item) {
    if (rule.costMinimum === null) {
        return true;
    }
    return ItemAccessors.getCost(item) >= rule.costMinimum;
}
/**
 *
 * @param rule
 * @param item
 */
export function validateItemByRuleType(rule, item) {
    switch (rule.type) {
        case InfusionItemDataRuleTypeEnum.ARMOR_TYPE:
            return ItemAccessors.getArmorTypeId(item) === rule.entityId;
        case InfusionItemDataRuleTypeEnum.GEAR_TYPE:
            return ItemAccessors.getGearTypeId(item) === rule.entityId;
        case InfusionItemDataRuleTypeEnum.ITEM:
            return (ItemAccessors.getDefinitionId(item) === rule.entityId &&
                ItemAccessors.getDefinitionEntityTypeId(item) === rule.entityTypeId);
        case InfusionItemDataRuleTypeEnum.WEAPON_PROPERTY:
            return ItemAccessors.getProperties(item).some((property) => property.id === rule.entityId);
        case InfusionItemDataRuleTypeEnum.WEAPON_CATEGORY:
            return ItemAccessors.getCategoryId(item) === rule.entityId;
        default:
        // not implemented
    }
    return false;
}
/**
 *
 * @param rule
 * @param item
 */
export function validateItemByItemRule(rule, item) {
    return (ItemAccessors.getInfusion(item) === null &&
        !ItemAccessors.isMagic(item) &&
        validateItemByRuleType(rule, item) &&
        validateItemByCost(rule, item));
}
/**
 *
 * @param infusion
 * @param contextLevel
 */
export function validateIsAvailableByContextLevel(infusion, contextLevel) {
    const infusionLevel = getLevel(infusion);
    if (contextLevel !== null && infusionLevel !== null && infusionLevel <= contextLevel) {
        return true;
    }
    return false;
}
/**
 *
 * @param item
 * @param andRules
 */
export function validateItemByInfusionRules(item, andRules) {
    return andRules.every((andRule) => !!andRule.rules && andRule.rules.some((orRule) => validateItemByItemRule(orRule, item)));
}
