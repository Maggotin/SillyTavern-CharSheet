var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { keyBy, orderBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { CharacterDerivers } from '../Character';
import { ContainerTypeEnum } from '../Container';
import { StealthCheckTypeEnum } from '../Core';
import { DataOriginDataInfoKeyEnum, DataOriginTypeEnum } from '../DataOrigin';
import { DefinitionHacks } from '../Definition';
import { DiceAccessors, DiceDerivers, DiceUtils } from '../Dice';
import { HelperUtils } from '../Helper';
import { InfusionAccessors } from '../Infusion';
import { LimitedUseAccessors, LimitedUseUtils } from '../LimitedUse';
import { ModifierDerivers, ModifierGenerators, ModifierValidators, } from '../Modifier';
import { RuleDataAccessors } from '../RuleData';
import { SpellGenerators } from '../Spell';
import { AdjustmentTypeEnum, ValueAccessors, ValueHacks, ValueUtils, } from '../Value';
import { getDefinitionDamage, getEntityTypeId, getFixedDamage, getId, getItemWeaponBehaviors, getLimitedUse, getMappingEntityTypeId, getMappingId, getModifiers, getName, getUniqueKey, isAttuned, isDisplayAsAttack, isEquipped, } from './accessors';
import { ItemBaseTypeEnum, ItemRarityNameEnum, WeaponPropertyEnum } from './constants';
import { deriveArmorClass, deriveAvailableWeaponAbilities, deriveAvatarUrl, deriveBaseType, deriveCanAttune, deriveCanBeDedicatedWeapon, deriveCanEquip, deriveCanHexWeapon, deriveCanWeaponOffhand, deriveCapacityWeight, deriveCategoryInfo, deriveCost, deriveDamageType, deriveDefinitionKey, deriveInfusionActions, deriveIsAdamantine, deriveIsCustomized, deriveIsDisplayAsAttack, deriveIsMagic, deriveIsMonkWeapon, deriveIsOffhand, deriveIsProficient, deriveIsSilvered, deriveLimitedUse, deriveMasteryName, deriveName, deriveNotes, deriveOriginalCustomContract, derivePrimarySourceCategoryId, deriveProperties, deriveSecondarySourceCategoryIds, deriveStealthCheck, deriveType, deriveValidGlobalModifiersFromArmor, deriveValidGlobalModifiersFromGear, deriveValidGlobalModifiersFromWeapons, deriveWeaponAdditionalDamage, deriveWeaponReach, deriveWeight, } from './derivers';
import { hasItemWeaponBehaviors, hasWeaponProperty, isAmmunition, isArmorContract, isBaseWeapon, isGearContract, isWeaponContract, } from './utils';
import { isCustomItem, isEquippedToCurrentCharacter, validateIsWeaponLike } from './validators';
/**
 *
 * @param customItems
 * @param ruleData
 * @param characterId
 */
export function generateCustomItems(customItems, ruleData, characterId) {
    return customItems.map((item) => generateCustomItem(item, ruleData, characterId));
}
/**
 * TODO v5.1: should be able to remove this generator and all usages after mobile can support customItems as Items
 * @param customItem
 * @param ruleData
 * @param characterId
 */
export function generateCustomItem(customItem, ruleData, characterId) {
    var _a, _b;
    const { id, quantity, notes, weight } = customItem, customItemData = __rest(customItem, ["id", "quantity", "notes", "weight"]);
    const definition = Object.assign(Object.assign({}, customItemData), { armorTypeId: null, armorClass: null, attackType: null, attunementDescription: null, avatarUrl: RuleDataAccessors.getDefaultGearImageUrl(ruleData), baseArmorName: null, baseItemId: null, baseTypeId: -1, bundleSize: 1, canAttune: false, canBeAddedToInventory: false, canEquip: false, capacity: null, capacityWeight: 0, categoryId: null, damage: null, damageType: null, entityTypeId: -1, filterType: null, fixedDamage: null, gearTypeId: null, grantedModifiers: [], groupedId: null, id: -1, isConsumable: false, isContainer: false, isHomebrew: false, isLegacy: false, isMonkWeapon: false, isPack: false, largeAvatarUrl: null, levelInfusionGranted: null, longRange: null, magic: false, properties: [], range: null, rarity: ItemRarityNameEnum.COMMON, snippet: null, sourcePageNumber: null, sources: [], stackable: true, stealthCheck: StealthCheckTypeEnum.NONE, strengthRequirement: null, subType: null, tags: [], type: 'Custom', version: null, weaponBehaviors: [], weight: weight !== null && weight !== void 0 ? weight : 0, weightMultiplier: 1 });
    const simulatedContract = {
        chargesUsed: 0,
        containerEntityId: characterId,
        containerEntityTypeId: ContainerTypeEnum.CHARACTER,
        containerDefinitionKey: DefinitionHacks.hack__generateDefinitionKey(ContainerTypeEnum.CHARACTER, characterId),
        definition,
        currency: null,
        definitionId: -1,
        definitionTypeId: -1,
        displayAsAttack: false,
        entityTypeId: -1,
        equipped: false,
        equippedEntityId: null,
        equippedEntityTypeId: null,
        id,
        isAttuned: false,
        limitedUse: null,
        quantity: quantity !== null && quantity !== void 0 ? quantity : 1,
    };
    return Object.assign(Object.assign({}, simulatedContract), { avatarUrl: (_a = definition.avatarUrl) !== null && _a !== void 0 ? _a : '', armorClass: null, baseItemType: ItemBaseTypeEnum.GEAR, additionalDamages: [], versatileDamage: null, reach: null, canAttune: false, canBeDedicatedWeapon: false, canEquip: false, canHexWeapon: false, canOffhand: false, canPactWeapon: false, categoryInfo: null, definitionKey: '', hexWeaponEnabled: false, isDedicatedWeapon: false, isHexWeapon: false, isPactWeapon: false, metaItems: [], pactWeaponEnabled: false, toHit: null, damage: null, infusion: null, infusionActions: [], isOffhand: false, isAdamantine: false, isMagic: false, isSilvered: false, damageType: definition.damageType, displayAsAttack: false, isCustom: true, isCustomized: false, isDisplayAsAttack: false, proficiency: false, modifiers: [], originalContract: customItem, spells: [], type: null, name: (_b = definition.name) !== null && _b !== void 0 ? _b : 'Unidentified Item', cost: deriveCost(simulatedContract, {}), weight: deriveWeight(simulatedContract, {}), capacityWeight: deriveCapacityWeight(simulatedContract, {}), notes, properties: [], stealthCheck: StealthCheckTypeEnum.NONE, masteryName: null, primarySourceCategoryId: -1, secondarySourceCategoryIds: [] });
}
/**
 *
 * @param baseWeapon
 * @param parentItem
 * @param valueLookup
 * @param ruleData
 */
export function generateWeaponBehaviorBaseItem(baseWeapon, parentItem, valueLookup, ruleData) {
    if (parentItem.definition === null) {
        return null;
    }
    const item = Object.assign(Object.assign({}, parentItem), { definition: Object.assign(Object.assign(Object.assign({}, parentItem.definition), baseWeapon), { fixedDamage: null }) });
    return Object.assign(Object.assign({}, item), { avatarUrl: deriveAvatarUrl(item, ruleData), baseItemType: ItemBaseTypeEnum.WEAPON, canAttune: deriveCanAttune(item, null), canEquip: deriveCanEquip(item, null), categoryInfo: deriveCategoryInfo(item, ruleData), cost: deriveCost(item, valueLookup), damageType: deriveDamageType(item, []), definitionKey: deriveDefinitionKey(item), isAdamantine: deriveIsAdamantine(item, valueLookup), isCustom: isCustomItem(item), isCustomized: deriveIsCustomized(item, valueLookup), isDisplayAsAttack: deriveIsDisplayAsAttack(item, valueLookup), isOffhand: deriveIsOffhand(item, valueLookup), isSilvered: deriveIsSilvered(item, valueLookup), isMagic: deriveIsMagic(item, null), infusion: null, infusionActions: [], modifiers: getModifiers(parentItem), name: deriveName(item, valueLookup), notes: deriveNotes(item, valueLookup), originalContract: null, properties: deriveProperties(item, [], ruleData), spells: [], type: deriveType(item, ruleData), weight: deriveWeight(item, valueLookup), capacityWeight: deriveCapacityWeight(item, valueLookup) });
}
/**
 *
 * @param items
 * @param abilityLookup
 * @param proficiencyBonus
 * @param modifiers
 * @param entityValueLookup
 * @param typeValueLookup
 * @param valueLookup
 * @param martialArtsLevel
 * @param ruleData
 * @param hack__characterSpecialWeaponPropertiesEnabled
 */
export function generateItems(items, abilityLookup, proficiencyBonus, modifiers, entityValueLookup, typeValueLookup, valueLookup, martialArtsLevel, ruleData, hack__characterSpecialWeaponPropertiesEnabled) {
    const { hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, dedicatedWeaponEnabled } = hack__characterSpecialWeaponPropertiesEnabled;
    return items.map((item) => generateItem(item, abilityLookup, proficiencyBonus, modifiers, entityValueLookup, typeValueLookup, valueLookup, martialArtsLevel, hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, ruleData, dedicatedWeaponEnabled));
}
/**
 *
 * @param item
 * @param abilityLookup
 * @param proficiencyBonus
 * @param modifiers
 * @param entityValueLookup
 * @param typeValueLookup
 * @param valueLookup
 * @param martialArtsLevel
 * @param hexWeaponEnabled
 * @param pactWeaponEnabled
 * @param improvedPactWeaponEnabled
 * @param ruleData
 * @param dedicatedWeaponEnabled
 */
export function generateItem(item, abilityLookup, proficiencyBonus, modifiers, entityValueLookup, typeValueLookup, valueLookup, martialArtsLevel, hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, ruleData, dedicatedWeaponEnabled) {
    const mappingId = getMappingId(item);
    const mappingIdString = ValueHacks.hack__toString(mappingId);
    const mappingEntityTypeId = getMappingEntityTypeId(item);
    const mappingEntityTypeIdString = ValueHacks.hack__toString(mappingEntityTypeId);
    const dataLookup = ValueUtils.getEntityData(entityValueLookup, mappingIdString, mappingEntityTypeIdString);
    const isOffhand = ValueUtils.getIsOffhand(valueLookup, mappingIdString, mappingEntityTypeIdString);
    const damageBonus = ValueUtils.getFixedValueBonus(valueLookup, mappingIdString, mappingEntityTypeIdString);
    const toHitBonus = ValueUtils.getToHitBonus(valueLookup, mappingIdString, mappingEntityTypeIdString);
    const toHitOverride = ValueUtils.getToHitOverride(valueLookup, mappingIdString, mappingEntityTypeIdString);
    const itemModifiers = getModifiers(item);
    const isMonkWeapon = deriveIsMonkWeapon(item, modifiers);
    const isOffhandWeapon = !!isOffhand;
    const canOffhand = deriveCanWeaponOffhand(item, modifiers);
    let canPactWeapon = false;
    let isPactWeapon = false;
    if (pactWeaponEnabled && (isBaseWeapon(item) || validateIsWeaponLike(item)) && !isAmmunition(item)) {
        canPactWeapon = pactWeaponEnabled;
        isPactWeapon =
            dataLookup.hasOwnProperty(AdjustmentTypeEnum.IS_PACT_WEAPON) &&
                !!ValueAccessors.getValue(dataLookup[AdjustmentTypeEnum.IS_PACT_WEAPON]);
    }
    const proficiency = deriveIsProficient(item, modifiers, isPactWeapon, typeValueLookup, ruleData);
    let canHexWeapon = false;
    let isHexWeapon = false;
    if (hexWeaponEnabled && (isBaseWeapon(item) || validateIsWeaponLike(item)) && !isAmmunition(item)) {
        canHexWeapon = deriveCanHexWeapon(item, proficiency);
        isHexWeapon =
            dataLookup.hasOwnProperty(AdjustmentTypeEnum.IS_HEXBLADE) &&
                !!ValueAccessors.getValue(dataLookup[AdjustmentTypeEnum.IS_HEXBLADE]);
    }
    let canBeDedicatedWeapon = false;
    let isDedicatedWeapon = false;
    if (dedicatedWeaponEnabled && (isBaseWeapon(item) || validateIsWeaponLike(item)) && !isAmmunition(item)) {
        canBeDedicatedWeapon = deriveCanBeDedicatedWeapon(item, proficiency);
        isDedicatedWeapon =
            dataLookup.hasOwnProperty(AdjustmentTypeEnum.IS_DEDICATED_WEAPON) &&
                !!ValueAccessors.getValue(dataLookup[AdjustmentTypeEnum.IS_DEDICATED_WEAPON]);
    }
    const reach = deriveWeaponReach(item, modifiers, ruleData);
    const additionalDamages = deriveWeaponAdditionalDamage(item);
    let newDamage = null;
    let versatileDamage = null;
    let bestAbilityToHit = null;
    const metaItems = [];
    if (isBaseWeapon(item)) {
        const adjustmentDamageBonus = damageBonus === null ? 0 : damageBonus;
        const adjustmentToHitBonus = toHitBonus === null ? 0 : toHitBonus;
        // get the current item bonus magic modifiers
        const bonusMagicModifiers = itemModifiers.filter((modifier) => ModifierValidators.isBonusMagicModifier(modifier) &&
            ModifierValidators.isValidAttunedItemModifier(modifier, item));
        let bonusMagicModifierTotal = ModifierDerivers.sumModifiers(bonusMagicModifiers);
        if (bonusMagicModifierTotal <= 0 && improvedPactWeaponEnabled && isPactWeapon) {
            bonusMagicModifierTotal = 1;
            // TODO hard coded for now, should be supplied from server data
        }
        // get anything else that may increase bonus magic
        const globalBonusMagicModifiers = modifiers.filter((modifier) => ModifierValidators.isBonusMagicModifier(modifier));
        const globalBonusMagicModifierTotal = ModifierDerivers.sumModifiers(globalBonusMagicModifiers);
        const totalModifierBonusMagic = globalBonusMagicModifierTotal + bonusMagicModifierTotal;
        // test for proficiency
        const weaponProficiencyBonus = proficiency ? proficiencyBonus : 0;
        // figure out the best stat to use with weapon
        let bestAbilityDamageBonus = 0;
        if (isBaseWeapon(item) && !isAmmunition(item)) {
            // find out about bonus toHit for current weapon
            const bonusToHitModifiers = modifiers.filter((modifier) => ModifierValidators.isValidBonusWeaponToHitModifier(modifier, item, ruleData));
            const bonusToHitModifierTotal = ModifierDerivers.sumModifiers(bonusToHitModifiers, abilityLookup);
            //get all the available ability stats for the weapon
            const availableAbilities = deriveAvailableWeaponAbilities(item, modifiers, martialArtsLevel, isDedicatedWeapon, isPactWeapon, isHexWeapon);
            // transform the available ability stats to have toHit and damage bonuses
            const abilityPossibilities = CharacterDerivers.deriveAttackAbilityPossibilities(availableAbilities, modifiers, weaponProficiencyBonus, abilityLookup);
            const bestAbility = HelperUtils.getLast(abilityPossibilities, ['toHit', 'modifier']);
            if (bestAbility !== null) {
                bestAbilityToHit =
                    bestAbility.toHit + adjustmentToHitBonus + totalModifierBonusMagic + bonusToHitModifierTotal;
                if (toHitOverride !== null) {
                    bestAbilityToHit = toHitOverride;
                }
                const ignoreOffhandModifierRestrictionsModifiers = modifiers.filter((modifier) => ModifierValidators.isIgnoreOffhandModifierRestrictionsModifier(modifier));
                if (isOffhandWeapon && ignoreOffhandModifierRestrictionsModifiers.length === 0) {
                    bestAbilityDamageBonus = Math.min(0, bestAbility.damageBonus);
                }
                else {
                    bestAbilityDamageBonus = bestAbility.damageBonus;
                }
            }
        }
        // generate new damage based on all the above info
        const damage = getDefinitionDamage(item);
        if (damage) {
            const allDamageDice = [damage];
            let martialArtsDie = null;
            if (martialArtsLevel !== null && (isMonkWeapon || isDedicatedWeapon)) {
                martialArtsDie = DiceDerivers.deriveMartialArtsDamageDie(martialArtsLevel);
                allDamageDice.push(martialArtsDie);
            }
            const highestDamageDie = DiceUtils.getHighestDie(allDamageDice);
            if (highestDamageDie !== null) {
                const damageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidWeaponDamageModifier(modifier, item, ruleData));
                const damageModifierTotal = ModifierDerivers.sumModifiers(damageModifiers, abilityLookup);
                const fixedDieValue = DiceAccessors.getFixedValue(highestDamageDie);
                const damageFixedValue = fixedDieValue === null ? 0 : fixedDieValue;
                newDamage = Object.assign(Object.assign({}, highestDamageDie), { fixedValue: damageFixedValue +
                        totalModifierBonusMagic +
                        damageModifierTotal +
                        bestAbilityDamageBonus +
                        adjustmentDamageBonus });
                if (!isOffhandWeapon && hasWeaponProperty(item, WeaponPropertyEnum.VERSATILE)) {
                    const versatileDamageModifiers = modifiers.filter((modifier) => ModifierValidators.isValidWeaponDamageModifier(modifier, item, ruleData, true));
                    const versatileDamageModifierTotal = ModifierDerivers.sumModifiers(versatileDamageModifiers, abilityLookup);
                    const versatileDieValuePossibilities = [];
                    const diceValue = DiceAccessors.getValue(damage);
                    const baseDamageVersatileDie = diceValue === null ? 0 : ruleData.versatileDieLookup[diceValue];
                    versatileDieValuePossibilities.push(baseDamageVersatileDie);
                    if (martialArtsLevel !== null && (isMonkWeapon || isDedicatedWeapon) && martialArtsDie) {
                        const martialArtsDamageVersatileDie = DiceAccessors.getValue(martialArtsDie);
                        if (martialArtsDamageVersatileDie !== null) {
                            versatileDieValuePossibilities.push(martialArtsDamageVersatileDie);
                        }
                    }
                    versatileDamage = Object.assign(Object.assign({}, newDamage), { diceValue: Math.max(...versatileDieValuePossibilities), fixedValue: damageFixedValue +
                            totalModifierBonusMagic +
                            versatileDamageModifierTotal +
                            bestAbilityDamageBonus +
                            adjustmentDamageBonus });
                }
            }
        }
        else {
            const fixedDamage = getFixedDamage(item);
            if (fixedDamage) {
                newDamage = fixedDamage + totalModifierBonusMagic + bestAbilityDamageBonus + adjustmentDamageBonus;
            }
        }
        if (martialArtsLevel !== null && (isMonkWeapon || isDedicatedWeapon)) {
            metaItems.push('Martial Arts');
        }
    }
    return Object.assign(Object.assign({}, item), { armorClass: deriveArmorClass(item), stealthCheck: deriveStealthCheck(item, modifiers), toHit: bestAbilityToHit, proficiency,
        metaItems,
        canOffhand,
        isHexWeapon,
        canHexWeapon,
        isPactWeapon,
        canPactWeapon,
        isDedicatedWeapon,
        canBeDedicatedWeapon,
        hexWeaponEnabled,
        pactWeaponEnabled, damage: newDamage, versatileDamage,
        additionalDamages,
        reach, masteryName: deriveMasteryName(item, modifiers), primarySourceCategoryId: derivePrimarySourceCategoryId(item, ruleData), secondarySourceCategoryIds: deriveSecondarySourceCategoryIds(item, ruleData) });
}
/**
 *
 * @param items
 * @param modifierLookup
 * @param spellLookup
 * @param valueLookup
 * @param inventoryInfusionLookup
 * @param ruleData
 */
