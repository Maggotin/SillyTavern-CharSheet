import { StealthCheckTypeEnum } from '../Core';
import { DataOriginTypeEnum } from '../DataOrigin';
import { ModifierGenerators } from '../Modifier';
import { getBundleSize, getDefinitionDamage, getDefinitionGrantedModifiers } from './accessors';
import { deriveArmorClass, deriveAvatarUrl, deriveBaseType, deriveCanAttune, deriveCanEquip, deriveCapacityWeight, deriveCategoryInfo, deriveCost, deriveDamageType, deriveDefinitionKey, deriveIsDisplayAsAttack, deriveIsMagic, deriveIsProficient, deriveName, derivePrimarySourceCategoryId, deriveProperties, deriveSecondarySourceCategoryIds, deriveType, deriveWeaponAdditionalDamage, deriveWeaponReach, deriveWeight, } from './derivers';
/**
 *
 * @param itemDefinition
 * @param globalModifiers
 * @param valueLookupByType
 * @param ruleData
 * @param overrides
 */
export function simulateItem(itemDefinition, globalModifiers, valueLookupByType, ruleData, overrides) {
    var _a, _b;
    const simulatedItemContract = Object.assign({ chargesUsed: 0, containerEntityId: -1, containerEntityTypeId: -1, containerDefinitionKey: '-1:-1', currency: null, definition: itemDefinition, definitionId: itemDefinition.id, definitionTypeId: -1, displayAsAttack: null, entityTypeId: -1, equipped: false, equippedEntityId: null, equippedEntityTypeId: null, id: -1, isAttuned: false, limitedUse: null, quantity: 1 }, ((_a = overrides === null || overrides === void 0 ? void 0 : overrides.simulatedItemContract) !== null && _a !== void 0 ? _a : {}));
    const modifiers = (_b = getDefinitionGrantedModifiers(simulatedItemContract)) !== null && _b !== void 0 ? _b : [];
    const simulatedItem = Object.assign(Object.assign({}, simulatedItemContract), { avatarUrl: deriveAvatarUrl(simulatedItemContract, ruleData), baseItemType: deriveBaseType(simulatedItemContract), canAttune: deriveCanAttune(simulatedItemContract, null), canEquip: deriveCanEquip(simulatedItemContract, null), categoryInfo: deriveCategoryInfo(simulatedItemContract, ruleData), cost: deriveCost(simulatedItemContract, {}), damageType: deriveDamageType(simulatedItemContract, []), definitionKey: deriveDefinitionKey(simulatedItemContract), isAdamantine: false, isCustom: false, isCustomized: false, isDisplayAsAttack: deriveIsDisplayAsAttack(simulatedItemContract, {}), isOffhand: false, isSilvered: false, isMagic: deriveIsMagic(simulatedItemContract, null), infusion: null, infusionActions: [], modifiers: modifiers.map((modifier) => ModifierGenerators.generateModifier(modifier, DataOriginTypeEnum.SIMULATED, null)), name: deriveName(simulatedItemContract, {}), notes: null, originalContract: null, properties: deriveProperties(simulatedItemContract, [], ruleData), spells: [], type: deriveType(simulatedItemContract, ruleData), weight: deriveWeight(simulatedItemContract, {}), capacityWeight: deriveCapacityWeight(simulatedItemContract, {}) });
    const additionalDamages = deriveWeaponAdditionalDamage(simulatedItem);
    const reach = deriveWeaponReach(simulatedItem, globalModifiers, ruleData);
    const proficiency = deriveIsProficient(simulatedItem, globalModifiers, false, valueLookupByType, ruleData);
    return Object.assign(Object.assign({}, simulatedItem), { armorClass: deriveArmorClass(simulatedItem), proficiency, quantity: getBundleSize(simulatedItem), canBeDedicatedWeapon: false, canHexWeapon: false, canOffhand: false, canPactWeapon: false, hexWeaponEnabled: false, isDedicatedWeapon: false, isHexWeapon: false, isPactWeapon: false, masteryName: null, metaItems: [], pactWeaponEnabled: false, toHit: 0, damage: getDefinitionDamage(simulatedItem), categoryInfo: deriveCategoryInfo(simulatedItem, ruleData), stealthCheck: StealthCheckTypeEnum.NONE, additionalDamages,
        reach, versatileDamage: null, primarySourceCategoryId: derivePrimarySourceCategoryId(simulatedItem, ruleData), secondarySourceCategoryIds: deriveSecondarySourceCategoryIds(simulatedItem, ruleData) });
}
