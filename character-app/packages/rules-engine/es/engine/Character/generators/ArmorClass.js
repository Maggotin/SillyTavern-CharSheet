import { forOwn, groupBy } from 'lodash';
import { AbilityAccessors } from '../../Ability';
import { AbilityStatEnum } from '../../Core';
import { DataOriginTypeEnum } from '../../DataOrigin';
import { HelperUtils } from '../../Helper';
import { ArmorTypeEnum, ItemAccessors, ItemDerivers, ItemHacks, ItemValidators, } from '../../Item';
import { ModifierAccessors, ModifierDerivers, ModifierGenerators, ModifierHacks, ModifierValidators, } from '../../Modifier';
import { AdjustmentTypeEnum, ValueAccessors, ValueUtils } from '../../Value';
import { ArmorClassExtraTypeEnum, ArmorClassTypeEnum } from '../constants';
import { deriveArmorClassSupplierTotal } from '../derivers';
/**
 *
 * @param type
 * @param amount
 * @param extra
 * @param extraType
 */
export function generateArmorClassSupplier(type, amount, extra = null, extraType = null) {
    return {
        type,
        amount,
        extra,
        extraType,
    };
}
/**
 *
 * @param armorItem
 * @param localModifiers
 * @param globalModifiers
 * @param abilityLookup
 * @param valueLookup
 * @param modifierData
 */
