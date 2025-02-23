import { ActivationAccessors } from '../Activation';
import { FeatureTypeEnum } from '../Core';
/**
 *
 * @param feature
 */
export function getDefinition(feature) {
    return feature.definition;
}
/**
 *
 * @param feature
 */
export function getDefinitionKey(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.definitionKey) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param feature
 */
export function getName(feature) {
    return getDefinitionName(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionName(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param feature
 */
export function getId(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feature
 */
export function getEntityTypeId(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feature
 */
export function getUniqueKey(feature) {
    return `${getId(feature)}-${getEntityTypeId(feature)}`;
}
/**
 *
 * @param feature
 */
export function getDescription(feature) {
    return getDefinitionDescription(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionDescription(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getSourceId(feature) {
    return getDefinitionSourceId(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionSourceId(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.sourceId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getSourcePage(feature) {
    return getDefinitionSourcePage(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionSourcePage(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.sourcePageNumber) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getActivation(feature) {
    return getDefinitionActivation(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionActivation(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.activation) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getActivationTime(feature) {
    return ActivationAccessors.getTime(getActivation(feature));
}
/**
 *
 * @param feature
 */
export function getActivationType(feature) {
    return ActivationAccessors.getType(getActivation(feature));
}
/**
 *
 * @param feature
 */
export function getDefinitionLevelScales(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.levelScales) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getLevelScales(feature) {
    return getDefinitionLevelScales(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionLimitedUse(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.limitedUse) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getLimitedUse(feature) {
    return getDefinitionLimitedUse(feature);
}
/**
 *
 * @param feature
 */
export function getMultiClassDescription(feature) {
    return getDefinitionMultiClassDescription(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionMultiClassDescription(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.multiClassDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getSnippet(feature) {
    return getDefinitionSnippet(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionSnippet(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getDisplayOrder(feature) {
    return getDefinitionDisplayOrder(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionDisplayOrder(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.displayOrder) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param feature
 */
export function getHideInBuilder(feature) {
    return getDefinitionHideInBuilder(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionHideInBuilder(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.hideInBuilder) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param feature
 */
export function getHideInSheet(feature) {
    return getDefinitionHideInSheet(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionHideInSheet(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.hideInSheet) !== null && _b !== void 0 ? _b : false;
}
/**
 * @deprecated see getDefinitionIsSubClassFeature
 * @param feature
 */
export function getIsSubClassFeature(feature) {
    return getDefinitionIsSubClassFeature(feature);
}
/**
 * @deprecated we are switching to the property "classId" instead for more useful information
 * @param feature
 */
export function getDefinitionIsSubClassFeature(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.isSubClassFeature) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param feature
 */
export function getDefinitionClassId(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.classId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feature
 */
export function getClassId(feature) {
    return getDefinitionClassId(feature);
}
/**
 *
 * @param feature
 */
export function getRequiredLevel(feature) {
    return getDefinitionRequiredLevel(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionRequiredLevel(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.requiredLevel) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param feature
 */
export function getDefinitionCreatureRules(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.creatureRules) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getCreatureRules(feature) {
    return getDefinitionCreatureRules(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionSpellListIds(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.spellListIds) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getSpellListIds(feature) {
    return getDefinitionSpellListIds(feature);
}
/**
 *
 * @param feature
 */
export function getAffectedFeatureDefinitionKeys(feature) {
    return getDefinitionAffectedFeatureDefinitionKeys(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionAffectedFeatureDefinitionKeys(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.affectedFeatureDefinitionKeys) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getSources(feature) {
    return getDefinitionSources(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionSources(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getFeatureType(feature) {
    return getDefinitionFeatureType(feature);
}
/**
 *
 * @param feature
 */
export function getDefinitionFeatureType(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.featureType) !== null && _b !== void 0 ? _b : FeatureTypeEnum.GRANTED;
}
/**
 *
 * @param feature
 */
export function getLevelScale(feature) {
    return feature.levelScale;
}
/**
 *
 * @param feature
 */
export function getOptions(feature) {
    return feature.options;
}
/**
 *
 * @param feature
 */
export function getActions(feature) {
    return feature.actions;
}
/**
 *
 * @param feature
 */
export function getChoices(feature) {
    return feature.choices;
}
/**
 *
 * @param feature
 */
export function getModifiers(feature) {
    return feature.modifiers;
}
/**
 *
 * @param feature
 */
export function getSpells(feature) {
    return feature.spells;
}
/**
 *
 * @param feature
 */
export function getFeats(feature) {
    return feature.feats;
}
/**
 *
 * @param feature
 */
export function getInfusionChoices(feature) {
    return feature.infusionChoices;
}
/**
 *
 * @param feature
 */
export function getInfusionRules(feature) {
    var _a, _b;
    return (_b = (_a = getDefinition(feature)) === null || _a === void 0 ? void 0 : _a.infusionRules) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param feature
 */
export function getAccessType(feature) {
    return feature.accessType;
}
export function getFeatListContracts(featureContract) {
    var _a, _b;
    return (_b = (_a = getDefinition(featureContract)) === null || _a === void 0 ? void 0 : _a.grantedFeats) !== null && _b !== void 0 ? _b : [];
}
