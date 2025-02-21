import { StealthCheckTypeEnum } from '../Core';
/**
 *
 * @param item
 */
export function getDefinition(item) {
    return item.definition;
}
/**
 *
 * @param item
 */
export function getUniqueKey(item) {
    return `${getMappingId(item)}-${getMappingEntityTypeId(item)}`;
}
/**
 *
 * @param item
 */
export function getDefinitionName(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getId(item) {
    return getDefinitionId(item);
}
/**
 *
 * @param item
 */
export function getDefinitionId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param item
 */
export function getEntityTypeId(item) {
    return getDefinitionEntityTypeId(item);
}
/**
 *
 * @param item
 */
export function getDefinitionEntityTypeId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param item
 */
export function getDefintionFilterType(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.filterType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getArmorTypeId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.armorTypeId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getGearTypeId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.gearTypeId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getBaseItemId(item) {
    return getDefinitionBaseItemId(item);
}
/**
 *
 * @param item
 */
export function getDefinitionBaseItemId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.baseItemId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getDefinitionAvatarUrl(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.avatarUrl) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getName(item) {
    return item.name;
}
/**
 *
 * @param item
 */
export function getDescription(item) {
    return getDefinitionDescription(item);
}
/**
 *
 * @param item
 */
export function getDefinitionDescription(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getLargeImageUrl(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.largeAvatarUrl) !== null && _b !== void 0 ? _b : null;
}
export function getSpells(item) {
    return item.spells;
}
/**
 *
 * @param item
 */
export function getTags(item) {
    return getDefinitionTags(item);
}
/**
 *
 * @param item
 */
export function getDefinitionTags(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.tags) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param item
 */
export function getVersion(item) {
    return getDefinitionVersion(item);
}
/**
 *
 * @param item
 */
export function getDefinitionVersion(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function hasProficiency(item) {
    return item.proficiency;
}
/**
 *
 * @param item
 */
export function getMappingId(item) {
    return item.id;
}
/**
 *
 * @param item
 */
export function getContainerEntityId(item) {
    return item.containerEntityId;
}
/**
 *
 * @param item
 */
export function getContainerEntityTypeId(item) {
    return item.containerEntityTypeId;
}
/**
 *
 * @param item
 */
export function getContainerDefinitionKey(item) {
    return item.containerDefinitionKey;
}
/**
 *
 * @param item
 */
export function getMappingEntityTypeId(item) {
    return item.entityTypeId;
}
/**
 *
 * @param item
 */
export function getDefinitionKey(item) {
    return item.definitionKey;
}
/**
 *
 * @param item
 */
export function getDisplayAsAttack(item) {
    return item.displayAsAttack;
}
/**
 *
 * @param item
 */
export function getChargesUsed(item) {
    return item.chargesUsed;
}
/**
 *
 * @param item
 */
export function getLimitedUse(item) {
    return item.limitedUse;
}
/**
 *
 * @param item
 */
export function isCustomized(item) {
    return item.isCustomized;
}
/**
 *
 * @param item
 */
export function isEquipped(item) {
    return item.equipped;
}
/**
 *
 * @param item
 */
export function canOffhand(item) {
    return item.canOffhand;
}
/**
 *
 * @param item
 */
export function getCategoryId(item) {
    return getDefinitionCategoryId(item);
}
/**
 *
 * @param item
 */
export function getDefinitionCategoryId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.categoryId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function isConsumable(item) {
    return getDefinitionIsConsumable(item);
}
/**
 *
 * @param item
 */
export function getDefinitionIsConsumable(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.isConsumable) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function getDefinitionIsHomebrew(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function isMagic(item) {
    return item.isMagic;
}
/**
 *
 * @param item
 */
export function getDefinitionMagic(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.magic) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function isStackable(item) {
    return getDefinitionIsStackable(item);
}
/**
 *
 * @param item
 */
export function getDefinitionIsStackable(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.stackable) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function canAttune(item) {
    return item.canAttune;
}
/**
 *
 * @param item
 */
export function getDefinitionCanAttune(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.canAttune) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function getLevelInfusionGranted(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.levelInfusionGranted) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getAttunementDescription(item) {
    return getDefinitionAttunementDescription(item);
}
/**
 *
 * @param item
 */
export function getDefinitionAttunementDescription(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.attunementDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function canEquip(item) {
    return item.canEquip;
}
/**
 *
 * @param item
 */
export function getDefinitionCanEquip(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.canEquip) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 * @returns boolean
 */
export function getDefinitionIsContainer(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.isContainer) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 * @returns boolean
 */
export function isContainer(item) {
    return getDefinitionIsContainer(item);
}
/**
 *
 * @param item
 */
export function isAttuned(item) {
    return item.isAttuned;
}
/**
 *
 * @param item
 */
export function isPack(item) {
    if (item.definition) {
        return isDefinitionPack(item.definition);
    }
    return false;
}
/**
 *
 * @param itemDefinition
 */
export function isDefinitionPack(itemDefinition) {
    return itemDefinition.isPack;
}
/**
 *
 * @param item
 */
export function getDefinitionCost(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.cost) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function isMonkWeapon(item) {
    return getDefinitionIsMonkWeapon(item);
}
/**
 *
 * @param item
 */
export function getDefinitionIsMonkWeapon(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.isMonkWeapon) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function getItemWeaponBehaviors(item) {
    return getDefinitionWeaponBehaviors(item);
}
/**
 *
 * @param item
 */
export function getDefinitionWeaponBehaviors(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.weaponBehaviors) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param item
 */
export function getArmorDefinitionAc(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.armorClass) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getItemRequiredStr(item) {
    return getDefinitionStrengthRequirement(item);
}
/**
 *
 * @param item
 */
export function getAttackType(item) {
    return getDefinitionAttackType(item);
}
/**
 *
 * @param item
 */
export function getDefinitionAttackType(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.attackType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getBaseTypeId(item) {
    return getDefinitionBaseTypeId(item);
}
/**
 *
 * @param item
 */
export function getDefinitionBaseTypeId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.baseTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param item
 */
export function getType(item) {
    return item.type;
}
/**
 *
 * @param item
 */
export function getReach(item) {
    return item.reach;
}
/**
 *
 * @param item
 */
export function getRange(item) {
    return getDefinitionRange(item);
}
/**
 *
 * @param item
 */
export function getDefinitionRange(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.range) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getLongRange(item) {
    return getDefinitionLongRange(item);
}
/**
 *
 * @param item
 */
export function getDefinitionLongRange(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.longRange) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getVersatileDamage(item) {
    return item.versatileDamage;
}
/**
 *
 * @param item
 */
export function getAdditionalDamages(item) {
    return item.additionalDamages;
}
/**
 *
 * @param item
 */
export function getFixedDamage(item) {
    return getDefinitionFixedDamage(item);
}
/**
 *
 * @param item
 */
export function getDefinitionFixedDamage(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.fixedDamage) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getDefinitionGrantedModifiers(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.grantedModifiers) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param item
 */
export function isDedicatedWeapon(item) {
    return item.isDedicatedWeapon;
}
/**
 *
 * @param item
 */
export function canBeDedicatedWeapon(item) {
    return item.canBeDedicatedWeapon;
}
/**
 *
 * @param item
 */
export function isHexWeapon(item) {
    return item.isHexWeapon;
}
/**
 *
 * @param item
 */
export function canHexWeapon(item) {
    return item.canHexWeapon;
}
/**
 *
 * @param item
 */
export function isPactWeapon(item) {
    return item.isPactWeapon;
}
/**
 *
 * @param item
 */
export function canPactWeapon(item) {
    return item.canPactWeapon;
}
/**
 *
 * @param item
 */
export function hexWeaponEnabled(item) {
    return item.hexWeaponEnabled;
}
/**
 *
 * @param item
 */
export function pactWeaponEnabled(item) {
    return item.pactWeaponEnabled;
}
/**
 *
 * @param item
 */
export function getMasteryName(item) {
    return item.masteryName;
}
/**
 *
 * @param item
 */
export function getDefinitionStealthCheck(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.stealthCheck) !== null && _b !== void 0 ? _b : StealthCheckTypeEnum.NONE;
}
/**
 *
 * @param item
 */
export function getStealthCheck(item) {
    return item.stealthCheck;
}
/**
 *
 * @param item
 */
export function getStrengthRequirement(item) {
    return getDefinitionStrengthRequirement(item);
}
/**
 *
 * @param item
 */
export function getDefinitionStrengthRequirement(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.strengthRequirement) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getToHit(item) {
    return item.toHit;
}
/**
 *
 * @param item
 */
export function getDefinitionDamage(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.damage) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getDamage(item) {
    return item.damage;
}
/**
 *
 * @param item
 */
export function getDamageType(item) {
    return item.damageType;
}
/**
 *
 * @param item
 */
export function getDefinitionDamageType(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.damageType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getBaseArmorName(item) {
    return getDefinitionBaseArmorName(item);
}
/**
 *
 * @param item
 */
export function getDefinitionBaseArmorName(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.baseArmorName) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getSubType(item) {
    return getDefinitionSubType(item);
}
/**
 *
 * @param item
 */
export function getDefinitionSubType(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.subType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getRarity(item) {
    return getDefinitionRarity(item);
}
/**
 *
 * @param item
 */
export function getDefinitionRarity(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.rarity) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getQuantity(item) {
    return item.quantity;
}
/**
 *
 * @param item
 */
export function getBundleSize(item) {
    return getDefinitionBundleSize(item);
}
/**
 *
 * @param item
 */
export function getDefinitionBundleSize(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.bundleSize) !== null && _b !== void 0 ? _b : 1;
}
/**
 *
 * @param item
 */
export function getWeightDefinition(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.weight) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param item
 */
export function getDefinitionCapacity(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.capacity) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getDefinitionCapacityWeight(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.capacityWeight) !== null && _b !== void 0 ? _b : 0;
}
/**
 *
 * @param item
 */
export function getDefinitionWeightMultiplier(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.weightMultiplier) !== null && _b !== void 0 ? _b : 1;
}
/**
 *
 * @param item
 */
export function getCapacity(item) {
    return getDefinitionCapacity(item);
}
/**
 *
 * @param item
 */
export function getCapacityWeight(item) {
    return item.capacityWeight;
}
/**
 *
 * @param item
 */
export function getWeightMultiplier(item) {
    return getDefinitionWeightMultiplier(item);
}
/**
 *
 * @param item
 */
export function getDefinitionSnippet(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 * @param item
 */
export function isOffhand(item) {
    return item.isOffhand;
}
/**
 * @param item
 */
export function isSilvered(item) {
    return item.isSilvered;
}
/**
 * @param item
 */
export function isAdamantine(item) {
    return item.isAdamantine;
}
/**
 * @param item
 */
export function getCost(item) {
    return item.cost;
}
/**
 * @param item
 */
export function getWeight(item) {
    return item.weight;
}
/**
 * @param item
 */
export function isDisplayAsAttack(item) {
    return item.isDisplayAsAttack;
}
/**
 *
 * @param item
 */
export function getNotes(item) {
    return item.notes;
}
/**
 *
 * @param item
 */
export function getCategoryInfo(item) {
    return item.categoryInfo;
}
/**
 *
 * @param item
 */
export function getDefinitionProperties(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.properties) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param item
 */
export function getProperties(item) {
    return item.properties;
}
/**
 *
 * @param item
 */
export function getBaseType(item) {
    return item.baseItemType;
}
/**
 *
 * @param item
 */
export function getModifiers(item) {
    return item.modifiers;
}
/**
 *
 * @param item
 */
export function getMetaItems(item) {
    return item.metaItems;
}
/**
 * @param item
 */
export function getArmorClass(item) {
    return item.armorClass;
}
/**
 * @param item
 */
export function getAvatarUrl(item) {
    return item.avatarUrl;
}
/**
 *
 * @param item
 */
export function getOriginalContract(item) {
    return item.originalContract;
}
/**
 *
 * @param item
 */
export function getInfusion(item) {
    return item.infusion;
}
/**
 *
 * @param item
 */
export function getDefinitionCanBeAddedToInventory(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.canBeAddedToInventory) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param item
 */
export function canBeAddedToInventory(item) {
    return getDefinitionCanBeAddedToInventory(item);
}
/**
 *
 * @param item
 */
export function getDefinitionGroupedId(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.groupedId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param item
 */
export function getGroupedId(item) {
    return getDefinitionGroupedId(item);
}
/**
 *
 * @param item
 */
export function getInfusionActions(item) {
    return item.infusionActions;
}
/**
 *
 * @param item
 */
export function getDefinitionSources(item) {
    var _a, _b;
    return (_b = (_a = item.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param item
 */
export function getSources(item) {
    return getDefinitionSources(item);
}
/**
 * @param item
 */
export function isCustom(item) {
    return item.isCustom;
}
/**
 *
 * @param item
 * @returns {number | null}
 */
export function getEquippedEntityId(item) {
    return item.equippedEntityId;
}
/**
 *
 * @param item
 * @returns {number | null}
 */
export function getEquippedEntityTypeId(item) {
    return item.equippedEntityTypeId;
}
/**
 *
 * @param item
 * @returns {CharacterCurrencyContract}
 */
export function getCurrency(item) {
    return item.currency;
}
export function isLegacy(item) {
    var _a, _b;
    return (_b = (_a = getDefinition(item)) === null || _a === void 0 ? void 0 : _a.isLegacy) !== null && _b !== void 0 ? _b : false;
}
export function getPrimarySourceCategoryId(item) {
    return item.primarySourceCategoryId;
}
export function getSecondarySourceCategoryIds(item) {
    return item.secondarySourceCategoryIds;
}