export function generateArmoredBaseArmorSuppliers(armorItem, localModifiers, globalModifiers, abilityLookup, valueLookup, modifierData) {
    const dexModifier = AbilityAccessors.getModifier(abilityLookup[AbilityStatEnum.DEXTERITY]);
    const baseArmorOverrideValue = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.OVERRIDE_BASE_ARMOR);
    const suppliers = [];
    if (baseArmorOverrideValue === null) {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.ARMOR, armorItem.armorClass, armorItem.item, ArmorClassExtraTypeEnum.ITEM));
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.DEX_BONUS, ItemDerivers.deriveArmorDexBonus(armorItem.item, dexModifier ? dexModifier : 0, globalModifiers, abilityLookup), ItemDerivers.deriveArmorDexBonusMax(armorItem.item, globalModifiers, abilityLookup), ArmorClassExtraTypeEnum.NUMBER));
    }
    const setArmoredModifiers = localModifiers.filter((modifier) => ModifierValidators.isSetArmoredArmorClassModifier(modifier));
    const setArmoredHighestModifier = ModifierDerivers.deriveHighestValueModifier(setArmoredModifiers, modifierData);
    if (setArmoredHighestModifier) {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.ARMORED_BONUS, ModifierDerivers.deriveValue(setArmoredHighestModifier, modifierData), setArmoredHighestModifier, ArmorClassExtraTypeEnum.MODIFIER));
    }
    const bonusArmoredModifiers = globalModifiers.filter((modifier) => ModifierValidators.isBonusArmoredArmorClassModifier(modifier));
    bonusArmoredModifiers.forEach((modifier) => {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.ARMORED_BONUS, ModifierDerivers.deriveValue(modifier, modifierData), modifier, ArmorClassExtraTypeEnum.MODIFIER));
    });
    return suppliers;
}
/**
 *
 * @param localModifiers
 * @param globalModifiers
 * @param abilityLookup
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateUnarmoredBaseArmorSuppliers(localModifiers, globalModifiers, abilityLookup, valueLookup, ruleData, modifierData) {
    const baseArmorOverrideValue = ValueUtils.getKeyValue(valueLookup, AdjustmentTypeEnum.OVERRIDE_BASE_ARMOR);
    const suppliers = [];
    if (baseArmorOverrideValue === null) {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.ARMOR, ruleData.noArmorAcAmount, 'None', ArmorClassExtraTypeEnum.STRING));
        const unarmoredDexModifier = ItemDerivers.deriveUnarmoredDexBonus(localModifiers, globalModifiers, abilityLookup);
        if (unarmoredDexModifier !== 0) {
            suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.DEX_BONUS, unarmoredDexModifier, ItemDerivers.deriveUnarmoredDexBonusMax(globalModifiers), ArmorClassExtraTypeEnum.NUMBER));
        }
    }
    const setUnarmoredModifiers = localModifiers.filter((modifier) => ModifierValidators.isSetUnarmoredArmorClassModifier(modifier));
    // TODO: Fix Dirty Hack for Integrated Protection
    const hasLightArmorProficiency = globalModifiers.filter((modifier) => ModifierHacks.hack__isProficiencyLightArmor(modifier)).length > 0;
    if (setUnarmoredModifiers.length) {
        // let setUnarmoredHighestModifier = ModifierUtils.getHighestValueModifier(setUnarmoredModifiers, modifierData);
        const setUnarmoredHighestModifier = HelperUtils.getLast(setUnarmoredModifiers, (modifier) => ItemHacks.hack__getSetUnarmoredModifierValue(modifier, modifierData, hasLightArmorProficiency));
        if (setUnarmoredHighestModifier) {
            suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.UNARMORED_BONUS, ItemHacks.hack__getSetUnarmoredModifierValue(setUnarmoredHighestModifier, modifierData, hasLightArmorProficiency), setUnarmoredHighestModifier, ArmorClassExtraTypeEnum.MODIFIER));
        }
    }
    const bonusUnarmoredModifiers = globalModifiers.filter((modifier) => ModifierValidators.isBonusUnarmoredArmorClassModifier(modifier));
    bonusUnarmoredModifiers.forEach((modifier) => {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.UNARMORED_BONUS, ModifierDerivers.deriveValue(modifier, modifierData), modifier, ArmorClassExtraTypeEnum.MODIFIER));
    });
    return suppliers;
}
/**
 *
 * @param armorItem
 * @param modifiers
 * @param abilityLookup
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateBaseArmorSuppliers(armorItem, modifiers, abilityLookup, valueLookup, ruleData, modifierData) {
    const branchPossibilities = [];
    const branchingModifiers = modifiers.filter((modifier) => ModifierValidators.isArmorBranchingModifier(modifier));
    const groupedBranchModifiers = groupBy(branchingModifiers, (modifier) => ModifierGenerators.generateDataOriginKey(modifier));
    forOwn(groupedBranchModifiers, (branchGroupModifiers) => {
        const ignoreUnarmoredWhileArmoredModifiers = branchGroupModifiers.filter((modifier) => ModifierValidators.isIgnoreUnarmoredWhileArmoredModifier(modifier));
        const ignoreUnarmoredWhileArmored = !!ignoreUnarmoredWhileArmoredModifiers.length;
        if (armorItem) {
            branchPossibilities.push(generateBaseArmorBranchPossibility(armorItem, branchGroupModifiers, modifiers, abilityLookup, valueLookup, ruleData, modifierData));
            if (!ignoreUnarmoredWhileArmored) {
                branchPossibilities.push(generateBaseArmorBranchPossibility(null, branchGroupModifiers, modifiers, abilityLookup, valueLookup, ruleData, modifierData));
            }
        }
        else {
            branchPossibilities.push(generateBaseArmorBranchPossibility(null, branchGroupModifiers, modifiers, abilityLookup, valueLookup, ruleData, modifierData));
        }
    });
    // innate armor calc
    branchPossibilities.push(generateBaseArmorBranchPossibility(armorItem, [], modifiers, abilityLookup, valueLookup, ruleData, modifierData));
    const bestBaseArmorBranchPossibility = HelperUtils.getLast(branchPossibilities, (possibility) => possibility.total);
    if (bestBaseArmorBranchPossibility === null) {
        return [];
    }
    return bestBaseArmorBranchPossibility.suppliers;
}
/**
 *
 * @param mainhandWeapons
 * @param offhandWeapons
 * @param modifiers
 * @param modifierData
 */
