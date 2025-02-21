import { ActivationAccessors } from '../Activation';
import { PrerequisiteAccessors } from '../Prerequisite';
/**
 *
 * @param feat
 */
export function getDefinition(feat) {
    return feat.definition;
}
/**
 *
 * @param feat
 */
export function getId(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feat
 */
export function getEntityTypeId(feat) {
    return getDefinitionEntityTypeId(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionEntityTypeId(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feat
 */
export function getUniqueKey(feat) {
    return `${getId(feat)}-${getEntityTypeId(feat)}`;
}
/**
 *
 * @param feat
 */
export function getName(feat) {
    return getDefinitionName(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionName(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param feat
 */
export function getActivation(feat) {
    return getDefinitionActivation(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionActivation(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.activation) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feat
 */
export function getActivationTime(feat) {
    return ActivationAccessors.getTime(getActivation(feat));
}
/**
 *
 * @param feat
 */
export function getActivationType(feat) {
    return ActivationAccessors.getType(getActivation(feat));
}
/**
 *
 * @param feat
 */
export function getSnippet(feat) {
    return getDefinitionSnippet(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionSnippet(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feat
 */
export function getDescription(feat) {
    return getDefinitionDescription(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionDescription(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feat
 */
export function getCreatureRules(feat) {
    return getDefinitionCreatureRules(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionCreatureRules(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.creatureRules) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feat
 */
export function getPrerequisites(feat) {
    return getDefinitionPrerequisites(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionPrerequisites(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.prerequisites) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feat
 */
export function getPrerequisiteDescription(feat) {
    const prerequisites = getPrerequisites(feat);
    return PrerequisiteAccessors.getDescription(prerequisites);
}
/**
 *
 * @param feat
 */
export function getComponentId(feat) {
    return feat.componentId;
}
/**
 *
 * @param feat
 */
export function getComponentTypeId(feat) {
    return feat.componentTypeId;
}
/**
 *
 * @param feat
 */
export function getOptions(feat) {
    return feat.options;
}
/**
 *
 * @param feat
 */
export function getActions(feat) {
    return feat.actions;
}
/**
 *
 * @param feat
 */
export function getChoices(feat) {
    return feat.choices;
}
/**
 *
 * @param feat
 */
export function getModifiers(feat) {
    return feat.modifiers;
}
/**
 *
 * @param feat
 */
export function getSpells(feat) {
    return feat.spells;
}
/**
 *
 * @param feat
 */
export function getDataOrigin(feat) {
    return feat.dataOrigin;
}
/**
 *
 * @param feat
 */
export function getDataOriginType(feat) {
    const dataOrigin = getDataOrigin(feat);
    return dataOrigin.type;
}
/**
 *
 * @param feat
 */
export function getDefinitionSources(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feat
 */
export function getSources(feat) {
    return getDefinitionSources(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionIsHomebrew(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param feat
 */
export function isHomebrew(feat) {
    return getDefinitionIsHomebrew(feat);
}
/**
 *
 * @param feat
 */
export function getCategories(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.categories) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feat
 */
export function getDefinitionIsRepeatable(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.isRepeatable) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param feat
 */
export function isRepeatable(feat) {
    return getDefinitionIsRepeatable(feat);
}
/**
 *
 * @param feat
 */
export function getDefinitionRepeatableParentId(feat) {
    var _a, _b;
    return (_b = (_a = feat.definition) === null || _a === void 0 ? void 0 : _a.repeatableParentId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feat
 */
export function getRepeatableParentId(feat) {
    return getDefinitionRepeatableParentId(feat);
}
