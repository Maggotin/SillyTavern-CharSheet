import { AccessTypeEnum } from '../Access';
import { DefinitionPoolUtils } from '../DefinitionPool';
/**
 *
 * @param definitionKey
 * @param definitionPool
 */
export function simulateRacialTrait(definitionKey, definitionPool) {
    const definition = DefinitionPoolUtils.getRacialTraitDefinition(definitionKey, definitionPool);
    if (definition === null) {
        return null;
    }
    const racialTraitMapping = simulateRacialTraitContract({ definition });
    return simulateRacialTraitFromContract(racialTraitMapping, DefinitionPoolUtils.getDefinitionAccessType(definitionKey, definitionPool));
}
/**
 *
 * @param racialTraitMapping
 * @param accessType
 */
export function simulateRacialTraitFromContract(racialTraitMapping, accessType) {
    return Object.assign(Object.assign({}, racialTraitMapping), { actions: [], choices: [], feats: [], modifiers: [], options: [], spells: [], accessType: accessType !== null && accessType !== void 0 ? accessType : AccessTypeEnum.OWNED });
}
/**
 *
 * @param racialTraitProps
 */
export function simulateRacialTraitContract(racialTraitProps) {
    return Object.assign({ definition: null }, racialTraitProps);
}
