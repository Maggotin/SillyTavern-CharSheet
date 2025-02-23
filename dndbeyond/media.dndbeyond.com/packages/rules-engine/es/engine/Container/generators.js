import { keyBy, sortBy } from 'lodash';
import { ConfigUtils } from '../../config';
import { CampaignAccessors, CampaignUtils } from '../Campaign';
import { generateCoinWeight } from '../Character/generators';
import { DefinitionHacks } from '../Definition';
import { FeatureFlagEnum, FeatureFlagInfoUtils } from '../FeatureFlagInfo';
import { ItemAccessors, ItemDerivers, ItemValidators } from '../Item';
import { getDefinitionKey, getName, isShared } from './accessors';
import { ContainerTypeEnum } from './constants';
function generateInitialCoins() {
    return {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0,
    };
}
/**
 *
 * @param items
 * @param customItems
 * @param characterId
 * @param partyInfo
 * @param partyInventory
 * @param featureFlagInfo
 * @param characterCoin
 * @param preferences
 * @param ruleData
 */
export function generateContainers(items, customItems, characterId, partyInfo, partyInventory, featureFlagInfo, characterCoin, preferences, ruleData) {
    let sharingStateActive = false;
    if (partyInfo && CampaignUtils.isSharingStateActive(CampaignAccessors.getSharingState(partyInfo))) {
        sharingStateActive = true;
    }
    const partyInventoryActive = FeatureFlagInfoUtils.getFeatureFlagInfoValue(FeatureFlagEnum.RELEASE_GATE_IMS, featureFlagInfo) &&
        sharingStateActive;
    const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
    // Do we want to display Cointainers? You betcha!
    const canCointainer = (preferences === null || preferences === void 0 ? void 0 : preferences.enableContainerCurrency) && (rulesEngineConfig === null || rulesEngineConfig === void 0 ? void 0 : rulesEngineConfig.canUseCurrencyContainers);
    //if includeCustomItems on the config is true - customItems are added on the Inventory as Items
    //if includeCustomItems on the config is false/undefined (mobile until v5.1 support) - use the customItem contracts on the character JSON
    const { includeCustomItems } = ConfigUtils.getCurrentRulesEngineConfig();
    const includeCustomItemContractsInEquipment = !includeCustomItems;
    const equipmentContainer = generateContainer(characterId, ContainerTypeEnum.CHARACTER, 'Equipment', 
    //TODO v5.1: All customItems mappings belong to character container for mobile until they can support customItems in containers
    includeCustomItemContractsInEquipment ? [...customItems, ...items] : items, false, null, characterCoin, characterId, preferences, ruleData);
    const itemContainers = items
        .filter(ItemAccessors.isContainer)
        .map((containerItem) => {
        var _a;
        return generateContainer(ItemAccessors.getMappingId(containerItem), ContainerTypeEnum.ITEM, ItemAccessors.getName(containerItem), items, false, containerItem, canCointainer ? (_a = ItemAccessors.getCurrency(containerItem)) !== null && _a !== void 0 ? _a : generateInitialCoins() : null, characterId, preferences, ruleData);
    });
    const campaignId = partyInfo ? CampaignAccessors.getId(partyInfo) : null;
    let partyEquipmentContainer = null;
    let partyContainers = [];
    if (partyInventoryActive && campaignId) {
        partyEquipmentContainer = generateContainer(campaignId, ContainerTypeEnum.CAMPAIGN, 'Party Equipment', partyInventory, true, null, partyInfo ? CampaignAccessors.getCoin(partyInfo) : null, characterId, preferences, ruleData);
        partyContainers = partyInventory
            .filter(ItemAccessors.isContainer)
            .map((containerItem) => {
            var _a;
            return generateContainer(ItemAccessors.getMappingId(containerItem), ContainerTypeEnum.ITEM, ItemAccessors.getName(containerItem), partyInventory, true, containerItem, canCointainer ? (_a = ItemAccessors.getCurrency(containerItem)) !== null && _a !== void 0 ? _a : generateInitialCoins() : null, characterId, preferences, ruleData);
        });
    }
    const playerContainers = sortBy(itemContainers, (container) => getName(container));
    return partyInventoryActive && partyEquipmentContainer
        ? [equipmentContainer, ...playerContainers, partyEquipmentContainer, ...partyContainers]
        : [equipmentContainer, ...playerContainers];
}
/**
 *
 * @param mappingId
 * @param containerType
 * @param name
 * @param availableInventory
 * @param isShared
 * @param item
 * @param coin
 * @param characterId
 * @param preferences
 * @param ruleData
 */