export function generateBaseItems(items, modifierLookup, spellLookup, valueLookup, inventoryInfusionLookup, ruleData) {
    return items.map((item) => generateBaseItem(item, modifierLookup, spellLookup, valueLookup, inventoryInfusionLookup, ruleData));
}
/**
 *
 * @param item
 * @param modifierLookup
 * @param spellLookup
 * @param valueLookup
 * @param inventoryInfusionLookup
 * @param ruleData
 */
export function generateBaseItem(item, modifierLookup, spellLookup, valueLookup, inventoryInfusionLookup, ruleData) {
    const id = getId(item);
    const entityTypeId = getEntityTypeId(item);
    const infusion = HelperUtils.lookupDataOrFallback(inventoryInfusionLookup, getMappingId(item));
    let infusionModifiers = [];
    if (infusion) {
        const selectedModifierData = InfusionAccessors.getSelectedModifierData(infusion);
        if (selectedModifierData && selectedModifierData.modifiers) {
            infusionModifiers = selectedModifierData.modifiers;
        }
    }
    const modifiers = ModifierGenerators.generateModifiers(id, entityTypeId, modifierLookup, DataOriginTypeEnum.ITEM, item, null, infusionModifiers);
    const baseSpells = SpellGenerators.generateBaseSpells(id, entityTypeId, spellLookup, DataOriginTypeEnum.ITEM, item, null, ruleData, {}, {});
    const infusionActions = deriveInfusionActions(infusion, valueLookup, item);
    const notes = deriveNotes(item, valueLookup);
    return Object.assign(Object.assign({}, item), { avatarUrl: deriveAvatarUrl(item, ruleData), baseItemType: deriveBaseType(item), canAttune: deriveCanAttune(item, infusion), canEquip: deriveCanEquip(item, infusion), categoryInfo: deriveCategoryInfo(item, ruleData), cost: deriveCost(item, valueLookup), definitionKey: deriveDefinitionKey(item), damageType: deriveDamageType(item, modifiers), infusion,
        infusionActions, isAdamantine: deriveIsAdamantine(item, valueLookup), isCustom: isCustomItem(item), isCustomized: deriveIsCustomized(item, valueLookup), isDisplayAsAttack: deriveIsDisplayAsAttack(item, valueLookup), isMagic: deriveIsMagic(item, infusion), isOffhand: deriveIsOffhand(item, valueLookup), isSilvered: deriveIsSilvered(item, valueLookup), limitedUse: deriveLimitedUse(infusionActions, getLimitedUse(item)), modifiers, name: deriveName(item, valueLookup), notes, originalContract: deriveOriginalCustomContract(item, notes), properties: deriveProperties(item, modifiers, ruleData), spells: baseSpells.map((spell) => updateBaseItemSpells(item, spell)), type: deriveType(item, ruleData), weight: deriveWeight(item, valueLookup), capacityWeight: deriveCapacityWeight(item, valueLookup) });
}
/**
 *
 * @param item
 * @param spell
 */
