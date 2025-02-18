import { DefinitionHacks } from '../Definition';
import { HelperUtils } from '../Helper';
import { getDefinitionKey, getWeightInfo, isShared } from './accessors';
import { ContainerTypeEnum } from './constants';
/**
 *
 * @param container
 * @returns
 */
export function isCharacterContainer(container) {
    return DefinitionHacks.hack__getDefinitionKeyType(getDefinitionKey(container)) === ContainerTypeEnum.CHARACTER;
}
/**
 *
 * @param container
 * @returns {boolean}
 */
export function isPartyContainer(container) {
    return isPartyContainerDefinitionKey(getDefinitionKey(container));
}
/**
 *
 * @param containerDefinitionKey
 * @returns {boolean}
 */
export function isPartyContainerDefinitionKey(containerDefinitionKey) {
    return DefinitionHacks.hack__getDefinitionKeyType(containerDefinitionKey) === ContainerTypeEnum.CAMPAIGN;
}
export function validateIsShared(containerDefinitionKey, containerLookup) {
    const container = HelperUtils.lookupDataOrFallback(containerLookup, containerDefinitionKey);
    return container ? isShared(container) : false;
}
/**
 *
 * @param container
 */
export function isOverCapacity(container) {
    const weightInfo = getWeightInfo(container);
    return weightInfo.total > weightInfo.capacity;
}
