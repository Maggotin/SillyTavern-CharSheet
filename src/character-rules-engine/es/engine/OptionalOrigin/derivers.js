import { DefinitionHacks, DefinitionTypeEnum } from '../Definition';
/**
 * use hack until ids are strings
 *
 * @param id
 */
export function deriveDefinitionKey(id) {
    return DefinitionHacks.hack__generateDefinitionKey(DefinitionTypeEnum.RACIAL_TRAIT, id);
}
