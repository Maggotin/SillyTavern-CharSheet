import { characterActions } from "../actions";
import { ContainerAccessors, ContainerTypeEnum, ContainerValidators } from "../engine/Container";
import { LimitedUseAccessors } from "../engine/LimitedUse";
import { RuleDataUtils } from "../engine/RuleData";
import { rulesEngineSelectors } from "../selectors";
import { EntityTypeEnum, DefaultCharacterName } from '../engine/Core';
import { DefinitionHacks } from '../engine/Definition';
import { ItemAccessors, ItemNotes, ItemUtils, ItemValidators } from '../engine/Item';
import { ContainerManager } from './ContainerManager';
import { PartyManager } from './PartyManager';
const itemMangerMap = new Map();
export const getItem = (itemId) => {
    const itemManager = itemMangerMap.get(itemId);
    if (!itemManager) {
        throw new Error(`ItemManager for item ${itemId} is null`);
    }
    return itemManager;
};
export const getItemManager = (params) => {
    const { item } = params;
    const itemId = ItemAccessors.getMappingId(item);
    if (itemMangerMap.has(itemId)) {
        const itemManager = itemMangerMap.get(itemId);
        if (!itemManager) {
            throw new Error(`ItemManager for item ${itemId} is null`);
        }
        if (itemManager.item === item) {
            return itemManager;
        }
    }
    const newItemManger = new ItemManager(params);
    itemMangerMap.set(itemId, newItemManger);
    return newItemManger;
};
export class ItemManager extends PartyManager {
    constructor(params) {
        super(params);
        // Actions
        this.handleAdd = ({ amount, containerDefinitionKey }, onSuccess, onError) => {
            var _a;
            // const container = this.requiresContainer();
            let itemDestinationContainerDefinitionKey = containerDefinitionKey;
            // TODO: IS THERE A SELECTOR FOR THIS? -> move to container manager?
            const containers = rulesEngineSelectors.getInventoryContainers(this.state);
            // Default to the character container if none is passed
            if (!itemDestinationContainerDefinitionKey) {
                itemDestinationContainerDefinitionKey = ContainerAccessors.getDefinitionKey((_a = containers.find(ContainerValidators.isCharacterContainer)) !== null && _a !== void 0 ? _a : containers[0]);
            }
            const isShared = ContainerManager.isSharedContainerDefinitionKey(this.state, itemDestinationContainerDefinitionKey);
            this.dispatch(characterActions.itemCreate(this.item, amount, this.handleAcceptOnSuccess(isShared, onSuccess), this.handleRejectOnError(onError), containerDefinitionKey));
        };
        this.handleRemove = (onSuccess, onError) => {
            const isShared = this.isShared();
            if (this.isCustom()) {
                this.dispatch(characterActions.customItemDestroy(this.getDefinitionId(), this.getMappingId(), isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
            else {
                const isContainer = this.isContainer();
                const infusion = this.getInfusion();
                this.dispatch(characterActions.itemDestroy(this.getMappingId(), isContainer && infusion ? false : true, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        this.handleMove = ({ containerDefinitionKey }, onSuccess, onError) => {
            const definitionKeyId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const definitionKeyType = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (definitionKeyId && definitionKeyType) {
                const isShared = this.requiresContainer().isSharedOtherContainerDefinitionKey(containerDefinitionKey) || this.isShared();
                this.dispatch(characterActions.itemMoveSet(this.getMappingId(), definitionKeyId, definitionKeyType, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        this.handleEquip = (onSuccess, onError) => {
            const characterId = rulesEngineSelectors.getId(this.state);
            this.dispatch(characterActions.itemEquippedSet(ItemAccessors.getMappingId(this.item), true, characterId, EntityTypeEnum.CHARACTER, this.handleAcceptOnSuccess(this.isShared(), onSuccess)));
        };
        this.handleUnequip = (onSuccess, onError) => {
            this.dispatch(characterActions.itemEquippedSet(ItemAccessors.getMappingId(this.item), false, null, null, this.handleAcceptOnSuccess(this.isShared(), onSuccess)));
        };
        this.handleItemLimitedUseSet = (uses) => {
            this.dispatch(characterActions.itemChargesSet(this.getMappingId(), uses, this.handleAcceptOnSuccess(this.isShared())));
        };
        this.getItem = () => this.item;
        // Accessors
        this.getUniqueKey = () => `${ItemAccessors.getUniqueKey(this.item)}-${this.requiresContainer().getDefinitionKey()}`;
        this.isEquipped = () => ItemAccessors.isEquipped(this.item);
        this.getMappingId = () => ItemAccessors.getMappingId(this.item);
        this.getType = () => ItemAccessors.getType(this.item);
        this.isHexWeapon = () => ItemAccessors.isHexWeapon(this.item);
        this.isPactWeapon = () => ItemAccessors.isPactWeapon(this.item);
        this.isDedicatedWeapon = () => ItemAccessors.isDedicatedWeapon(this.item);
        this.isOffhand = () => ItemAccessors.isOffhand(this.item);
        this.getBaseArmorName = () => ItemAccessors.getBaseArmorName(this.item);
        this.getSubType = () => ItemAccessors.getSubType(this.item);
        this.getQuantity = () => ItemAccessors.getQuantity(this.item);
        this.isStackable = () => ItemAccessors.isStackable(this.item);
        this.getWeight = () => ItemAccessors.getWeight(this.item);
        this.getCost = () => ItemAccessors.getCost(this.item);
        this.getAvatarUrl = () => ItemAccessors.getAvatarUrl(this.item);
        this.isContainer = () => ItemAccessors.isContainer(this.item);
        this.getName = () => ItemAccessors.getName(this.item);
        this.isCustom = () => ItemAccessors.isCustom(this.item);
        this.getDefinitionId = () => ItemAccessors.getDefinitionId(this.item);
        this.getInfusion = () => ItemAccessors.getInfusion(this.item);
        this.getContainerDefinitionKey = () => ItemAccessors.getContainerDefinitionKey(this.item);
        this.hasProficiency = () => ItemAccessors.hasProficiency(this.item);
        this.isMagic = () => ItemAccessors.isMagic(this.item);
        this.getDefintionFilterType = () => ItemAccessors.getDefintionFilterType(this.item);
        this.isPack = () => ItemAccessors.isPack(this.item);
        this.getBundleSize = () => ItemAccessors.getBundleSize(this.item);
        this.getAttackType = () => ItemAccessors.getAttackType(this.item);
        this.isAdamantine = () => ItemAccessors.isAdamantine(this.item);
        this.isSilvered = () => ItemAccessors.isSilvered(this.item);
        this.isCustomized = () => ItemAccessors.isCustomized(this.item);
        this.getRange = () => ItemAccessors.getRange(this.item);
        this.getLongRange = () => ItemAccessors.getLongRange(this.item);
        this.getReach = () => ItemAccessors.getReach(this.item);
        this.getToHit = () => ItemAccessors.getToHit(this.item);
        this.getDamage = () => ItemAccessors.getDamage(this.item);
        this.getVersatileDamage = () => ItemAccessors.getVersatileDamage(this.item);
        this.getDamageType = () => ItemAccessors.getDamageType(this.item);
        this.getMasteryName = () => ItemAccessors.getMasteryName(this.item);
        this.isLegacy = () => ItemAccessors.isLegacy(this.item);
        this.getPrimarySourceCategoryId = () => ItemAccessors.getPrimarySourceCategoryId(this.item);
        this.getSecondarySourceCategoryIds = () => ItemAccessors.getSecondarySourceCategoryIds(this.item);
        this.getAllSourceCategoryIds = () => ItemUtils.getAllSourceCategoryIds(this.item);
        // Validator
        this.isShared = () => this.requiresContainer().isShared();
        this.isArmorContract = () => ItemUtils.isArmorContract(this.item);
        this.isGearContract = () => ItemUtils.isGearContract(this.item);
        this.isWeaponContract = () => ItemUtils.isWeaponContract(this.item);
        this.canEquipUnequipItem = () => {
            const isShared = this.isShared();
            const canEquip = ItemAccessors.canEquip(this.item);
            const isEquipped = ItemAccessors.isEquipped(this.item);
            if (isShared && canEquip) {
                if (this.isSharingTurnedOn() || (this.isSharingTurnedDeleteOnly() && isEquipped)) {
                    return isEquipped ? this.isEquippedToCurrentCharacter() : true;
                }
                return false;
            }
            return canEquip;
        };
        this.isEquippedToCurrentCharacter = () => {
            const characterId = rulesEngineSelectors.getId(this.state);
            return ItemValidators.isEquippedToCurrentCharacter(this.item, characterId);
        };
        // Utils
        this.getRarityLevel = () => ItemUtils.getRarityLevel(this.item);
        this.generateContainerDefinitionKey = () => {
            return DefinitionHacks.hack__generateDefinitionKey(ContainerTypeEnum.ITEM, this.getMappingId());
        };
        this.getEquippedCharacterName = () => {
            var _a;
            const equippedEntityId = ItemAccessors.getEquippedEntityId(this.item);
            if (this.isEquippedToCurrentCharacter()) {
                return (_a = rulesEngineSelectors.getName(this.state)) !== null && _a !== void 0 ? _a : '';
            }
            if (equippedEntityId) {
                return this.getPartyMemberName(equippedEntityId);
            }
            return DefaultCharacterName;
        };
        this.getNotes = () => {
            const weaponSpellDamageGroups = rulesEngineSelectors.getWeaponSpellDamageGroups(this.state);
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const abilityLookup = rulesEngineSelectors.getAbilityLookup(this.state);
            const proficiencyBonus = rulesEngineSelectors.getProficiencyBonus(this.state);
            return ItemNotes.getNoteComponents(this.item, weaponSpellDamageGroups, ruleData, abilityLookup, proficiencyBonus);
        };
        this.getMetaText = () => {
            let metaItems = [];
            if (this.isLegacy()) {
                metaItems.push('Legacy');
            }
            const type = this.getType();
            if (type !== null) {
                metaItems.push(type);
            }
            if (this.isHexWeapon()) {
                metaItems.push('Hex Weapon');
            }
            if (this.isPactWeapon()) {
                metaItems.push('Pact Weapon');
            }
            if (this.isDedicatedWeapon()) {
                metaItems.push('Dedicated Weapon');
            }
            if (this.isOffhand()) {
                metaItems.push('Dual Wield');
            }
            if (this.isArmorContract()) {
                let baseArmorName = this.getBaseArmorName();
                if (baseArmorName) {
                    metaItems.push(baseArmorName);
                }
            }
            else if (this.isGearContract()) {
                let subType = this.getSubType();
                if (subType) {
                    metaItems.push(subType);
                }
            }
            if (this.getMasteryName()) {
                metaItems.push('Mastery');
            }
            if (this.isEquipped() && !this.isEquippedToCurrentCharacter()) {
                metaItems.push(`Equipped by ${this.getEquippedCharacterName()}`);
            }
            return metaItems;
        };
        this.getNumberUsed = () => {
            const limitedUse = ItemAccessors.getLimitedUse(this.item);
            if (limitedUse !== null) {
                return LimitedUseAccessors.getNumberUsed(limitedUse);
            }
            return null;
        };
        this.getAttackTypeName = () => {
            const attackType = this.getAttackType();
            let attackTypeName = '';
            if (attackType) {
                attackTypeName = RuleDataUtils.getAttackTypeRangeName(attackType);
            }
            return attackTypeName;
        };
        this.getMasteryAction = () => {
            const actions = rulesEngineSelectors.getActions(this.state);
            return ItemUtils.getMasteryAction(this.item, actions);
        };
        this.item = params.item;
        this.container = params.container || null;
    }
    /**
     *
     * @description This method is used to throw an error incase the manager was not created with a container
     */
    requiresContainer() {
        if (this.container === null) {
            throw new Error('Item does not have a container');
        }
        return this.container;
    }
}
ItemManager.getItem = getItem;
