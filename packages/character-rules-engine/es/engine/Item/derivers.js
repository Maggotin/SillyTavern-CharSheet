import { flatten, round, uniqBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { AbilityAccessors } from '../Ability';
import { ActionAccessors, ActionGenerators } from '../Action';
import { CharacterValidators } from '../Character';
import { AbilityStatEnum, AttackTypeRangeEnum, PreferenceEncumbranceTypeEnum, StealthCheckTypeEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { DefinitionHacks } from '../Definition';
import { HelperUtils } from '../Helper';
import { InfusionAccessors, InfusionTypeEnum } from '../Infusion';
import { LimitedUseAccessors } from '../LimitedUse';
import { ModifierAccessors, ModifierDerivers, ModifierValidators } from '../Modifier';
import { isValidWeaponMasteryModifier } from '../Modifier/validators';
import { RuleDataAccessors, RuleDataUtils } from '../RuleData';
import { AdjustmentTypeEnum, ValueAccessors, ValueHacks, ValueUtils, ValueValidators, } from '../Value';
import { getArmorDefinitionAc, getArmorTypeId, getAttackType, getBaseItemId, getBaseTypeId, getBundleSize, getCategoryId, getDefinitionAvatarUrl, getDefinitionCanAttune, getDefinitionCanEquip, getDefinitionCapacityWeight, getDefinitionCost, getDefinitionDamageType, getDefinitionId, getDefinitionMagic, getDefinitionName, getDefinitionProperties, getDefinitionStealthCheck, getDescription, getGearTypeId, getItemRequiredStr, getItemWeaponBehaviors, getLimitedUse, getMappingEntityTypeId, getMappingId, getModifiers, getQuantity, getSources, getWeight, getWeightDefinition, isEquipped, isMagic, isMonkWeapon, isStackable, } from './accessors';
import { ArmorTypeEnum, FUTURE_ITEM_DEFINITION_TYPE, ITEM_CUSTOMIZATION_ADJUSTMENT_TYPES, ItemBaseTypeEnum, ItemBaseTypeIdEnum, ItemTypeEnum, WeaponPropertyEnum, } from './constants';
import { hack__deriveStealthMediumArmorMasterShouldReturnStealthDefinition } from './hacks';
import { hasWeaponProperty, isArmorContract, isBaseArmor, isBaseGear, isBaseWeapon, hasItemWeaponBehaviors, isWeaponContract, isAmmunition, isGearContract, } from './utils';
import { isCustomItem, validateIsWeaponLike } from './validators';
/**
 *
 * @param item
 */
export function deriveArmorClass(item) {
    if (!isArmorContract(item)) {
        return null;
    }
    const definitionArmorClass = getArmorDefinitionAc(item);
    return deriveArmorModifierAcTotal(item) + (definitionArmorClass === null ? 0 : definitionArmorClass);
}
/**
 *
 * @param weapon
 * @param valueLookup
 */
export function deriveIsOffhand(weapon, valueLookup) {
    return !!ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.IS_OFFHAND, ValueHacks.hack__toString(getMappingId(weapon)), ValueHacks.hack__toString(getMappingEntityTypeId(weapon)));
}
/**
 *
 * @param weapon
 * @param valueLookup
 */
export function deriveIsSilvered(weapon, valueLookup) {
    return !!ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.IS_SILVER, ValueHacks.hack__toString(getMappingId(weapon)), ValueHacks.hack__toString(getMappingEntityTypeId(weapon)));
}
/**
 *
 * @param weapon
 * @param valueLookup
 */
export function deriveIsAdamantine(weapon, valueLookup) {
    return !!ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.IS_ADAMANTINE, ValueHacks.hack__toString(getMappingId(weapon)), ValueHacks.hack__toString(getMappingEntityTypeId(weapon)));
}
/**
 *
 * @param item
 * @param infusion
 */
export function deriveCanAttune(item, infusion) {
    if (infusion && InfusionAccessors.getType(infusion) !== InfusionTypeEnum.REPLICATE) {
        return InfusionAccessors.requiresAttunement(infusion);
    }
    return getDefinitionCanAttune(item);
}
/**
 *
 * @param item
 * @param infusion
 */
export function deriveCanEquip(item, infusion) {
    if (infusion !== null) {
        return true;
    }
    return getDefinitionCanEquip(item);
}
/**
 *
 * @param item
 * @param ruleData
 */
