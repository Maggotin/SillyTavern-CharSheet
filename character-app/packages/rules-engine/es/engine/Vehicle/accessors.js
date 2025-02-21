import { TypeScriptUtils } from '../../utils';
/**
 *
 * @param vehicle
 */
export function getAccessType(vehicle) {
    return vehicle.accessType;
}
/**
 *
 * @param vehicle
 */
export function getId(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param vehicle
 */
export function getMappingId(vehicle) {
    return vehicle.id;
}
/**
 *
 * @param vehicle
 */
export function getCharacterId(vehicle) {
    return vehicle.characterId;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionKey(vehicle) {
    return vehicle.definitionKey;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionDefinitionKey(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.definitionKey) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param vehicle
 */
export function getDefinitionId(vehicle) {
    return vehicle.definitionId;
}
/**
 *
 * @param vehicle
 */
export function getUniqueKey(vehicle) {
    return vehicle.uniqueKey;
}
/**
 *
 * @param vehicle
 */
export function getAvatarUrl(vehicle) {
    return getDefinitionAvatarUrl(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionAvatarUrl(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.avatarUrl) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getName(vehicle) {
    return vehicle.name ? vehicle.name : getDefinitionName(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionName(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
export function getSlug(vehicle) {
    return getDefinitionSlug(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionSlug(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.slug) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionStats(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.stats) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getActionsText(vehicle) {
    return getDefinitionActionsText(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionActionsText(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.actionsText) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionActions(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.actions) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getActions(vehicle) {
    return vehicle.actions;
}
/**
 *
 * @param vehicle
 */
export function getActionSummaries(vehicle) {
    return getDefinitionComponentActionSummaries(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionComponentActionSummaries(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.componentActionSummaries) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getAllActions(vehicle) {
    return vehicle.allActions;
}
/**
 *
 * @param vehicle
 */
export function getCargoCapacity(vehicle) {
    return getDefinitionCargoCapacity(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionCargoCapacity(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.cargoCapacity) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getCargoCapacityDescription(vehicle) {
    return getDefinitionCargoCapacityDescription(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionCargoCapacityDescription(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.cargoCapacityDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getEnabledConditions(vehicle) {
    return getDefinitionEnabledConditions(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionEnabledConditions(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.enabledConditions) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getActiveConditionLookup(vehicle) {
    return vehicle.activeConditionLookup;
}
/**
 *
 * @param vehicle
 */
export function getActiveConditions(vehicle) {
    return vehicle.activeConditions;
}
/**
 *
 * @param vehicle
 */
export function getConditions(vehicle) {
    return vehicle.conditions;
}
/**
 *
 * @param vehicle
 */
export function getRemainingFuel(vehicle) {
    return vehicle.remainingFuel;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionFuelData(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.fuelData) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getFuelData(vehicle) {
    return vehicle.fuelData;
}
/**
 *
 * @param vehicle
 */
export function getPrimaryComponent(vehicle) {
    return vehicle.primaryComponent;
}
/**
 *
 * @param vehicle
 */
export function getComponents(vehicle) {
    return vehicle.components;
}
/**
 *
 * @param vehicle
 */
export function getActionStations(vehicle) {
    return vehicle.actionStations;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionComponents(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.components) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getConditionImmunities(vehicle) {
    return getDefinitionConditionImmunities(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionConditionImmunities(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.conditionImmunities) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getCreatureCapacityDescriptions(vehicle) {
    return vehicle.creatureCapacityDescriptions;
}
/**
 *
 * @param vehicle
 */
export function getCreatureCapacity(vehicle) {
    return getDefinitionCreatureCapacity(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionCreatureCapacity(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.creatureCapacity) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getDamageImmunities(vehicle) {
    return getDefinitionDamageImmunities(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionDamageImmunities(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.damageImmunities) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getLength(vehicle) {
    return getDefinitionLength(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionLength(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getWidth(vehicle) {
    return getDefinitionWidth(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionWidth(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getLevels(vehicle) {
    return getDefinitionLevels(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionLevels(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.levels) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getStats(vehicle) {
    return vehicle.stats;
}
/**
 *
 * @param vehicle
 */
export function getTravelPace(vehicle) {
    return getDefinitionTravelPace(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionTravelPace(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.travelPace) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getTravelPaceEffectiveHours(vehicle) {
    return getDefinitionTravelPaceEffectiveHours(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionTravelPaceEffectiveHours(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.travelPaceEffectiveHours) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getLargeAvatarUrl(vehicle) {
    return getDefinitionLargeAvatarUrl(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionLargeAvatarUrl(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.largeAvatarUrl) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getType(vehicle) {
    return getDefinitionType(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionType(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getUrl(vehicle) {
    return getDefinitionUrl(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionUrl(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getWeight(vehicle) {
    return getDefinitionWeight(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionWeight(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.weight) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getConfigurations(vehicle) {
    return getDefinitionConfigurations(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionConfigurations(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.configurations) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getConfigurationLookup(vehicle) {
    return vehicle.configurationLookup;
}
/**
 *
 * @param vehicle
 */
export function getConfigurationValueLookup(vehicle) {
    return vehicle.configurationValueLookup;
}
/**
 *
 * @param vehicle
 */
export function getStatLookup(vehicle) {
    return vehicle.statLookup;
}
/**
 *
 * @param vehicle
 */
export function getFeatures(vehicle) {
    return vehicle.features;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionFeatures(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.features) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getDamageImmunityInfos(vehicle) {
    return vehicle.damageImmunityInfos;
}
/**
 *
 * @param vehicle
 */
export function getConditionImmunityInfos(vehicle) {
    return vehicle.conditionImmunityInfos;
}
/**
 *
 * @param vehicle
 */
export function getSizeId(vehicle) {
    return vehicle.sizeId;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionSizeId(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.sizeId) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getSizeInfo(vehicle) {
    return vehicle.sizeInfo;
}
/**
 *
 * @param vehicle
 */
export function getNotes(vehicle) {
    return vehicle.notes;
}
/**
 *
 * @param vehicle
 */
export function getDefinitionDescription(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getDescription(vehicle) {
    return vehicle.description;
}
/**
 *
 * @param vehicle
 */
export function getObjectTypeInfo(vehicle) {
    return vehicle.objectTypeInfo;
}
/**
 *
 * @param vehicle
 */
export function getMovementKeys(vehicle) {
    return vehicle.movementKeys;
}
/**
 *
 * @param vehicle
 */
export function getMovementNames(vehicle) {
    return vehicle.movementNames;
}
/**
 *
 * @param vehicle
 */
export function getTypeName(vehicle) {
    var _a, _b;
    return (_b = (_a = getObjectTypeInfo(vehicle)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param vehicle
 */
export function getSearchTags(vehicle) {
    return [getDefinitionName(vehicle), getTypeName(vehicle)].filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param vehicle
 */
export function getAllComponentsData(vehicle) {
    return [...getComponents(vehicle), ...getActionStations(vehicle)];
}
/**
 *
 * @param vehicle
 */
export function getDefinitionSources(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.sources) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param vehicle
 */
export function getSources(vehicle) {
    return getDefinitionSources(vehicle);
}
/**
 *
 * @param vehicle
 */
export function getDefinitionIsHomebrew(vehicle) {
    var _a, _b;
    return (_b = (_a = vehicle.definition) === null || _a === void 0 ? void 0 : _a.isHomebrew) !== null && _b !== void 0 ? _b : false;
}
/**
 *
 * @param vehicle
 */
export function isHomebrew(vehicle) {
    return getDefinitionIsHomebrew(vehicle);
}