export function generateDualWieldArmorClassSuppliers(mainhandWeapons, offhandWeapons, modifiers, modifierData) {
    const armorClassSuppliers = [];
    const bonusDualWieldAcModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusDualWieldAcModifier(modifier));
    if (bonusDualWieldAcModifiers.length && mainhandWeapons.length && offhandWeapons.length) {
        bonusDualWieldAcModifiers.forEach((modifier) => {
            armorClassSuppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.MISC_BONUS, ModifierDerivers.deriveValue(modifier, modifierData), modifier, ArmorClassExtraTypeEnum.MODIFIER));
        });
    }
    return armorClassSuppliers;
}
/**
 *
 * @param armorItem
 * @param shieldItem
 * @param modifiers
 * @param abilityLookup
 * @param equippedItems
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateArmorClassSuppliers(armorItem, shieldItem, modifiers, abilityLookup, equippedItems, valueLookup, ruleData, modifierData) {
    const armorClassSuppliers = [];
    // base armor AC sources based on potential branching paths
    const baseArmorSuppliers = generateBaseArmorSuppliers(armorItem, modifiers, abilityLookup, valueLookup, ruleData, modifierData);
    armorClassSuppliers.push(...baseArmorSuppliers);
    // TODO part of dirty hack
    const isWearingHeavyArmor = armorItem
        ? ItemAccessors.getArmorTypeId(armorItem.item) === ArmorTypeEnum.HEAVY_ARMOR
        : false;
    // general AC bonuses (for both unarmored and armored)
    const armorModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusArmorModifier(modifier));
    armorModifiers.forEach((modifier) => {
        const dataOrigin = ModifierAccessors.getDataOrigin(modifier);
        const dataOriginType = ModifierAccessors.getDataOriginType(modifier);
        let type = ArmorClassTypeEnum.MISC_BONUS;
        if (dataOriginType === DataOriginTypeEnum.ITEM) {
            // TODO This may cause issues with magic infusions, but should be minor and can be fixed when we do overhaul of accessing DataOrigin entities
            type = ItemAccessors.getDefinitionMagic(dataOrigin.primary)
                ? ArmorClassTypeEnum.MAGIC_BONUS
                : ArmorClassTypeEnum.MISC_BONUS;
        }
        // TODO part of dirty hack
        const value = ItemHacks.hack__deriveBonusArmorModifierValue(modifier, modifierData, isWearingHeavyArmor);
        armorClassSuppliers.push(generateArmorClassSupplier(type, value, 
        // ModifierDerivers.deriveValue(modifier, modifierData),
        modifier, ArmorClassExtraTypeEnum.MODIFIER));
    });
    // misc overall bonuses
    const shieldArmorClass = shieldItem ? shieldItem.armorClass : 0;
    const mainhandWeapons = equippedItems.filter(ItemValidators.isEquippedMainhandWeapon);
    const offhandWeapons = equippedItems.filter(ItemValidators.isEquippedOffhandWeapon);
    const dualWieldArmorClassSuppliers = generateDualWieldArmorClassSuppliers(mainhandWeapons, offhandWeapons, modifiers, modifierData);
    const dualWieldArmorClassBonus = deriveArmorClassSupplierTotal(dualWieldArmorClassSuppliers);
    if (dualWieldArmorClassBonus > 0 && dualWieldArmorClassBonus > shieldArmorClass) {
        armorClassSuppliers.push(...dualWieldArmorClassSuppliers);
    }
    else {
        // best shield AC
        if (shieldItem) {
            armorClassSuppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.SHIELD, shieldItem.armorClass, shieldItem.item, ArmorClassExtraTypeEnum.ITEM));
        }
    }
    // overall magic bonus adjustment value
    const magicBonusAdjustment = ValueUtils.getData(valueLookup, AdjustmentTypeEnum.MAGIC_BONUS_AC);
    if (magicBonusAdjustment !== null) {
        armorClassSuppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.MAGIC_BONUS, ValueAccessors.getValue(magicBonusAdjustment), ValueAccessors.getNotes(magicBonusAdjustment), ArmorClassExtraTypeEnum.STRING));
    }
    // overall misc bonus adjustment value
    const miscBonusAdjustment = ValueUtils.getData(valueLookup, AdjustmentTypeEnum.MISC_BONUS_AC);
    if (miscBonusAdjustment !== null) {
        armorClassSuppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.MISC_BONUS, ValueAccessors.getValue(miscBonusAdjustment), ValueAccessors.getNotes(miscBonusAdjustment), ArmorClassExtraTypeEnum.STRING));
    }
    return armorClassSuppliers;
}
/**
 *
 * @param armorItem
 * @param localModifiers
 * @param globalModifiers
 * @param abilityLookup
 * @param valueLookup
 * @param ruleData
 * @param modifierData
 */
