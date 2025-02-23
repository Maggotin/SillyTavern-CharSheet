import { HelperUtils } from '../Helper';
import { DEFINITION_KEY_SEPARATOR } from './constants';
import { getDefinitionKeyId, getDefinitionKeyType } from './utils';
/**
 *
 * @param type
 * @param id
 */
export function hack__generateDefinitionKey(type, id) {
    return `${type}${DEFINITION_KEY_SEPARATOR}${id}`;
}
/**
 *
 * @param definitionKey
 */
export function hack__getDefinitionKeyId(definitionKey) {
    return HelperUtils.parseInputInt(getDefinitionKeyId(definitionKey));
}
/**
 *
 * @param definitionKey
 */
export function hack__getDefinitionKeyType(definitionKey) {
    return HelperUtils.parseInputInt(getDefinitionKeyType(definitionKey));
}
