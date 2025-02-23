import { DataOriginGenerators, DataOriginTypeEnum } from '../DataOrigin';
/**
 *
 * @param definition
 */
export function simulateFeat(definition) {
    return {
        dataOrigin: DataOriginGenerators.generateDataOrigin(DataOriginTypeEnum.SIMULATED),
        actions: [],
        definition,
        definitionId: definition.id,
        componentId: -1,
        componentTypeId: -1,
        choices: [],
        spells: [],
        modifiers: [],
        options: [],
    };
}
