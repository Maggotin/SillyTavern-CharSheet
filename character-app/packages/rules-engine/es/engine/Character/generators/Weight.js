import { ContainerAccessors, ContainerTypeEnum } from '../../Container';
import { ItemDerivers, ItemValidators } from '../../Item';
import { RuleDataAccessors } from '../../RuleData';
/**
 *
 * @param currencies
 * @param preferences
 * @param ruleData
 */
export function generateCoinWeight(currencies, preferences, ruleData) {
    let weight = 0;
    if (currencies === null) {
        return weight;
    }
    if (preferences !== null && !preferences.ignoreCoinWeight) {
        RuleDataAccessors.getCurrencyData(ruleData).forEach((currencyInfo) => {
            if (currencyInfo.name !== null) {
                const heldCurrencyAmount = currencies[currencyInfo.name.toLowerCase()];
                if (heldCurrencyAmount) {
                    weight += currencyInfo.weight * heldCurrencyAmount;
                }
            }
        });
    }
    return weight;
}
/**
 *
 * @param allItems
 * @param customItems
 * @returns {number}
 */
export function generateItemWeight(allItems, customItems) {
    return ItemDerivers.deriveItemsWeightTotal(allItems) + ItemDerivers.deriveItemsWeightTotal(customItems);
}
/**
 *
 * @param characterContainers
 * @param partyContainers
 * @param characterId
 * @returns {number}
 */
export function generateContainerItemWeight(characterContainers, partyContainers, characterId) {
    return [...characterContainers, ...partyContainers].reduce((acc, container) => {
        const type = ContainerAccessors.getContainerType(container);
        const isEquipped = ContainerAccessors.isEquipped(container);
        if (type === ContainerTypeEnum.ITEM && isEquipped) {
            // A container item
            const containerItem = ContainerAccessors.getItem(container);
            // Ignore containers equipped to someone else in the party inventory
            if (containerItem && ItemValidators.isEquippedToCurrentCharacter(containerItem, characterId)) {
                const appliedWeight = ContainerAccessors.getWeightInfo(container).itemApplied;
                acc += appliedWeight;
            }
        }
        if (type === ContainerTypeEnum.CHARACTER || type === ContainerTypeEnum.CAMPAIGN) {
            // Based on the generateContainerWeightInfo generator,
            // when looking at the top level party inventory,
            // applied weight only includes items that are equipped to you.
            const appliedWeight = ContainerAccessors.getWeightInfo(container).itemApplied;
            acc += appliedWeight;
        }
        return acc;
    }, 0);
}
/**
 *
 * @param characterContainers
 * @param partyContainers
 * @param characterId
 * @param preferences
 * @returns {number}
 */
export function generateCointainerCoinWeight(characterContainers, partyContainers, characterId, preferences) {
    // 0 when ignoring coin weight
    if (!preferences || preferences.ignoreCoinWeight) {
        return 0;
    }
    // Whether cointainers are enabled or not, the process is the same.
    // All the coins will be in the top level character container if cointainers are off.
    return [...characterContainers, ...partyContainers].reduce((acc, container) => {
        const type = ContainerAccessors.getContainerType(container);
        const isEquipped = ContainerAccessors.isEquipped(container);
        if (type === ContainerTypeEnum.ITEM && isEquipped) {
            const containerItem = ContainerAccessors.getItem(container);
            if (containerItem && ItemValidators.isEquippedToCurrentCharacter(containerItem, characterId)) {
                const appliedWeight = ContainerAccessors.getWeightInfo(container).coinApplied;
                acc += appliedWeight;
            }
        }
        if (type === ContainerTypeEnum.CHARACTER || type === ContainerTypeEnum.CAMPAIGN) {
            const appliedWeight = ContainerAccessors.getWeightInfo(container).coinApplied;
            acc += appliedWeight;
        }
        return acc;
    }, 0);
}
/**
 * //TODO could include suppliers data
 * @param itemWeight
 * @param coinWeight
 */
export function generateTotalWeight(itemWeight, coinWeight) {
    // When coin weight is ignored, coinWeight will be 0.
    return itemWeight + coinWeight;
}