export function generateContainer(mappingId, containerType, name, availableInventory, isShared, item, coin, characterId, preferences, ruleData) {
    let definitionKey = DefinitionHacks.hack__generateDefinitionKey(containerType, mappingId);
    const contents = availableInventory.filter((item) => ItemAccessors.getContainerDefinitionKey(item) === definitionKey && !ItemAccessors.isContainer(item));
    const infusedItems = contents.filter(ItemAccessors.getInfusion);
    return {
        containerType,
        coin,
        definitionKey,
        mappingId,
        name,
        hasInfusions: !!infusedItems.length,
        item,
        infusedItemMappingIds: infusedItems.map(ItemAccessors.getMappingId),
        itemMappingIds: contents.map(ItemAccessors.getMappingId),
        isEquipped: item ? ItemAccessors.isEquipped(item) : null,
        isShared,
        weightInfo: generateContainerWeightInfo(containerType, contents, item, characterId, coin, preferences, ruleData),
    };
}
export function generateContainerWeightInfo(type, containerInventory, item, characterId, coin, preferences, ruleData) {
    // Item total is the weight of all of the items in the container
    const itemTotal = ItemDerivers.deriveItemsWeightTotal(containerInventory);
    const coinTotal = generateCoinWeight(coin, preferences, ruleData);
    const total = itemTotal + coinTotal;
    // Default case is the character equipment container. All of its weight is applied.
    let capacity = 0;
    let itemApplied = itemTotal;
    let coinApplied = coinTotal;
    let applied = total;
    if (type === ContainerTypeEnum.ITEM && item) {
        // Case: It's a container, either in the character or party inventory.
        // The weight of the container itself (5lbs for a backpack, for example)
        // should be added in.
        // Some containers, such as bags of holding, have a weight multiplier to nullify
        // the weight of the contents.
        // The weight multiplier also affects coins.
        capacity = ItemAccessors.getCapacityWeight(item);
        const itemWeight = ItemAccessors.getWeight(item);
        const weightMultiplier = ItemAccessors.getWeightMultiplier(item);
        itemApplied = itemWeight + itemTotal * weightMultiplier;
        coinApplied = coinTotal * weightMultiplier;
        applied = itemApplied + coinApplied;
    }
    else if (type === ContainerTypeEnum.CAMPAIGN) {
        // Special case: This is the top level party inventory.
        // Go through the items. Only items equipped to the current character
        // are added to the applied weight.
        itemApplied = containerInventory.reduce((acc, containerItem) => {
            const itemEquippedToCharacter = ItemValidators.isEquippedToCurrentCharacter(containerItem, characterId);
            if (itemEquippedToCharacter) {
                return acc + ItemAccessors.getWeight(containerItem);
            }
            return acc;
        }, 0);
        coinApplied = 0; // never apply coin weight from the top level party inventory
        applied = itemApplied;
    }
    return {
        applied,
        capacity,
        total,
        itemTotal,
        coinTotal,
        itemApplied,
        coinApplied,
    };
}
/**
 *
 * @param containers
 */
export function generateCharacterContainers(containers) {
    return containers.filter((container) => !isShared(container));
}
/**
 *
 * @param containers
 */
export function generatePartyContainers(containers) {
    return containers.filter(isShared);
}
/**
 *
 * @param containers
 */
export function generateContainerLookup(containers) {
    return keyBy(containers, (container) => getDefinitionKey(container));
}
