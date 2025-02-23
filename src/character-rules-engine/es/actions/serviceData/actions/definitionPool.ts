import { DefinitionPoolGenerators } from '../../../engine/DefinitionPool';
import * as actionTypes from '../actionTypes/definitionPool';

interface DefinitionPoolAddAction {
    type: typeof actionTypes.DEFINITION_POOL_ADD;
    payload: {
        type: ReturnType<typeof DefinitionPoolGenerators.generatePoolDefinitionType>;
        definitions: ReturnType<typeof DefinitionPoolGenerators.generatePoolDefinitionItems>;
        definitionAccessTypeLookup: unknown;
    };
    meta: {
        commit: {
            type: typeof actionTypes.DEFINITION_POOL_ADD_COMMIT;
        };
    };
}

/**
 *
 * @param definitions
 * @param definitionAccessTypeLookup
 */
export function definitionPoolAdd(
    definitions: unknown[],
    definitionAccessTypeLookup: unknown
): DefinitionPoolAddAction {
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