import { DefinitionPoolUtils } from '../DefinitionPool';
import { deriveRequiresItemChoice, deriveRequiresModifierDataChoice, deriveSelectedModifierData } from './derivers';
import { generateBaseInfusion } from './generators';
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function simulateInfusion(definitionKey, definitionPool) {
    const infusionDefinition = DefinitionPoolUtils.getInfusionDefinition(definitionKey, definitionPool);
    if (infusionDefinition === null) {
        return null;
    }
    const simulatedMapping = {
        characterId: -1,
        choiceKey: '',
        creatureMappingId: -1,
        definitionKey,
        inventoryMappingId: -1,
        modifierGroupId: '',
        monsterId: -1,
        itemId: -1,
        itemTypeId: -1,
    };
    const baseInfusion = generateBaseInfusion(simulatedMapping, infusionDefinition);
    return Object.assign(Object.assign({}, baseInfusion), { accessType: DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool), selectedModifierData: deriveSelectedModifierData(baseInfusion), requiresItemChoice: deriveRequiresItemChoice(baseInfusion), requiresModifierDataChoice: deriveRequiresModifierDataChoice(baseInfusion) });
}
