import { DEFINITION_KEY_SEPARATOR } from './constants';
/**
 *
 * @param definitionKey
 */
export function getDefinitionKeyType(definitionKey) {
    return definitionKey.split(DEFINITION_KEY_SEPARATOR)[0];
}
/**
 *
 * @param definitionKey
 */
export function getDefinitionKeyId(definitionKey) {
    return definitionKey.split(DEFINITION_KEY_SEPARATOR)[1];
}