export function generateBaseArmorBranchPossibility(armorItem, localModifiers, globalModifiers, abilityLookup, valueLookup, ruleData, modifierData) {
    let suppliers = [];
    const baseArmorOverride = ValueUtils.getData(valueLookup, AdjustmentTypeEnum.OVERRIDE_BASE_ARMOR);
    if (baseArmorOverride !== null) {
        suppliers.push(generateArmorClassSupplier(ArmorClassTypeEnum.OVERRIDE_BASE_ARMOR, ValueAccessors.getValue(baseArmorOverride), ValueAccessors.getNotes(baseArmorOverride), ArmorClassExtraTypeEnum.STRING));
    }
    // basearmor + set highest + status bonuses
    // - set highest is all of the "set > (un)armored armor class" modifiers
    // - status bonuses are bonuses based on whether you are armored or unarmored
    if (armorItem) {
        suppliers.push(...generateArmoredBaseArmorSuppliers(armorItem, localModifiers, globalModifiers, abilityLookup, valueLookup, modifierData));
    }
    else {
        suppliers.push(...generateUnarmoredBaseArmorSuppliers(localModifiers, globalModifiers, abilityLookup, valueLookup, ruleData, modifierData));
    }
    const minimumBaseArmorModifiers = localModifiers.filter((modifier) => ModifierValidators.isSetMinimumBaseArmorModifier(modifier));
    if (minimumBaseArmorModifiers.length) {
        const minBaseArmorModifier = minimumBaseArmorModifiers[0];
        const setMinBaseArmorValue = ModifierDerivers.deriveValue(minBaseArmorModifier, modifierData);
        if (setMinBaseArmorValue > deriveArmorClassSupplierTotal(suppliers)) {
            suppliers = [
                generateArmorClassSupplier(ArmorClassTypeEnum.ARMOR, setMinBaseArmorValue, minBaseArmorModifier, ArmorClassExtraTypeEnum.MODIFIER),
            ];
        }
    }
    return {
        total: deriveArmorClassSupplierTotal(suppliers),
        suppliers,
    };
}
/**
 *
 * @param equippedItems
 * @param dexModifier
 * @param modifiers
 * @param abilityLookup
 * @param ruleData
 */
export function generateHighestAcEquippedArmor(equippedItems, dexModifier, modifiers, abilityLookup, ruleData) {
    const equippedArmor = equippedItems.filter(ItemValidators.isEquippedNonShieldArmor);
    return ItemDerivers.deriveHighestArmorAcItem(equippedArmor, dexModifier, modifiers, abilityLookup, ruleData);
}
/**
 *
 * @param equippedItems
 * @param dexModifier
 * @param modifiers
 * @param abilityLookup
 * @param ruleData
 */
export function generateHighestAcEquippedShield(equippedItems, dexModifier, modifiers, abilityLookup, ruleData) {
    const equippedShields = equippedItems.filter(ItemValidators.isEquippedShield);
    return ItemDerivers.deriveHighestArmorAcItem(equippedShields, dexModifier, modifiers, abilityLookup, ruleData);
}
/**
 *
 * @param valueLookup
 */
export function generateArmorClassAdjustments(valueLookup) {
    return {
        overrideAc: ValueUtils.getData(valueLookup, AdjustmentTypeEnum.OVERRIDE_AC),
        overrideBaseArmor: ValueUtils.getData(valueLookup, AdjustmentTypeEnum.OVERRIDE_BASE_ARMOR),
        miscBonus: ValueUtils.getData(valueLookup, AdjustmentTypeEnum.MISC_BONUS_AC),
        magicBonus: ValueUtils.getData(valueLookup, AdjustmentTypeEnum.MAGIC_BONUS_AC),
    };
}
/**
 *
 * @param armorClassSuppliers
 * @param armorClassAdjustments
 */
export function generateArmorClassTotal(armorClassSuppliers, armorClassAdjustments) {
    if (armorClassAdjustments.overrideAc !== null) {
        const overrideAcValue = ValueUtils.getTypedCharacterValueValue(armorClassAdjustments.overrideAc);
        if (overrideAcValue !== null) {
            return overrideAcValue;
        }
    }
    return deriveArmorClassSupplierTotal(armorClassSuppliers);
}
