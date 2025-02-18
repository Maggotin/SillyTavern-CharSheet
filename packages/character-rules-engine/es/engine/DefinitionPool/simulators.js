import { DefinitionUtils } from '../Definition';
/**
 *
 * @param definitions
 * @param accessType
 */
export function simulateAccessTypeLookup(definitions, accessType) {
    return definitions.reduce((acc, definition) => {
        if (definition.definitionKey) {
            acc[DefinitionUtils.getDefinitionKeyId(definition.definitionKey)] = accessType;
        }
        return acc;
    }, {});
}