export function deriveCategoryInfo(item, ruleData) {
    if (!isWeaponContract(item)) {
        return null;
    }
    return RuleDataUtils.getWeaponCategoryInfo(getCategoryId(item), ruleData);
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveIsDisplayAsAttack(item, valueLookup) {
    const override = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.DISPLAY_AS_ATTACK, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    const defaultIsDisplayAsAttack = deriveDefaultIsDisplayAsAttack(item);
    return (defaultIsDisplayAsAttack && (override === null || override)) || !!override;
}
/**
 *
 * @param baseTypeId
 */
export function deriveBaseTypeNameFromId(baseTypeId) {
    switch (baseTypeId) {
        case ItemBaseTypeIdEnum.WEAPON:
            return 'Weapon';
        case ItemBaseTypeIdEnum.ARMOR:
            return 'Armor';
        case ItemBaseTypeIdEnum.GEAR:
            return 'Gear';
        default:
        // not implemented
    }
    return '';
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveCost(item, valueLookup) {
    const override = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.COST_OVERRIDE, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    const quantity = getQuantity(item);
    const bundleSize = getBundleSize(item);
    let costPerItem = getDefinitionCost(item);
    if (costPerItem === null) {
        costPerItem = 0;
    }
    if (override !== null) {
        costPerItem = override;
    }
    if (isStackable(item)) {
        costPerItem /= bundleSize === 0 ? 1 : bundleSize;
    }
    return round(costPerItem * quantity, 2);
}
/**
 *
 * @param item
 * @param globalModifiers
 */
export function deriveStealthCheck(item, globalModifiers) {
    if (!isArmorContract(item)) {
        return StealthCheckTypeEnum.NONE;
    }
    const itemModifiers = getModifiers(item);
    const definitionCheck = getDefinitionStealthCheck(item);
    if (definitionCheck === StealthCheckTypeEnum.DISADVANTAGE) {
        const filteredGlobalModifiers = globalModifiers.filter((modifier) => ModifierValidators.isStealthDisadvantageRemoveModifier(modifier));
        if (itemModifiers.find((modifier) => ModifierValidators.isStealthDisadvantageRemoveModifier(modifier)) ||
            filteredGlobalModifiers.length) {
            if (hack__deriveStealthMediumArmorMasterShouldReturnStealthDefinition(item, filteredGlobalModifiers)) {
                return definitionCheck;
            }
            return StealthCheckTypeEnum.NONE;
        }
    }
    return definitionCheck;
}
/**
 *
 * @param item
 * @param ruleData
 */
export function deriveAvatarUrl(item, ruleData) {
    let previewImageUrl = getDefinitionAvatarUrl(item);
    switch (getBaseTypeId(item)) {
        case ItemBaseTypeIdEnum.WEAPON:
            if (!previewImageUrl) {
                previewImageUrl = ruleData.defaultWeaponImageUrl;
            }
            break;
        case ItemBaseTypeIdEnum.ARMOR:
            if (!previewImageUrl) {
                previewImageUrl = ruleData.defaultArmorImageUrl;
            }
            break;
        case ItemBaseTypeIdEnum.GEAR:
            if (!previewImageUrl) {
                previewImageUrl = ruleData.defaultGearImageUrl;
            }
            break;
    }
    if (!previewImageUrl && isCustomItem(item)) {
        previewImageUrl = ruleData.defaultGearImageUrl;
    }
    if (previewImageUrl) {
        return previewImageUrl;
    }
    return '';
}
/**
 *
 * @param item
 */
export function deriveBaseType(item) {
    if (isArmorContract(item)) {
        return ItemBaseTypeEnum.ARMOR;
    }
    else if (isWeaponContract(item)) {
        return ItemBaseTypeEnum.WEAPON;
    }
    return ItemBaseTypeEnum.GEAR;
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveWeight(item, valueLookup) {
    const quantity = getQuantity(item);
    const bundleSize = getBundleSize(item);
    const isItemStackable = isStackable(item);
    const weight = getWeightDefinition(item);
    const weightOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.WEIGHT_OVERRIDE, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    let baseWeight = weight;
    if (weightOverride !== null) {
        baseWeight = weightOverride;
    }
    if (!baseWeight) {
        return 0;
    }
    if (isItemStackable) {
        if (quantity) {
            return round(baseWeight * (quantity / (bundleSize === 0 ? 1 : bundleSize)), 2);
        }
        return 0;
    }
    return baseWeight;
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveCapacityWeight(item, valueLookup) {
    const capacityWeight = getDefinitionCapacityWeight(item);
    const capacityOverride = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.CAPACITY_WEIGHT_OVERRIDE, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    return capacityOverride !== null && capacityOverride !== void 0 ? capacityOverride : capacityWeight;
}
/**
 *
 * @param items
 * @param initialValue
 */
export function deriveItemsWeightTotal(items, initialValue = 0) {
    return items.reduce((acc, item) => (acc += getWeight(item)), initialValue);
}
/**
 *
 * @param armor
 * @param modifiers
 * @param abilityLookup
 */
export function deriveArmorDexBonusMax(armor, modifiers, abilityLookup) {
    const armorTypeId = getArmorTypeId(armor);
    switch (armorTypeId) {
        case ArmorTypeEnum.MEDIUM_ARMOR:
            const dexAbility = abilityLookup[AbilityStatEnum.DEXTERITY];
            const dexAbilityScore = AbilityAccessors.getScore(dexAbility);
            if (dexAbility && dexAbilityScore !== null && dexAbilityScore >= 16) {
                const maxModifiers = modifiers.filter((modifier) => ModifierValidators.isSetAcMaxDexModifierModifier(modifier));
                const maxArmoredModifiers = modifiers.filter((modifier) => ModifierValidators.isSetAcMaxDexArmoredModifier(modifier));
                const maxModifierPossibilities = [];
                if (maxModifiers.length) {
                    maxModifierPossibilities.push(ModifierDerivers.deriveHighestModifierValue(maxModifiers));
                }
                if (maxArmoredModifiers.length) {
                    maxModifierPossibilities.push(ModifierDerivers.deriveHighestModifierValue(maxArmoredModifiers));
                }
                if (maxModifierPossibilities.length) {
                    return Math.max(...maxModifierPossibilities);
                }
            }
            return 2;
        case ArmorTypeEnum.HEAVY_ARMOR:
            return 0;
        default:
        // not implemented
    }
    return null;
}
/**
 *
 * @param modifiers
 */
export function deriveUnarmoredDexBonusMax(modifiers) {
    const maxDexModifiers = modifiers.filter((modifier) => ModifierValidators.isSetAcMaxDexModifierModifier(modifier));
    const maxDexUnarmoredModifiers = modifiers.filter((modifier) => ModifierValidators.isSetAcMaxDexUnarmoredModifier(modifier));
    const maxDexValuePossibilities = [];
    if (maxDexModifiers.length) {
        maxDexValuePossibilities.push(ModifierDerivers.deriveHighestModifierValue(maxDexModifiers));
    }
    if (maxDexUnarmoredModifiers.length) {
        maxDexValuePossibilities.push(ModifierDerivers.deriveHighestModifierValue(maxDexUnarmoredModifiers));
    }
    if (maxDexValuePossibilities.length) {
        return Math.max(...maxDexValuePossibilities);
    }
    return null;
}
/**
 *
 * @param localModifiers
 * @param globalModifiers
 * @param abilityLookup
 */
export function deriveUnarmoredDexBonus(localModifiers, globalModifiers, abilityLookup) {
    let bonus = 0;
    if (Object.keys(abilityLookup).length) {
        const dexMod = abilityLookup[AbilityStatEnum.DEXTERITY];
        bonus = AbilityAccessors.getModifier(dexMod) || 0;
    }
    const ignoreUnarmoredDexBonusModifiers = localModifiers.filter((modifier) => ModifierValidators.isIgnoreUnarmoredDexAcBonusModifier(modifier));
    if (ignoreUnarmoredDexBonusModifiers.length) {
        return 0;
    }
    const max = deriveUnarmoredDexBonusMax(globalModifiers);
    return Math.min(bonus, max === null ? Number.MAX_VALUE : max);
}
/**
 *
 * @param armor
 * @param dexModifier
 * @param modifiers
 * @param abilityLookup
 */
export function deriveArmorDexBonus(armor, dexModifier, modifiers, abilityLookup) {
    switch (getArmorTypeId(armor)) {
        case ArmorTypeEnum.HEAVY_ARMOR:
        case ArmorTypeEnum.SHIELD:
            return 0;
    }
    const armorDexBonusMax = deriveArmorDexBonusMax(armor, modifiers, abilityLookup);
    return armorDexBonusMax === null ? dexModifier : Math.min(armorDexBonusMax, dexModifier);
}
/**
 *
 * @param armor
 * @param dexModifier
 * @param modifiers
 * @param abilityLookup
 * @param ruleData
 */
export function deriveArmorAc(armor, dexModifier, modifiers, abilityLookup, ruleData) {
    let armorAc = ruleData.noArmorAcAmount;
    if (armor) {
        const definitionArmorClass = getArmorDefinitionAc(armor);
        if (definitionArmorClass !== null) {
            armorAc = definitionArmorClass;
        }
    }
    return armorAc + deriveArmorDexBonus(armor, dexModifier, modifiers, abilityLookup);
}
/**
 *
 * @param armorItems
 * @param dexModifier
 * @param modifiers
 * @param abilityLookup
 * @param ruleData
 */
export function deriveHighestArmorAcItem(armorItems, dexModifier, modifiers, abilityLookup, ruleData) {
    const armorAc = armorItems.map((item) => {
        const armorAc = deriveArmorAc(item, dexModifier, modifiers, abilityLookup, ruleData);
        const modifierAc = deriveArmorModifierAcTotal(item);
        const definitionArmorClass = getArmorDefinitionAc(item);
        return {
            item,
            armorClassWithDex: armorAc + modifierAc,
            armorClass: (definitionArmorClass === null ? 0 : definitionArmorClass) + modifierAc,
        };
    });
    return HelperUtils.getLast(armorAc, ['armorClassWithDex']);
}
/**
 *
 * @param equippedItems
 * @param strScore
 * @param preferences
 * @param modifiers
 */
export function deriveArmorSpeedAdjustmentAmount(equippedItems, strScore, preferences, modifiers) {
    if (preferences.encumbranceType === PreferenceEncumbranceTypeEnum.VARIANT ||
        modifiers.some(ModifierValidators.isIgnoreHeavyArmorSpeedReductionModifier)) {
        return 0;
    }
    const armorItems = equippedItems.filter(isArmorContract);
    const encumberingArmorItem = armorItems.find((item) => {
        const reqStr = getItemRequiredStr(item);
        return reqStr && reqStr > strScore;
    });
    if (encumberingArmorItem) {
        return -10;
    }
    return 0;
}
/**
 *
 * @param item
 * @param globalModifiers
 * @param isPactWeapon
 * @param valueLookupByType
 * @param ruleData
 */
export function deriveIsProficient(item, globalModifiers, isPactWeapon, valueLookupByType, ruleData) {
    if (isBaseWeapon(item)) {
        if (globalModifiers.filter((modifier) => ModifierValidators.isValidWeaponProficiencyModifier(modifier, item))
            .length) {
            return true;
        }
        if (valueLookupByType.hasOwnProperty(AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL)) {
            const charValues = valueLookupByType[AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL];
            if (charValues.find((charValue) => ValueAccessors.getValueIntId(charValue) === getBaseItemId(item))) {
                return true;
            }
        }
        return isPactWeapon;
    }
    if (isBaseArmor(item)) {
        if (globalModifiers.filter((modifier) => ModifierValidators.isValidArmorProficiencyModifier(modifier, item))
            .length) {
            return true;
        }
        if (valueLookupByType.hasOwnProperty(AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL)) {
            const charValues = valueLookupByType[AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL];
            if (charValues.find((charValue) => ValueAccessors.getValueIntId(charValue) === getBaseItemId(item))) {
                return true;
            }
        }
    }
    if (!isBaseGear(item)) {
        if (getModifiers(item).filter((modifier) => ModifierValidators.isProficiencySelfModifier(modifier)).length) {
            return true;
        }
    }
    return false;
}
/**
 *
 * @param item
 * @param modifiers
 */
export function deriveIsMonkWeapon(item, modifiers) {
    if (!isWeaponContract(item)) {
        return false;
    }
    const monkWeaponModifiers = modifiers.filter((modifier) => ModifierValidators.isMonkWeaponModifier(modifier));
    return (isMonkWeapon(item) ||
        !!monkWeaponModifiers.find((modifier) => ModifierValidators.isValidWeaponSubTypeModifier(modifier, item)));
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveIsCustomized(item, valueLookup) {
    return isCustomItem(item)
        ? false
        : ValueValidators.validateHasCustomization(ITEM_CUSTOMIZATION_ADJUSTMENT_TYPES, valueLookup, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
}
/**
 *
 * @param item
 */
export function deriveWeaponAdditionalDamage(item) {
    let additionalDamages = [];
    if (!isWeaponContract(item)) {
        return additionalDamages;
    }
    const itemModifiers = getModifiers(item);
    const additionalDamageModifiers = itemModifiers.filter((modifier) => ModifierValidators.isWeaponAdditionalDamageModifier(modifier));
    if (additionalDamageModifiers.length) {
        additionalDamages = additionalDamageModifiers.map((modifier) => {
            const damageValue = ModifierAccessors.getValue(modifier);
            return {
                damageType: ModifierAccessors.getFriendlySubtypeName(modifier),
                damage: damageValue ? damageValue : ModifierAccessors.getDice(modifier),
                info: ModifierAccessors.getRestriction(modifier),
                id: ModifierAccessors.getId(modifier),
            };
        });
    }
    return additionalDamages;
}
/**
 *
 * @param item
 * @param modifiers
 * @param ruleData
 */
export function deriveWeaponReach(item, modifiers, ruleData) {
    let reach = null;
    if (!isBaseWeapon(item)) {
        return reach;
    }
    if (getAttackType(item) === AttackTypeRangeEnum.MELEE) {
        const baseReach = ruleData.baseWeaponReach;
        const bonusReachModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusMeleeReachModifier(modifier));
        const bonusReachModifierTotal = ModifierDerivers.sumModifiers(bonusReachModifiers);
        let reachPropertyTotal = 0;
        if (hasWeaponProperty(item, WeaponPropertyEnum.REACH)) {
            reachPropertyTotal = ruleData.weaponPropertyReachDistance;
        }
        reach = baseReach + reachPropertyTotal + bonusReachModifierTotal;
    }
    return reach;
}
/**
 *
 * @param item
 * @param modifiers
 * @param martialArtsLevel
 */
export function deriveAvailableWeaponAbilities(item, modifiers, martialArtsLevel, isDedicatedWeapon, isPactWeapon, isHexWeapon) {
    const availableAbilities = [];
    const attackType = getAttackType(item);
    if (attackType === AttackTypeRangeEnum.MELEE || hasWeaponProperty(item, WeaponPropertyEnum.FINESSE)) {
        availableAbilities.push(AbilityStatEnum.STRENGTH);
    }
    if (attackType === AttackTypeRangeEnum.RANGED ||
        (martialArtsLevel !== null && (deriveIsMonkWeapon(item, modifiers) || isDedicatedWeapon)) ||
        hasWeaponProperty(item, WeaponPropertyEnum.FINESSE)) {
        availableAbilities.push(AbilityStatEnum.DEXTERITY);
    }
    if (isMagic(item)) {
        const magicItemBonusModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusMagicItemAttackWithStatModifier(modifier));
        magicItemBonusModifiers.forEach((modifier) => {
            const entityId = ModifierAccessors.getEntityId(modifier);
            if (entityId !== null && !availableAbilities.includes(entityId)) {
                availableAbilities.push(entityId);
            }
        });
    }
    //handle PactWeapon modifiers
    if (isPactWeapon) {
        //Get the enable Pact modifier
        const enablePactModifier = modifiers.find((modifier) => ModifierValidators.isEnablePactWeaponModifier(modifier));
        //Get the origin of the enable Pact Modifier
        const pactDataOrigin = enablePactModifier && ModifierAccessors.getDataOrigin(enablePactModifier);
        if (pactDataOrigin) {
            const replacementAbilities = deriveReplacementWeaponAbilities(modifiers, pactDataOrigin);
            replacementAbilities.forEach((ability) => {
                if (!availableAbilities.includes(ability)) {
                    availableAbilities.push(ability);
                }
            });
        }
    }
    //handle HexWeapon modifiers
    if (isHexWeapon) {
        //Get the enable Hex modifier
        const enableHexModifier = modifiers.find((modifier) => ModifierValidators.isEnableHexWeaponModifier(modifier));
        //Get the origin of the enable Hex Modifier
        const hexDataOrigin = enableHexModifier && ModifierAccessors.getDataOrigin(enableHexModifier);
        if (hexDataOrigin) {
            const replacementAbilities = deriveReplacementWeaponAbilities(modifiers, hexDataOrigin);
            replacementAbilities.forEach((ability) => {
                if (!availableAbilities.includes(ability)) {
                    availableAbilities.push(ability);
                }
            });
        }
    }
    return availableAbilities;
}
export function deriveReplacementWeaponAbilities(modifiers, enableModifierDataOrigin) {
    let replacementAbilities = [];
    const replaceAbilityModifiers = modifiers.filter((modifier) => ModifierValidators.isReplaceWeaponAbilityModifier(modifier));
    if (replaceAbilityModifiers.length > 0) {
        replaceAbilityModifiers.forEach((replaceAbilityModifier) => {
            var _a, _b;
            //get the id of the Ability Stat on the replace weapon ability modifier
            const statId = ModifierAccessors.getEntityId(replaceAbilityModifier);
            //get the data origin of the replace weapon ability modifier
            const dataOrigin = ModifierAccessors.getDataOrigin(replaceAbilityModifier);
            if (statId &&
                dataOrigin.type === enableModifierDataOrigin.type &&
                ((_a = dataOrigin.primary.definition) === null || _a === void 0 ? void 0 : _a.id) === ((_b = enableModifierDataOrigin.primary.definition) === null || _b === void 0 ? void 0 : _b.id) &&
                !replacementAbilities.includes(statId)) {
                replacementAbilities.push(statId);
            }
        });
    }
    return replacementAbilities;
}
/**
 *
 * @param item
 * @param modifiers
 */
export function deriveCanWeaponOffhand(item, modifiers) {
    if (!isBaseWeapon(item)) {
        return false;
    }
    const ignoreOffhandLightRestrictionsModifiers = modifiers.filter((modifier) => ModifierValidators.isIgnoreOffhandLightRestrictionsModifier(modifier));
    let canOffhand = false;
    if (hasWeaponProperty(item, WeaponPropertyEnum.LIGHT) || ignoreOffhandLightRestrictionsModifiers.length > 0) {
        canOffhand = true;
    }
    return canOffhand;
}
/**
 *
 * @param weapon
 */
export function deriveCanPactWeapon(weapon) {
    return getAttackType(weapon) === AttackTypeRangeEnum.MELEE;
}
/**
 *
 * @param item
 * @param proficiency
 */
export function deriveCanHexWeapon(item, proficiency) {
    if (!isBaseWeapon(item) && !validateIsWeaponLike(item)) {
        return false;
    }
    return proficiency && !hasWeaponProperty(item, WeaponPropertyEnum.TWO_HANDED);
}
/**
 *
 * @param item
 * @param proficiency
 */
export function deriveCanBeDedicatedWeapon(item, proficiency) {
    if (!isBaseWeapon(item) && !validateIsWeaponLike(item)) {
        return false;
    }
    return (proficiency &&
        !hasWeaponProperty(item, WeaponPropertyEnum.HEAVY) &&
        !hasWeaponProperty(item, WeaponPropertyEnum.SPECIAL));
}
/**
 *
 * @param item
 * @param modifiers
 */
export function deriveMasteryName(item, modifiers) {
    if (getBaseTypeId(item) !== ItemBaseTypeIdEnum.WEAPON) {
        return null;
    }
    //get modifiers that are weaponmastery
    const masteryModifiers = modifiers.filter((modifier) => isValidWeaponMasteryModifier(modifier));
    //get entity id from modifier and match to item baseWeaponid
    const masteryModifier = masteryModifiers.find((modifier) => ModifierAccessors.getEntityId(modifier) === getBaseItemId(item));
    return masteryModifier ? ModifierAccessors.getFriendlySubtypeName(masteryModifier) : null;
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveName(item, valueLookup) {
    const override = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.NAME_OVERRIDE, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    if (override !== null && override !== '') {
        return override;
    }
    const definitionName = getDefinitionName(item);
    if (definitionName === null) {
        return '';
    }
    return definitionName;
}
/**
 *
 * @param item
 * @param valueLookup
 */
export function deriveNotes(item, valueLookup) {
    const notes = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.NOTES, ValueHacks.hack__toString(getMappingId(item)), ValueHacks.hack__toString(getMappingEntityTypeId(item)));
    if (notes !== null && notes !== '') {
        return notes;
    }
    return null;
}
/**
 *
 * @param item
 * @param modifiers
 * @param ruleData
 */
export function deriveProperties(item, modifiers, ruleData) {
    let properties = [];
    if (isArmorContract(item)) {
        return properties;
    }
    if (isWeaponContract(item)) {
        properties = getDefinitionProperties(item);
    }
    else if (hasItemWeaponBehaviors(item)) {
        const behavior = getItemWeaponBehaviors(item);
        const firstBehavior = behavior[0];
        properties = firstBehavior.properties === null ? [] : firstBehavior.properties;
    }
    const weaponPropertyModifiers = modifiers.filter((modifier) => ModifierValidators.isWeaponPropertyModifier(modifier));
    const weaponPropertyModifierInfos = weaponPropertyModifiers
        .map((modifier) => {
        const entityId = ModifierAccessors.getEntityId(modifier);
        if (entityId === null) {
            return null;
        }
        const configWeaponProperty = RuleDataUtils.getWeaponPropertyInfo(entityId, ruleData);
        if (configWeaponProperty === null) {
            return null;
        }
        return {
            id: configWeaponProperty.id,
            description: configWeaponProperty.description,
            name: configWeaponProperty.name,
            notes: '',
        };
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    properties = uniqBy([...properties, ...weaponPropertyModifierInfos], (property) => property.name);
    const ignoreWeaponPropertyModifiers = modifiers.filter((modifier) => ModifierValidators.isIgnoreWeaponPropertyModifier(modifier));
    if (ignoreWeaponPropertyModifiers.length) {
        const ignoreWeaponPropertyModifiersNames = ignoreWeaponPropertyModifiers
            .map((modifier) => ModifierAccessors.getFriendlySubtypeName(modifier))
            .filter(TypeScriptUtils.isNotNullOrUndefined);
        properties = properties.filter((property) => property.name !== null && !ignoreWeaponPropertyModifiersNames.includes(property.name));
    }
    return properties;
}
/**
 *
 * @param armorItems
 */
export function deriveValidGlobalModifiersFromArmor(armorItems) {
    if (!armorItems.length) {
        return [];
    }
    // get all armor modifiers that aren't AC bonuses
    return flatten(armorItems.map((item) => getModifiers(item).filter((modifier) => !ModifierValidators.isBonusArmorModifier(modifier) &&
        !ModifierValidators.isProficiencySelfModifier(modifier) &&
        isEquipped(item) &&
        ModifierValidators.isValidAttunedItemModifier(modifier, item))));
}
/**
 *
 * @param weaponItems
 */
export function deriveValidGlobalModifiersFromWeapons(weaponItems) {
    if (!weaponItems.length) {
        return [];
    }
    // get all weapon modifiers that aren't bonus magic
    return flatten(weaponItems.map((item) => getModifiers(item).filter((modifier) => !ModifierValidators.isBonusMagicModifier(modifier) &&
        !ModifierValidators.isProficiencySelfModifier(modifier) &&
        !ModifierValidators.isReplaceDamageTypeModifier(modifier) &&
        !ModifierValidators.isWeaponPropertyModifier(modifier) &&
        !ModifierValidators.isWeaponAdditionalDamageModifier(modifier) &&
        isEquipped(item) &&
        ModifierValidators.isValidAttunedItemModifier(modifier, item))));
}
/**
 *
 * @param gearItems
 */
export function deriveValidGlobalModifiersFromGear(gearItems) {
    if (!gearItems.length) {
        return [];
    }
    return flatten(gearItems.map((item) => getModifiers(item).filter((modifier) => isEquipped(item) &&
        (!hasItemWeaponBehaviors(item) ||
            (hasItemWeaponBehaviors(item) && !ModifierValidators.isBonusMagicModifier(modifier))) &&
        !ModifierValidators.isProficiencySelfModifier(modifier) &&
        ModifierValidators.isValidAttunedItemModifier(modifier, item))));
}
/**
 *
 * @param item
 */
export function deriveValidArmorStatModifiers(item) {
    return getModifiers(item).filter((modifier) => ModifierValidators.isBonusArmorModifier(modifier) &&
        ModifierValidators.isValidAttunedItemModifier(modifier, item));
}
/**
 *
 * @param item
 */
export function deriveArmorModifierAcTotal(item) {
    const validModifiers = deriveValidArmorStatModifiers(item);
    return ModifierDerivers.sumModifiers(validModifiers);
}
/**
 *
 * @param item
 * @param modifiers
 */
export function deriveDamageType(item, modifiers) {
    let damageType = getDefinitionDamageType(item);
    const replaceDamageTypeModifiers = modifiers.filter((modifier) => ModifierValidators.isReplaceDamageTypeModifier(modifier));
    if (replaceDamageTypeModifiers.length) {
        damageType = ModifierAccessors.getFriendlySubtypeName(replaceDamageTypeModifiers[0]);
    }
    return damageType;
}
/**
 *
 * @param item
 */
export function deriveDefinitionKey(item) {
    return DefinitionHacks.hack__generateDefinitionKey(FUTURE_ITEM_DEFINITION_TYPE, getDefinitionId(item));
}
/**
 *
 * @param infusion
 * @param valueLookup
 * @param item
 */
export function deriveInfusionActions(infusion, valueLookup, item) {
    if (infusion === null) {
        return [];
    }
    const itemLimitedUse = getLimitedUse(item);
    const baseActions = ActionGenerators.generateDataOriginBaseActions(InfusionAccessors.getDefinitionActions(infusion), valueLookup, DataOriginTypeEnum.ITEM, item);
    return baseActions.map((action) => {
        const actionLimitedUse = ActionAccessors.getLimitedUse(action);
        // TODO I don't like this but im not sure how to fix it. and moving on because of time
        // possibly calculate in ActionDerivers.deriveLimitedUse
        if (actionLimitedUse !== null) {
            return Object.assign(Object.assign({}, action), { limitedUse: Object.assign(Object.assign({}, actionLimitedUse), { numberUsed: itemLimitedUse === null ? 0 : LimitedUseAccessors.getNumberUsed(itemLimitedUse) }) });
        }
        return action;
    });
}
/**
 *
 * @param infusionActions
 * @param itemLimitedUse
 */
export function deriveLimitedUse(infusionActions, itemLimitedUse) {
    // if we have no infusion actions, we will just keep what we have
    if (infusionActions.length === 0) {
        return itemLimitedUse;
    }
    // This is for when we updated charges used to null, but still have limited use object
    if (itemLimitedUse !== null && LimitedUseAccessors.getNumberUsed(itemLimitedUse) === null) {
        return null;
    }
    const limitedUseInfusionAction = infusionActions.find((action) => ActionAccessors.getLimitedUse(action) !== null);
    if (!limitedUseInfusionAction) {
        return itemLimitedUse;
    }
    // We made assumption that all of the limited use must be the same for all actions on items
    const actionLimitedUse = ActionAccessors.getLimitedUse(limitedUseInfusionAction);
    if (actionLimitedUse) {
        return {
            resetType: actionLimitedUse.resetType === null ? null : actionLimitedUse.resetType.toString(),
            resetTypeDescription: null,
            maxUses: actionLimitedUse.maxUses,
            numberUsed: itemLimitedUse === null ? 0 : itemLimitedUse.numberUsed,
        };
    }
    return itemLimitedUse;
}
/**
 *
 * @param item
 * @param infusion
 */
export function deriveIsMagic(item, infusion) {
    if (infusion) {
        return true;
    }
    return getDefinitionMagic(item);
}
/**
 *
 * @param item
 */
export function deriveDefaultIsDisplayAsAttack(item) {
    if (!isEquipped(item)) {
        return false;
    }
    return validateIsWeaponLike(item);
}
/**
 *
 * @param item
 * @param ruleData
 */
export function deriveType(item, ruleData) {
    if (isArmorContract(item)) {
        const armorTypeId = getArmorTypeId(item);
        if (armorTypeId !== null) {
            const armorType = HelperUtils.lookupDataOrFallback(RuleDataAccessors.getArmorTypeLookup(ruleData), armorTypeId);
            if (armorType !== null) {
                return armorType.name;
            }
        }
    }
    else if (isWeaponContract(item)) {
        if (isAmmunition(item)) {
            return 'Ammunition';
        }
        const weapon = RuleDataUtils.getWeaponByEntityId(getBaseItemId(item), getBaseTypeId(item), ruleData);
        if (weapon !== null) {
            return weapon.name;
        }
    }
    else if (isGearContract(item)) {
        if (!getDefinitionMagic(item)) {
            return 'Gear';
        }
        const gearTypeId = getGearTypeId(item);
        switch (gearTypeId) {
            case ItemTypeEnum.ARMOR:
                return 'Armor';
            case ItemTypeEnum.ARTIFACT:
                return 'Artifact';
            case ItemTypeEnum.POTION:
                return 'Potion';
            case ItemTypeEnum.RING:
                return 'Ring';
            case ItemTypeEnum.ROD:
                return 'Rod';
            case ItemTypeEnum.SCROLL:
                return 'Scroll';
            case ItemTypeEnum.STAFF:
                return 'Staff';
            case ItemTypeEnum.WAND:
                return 'Wand';
            case ItemTypeEnum.WEAPON:
                return 'Weapon';
            case ItemTypeEnum.WONDROUS_ITEM:
                return 'Wondrous item';
            default:
            // not implemented
        }
    }
    else if (isCustomItem(item)) {
        return 'Custom';
    }
    return null;
}
/**
 *
 * @param item
 * @param notes
 */
export function deriveOriginalCustomContract(item, notes) {
    if (isCustomItem(item)) {
        return {
            id: getDefinitionId(item),
            name: getDefinitionName(item),
            weight: getWeightDefinition(item),
            cost: getDefinitionCost(item),
            quantity: getQuantity(item),
            description: getDescription(item),
            notes,
        };
    }
    return null;
}
export function derivePrimarySourceCategoryId(item, ruleData) {
    var _a;
    const primarySources = getSources(item).filter(CharacterValidators.isPrimarySource);
    if (!primarySources.length) {
        return 0;
    }
    const source = HelperUtils.lookupDataOrFallback(RuleDataAccessors.getSourceDataLookup(ruleData), primarySources[0].sourceId);
    return ((_a = source === null || source === void 0 ? void 0 : source.sourceCategory) === null || _a === void 0 ? void 0 : _a.id) || 0;
}
export function deriveSecondarySourceCategoryIds(item, ruleData) {
    const secondarySources = getSources(item).filter(CharacterValidators.isSecondarySource);
    return secondarySources.map((source) => {
        var _a;
        const sourceData = HelperUtils.lookupDataOrFallback(RuleDataAccessors.getSourceDataLookup(ruleData), source.sourceId);
        return ((_a = sourceData === null || sourceData === void 0 ? void 0 : sourceData.sourceCategory) === null || _a === void 0 ? void 0 : _a.id) || 0;
    });
}
