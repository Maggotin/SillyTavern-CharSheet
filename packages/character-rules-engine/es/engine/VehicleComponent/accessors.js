import { TypeScriptUtils } from '../../utils';
import { VehicleComponentGroupTypeEnum } from '../Vehicle';
/**
 *
 * @param component
 */
export function getActions(component) {
    return component.actions;
}
/**
 * @deprecated - this was a generated string of action name and description snippet that we no longer get on the definition
 * @param component
 */
export function getDefinitionActionsDescription(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.actionsDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 * @deprecated - this was a generated string of action name and description snippet that we no longer get on the definition
 * @param component
 */
export function getActionsDescription(component) {
    return getDefinitionActionsDescription(component);
}
/**
 *
 * @param component
 */
export function getComponentId(component) {
    return component.componentId;
}
/**
 *
 * @param component
 */
export function getCosts(component) {
    return getDefinitionCosts(component);
}
/**
 *
 * @param component
 */
export function getDefinitionCosts(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.costs) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param component
 */
export function getArmorClass(component) {
    return getDefinitionArmorClass(component);
}
/**
 *
 * @param component
 */
export function getDefinitionArmorClass(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.armorClass) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getArmorClassDescription(component) {
    return getDefinitionArmorClassDescription(component);
}
/**
 *
 * @param component
 */
export function getDefinitionArmorClassDescription(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.armorClassDescription) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getArmorClassInfo(component) {
    return component.armorClassInfo;
}
/**
 *
 * @param component
 */
export function getCoverType(component) {
    return getDefinitionCoverType(component);
}
/**
 *
 * @param component
 */
export function getDefinitionCoverType(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.coverType) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getRequiredCrew(component) {
    return getDefinitionRequiredCrew(component);
}
/**
 *
 * @param component
 */
export function getDefinitionRequiredCrew(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.requiredCrew) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getMishapThreshold(component) {
    return getDefinitionMishapThreshold(component);
}
/**
 *
 * @param component
 */
export function getDefinitionMishapThreshold(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.mishapThreshold) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getDamageThreshold(component) {
    return getDefinitionDamageThreshold(component);
}
/**
 *
 * @param component
 */
export function getDefinitionDamageThreshold(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.damageThreshold) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getMappingDescription(component) {
    return component.description;
}
/**
 *
 * @param component
 */
export function getDescription(component) {
    return component.description;
}
/**
 *
 * @param component
 */
export function getDefinitionDescription(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getDisplayOrder(component) {
    return component.displayOrder;
}
/**
 *
 * @param component
 */
export function getHitPoints(component) {
    return getDefinitionHitPoints(component);
}
/**
 *
 * @param component
 */
export function getDefinitionHitPoints(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.hitPoints) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getIsRemovable(component) {
    return component.isRemovable;
}
/**
 *
 * @param component
 */
export function getLevelId(component) {
    return component.levelId;
}
/**
 *
 * @param component
 */
export function getVehicleLevelId(component) {
    return component.vehicleLevelId;
}
/**
 *
 * @param component
 */
export function getName(component) {
    var _a;
    return (_a = component.name) !== null && _a !== void 0 ? _a : getDefinitionName(component);
}
/**
 *
 * @param component
 */
export function getDefinitionName(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getSpeedInfos(component) {
    return component.speedInfos;
}
/**
 *
 * @param component
 */
export function getSpeeds(component) {
    return getDefinitionSpeeds(component);
}
/**
 *
 * @param component
 */
export function getDefinitionSpeeds(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.speeds) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param component
 */
export function getTypes(component) {
    return getDefinitionTypes(component);
}
/**
 *
 * @param component
 */
export function getDefinitionTypes(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.types) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param component
 */
export function getId(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
}
/**
 *
 * @param component
 */
export function getMappingId(component) {
    return component.id;
}
/**
 *
 * @param component
 */
export function getCharacterId(component) {
    return component.characterId;
}
/**
 *
 * @param component
 */
export function getDefinitionDefinitionKey(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.definitionKey) !== null && _b !== void 0 ? _b : '';
}
/**
 *
 * @param component
 */
export function getDefinitionKey(component) {
    var _a;
    return (_a = component.definitionKey) !== null && _a !== void 0 ? _a : '';
}
/**
 *
 * @param component
 */
export function getDefinitionActions(component) {
    var _a, _b;
    return (_b = (_a = component.definition) === null || _a === void 0 ? void 0 : _a.actions) !== null && _b !== void 0 ? _b : [];
}
/**
 *
 * @param component
 */
export function getIsPrimary(component) {
    return component.isPrimaryComponent;
}
/**
 *
 * @param component
 */
export function getGroupType(component) {
    if (component.definition && component.definition.groupType !== null) {
        const groupType = component.definition
            .groupType;
        switch (groupType) {
            case VehicleComponentGroupTypeEnum.COMPONENT:
            case VehicleComponentGroupTypeEnum.ACTION_STATION:
                return groupType;
            default:
                TypeScriptUtils.testUnreachable(groupType);
        }
    }
    return VehicleComponentGroupTypeEnum.COMPONENT;
}
/**
 *
 * @param component
 */
export function getUniqueKey(component) {
    return component.uniqueKey;
}
/**
 *
 * @param component
 */
export function getUniquenessFactor(component) {
    return component.uniquenessFactor;
}
/**
 *
 * @param component
 */
export function getHitPointSpeedAdjustments(component) {
    return component.hitPointSpeedAdjustments;
}
/**
 *
 * @param component
 */
export function getHitPointInfo(component) {
    return component.hitPointInfo;
}
/**
 *
 * @param component
 */
export function getRemovedHitPoints(component) {
    return component.removedHitPoints;
}
/**
 *
 * @param component
 */
export function getVehicleMappingId(component) {
    return component.vehicleMappingId;
}
/**
 *
 * @param component
 */
export function getTypeNames(component) {
    return component.typeNames;
}
