import { ActivationAccessors } from '../Activation';
import { FeatureTypeEnum, } from '../Core';
/**
 *
 * @param racialTrait
 */
export function getUniqueKey(racialTrait) {
    return `${getId(racialTrait)}-${getEntityTypeId(racialTrait)}`;
}
/**
 *
 * @param racialTrait
 */
export function getDefinition(racialTrait) {
    return racialTrait.definition;
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionKey(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.definitionKey) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param racialTrait
 */
export function getName(racialTrait) {
    return getDefinitionName(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionName(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param racialTrait
 */
export function getId(racialTrait) {
    return getDefinitionId(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionId(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param racialTrait
 */
export function getEntityTypeId(racialTrait) {
    return getDefinitionEntityTypeId(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionEntityTypeId(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.entityTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param racialTrait
 */
export function getEntityRaceId(racialTrait) {
    return getDefinitionEntityRaceId(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionEntityRaceId(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.entityRaceId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param racialTrait
 */
export function getEntityRaceTypeId(racialTrait) {
    return getDefinitionEntityRaceTypeId(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionEntityRaceTypeId(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.entityRaceTypeId) !== null && _b !== void 0 ? _b : -1;
}
/**
 *
 * @param racialTrait
 */
export function getDescription(racialTrait) {
    return getDefinitionDescription(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionDescription(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getSourceId(racialTrait) {
    return getDefinitionSourceId(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionSourceId(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.sourceId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getSourcePage(racialTrait) {
    return getDefinitionSourcePage(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionSourcePage(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.sourcePageNumber) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getActivation(racialTrait) {
    return getDefinitionActivation(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionActivation(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.activation) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getActivationTime(racialTrait) {
    return ActivationAccessors.getTime(getActivation(racialTrait));
}
/**
 *
 * @param racialTrait
 */
export function getActivationType(racialTrait) {
    return ActivationAccessors.getType(getActivation(racialTrait));
}
/**
 *
 * @param racialTrait
 */
export function getSnippet(racialTrait) {
    return getDefinitionSnippet(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionSnippet(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.snippet) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getDisplayOrder(racialTrait) {
    return getDefinitionDisplayOrder(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionDisplayOrder(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.displayOrder) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param racialTrait
 */
export function getHideInBuilder(racialTrait) {
    return getDefinitionHideInBuilder(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionHideInBuilder(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.hideInBuilder) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param racialTrait
 */
export function getHideInSheet(racialTrait) {
    return getDefinitionHideInSheet(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionHideInSheet(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.hideInSheet) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param racialTrait
 */
export function getCreatureRules(racialTrait) {
    return getDefinitionCreatureRules(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionCreatureRules(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.creatureRules) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionSpellListIds(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.spellListIds) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param racialTrait
 */
export function getSpellListIds(racialTrait) {
    return getDefinitionSpellListIds(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionAffectedFeatureDefinitionKeys(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.affectedFeatureDefinitionKeys) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param racialTrait
 */
export function getAffectedFeatureDefinitionKeys(racialTrait) {
    return getDefinitionAffectedFeatureDefinitionKeys(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getFeatureType(racialTrait) {
    return getDefinitionFeatureType(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionFeatureType(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.featureType) !== null && _b !== void 0 ? _b : FeatureTypeEnum.GRANTED;
}
/**
 *
 * @param racialTrait
 */
export function getSources(racialTrait) {
    return getDefinitionSources(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionSources(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param racialTrait
 */
export function isCalledOut(racialTrait) {
    return getDefinitionIsCalledOut(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function getDefinitionIsCalledOut(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.isCalledOut) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param racialTrait
 */
export function getSpells(racialTrait) {
    return racialTrait.spells;
}
/**
 *
 * @param racialTrait
 */
export function getOptions(racialTrait) {
    return racialTrait.options;
}
/**
 *
 * @param racialTrait
 */
export function getActions(racialTrait) {
    return racialTrait.actions;
}
/**
 *
 * @param racialTrait
 */
export function getChoices(racialTrait) {
    return racialTrait.choices;
}
/**
 *
 * @param racialTrait
 */
export function getFeats(racialTrait) {
    return racialTrait.feats;
}
/**
 *
 * @param racialTrait
 */
export function getModifiers(racialTrait) {
    return racialTrait.modifiers;
}
/**
 *
 * @param racialTrait
 */
export function getAccessType(racialTrait) {
    return racialTrait.accessType;
}
/**
 *
 * @param racialTrait
 * @returns {Record<string, number>}
 */
export function getDisplayConfiguration(racialTrait) {
    var _a, _b;
    return (_b = (_a = racialTrait.definition) === null || _a === void 0 ? void 0 : _a.displayConfiguration) !== null && _b !== void 0 ? _b : null;
}
export function getRequiredLevel(racialTrait) {
    return getDefinitionRequiredLevel(racialTrait);
}
export function getDefinitionRequiredLevel(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.requiredLevel) !== null && _b !== void 0 ? _b : 0;
}
export function getCategories(racialTrait) {
    var _a, _b;
    return (_b = (_a = getDefinition(racialTrait)) === null || _a === void 0 ? void 0 : _a.categories) !== null && _b !== void 0 ? _b : [];
}
