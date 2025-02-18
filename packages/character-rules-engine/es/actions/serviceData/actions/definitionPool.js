import { DefinitionPoolGenerators } from '../../../engine/DefinitionPool';
import * as actionTypes from '../actionTypes';
/**
 *
 * @param definitions
 * @param definitionAccessTypeLookup
 */
export function definitionPoolAdd(definitions, definitionAccessTypeLookup) {
    return {
        type: actionTypes.DEFINITION_POOL_ADD,
        payload: {
            type: DefinitionPoolGenerators.generatePoolDefinitionType(definitions[0]),
            definitions: DefinitionPoolGenerators.generatePoolDefinitionItems(definitions),
            definitionAccessTypeLookup,
        },
        meta: {
            commit: {
                type: actionTypes.DEFINITION_POOL_ADD_COMMIT,
            },
        },
    };
}
