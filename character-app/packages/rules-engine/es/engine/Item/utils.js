import { orderBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { ActionAccessors } from '../Action';
import { ContainerValidators } from '../Container';
import { ValueHacks, ValueUtils } from '../Value';
import { canAttune, getArmorTypeId, getAttackType, getBaseItemId, getBaseType, getBaseTypeId, getContainerDefinitionKey, getGearTypeId, getItemWeaponBehaviors, getMappingEntityTypeId, getMappingId, getMasteryName, getName, getPrimarySourceCategoryId, getProperties, getRarity, getSecondarySourceCategoryIds, isAttuned, isContainer, } from './accessors';
import { ArmorTypeEnum, ItemBaseTypeEnum, ItemBaseTypeIdEnum, ItemRarityNameEnum, ItemTypeEnum, } from './constants';
//TODO probably move alot of these to validators and validate naming :)
export function isShield(armor) {
    return getArmorTypeId(armor) === ArmorTypeEnum.SHIELD;
}
export function isAmmunition(item) {
    return isWeaponContract(item) && getBaseItemId(item) === null;
}
export function isStaff(item) {
    return getGearTypeId(item) === ItemTypeEnum.STAFF;
}
export function isRod(item) {
    return getGearTypeId(item) === ItemTypeEnum.ROD;
}
export function isWand(item) {
    return getGearTypeId(item) === ItemTypeEnum.WAND;
}
export function isAvailableToAttune(item) {
    return canAttune(item) && !isAttuned(item);
}
export function hasItemWeaponBehaviors(item) {
    return getItemWeaponBehaviors(item) && getItemWeaponBehaviors(item).length > 0;
}
/**
 * @param item
 */
export function isWeaponContract(item) {
    return getBaseTypeId(item) === ItemBaseTypeIdEnum.WEAPON;
}
/**
 * @param item
 */
export function isArmorContract(item) {
    return getBaseTypeId(item) === ItemBaseTypeIdEnum.ARMOR;
}
/**
 * @param item
 */
export function isGearContract(item) {
    return getBaseTypeId(item) === ItemBaseTypeIdEnum.GEAR;
}
/**
 * @param item
 */
export function isBaseWeapon(item) {
    return getBaseType(item) === ItemBaseTypeEnum.WEAPON;
}
/**
 * @param item
 */
export function isBaseArmor(item) {
    return getBaseType(item) === ItemBaseTypeEnum.ARMOR;
}
/**
 * @param item
 */
export function isBaseGear(item) {
    return getBaseType(item) === ItemBaseTypeEnum.GEAR;
}
/**
 *
 * @param item
 */
export function getWeaponBehaviorAttackTypes(item) {
    let attackTypes = [];
    if (isWeaponContract(item)) {
        return [];
    }
    const weaponBehaviors = getItemWeaponBehaviors(item);
    if (weaponBehaviors && weaponBehaviors.length) {
        attackTypes = weaponBehaviors.map((behavior) => behavior.attackType);
    }
    return attackTypes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param item
 * @param propertyName
 */
export function hasWeaponProperty(item, propertyName) {
    return !!getProperties(item).find((property) => property.name === propertyName);
}
/**
 *
 * @param item
 * @param weaponSpellDamageGroups
 */
export function getApplicableWeaponSpellDamageGroups(item, weaponSpellDamageGroups) {
    const behaviorAttackTypes = getWeaponBehaviorAttackTypes(item);
    return weaponSpellDamageGroups.filter((spellDamage) => (isWeaponContract(item) && spellDamage.attackTypeRange === getAttackType(item)) ||
        (spellDamage.attackTypeRange && behaviorAttackTypes.includes(spellDamage.attackTypeRange)));
}
/**
 *
 * @param item
 */
export function getRarityLevel(item) {
    switch (getRarity(item)) {
        case ItemRarityNameEnum.ARTIFACT:
            return 5;
        case ItemRarityNameEnum.LEGENDARY:
            return 4;
        case ItemRarityNameEnum.VERY_RARE:
            return 3;
        case ItemRarityNameEnum.RARE:
            return 2;
        case ItemRarityNameEnum.UNCOMMON:
            return 1;
        case ItemRarityNameEnum.COMMON:
        default:
            return 0;
    }
}
/**
 *
 * @param items
 * @param attunedItemCountMax
 */
export function getAttunedSlots(items, attunedItemCountMax) {
    const attunedSlots = [];
    for (let i = 0; i < attunedItemCountMax; i++) {
        attunedSlots.push(items[i] ? items[i] : null);
    }
    return attunedSlots;
}
export function sortInventoryItems(items, sortContainers) {
    const sortCriteria = [
        sortContainers ? (item) => isContainer(item) : () => { } /* no-op */,
        (item) => getRarityLevel(item),
        (item) => getName(item),
        (item) => getMappingId(item),
    ];
    const sortOrder = ['desc', 'desc', 'asc', 'asc'];
    return orderBy(items, sortCriteria, sortOrder);
}
export function isShared(item, containerLookup) {
    const containerDefinitionKey = getContainerDefinitionKey(item);
    return ContainerValidators.validateIsShared(containerDefinitionKey, containerLookup);
}
/**
 *
 * @param entityValueLookup
 * @param items
 */
export function getInventoryValuesMappings(entityValueLookup, items) {
    const itemValueLookups = items
        .map((item) => ValueUtils.getEntityData(entityValueLookup, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item))))
        .filter((lookup) => Object.keys(lookup).length > 0);
    const itemValuesContracts = [];
    for (let i = 0; i < itemValueLookups.length; i++) {
        itemValuesContracts.push(...Object.values(itemValueLookups[i]));
    }
    return itemValuesContracts;
}
/**
 *
 * @param item
 * @param actions
 */
export function getMasteryAction(item, actions) {
    var _a;
    const masteryName = getMasteryName(item);
    if (masteryName) {
        //Find the action where the actionName matches the masteryName (meaning the name is equal to the modifier friendly subtype name of the weapon mastery modifier type group)
        return ((_a = actions.find((action) => {
            return masteryName === ActionAccessors.getDefinitionName(action);
        })) !== null && _a !== void 0 ? _a : null);
    }
    return null;
}
export function getAllSourceCategoryIds(item) {
    return [getPrimarySourceCategoryId(item), ...getSecondarySourceCategoryIds(item)];
}
