import { ContainerAccessors } from '.';
import { PartyInventorySharingStateEnum } from '../Campaign';
import { ItemAccessors } from '../Item';
import { getDefinitionKey, getItemMappingIds, getName } from './accessors';
import { ContainerTypeEnum } from './constants';
/**
 *
 * @param containers
 * @param excludedDefinitionKeys
 * @returns {Array<Container>}
 */
export function getAvailableContainers(containers, excludedDefinitionKeys) {
    return containers.filter((container) => !excludedDefinitionKeys.includes(getDefinitionKey(container)));
}
/**
 * @param characterId
 * @returns {string}
 */
export function getCharacterContainerDefinitionKey(characterId) {
    return `${ContainerTypeEnum.CHARACTER}:${characterId}`;
}
/**
 * @param campaignId
 * @returns {string}
 */
export function getPartyContainerDefinitionKey(campaignId) {
    return `${ContainerTypeEnum.CAMPAIGN}:${campaignId}`;
}
/**
 *
 * @param containers
 * @param itemContainerDefinitionKey
 * @returns {Container | null}
 */
export function getItemParentContainer(containers, itemContainerDefinitionKey) {
    var _a;
    return (_a = containers.find((container) => getDefinitionKey(container) === itemContainerDefinitionKey)) !== null && _a !== void 0 ? _a : null;
}
/**
 *
 * @param container
 * @param inventory
 * @returns {Array<Item>}
 */
export function getInventoryItems(container, inventory) {
    return inventory.filter((item) => getItemMappingIds(container).includes(ItemAccessors.getMappingId(item)));
}
/**
 *
 * @param currentContainerDefinitionKey
 * @param containers
 * @returns {Array<MenuOption>}
 */
export function getGroupedOptions(currentContainerDefinitionKey, containers, label, sharingState) {
    const excludedKeys = [];
    if (currentContainerDefinitionKey) {
        excludedKeys.push(currentContainerDefinitionKey);
    }
    const availableContainers = getAvailableContainers(containers, excludedKeys);
    const characterContainers = availableContainers.filter((container) => !ContainerAccessors.isShared(container));
    const partyContainers = availableContainers.filter(ContainerAccessors.isShared);
    const options = [];
    if (characterContainers.length) {
        options.push({
            label,
            options: characterContainers.map((container) => ({
                value: getDefinitionKey(container),
                label: getName(container),
            })),
        });
    }
    // Only display Party inventory if there are containers and the sharing state is turned to on
    // ( e.g. hide these containers as options when OFF and in DELETE_ONLY )
    if (partyContainers.length && sharingState === PartyInventorySharingStateEnum.ON) {
        options.push({
            label: `${!characterContainers.length ? `${label} ` : ''}Party Inventory`,
            options: partyContainers.map((container) => ({
                value: getDefinitionKey(container),
                label: getName(container),
            })),
        });
    }
    return options;
}