function updateBaseItemSpells(item, spell) {
    let spellLimitedUse = null;
    if (spell.limitedUse) {
        spellLimitedUse = spell.limitedUse;
        const itemLimitedUse = getLimitedUse(item);
        if (itemLimitedUse !== null) {
            spellLimitedUse = Object.assign(Object.assign(Object.assign({}, spellLimitedUse), item.limitedUse), { 
                // TODO fix when resetType on ItemLimitedUse is no longer a string
                resetType: LimitedUseUtils.getResetTypeIdByName(LimitedUseAccessors.getResetTypeName(itemLimitedUse)) });
        }
    }
    return Object.assign(Object.assign({}, spell), { limitedUse: spellLimitedUse });
}
/**
 *
 * @param items
 * @param abilityLookup
 * @param proficiencyBonus
 * @param modifiers
 * @param entityValueLookup
 * @param typeValueLookup
 * @param valueLookup
 * @param martialArtsLevel
 * @param ruleData
 * @param hack__characterSpecialWeaponPropertiesEnabled
 * @param characterId
 */
export function generateGearWeaponItems(items, abilityLookup, proficiencyBonus, modifiers, entityValueLookup, typeValueLookup, valueLookup, martialArtsLevel, ruleData, hack__characterSpecialWeaponPropertiesEnabled, characterId) {
    const { hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, dedicatedWeaponEnabled } = hack__characterSpecialWeaponPropertiesEnabled;
    return items
        .filter(isGearContract)
        .filter((item) => hasItemWeaponBehaviors(item))
        .filter((item) => isEquippedToCurrentCharacter(item, characterId))
        .map((gearItem) => getItemWeaponBehaviors(gearItem)
        .map((itemDefinition) => {
        const simulatedBaseItem = generateWeaponBehaviorBaseItem(itemDefinition, gearItem, valueLookup, ruleData);
        if (simulatedBaseItem === null) {
            return null;
        }
        return generateItem(simulatedBaseItem, abilityLookup, proficiencyBonus, modifiers, entityValueLookup, typeValueLookup, valueLookup, martialArtsLevel, hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, ruleData, dedicatedWeaponEnabled);
    })
        .filter(TypeScriptUtils.isNotNullOrUndefined))
        .reduce((acc, itemBehaviors) => {
        acc.push(...itemBehaviors);
        return acc;
    }, []);
}
/**
 *
 * @param ruleData
 * @param modifiers
 */
