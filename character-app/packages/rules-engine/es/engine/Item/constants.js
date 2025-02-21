import { AdjustmentTypeEnum } from '../Value';
export var ItemBaseTypeEnum;
(function (ItemBaseTypeEnum) {
    ItemBaseTypeEnum["ARMOR"] = "ARMOR";
    ItemBaseTypeEnum["GEAR"] = "GEAR";
    ItemBaseTypeEnum["WEAPON"] = "WEAPON";
})(ItemBaseTypeEnum || (ItemBaseTypeEnum = {}));
export var ItemBaseTypeIdEnum;
(function (ItemBaseTypeIdEnum) {
    ItemBaseTypeIdEnum[ItemBaseTypeIdEnum["ARMOR"] = 701257905] = "ARMOR";
    ItemBaseTypeIdEnum[ItemBaseTypeIdEnum["GEAR"] = 2103445194] = "GEAR";
    ItemBaseTypeIdEnum[ItemBaseTypeIdEnum["WEAPON"] = 1782728300] = "WEAPON";
})(ItemBaseTypeIdEnum || (ItemBaseTypeIdEnum = {}));
export var ItemTypeEnum;
(function (ItemTypeEnum) {
    ItemTypeEnum[ItemTypeEnum["ARMOR"] = 1] = "ARMOR";
    ItemTypeEnum[ItemTypeEnum["ARTIFACT"] = 2] = "ARTIFACT";
    ItemTypeEnum[ItemTypeEnum["POTION"] = 3] = "POTION";
    ItemTypeEnum[ItemTypeEnum["RING"] = 4] = "RING";
    ItemTypeEnum[ItemTypeEnum["ROD"] = 5] = "ROD";
    ItemTypeEnum[ItemTypeEnum["SCROLL"] = 6] = "SCROLL";
    ItemTypeEnum[ItemTypeEnum["STAFF"] = 7] = "STAFF";
    ItemTypeEnum[ItemTypeEnum["WAND"] = 8] = "WAND";
    ItemTypeEnum[ItemTypeEnum["WEAPON"] = 9] = "WEAPON";
    ItemTypeEnum[ItemTypeEnum["WONDROUS_ITEM"] = 10] = "WONDROUS_ITEM";
})(ItemTypeEnum || (ItemTypeEnum = {}));
export var ArmorTypeEnum;
(function (ArmorTypeEnum) {
    ArmorTypeEnum[ArmorTypeEnum["LIGHT_ARMOR"] = 1] = "LIGHT_ARMOR";
    ArmorTypeEnum[ArmorTypeEnum["MEDIUM_ARMOR"] = 2] = "MEDIUM_ARMOR";
    ArmorTypeEnum[ArmorTypeEnum["HEAVY_ARMOR"] = 3] = "HEAVY_ARMOR";
    ArmorTypeEnum[ArmorTypeEnum["SHIELD"] = 4] = "SHIELD";
})(ArmorTypeEnum || (ArmorTypeEnum = {}));
export var WeaponTypeEnum;
(function (WeaponTypeEnum) {
    WeaponTypeEnum["AMMUNITION"] = "Ammunition";
})(WeaponTypeEnum || (WeaponTypeEnum = {}));
export var WeaponPropertyEnum;
(function (WeaponPropertyEnum) {
    WeaponPropertyEnum["VERSATILE"] = "Versatile";
    WeaponPropertyEnum["AMMUNITION"] = "Ammunition";
    WeaponPropertyEnum["LOADING"] = "Loading";
    WeaponPropertyEnum["TWO_HANDED"] = "Two-Handed";
    WeaponPropertyEnum["FINESSE"] = "Finesse";
    WeaponPropertyEnum["LIGHT"] = "Light";
    WeaponPropertyEnum["THROWN"] = "Thrown";
    WeaponPropertyEnum["HEAVY"] = "Heavy";
    WeaponPropertyEnum["RANGE"] = "Range";
    WeaponPropertyEnum["REACH"] = "Reach";
    WeaponPropertyEnum["SPECIAL"] = "Special";
})(WeaponPropertyEnum || (WeaponPropertyEnum = {}));
export var ItemRarityNameEnum;
(function (ItemRarityNameEnum) {
    ItemRarityNameEnum["COMMON"] = "Common";
    ItemRarityNameEnum["UNCOMMON"] = "Uncommon";
    ItemRarityNameEnum["RARE"] = "Rare";
    ItemRarityNameEnum["VERY_RARE"] = "Very Rare";
    ItemRarityNameEnum["LEGENDARY"] = "Legendary";
    ItemRarityNameEnum["ARTIFACT"] = "Artifact";
})(ItemRarityNameEnum || (ItemRarityNameEnum = {}));
//ONLY USED FOR INFUSIONS CURRENTLY
export const FUTURE_ITEM_DEFINITION_TYPE = 'magic-item';
export const MAGIC_ITEM_ENTITY_TYPE_ID = 112130694;
export const CUSTOM_ITEM_DEFINITION_ENTITY_TYPE_ID = 988229960;
export const ITEM_CUSTOMIZATION_ADJUSTMENT_TYPES = [
    AdjustmentTypeEnum.COST_OVERRIDE,
    AdjustmentTypeEnum.FIXED_VALUE_BONUS,
    AdjustmentTypeEnum.DISPLAY_AS_ATTACK,
    AdjustmentTypeEnum.IS_ADAMANTINE,
    AdjustmentTypeEnum.IS_OFFHAND,
    AdjustmentTypeEnum.IS_PROFICIENT,
    AdjustmentTypeEnum.IS_SILVER,
    AdjustmentTypeEnum.NAME_OVERRIDE,
    AdjustmentTypeEnum.NOTES,
    AdjustmentTypeEnum.TO_HIT_OVERRIDE,
    AdjustmentTypeEnum.TO_HIT_BONUS,
    AdjustmentTypeEnum.SAVE_DC_OVERRIDE,
    AdjustmentTypeEnum.SAVE_DC_BONUS,
    AdjustmentTypeEnum.WEIGHT_OVERRIDE,
    AdjustmentTypeEnum.CAPACITY_WEIGHT_OVERRIDE,
];
