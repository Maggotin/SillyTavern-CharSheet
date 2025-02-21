var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as ApiAdapterUtils from "../apiAdapter/utils";
import { characterActions } from '../actions';
import { ContainerAccessors, ContainerGenerators, ContainerUtils, ContainerValidators, } from '../engine/Container';
import { EntityTypeEnum, DefaultCharacterName } from '../engine/Core';
import { DefinitionHacks } from '../engine/Definition';
import { HelperUtils } from '../engine/Helper';
import { InfusionAccessors } from '../engine/Infusion';
import { ItemAccessors, ItemSimulators, ItemUtils, ItemValidators } from '../engine/Item';
import { ValueHacks } from '../engine/Value';
import { apiCreatorSelectors, characterSelectors, rulesEngineSelectors } from '../selectors';
import { getContainerManager } from './ContainerManager';
import { PartyManager } from './PartyManager';
export class InventoryManager extends PartyManager {
    constructor(params) {
        super(params);
        this.transformLoadedItems = (data) => {
            const globalModifiers = rulesEngineSelectors.getValidGlobalModifiers(this.state);
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const valueLookupByType = rulesEngineSelectors.getCharacterValueLookupByType(this.state);
            return data.map((definition) => ItemSimulators.simulateItem(definition, globalModifiers, valueLookupByType, ruleData, {
                simulatedItemContract: {
                    id: definition.id,
                },
            }));
        };
        /**
         *
         * Below methods are being depricated in favor of
         * moving the methods to container and item managers
         *
         */
        this.handleAcceptOnSuccess = (isShared, onSuccess) => {
            return () => {
                typeof onSuccess === 'function' && onSuccess();
                if (isShared) {
                    const data = {};
                    const eventType = this.EVENT_TYPES.ITEM_SHARED_FULFILLED;
                    this.sendMessage({ data, eventType });
                }
            };
        };
        this.handleRejectOnError = (onError, isShared) => {
            return () => {
                typeof onError === 'function' && onError();
            };
        };
        //Item Action Handlers
        /**
         * @deprecated
         */
        this.handleAdd = ({ item, amount, containerDefinitionKey }, onSuccess, onError) => {
            const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
            this.dispatch(characterActions.itemCreate(item, amount, this.handleAcceptOnSuccess(isShared, onSuccess), this.handleRejectOnError(onError), containerDefinitionKey));
        };
        this.handleCustomAdd = ({ customItem, containerDefinitionKey }, onSuccess, onError) => {
            var _a;
            const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey);
            this.dispatch(characterActions.customItemCreate((_a = customItem.name) !== null && _a !== void 0 ? _a : this.getDefaultCustomItemName(), customItem.description, customItem.cost, customItem.quantity, customItem.weight, customItem.notes, containerDefinitionKey, isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        /**
         * @deprecated
         */
        this.handleMove = ({ item, containerDefinitionKey }, onSuccess, onError) => {
            const definitionKeyId = DefinitionHacks.hack__getDefinitionKeyId(containerDefinitionKey);
            const definitionKeyType = DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey);
            if (definitionKeyId && definitionKeyType) {
                const isShared = this.isSharedContainerDefinitionKey(containerDefinitionKey) || this.isShared(item);
                this.dispatch(characterActions.itemMoveSet(ItemAccessors.getMappingId(item), definitionKeyId, definitionKeyType, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        /**
         * @deprecated
         */
        this.handleRemove = ({ item }, onSuccess, onError) => {
            const isCustomItem = ItemAccessors.isCustom(item);
            const isShared = this.isShared(item);
            if (isCustomItem) {
                this.dispatch(characterActions.customItemDestroy(ItemAccessors.getDefinitionId(item), ItemAccessors.getMappingId(item), isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
            else {
                const isContainer = ItemAccessors.isContainer(item);
                const infusion = ItemAccessors.getInfusion(item);
                this.dispatch(characterActions.itemDestroy(ItemAccessors.getMappingId(item), isContainer && infusion ? false : true, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        /**
         * @deprecated
         */
        this.handleEquip = ({ item }, onSuccess, onError) => {
            const characterId = rulesEngineSelectors.getId(this.state);
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemEquippedSet(ItemAccessors.getMappingId(item), true, characterId, EntityTypeEnum.CHARACTER, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        /**
         * @deprecated
         */
        this.handleUnequip = ({ item }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemEquippedSet(ItemAccessors.getMappingId(item), false, null, null, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        this.handleAttune = ({ item }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemAttuneSet(ItemAccessors.getMappingId(item), true, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        this.handleUnattune = ({ item }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemAttuneSet(ItemAccessors.getMappingId(item), false, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        this.handleQuantitySet = ({ item, quantity }, onSuccess, onError) => {
            const originalQuantity = ItemAccessors.getQuantity(item);
            if (originalQuantity === quantity) {
                return;
            }
            const isShared = this.isShared(item);
            const isCustomItem = ItemAccessors.isCustom(item);
            if (isCustomItem) {
                this.handleCustomEdit({ item, adjustments: { quantity } }, onSuccess, onError);
            }
            else {
                this.dispatch(characterActions.itemQuantitySet(ItemAccessors.getMappingId(item), quantity, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        /**
         * @deprecated - moved to the item
         * @param param0
         * @param onSuccess
         * @param onError
         */
        this.handleChargesSet = ({ item, used }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemChargesSet(ItemAccessors.getMappingId(item), used, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        this.handleCustomEdit = ({ item, adjustments }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            let originalContract = ItemAccessors.getOriginalContract(item);
            if (originalContract !== null) {
                let newProperties = Object.assign(Object.assign({}, originalContract), adjustments);
                this.dispatch(characterActions.customItemSet(ItemAccessors.getDefinitionId(item), newProperties, ItemAccessors.getMappingId(item), isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
            }
        };
        this.handleCustomizationSet = ({ item, adjustmentType, value }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.valueSet(adjustmentType, value, null, ValueHacks.hack__toString(ItemAccessors.getMappingId(item)), ValueHacks.hack__toString(ItemAccessors.getMappingEntityTypeId(item)), null, null, isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        this.handleCustomizationsRemove = ({ item }, onSuccess, onError) => {
            const isShared = this.isShared(item);
            this.dispatch(characterActions.itemCustomizationsDelete(ItemAccessors.getMappingId(item), ItemAccessors.getMappingEntityTypeId(item), isShared ? this.getPartyId() : null, this.handleAcceptOnSuccess(isShared, onSuccess)));
        };
        // Validators
        this.canAddToContainer = (container) => {
            const isShared = ContainerAccessors.isShared(container);
            return !isShared || this.isSharingTurnedOn();
        };
        /**
         * @deprecated
         */
        this.canEquipUnequipItem = (item) => {
            const isShared = this.isShared(item);
            const canEquip = ItemAccessors.canEquip(item);
            const isEquipped = ItemAccessors.isEquipped(item);
            if (isShared && canEquip) {
                if (this.isSharingTurnedOn() || (this.isSharingTurnedDeleteOnly() && isEquipped)) {
                    return isEquipped ? this.isEquippedToCurrentCharacter(item) : true;
                }
                return false;
            }
            return canEquip;
        };
        this.canAttuneUnattuneItem = (item) => {
            const hasMaxAttunedItems = rulesEngineSelectors.hasMaxAttunedItems(this.state);
            const isShared = this.isShared(item);
            const canAttune = ItemAccessors.canAttune(item);
            const isAttuned = ItemAccessors.isAttuned(item);
            if (!isAttuned) {
                if (isShared) {
                    if (this.isSharingTurnedDeleteOnly()) {
                        return false;
                    }
                    return this.isEquippedToCurrentCharacter(item) && !hasMaxAttunedItems && canAttune;
                }
                return !hasMaxAttunedItems && canAttune;
            }
            else {
                if (isShared) {
                    return this.isEquippedToCurrentCharacter(item);
                }
                return true;
            }
        };
        this.canModifyQuantity = (item) => {
            const isShared = this.isShared(item);
            const isStackable = ItemAccessors.isStackable(item);
            if (isShared && isStackable) {
                return this.isSharingTurnedOn();
            }
            return isStackable;
        };
        this.canCustomizeItem = (item) => {
            const isShared = this.isShared(item);
            if (isShared) {
                return this.isSharingTurnedOn();
            }
            return true;
        };
        this.canUseItemCharges = (item) => {
            const isShared = this.isShared(item);
            if (isShared) {
                return this.isSharingTurnedOn();
            }
            return !!ItemAccessors.getLimitedUse(item);
        };
        this.canRemoveItem = (item) => {
            const isShared = this.isShared(item);
            if (isShared) {
                const infusion = ItemAccessors.getInfusion(item);
                if (infusion) {
                    const infusionCharacterId = InfusionAccessors.getCharacterId(infusion);
                    if (infusionCharacterId !== rulesEngineSelectors.getId(this.state)) {
                        return false;
                    }
                }
                return ItemAccessors.isEquipped(item)
                    ? this.isSharingTurnedOnOrDeleteOnly() && this.isEquippedToCurrentCharacter(item)
                    : this.isSharingTurnedOnOrDeleteOnly();
            }
            return true;
        };
        this.canMoveItem = (item) => {
            // If you are changing this, you may want to change the canRemoveItem above
            const isShared = this.isShared(item);
            if (isShared) {
                const infusion = ItemAccessors.getInfusion(item);
                if (infusion) {
                    const infusionCharacterId = InfusionAccessors.getCharacterId(infusion);
                    if (infusionCharacterId !== rulesEngineSelectors.getId(this.state)) {
                        return false;
                    }
                }
                return ItemAccessors.isEquipped(item)
                    ? this.isSharingTurnedOnOrDeleteOnly() && this.isEquippedToCurrentCharacter(item)
                    : this.isSharingTurnedOnOrDeleteOnly();
            }
            else if (this.isSharingTurnedDeleteOnly()) {
                const localContainers = rulesEngineSelectors.getCharacterInventoryContainers(this.state);
                return localContainers.length > 1;
            }
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            return Object.keys(containerLookup).length > 1;
        };
        this.canShareItem = (item) => {
            const isContainer = ItemAccessors.isContainer(item);
            if (!isContainer) {
                return false;
            }
            const isShared = this.isShared(item);
            return !isShared && this.isSharingTurnedOn();
        };
        this.canClaimItem = (item) => {
            const isContainer = ItemAccessors.isContainer(item);
            if (!isContainer || (ItemAccessors.isEquipped(item) && !this.isEquippedToCurrentCharacter(item))) {
                return false;
            }
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            const isShared = this.isShared(item);
            if (isShared) {
                // If container is shared and has items equipped to others, then it can't be claimed
                const definitionKey = DefinitionHacks.hack__generateDefinitionKey(EntityTypeEnum.ITEM, ItemAccessors.getMappingId(item));
                const container = HelperUtils.lookupDataOrFallback(containerLookup, definitionKey);
                if (container) {
                    const infusion = ItemAccessors.getInfusion(item);
                    if (infusion) {
                        const infusionCharacterId = InfusionAccessors.getCharacterId(infusion);
                        if (infusionCharacterId !== rulesEngineSelectors.getId(this.state)) {
                            return false;
                        }
                    }
                    const inventory = rulesEngineSelectors.getAllInventoryItems(this.state);
                    const inventoryItems = ContainerUtils.getInventoryItems(container, inventory);
                    const itemsEquippedToOthers = inventoryItems.filter((item) => ItemAccessors.isEquipped(item) && !this.isEquippedToCurrentCharacter(item));
                    if (itemsEquippedToOthers.length) {
                        return false;
                    }
                }
                return this.isSharingTurnedOnOrDeleteOnly();
            }
            return false;
        };
        this.isSharedContainerDefinitionKey = (containerDefinitionKey) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            return ContainerValidators.validateIsShared(containerDefinitionKey, containerLookup);
        };
        this.isShared = (item) => {
            const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
            return ItemUtils.isShared(item, containerLookup);
        };
        /**
         * @deprecated
         */
        this.isEquippedToCurrentCharacter = (item) => {
            const characterId = rulesEngineSelectors.getId(this.state);
            return ItemValidators.isEquippedToCurrentCharacter(item, characterId);
        };
        this.isInfused = (item) => {
            const infusion = ItemAccessors.getInfusion(item);
            return !!infusion;
        };
        /**
         * @deprecated
         */
        this.getEquippedCharacterName = (item) => {
            var _a;
            const equippedEntityId = ItemAccessors.getEquippedEntityId(item);
            if (this.isEquippedToCurrentCharacter(item)) {
                return (_a = rulesEngineSelectors.getName(this.state)) !== null && _a !== void 0 ? _a : '';
            }
            if (equippedEntityId) {
                return this.getPartyMemberName(equippedEntityId);
            }
            return DefaultCharacterName;
        };
        this.getPartyEquipmentContainerDefinitionKey = () => {
            const partyId = this.getPartyId();
            if (partyId) {
                return ContainerUtils.getPartyContainerDefinitionKey(partyId);
            }
            return null;
        };
        this.getCharacterContainerDefinitionKey = () => {
            const characterId = rulesEngineSelectors.getId(this.state);
            return ContainerUtils.getCharacterContainerDefinitionKey(characterId);
        };
        this.getDefaultCustomItemName = () => {
            const customItems = rulesEngineSelectors.getCustomItems(this.state);
            return `Custom Item ${customItems.length + 1}`;
        };
        this.params = params;
    }
    getCharacterContainers() {
        const characterContainers = rulesEngineSelectors.getCharacterInventoryContainers(this.state);
        return this.generateContainerManagers(characterContainers);
    }
    getPartyContainers() {
        const partyContainers = rulesEngineSelectors.getPartyInventoryContainers(this.state);
        return this.generateContainerManagers(partyContainers);
    }
    getAllContainers() {
        const containers = rulesEngineSelectors.getInventoryContainers(this.state);
        return this.generateContainerManagers(containers);
    }
    getContainer(containerDefinitionKey) {
        const containerLookup = rulesEngineSelectors.getContainerLookup(this.state);
        const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
        return container ? getContainerManager(Object.assign(Object.assign({}, this.params), { container })) : null;
    }
    generateContainerManagers(containers) {
        return containers.map((container) => getContainerManager(Object.assign(Object.assign({}, this.params), { container })));
    }
    getInventoryShoppe({ onSuccess, additionalApiConfig, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const characterId = characterSelectors.getId(this.state);
            // TODO: this can be cached sometimes? recall when pane closes and opens? needs a cache reset function?
            const loadItems = apiCreatorSelectors.makeLoadAvailableItems(this.state);
            const response = yield loadItems(additionalApiConfig);
            let data = ApiAdapterUtils.getResponseData(response);
            let transformedItems = [];
            // TODO: it would be nice to clean this double loop up transform map and filter...
            if (data) {
                transformedItems = this.transformLoadedItems(data.filter((item) => item.canBeAddedToInventory));
            }
            const ruleData = rulesEngineSelectors.getRuleData(this.state);
            const shoppeContainer = ContainerGenerators.generateContainer(-1, -1, 'Item Shoppe', transformedItems, false, null, null, characterId, null, ruleData);
            const shoppeManager = getContainerManager(Object.assign(Object.assign({}, this.params), { container: shoppeContainer, overrideItems: transformedItems }));
            onSuccess(shoppeManager);
            return shoppeManager;
        });
    }
}
