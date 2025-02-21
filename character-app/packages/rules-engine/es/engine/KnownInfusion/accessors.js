import { HelperUtils } from '../Helper';
export function getCharacterId(knownInfusion) {
    return knownInfusion.characterId;
}
export function getChoiceKey(knownInfusion) {
    return knownInfusion.choiceKey;
}
export function getUniqueKey(knownInfusion) {
    return knownInfusion.uniqueKey;
}
export function getDefinitionKey(knownInfusion) {
    return knownInfusion.definitionKey;
}
export function getMappingId(knownInfusion) {
    return knownInfusion.id;
}
/**
 * TODO remove this once it is a string
 * @param knownInfusion
 * @returns {number | null}
 */
export function getItemId(knownInfusion) {
    if (knownInfusion.itemId !== null) {
        return HelperUtils.parseInputInt(knownInfusion.itemId);
    }
    return null;
}
export function getItemName(knownInfusion) {
    return knownInfusion.itemName;
}
export function getItemTypeId(knownInfusion) {
    return knownInfusion.itemTypeId;
}
export function getLegacyItemTypeId(knownInfusion) {
    return knownInfusion.legacyItemTypeId;
}
export function getSimulatedInfusion(knownInfusion) {
    return knownInfusion.simulatedInfusion;
}
export function getItemDefinitionKey(knownInfusion) {
    return knownInfusion.itemDefinitionKey;
}