export function generateAttunedItemCountMax(ruleData, modifiers) {
    const setAttunementModifiers = modifiers.filter((modifier) => ModifierValidators.isSetAttunementSlotsModifier(modifier));
    if (setAttunementModifiers.length) {
        const highestModifierValue = ModifierDerivers.deriveHighestModifierValue(setAttunementModifiers, null);
        return HelperUtils.clampInt(highestModifierValue, RuleDataAccessors.getMinAttunedItemCountMax(ruleData), RuleDataAccessors.getMaxAttunedItemCountMax(ruleData));
    }
    return RuleDataAccessors.getDefaultAttunedItemCountMax(ruleData);
}
/**
 *
 * @param attunedItems
 * @param attunedItemCountMax
 */
export function generateHasMaxAttunedItems(attunedItems, attunedItemCountMax) {
    return attunedItems.length >= attunedItemCountMax;
}
/**
 *
 * @param items
 */
export function generateInventoryLookup(items) {
    return keyBy(items, (item) => getMappingId(item));
}
/**
 *
 * @param items
 * @param characterId
 */
export function generateEquippedItems(items, characterId) {
    return items.filter((item) => isEquipped(item) && isEquippedToCurrentCharacter(item, characterId));
}
/**
 *
 * @param equippedItems
 * @param attunedItemCountMax
 */
