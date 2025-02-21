import { canAttune, isAttuned, getEquippedEntityId, isEquipped, hasProficiency, isOffhand, getDefinitionEntityTypeId, } from './accessors';
import { CUSTOM_ITEM_DEFINITION_ENTITY_TYPE_ID } from './constants';
import { isGearContract, hasItemWeaponBehaviors, isWeaponContract, isAmmunition, isArmorContract, isShield, } from './utils';
/**
 *
 * @param item
 */
export function validateIsWeaponLike(item) {
    if (isGearContract(item) && hasItemWeaponBehaviors(item)) {
        return true;
    }
    if (isWeaponContract(item) && !isAmmunition(item)) {
        return true;
    }
    return false;
}
/**
 *
 * @param item
 */
export function isNonProficientEquippedArmorItem(item) {
    return isArmorContract(item) && !!isEquipped(item) && !hasProficiency(item);
}
/**
 *
 * @param item
 */
export function isEquippedMainhandWeapon(item) {
    return isWeaponContract(item) && !isOffhand(item) && !!isEquipped(item);
}
/**
 *
 * @param item
 */
export function isEquippedOffhandWeapon(item) {
    return isWeaponContract(item) && isOffhand(item) && !!isEquipped(item);
}
/**
 *
 * @param item
 */
export function isEquippedShield(item) {
    return isArmorContract(item) && isShield(item) && !!isEquipped(item);
}
/**
 *
 * @param item
 */
export function isEquippedNonShieldArmor(item) {
    return isArmorContract(item) && !isShield(item) && !!isEquipped(item);
}
/**
 *
 * @param item
 */
export function validateCanContributeActions(item) {
    if (canAttune(item)) {
        return !!isAttuned(item);
    }
    return true;
}
/**
 *
 * @param item
 * @param characterId
 */
export function isEquippedToCurrentCharacter(item, characterId) {
    return getEquippedEntityId(item) === characterId;
}
/**
 *
 * @param item
 */
export function isCustomItem(item) {
    return getDefinitionEntityTypeId(item) === CUSTOM_ITEM_DEFINITION_ENTITY_TYPE_ID;
}
