import { keyBy } from 'lodash';
import { DefinitionAccessors, DefinitionUtils } from '../Definition';
/**
 *
 * @param definition
 */
export function generatePoolDefinitionType(definition) {
    return DefinitionUtils.getDefinitionKeyType(DefinitionAccessors.getDefinitionKey(definition));
}
/**
 *
 * @param definitions
 */
export function generatePoolDefinitionItems(definitions) {
    return keyBy(definitions, (definition) => DefinitionUtils.getDefinitionKeyId(DefinitionAccessors.getDefinitionKey(definition)));
}
