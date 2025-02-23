import { HelperUtils } from '../Helper';
import { getType } from './accessors';
import { InfusionTypeEnum } from './constants';
/**
 * This is a temporary workaround til we have item definition game data service.  Once we can
 * load item definitions as needed, we can fully calculate requiresItemChoice at the
 * same time as we generate the infusion
 * @param infusion
 * @param itemId
 * @param itemCanBeAddedLookup
 * @returns {boolean}
 */
export function hack__requiresItemChoice(infusion, itemId = null, itemCanBeAddedLookup = {}) {
    if (getType(infusion) !== InfusionTypeEnum.REPLICATE) {
        return true;
    }
    return !this.hack__itemCanBeAddedToInventory(infusion, itemId, itemCanBeAddedLookup);
}
/**
 *
 * @param infusion
 * @param itemId
 * @param itemCanBeAddedLookup
 */
export function hack__itemCanBeAddedToInventory(infusion, itemId, itemCanBeAddedLookup) {
    if (getType(infusion) !== InfusionTypeEnum.REPLICATE) {
        return true;
    }
    const fallback = false;
    if (itemId === null) {
        return fallback;
    }
    return HelperUtils.lookupDataOrFallback(itemCanBeAddedLookup, itemId, fallback);
}
