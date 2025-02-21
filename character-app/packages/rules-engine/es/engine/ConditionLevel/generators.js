import { DataOriginTypeEnum } from '../DataOrigin';
import { ModifierGenerators } from '../Modifier';
import { getEntityTypeId, getId } from './accessors';
/**
 *
 * @param conditionLevel
 * @param condition
 * @param modifierLookup
 */
export function generateConditionLevel(conditionLevel, condition, modifierLookup) {
    const modifiers = ModifierGenerators.generateModifiers(getId(conditionLevel), getEntityTypeId(conditionLevel), modifierLookup, DataOriginTypeEnum.CONDITION, condition);
    return Object.assign(Object.assign({}, conditionLevel), { modifiers });
}
