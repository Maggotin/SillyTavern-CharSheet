/**
 *
 * @param option
 */
export function getId(option) {
    return getDefinitionId(option);
}
/**
 *
 * @param option
 */
export function getDefinitionId(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param option
 */
export function getEntityTypeId(option) {
    return getDefinitionEntityTypeId(option);
}
/**
 *
 * @param option
 */
export function getDefinitionEntityTypeId(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param option
 */
export function getUniqueKey(option) {
    return `${getId(option)}-${getEntityTypeId(option)}`;
}
/**
 *
 * @param option
 */
export function getActivation(option) {
    return getDefinitionActivation(option);
}
/**
 *
 * @param option
 */
export function getDefinitionActivation(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.activation) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param option
 */
export function getName(option) {
    return getDefinitionName(option);
}
/**
 *
 * @param option
 */
export function getDefinitionName(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param option
 */
export function getSourceId(option) {
    return getDefinitionSourceId(option);
}
/**
 *
 * @param option
 */
export function getDefinitionSourceId(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.sourceId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param option
 */
export function getSourcePage(option) {
    return getDefinitionSourcePage(option);
}
/**
 *
 * @param option
 */
export function getDefinitionSourcePage(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.sourcePageNumber) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param option
 */
export function getSnippet(option) {
    return getDefinitionSnippet(option);
}
/**
 *
 * @param option
 */
export function getDefinitionSnippet(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param option
 */
export function getDescription(option) {
    return getDefinitionDescription(option);
}
/**
 *
 * @param option
 */
export function getDefinitionDescription(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param option
 */
export function getCreatureRules(option) {
    return getDefinitionCreatureRules(option);
}
/**
 *
 * @param option
 */
export function getDefinitionCreatureRules(option) {
    var _a, _b;
    return (_b = (_a = option.definition) === null || _a === void 0 ? void 0 : _a.creatureRules) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param option
 */
export function getComponentId(option) {
    return option.componentId;
}
/**
 *
 * @param option
 */
export function getComponentTypeId(option) {
    return option.componentTypeId;
}
/**
 *
 * @param option
 */
export function getDataOrigin(option) {
    return option.dataOrigin;
}
/**
 *
 * @param option
 */
export function getDataOriginType(option) {
    const dataOrigin = getDataOrigin(option);
    return dataOrigin.type;
}
/**
 *
 * @param option
 */
export function getActions(option) {
    return option.actions;
}
/**
 *
 * @param option
 */
export function getFeats(option) {
    return option.feats;
}
/**
 *
 * @param option
 */
export function getSpells(option) {
    return option.spells;
}
/**
 *
 * @param option
 */
export function getModifiers(option) {
    return option.modifiers;
}
