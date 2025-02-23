import { DefinitionHacks } from '../Definition';
import { getItemId, getItemTypeId } from './accessors';
/**
 *
 * @param knownInfusionMapping
 */
export function deriveItemDefinitionKey(knownInfusionMapping) {
    const itemTypeId = getItemTypeId(knownInfusionMapping);
    const itemId = getItemId(knownInfusionMapping);
    if (!itemTypeId || !itemId) {
        return null;
    }
    return DefinitionHacks.hack__generateDefinitionKey(itemTypeId, itemId);
}