export function generateEquippedAttunedItems(equippedItems, attunedItemCountMax) {
    return equippedItems.filter(isAttuned).slice(0, attunedItemCountMax);
}
/**
 *
 * @param equippedItems
 * @param gearWeaponItems
 */
export function generateOrderedItemAttacks(equippedItems, gearWeaponItems) {
    const equippedWeaponItems = equippedItems.filter(isWeaponContract);
    return orderBy([...equippedWeaponItems, ...gearWeaponItems].filter(isDisplayAsAttack), [(item) => getName(item)]);
}
/**
 *
 * @param equippedItems
 */
export function generateValidEquipmentModifiers(equippedItems) {
    const armorModifiers = deriveValidGlobalModifiersFromArmor(equippedItems.filter(isArmorContract));
    const weaponModifiers = deriveValidGlobalModifiersFromWeapons(equippedItems.filter(isWeaponContract));
    const gearModifiers = deriveValidGlobalModifiersFromGear(equippedItems.filter(isGearContract));
    return [...armorModifiers, ...weaponModifiers, ...gearModifiers];
}
/**
 *
 * @param items
 */
export function generateRefItemData(items) {
    let data = {};
    items.forEach((item) => {
        data[getUniqueKey(item)] = {
            [DataOriginDataInfoKeyEnum.PRIMARY]: item,
            [DataOriginDataInfoKeyEnum.PARENT]: null,
        };
    });
    return data;
}
