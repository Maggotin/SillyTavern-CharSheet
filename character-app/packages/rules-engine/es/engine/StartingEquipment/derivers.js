import { StartingEquipmentRuleTypeEnum } from './constants';
/**
 *
 * @param ruleType
 */
export function deriveIsEquipmentStartingEquipmentRuleType(ruleType) {
    switch (ruleType) {
        case StartingEquipmentRuleTypeEnum.ARMOR:
        case StartingEquipmentRuleTypeEnum.ARMOR_TYPE:
        case StartingEquipmentRuleTypeEnum.GEAR:
        case StartingEquipmentRuleTypeEnum.GEAR_TYPE:
        case StartingEquipmentRuleTypeEnum.WEAPON:
        case StartingEquipmentRuleTypeEnum.WEAPON_TYPE:
            return true;
    }
    return false;
}
