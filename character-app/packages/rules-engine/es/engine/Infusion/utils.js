import { ItemAccessors } from '../Item';
import { getItemRuleData } from './accessors';
import { hack__itemCanBeAddedToInventory } from './hacks';
import { validateItemByInfusionRules } from './validators';
/**
 *
 * @param items
 * @param infusion
 * @param itemId
 * @param itemCanBeAddedLookup
 */
export function filterAvailableItems(items, infusion, itemId = null, itemCanBeAddedLookup = {}) {
    if (itemId !== null && !hack__itemCanBeAddedToInventory(infusion, itemId, itemCanBeAddedLookup)) {
        return items.filter((item) => itemId === ItemAccessors.getGroupedId(item));
    }
    const itemRuleData = getItemRuleData(infusion);
    if (itemRuleData === null) {
        return [];
    }
    let availableItems = [];
    const andRules = itemRuleData.itemRules !== null ? itemRuleData.itemRules : [];
    if (andRules.length) {
        availableItems = items.filter((item) => validateItemByInfusionRules(item, andRules));
    }
    return availableItems;
}
