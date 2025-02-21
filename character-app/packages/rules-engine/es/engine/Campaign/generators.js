import { ItemGenerators } from '../Item';
import { getPartyBaseInventoryContracts } from './accessors';
/**
 *
 * @param partyInfo
 * @param modifierLookup
 * @param spellLookup
 * @param valueLookup
 * @param inventoryInfusionLookup
 * @param ruleData
 */
export function generateBasePartyInventory(partyInfo, modifierLookup, spellLookup, valueLookup, inventoryInfusionLookup, ruleData) {
    return partyInfo
        ? ItemGenerators.generateBaseItems(getPartyBaseInventoryContracts(partyInfo), modifierLookup, spellLookup, valueLookup, inventoryInfusionLookup, ruleData)
        : [];
}
