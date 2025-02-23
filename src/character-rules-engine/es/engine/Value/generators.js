import { groupBy, keyBy } from 'lodash';
import { getEntityContextKey, getTypeId, getUniqueKey } from './accessors';
/**
 *
 * @param typeId
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @returns
 */
export function generateUniqueKey(typeId, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null) {
    return `${typeId}-${valueId}-${valueTypeId}-${contextId}-${contextTypeId}`;
}
/**
 *
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @returns
 */
export function generateEntityContextKey(valueId = null, valueTypeId = null, contextId = null, contextTypeId = null) {
    if (valueId === null) {
        return 'null';
    }
    return `${valueId}-${valueTypeId}-${contextId}-${contextTypeId}`;
}
/**
 *
 * @param valueId
 * @param valueTypeId
 * @returns
 */
export function generateEntityKey(valueId = null, valueTypeId = null) {
    if (valueId === null) {
        return 'null';
    }
    return `${valueId}-${valueTypeId}`;
}
/**
 *
 * @param values
 */
export function generateCharacterValueLookup(values) {
    return keyBy(values, (value) => getUniqueKey(value));
}
/**
 *
 * @param values
 */
export function generateCharacterEntityValueLookup(values) {
    const groups = groupBy(values, (value) => getEntityContextKey(value));
    const lookup = {};
    Object.keys(groups).forEach((groupKey) => {
        lookup[groupKey] = keyBy(groups[groupKey], 'typeId');
    });
    return lookup;
}
/**
 *
 * @param values
 */
export function generateCharacterTypeValueLookup(values) {
    return groupBy(values, (value) => getTypeId(value));
}
