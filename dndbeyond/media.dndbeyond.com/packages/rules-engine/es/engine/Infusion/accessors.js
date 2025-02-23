export function getChoiceKey(infusion) {
    return infusion.choiceKey;
}
export function getCharacterId(infusion) {
    return infusion.characterId;
}
export function getUniqueKey(infusion) {
    return infusion.uniqueKey;
}
export function getCreatureMappingId(infusion) {
    return infusion.creatureMappingId;
}
export function getDefinitionKey(infusion) {
    return infusion.definitionKey;
}
export function getInventoryMappingId(infusion) {
    return infusion.inventoryMappingId;
}
export function getItemId(infusion) {
    return infusion.itemId;
}
export function getItemTypeId(infusion) {
    return infusion.itemTypeId;
}
export function getModifierGroupId(infusion) {
    return infusion.modifierGroupId;
}
export function getMonsterId(infusion) {
    return infusion.monsterId;
}
export function getDefinitionActions(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.actions) !== null && _b !== void 0 ? _b : [];
}
export function getActions(infusion) {
    return getDefinitionActions(infusion);
}
export function getDefinitionAllowDuplicates(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.allowDuplicates) !== null && _b !== void 0 ? _b : false;
}
export function getAllowDuplicates(infusion) {
    return getDefinitionAllowDuplicates(infusion);
}
export function getDefinitionCreatureData(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.creatureData) !== null && _b !== void 0 ? _b : null;
}
export function getCreatureData(infusion) {
    return getDefinitionCreatureData(infusion);
}
export function getDefinitionDefinitionKey(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.definitionKey) !== null && _b !== void 0 ? _b : null;
}
export function getDefinitionDescription(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
export function getDescription(infusion) {
    return getDefinitionDescription(infusion);
}
export function getId(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
}
export function getDefinitionItemRuleData(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.itemRuleData) !== null && _b !== void 0 ? _b : null;
}
export function getItemRuleData(infusion) {
    return getDefinitionItemRuleData(infusion);
}
export function getDefinitionLevel(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : null;
}
export function getLevel(infusion) {
    return getDefinitionLevel(infusion);
}
export function getDefinitionModifierData(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.modifierData) !== null && _b !== void 0 ? _b : [];
}
export function getModifierData(infusion) {
    return getDefinitionModifierData(infusion);
}
export function getDefinitionModifierDataType(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.modifierDataType) !== null && _b !== void 0 ? _b : null;
}
export function getModifierDataType(infusion) {
    return getDefinitionModifierDataType(infusion);
}
export function getDefinitionName(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
export function getName(infusion) {
    return getDefinitionName(infusion);
}
export function getDefinitionRequiresAttunement(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.requiresAttunement) !== null && _b !== void 0 ? _b : false;
}
export function requiresAttunement(infusion) {
    return getDefinitionRequiresAttunement(infusion);
}
export function getDefinitionSnippet(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
export function getSnippet(infusion) {
    return getDefinitionSnippet(infusion);
}
export function getDefinitionType(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
}
export function getType(infusion) {
    return getDefinitionType(infusion);
}
/**
 *
 * @param infusion
 */
export function getAccessType(infusion) {
    return infusion.accessType;
}
/**
 *
 * @param infusion
 */
export function getSelectedModifierData(infusion) {
    return infusion.selectedModifierData;
}
/**
 * The deprecation is a lie
 *
 * see hack__requiresItemChoice() for details about why
 *
 * @deprecated
 * @param infusion
 * @returns {boolean}
 */
export function requiresItemChoice(infusion) {
    return infusion.requiresItemChoice;
}
/**
 *
 * @param infusion
 */
export function requiresModifierDataChoice(infusion) {
    return infusion.requiresModifierDataChoice;
}
/**
 *
 * @param infusion
 */
export function getDefinitionSources(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param infusion
 */
export function getSources(infusion) {
    return getDefinitionSources(infusion);
}
/**
 *
 * @param infusion
 */
export function getDefinitionIsHomebrew(infusion) {
    var _a, _b;
    return (_b = (_a = infusion.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param infusion
 */
export function isHomebrew(infusion) {
    return getDefinitionIsHomebrew(infusion);
}
