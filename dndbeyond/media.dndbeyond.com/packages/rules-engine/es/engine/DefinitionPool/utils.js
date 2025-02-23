import { values } from 'lodash';
import { AccessTypeEnum, AccessUtils } from '../Access';
import { DefinitionAccessors, DefinitionTypeEnum, DefinitionUtils } from '../Definition';
import { DefinitionPoolTypeInfoKeyEnum } from './constants';
/**
 *
 * @param type
 * @param id
 * @param definitionPool
 */
export function canAccessDefinition(type, id, definitionPool) {
    const accessTypeLookup = getTypedDefinitionAccessTypeLookup(type, definitionPool);
    if (accessTypeLookup && accessTypeLookup[id] && AccessUtils.isAccessible(accessTypeLookup[id])) {
        return true;
    }
    return false;
}
/**
 *
 * @param type
 * @param definitionPool
 * @param includeNonAccessibleDefinition
 */
export function getTypedDefinitionList(type, definitionPool, includeNonAccessibleDefinition = false) {
    const lookup = getTypedDefinitionLookup(type, definitionPool);
    if (lookup) {
        const definitions = values(lookup); // lodash values is giving typing conflicts
        return definitions.filter((definition) => includeNonAccessibleDefinition ||
            (!includeNonAccessibleDefinition &&
                canAccessDefinition(DefinitionUtils.getDefinitionKeyType(DefinitionAccessors.getDefinitionKey(definition)), DefinitionUtils.getDefinitionKeyId(DefinitionAccessors.getDefinitionKey(definition)), definitionPool)));
    }
    return [];
}
/**
 *
 * @param type
 * @param definitionPool
 */
export function getTypedDefinitionLookup(type, definitionPool) {
    if (definitionPool[type]) {
        return definitionPool[type][DefinitionPoolTypeInfoKeyEnum.DEFINITION_LOOKUP];
    }
    return null;
}
/**
 *
 * @param type
 * @param definitionPool
 */
export function getTypedDefinitionAccessTypeLookup(type, definitionPool) {
    if (definitionPool[type]) {
        return definitionPool[type][DefinitionPoolTypeInfoKeyEnum.ACCESS_TYPE_LOOKUP];
    }
    return null;
}
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function getDefinitionAccessType(definitionKey, definitionPool) {
    const type = DefinitionUtils.getDefinitionKeyType(definitionKey);
    const typedDefinitionAccessLookup = getTypedDefinitionAccessTypeLookup(type, definitionPool);
    const id = DefinitionUtils.getDefinitionKeyId(definitionKey);
    if (typedDefinitionAccessLookup && typedDefinitionAccessLookup[id]) {
        return typedDefinitionAccessLookup[id];
    }
    return AccessTypeEnum.NO_ACCESS;
}
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function getInfusionDefinition(definitionKey, definitionPool) {
    const type = DefinitionTypeEnum.INFUSION;
    const id = DefinitionUtils.getDefinitionKeyId(definitionKey);
    const typedDefinitionLookup = getTypedDefinitionLookup(type, definitionPool);
    if (typedDefinitionLookup && typedDefinitionLookup[id]) {
        return typedDefinitionLookup[id];
    }
    return null;
}
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function getVehicleDefinition(definitionKey, definitionPool) {
    const type = DefinitionTypeEnum.VEHICLE;
    const id = DefinitionUtils.getDefinitionKeyId(definitionKey);
    const typedDefinitionLookup = getTypedDefinitionLookup(type, definitionPool);
    if (typedDefinitionLookup && typedDefinitionLookup[id]) {
        return typedDefinitionLookup[id];
    }
    return null;
}
/**
 *
 * @param definitionPool
 */
export function getVehicleDefinitionList(definitionPool) {
    return getTypedDefinitionList(DefinitionTypeEnum.VEHICLE, definitionPool);
}
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function getClassFeatureDefinition(definitionKey, definitionPool) {
    const type = DefinitionTypeEnum.CLASS_FEATURE;
    const id = DefinitionUtils.getDefinitionKeyId(definitionKey);
    const typedDefinitionLookup = getTypedDefinitionLookup(type, definitionPool);
    if (typedDefinitionLookup && typedDefinitionLookup[id]) {
        return typedDefinitionLookup[id];
    }
    return null;
}
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function getRacialTraitDefinition(definitionKey, definitionPool) {
    const type = DefinitionTypeEnum.RACIAL_TRAIT;
    const id = DefinitionUtils.getDefinitionKeyId(definitionKey);
    const typedDefinitionLookup = getTypedDefinitionLookup(type, definitionPool);
    if (typedDefinitionLookup && typedDefinitionLookup[id]) {
        return typedDefinitionLookup[id];
    }
    return null;
}
