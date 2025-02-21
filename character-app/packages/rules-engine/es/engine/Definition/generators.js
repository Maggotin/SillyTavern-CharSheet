import { DEFINITION_KEY_SEPARATOR } from './constants';
/**
 *
 * @param type
 * @param id
 */
export function generateDefinitionKey(type, id) {
    return `${type}${DEFINITION_KEY_SEPARATOR}${id}`;
}
