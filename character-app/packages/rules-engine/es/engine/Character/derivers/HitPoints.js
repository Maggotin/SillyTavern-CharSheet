import { ItemAccessors, ItemValidators } from '../../Item';
import { LimitedUseDerivers } from '../../LimitedUse';
import { ModifierAccessors } from '../../Modifier';
import { ProtectionAvailabilityStatusEnum } from '../constants';
/**
 *
 * @param limitedUse
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 */
export function deriveProtectionSupplierAvailabilityStatus(limitedUse, abilityLookup, ruleData, proficiencyBonus) {
    let availabilityStatus = ProtectionAvailabilityStatusEnum.AVAILABLE;
    if (!LimitedUseDerivers.deriveHasUsesAvailable(limitedUse, abilityLookup, ruleData, proficiencyBonus)) {
        availabilityStatus = ProtectionAvailabilityStatusEnum.NO_LIMITED_USE_REMAINING;
    }
    return availabilityStatus;
}
/**
 *
 * @param item
 * @param modifier
 * @param limitedUse
 * @param abilityLookup
 * @param ruleData
 * @param proficiencyBonus
 * @param characterId
 */
export function deriveItemProtectionSupplierAvailabilityStatus(item, modifier, limitedUse, abilityLookup, ruleData, proficiencyBonus, characterId) {
    if (ItemAccessors.canEquip(item)) {
        const isEquippedToCurrentCharacter = ItemValidators.isEquippedToCurrentCharacter(item, characterId);
        if (!isEquippedToCurrentCharacter) {
            return ProtectionAvailabilityStatusEnum.ITEM_NOT_EQUIPPED;
        }
        if (ModifierAccessors.requiresAttunement(modifier) && !ItemAccessors.isAttuned(item)) {
            return ProtectionAvailabilityStatusEnum.ITEM_NOT_ATTUNED;
        }
    }
    if (!LimitedUseDerivers.deriveHasUsesAvailable(limitedUse, abilityLookup, ruleData, proficiencyBonus)) {
        return ProtectionAvailabilityStatusEnum.NO_LIMITED_USE_REMAINING;
    }
    return ProtectionAvailabilityStatusEnum.AVAILABLE;
}
