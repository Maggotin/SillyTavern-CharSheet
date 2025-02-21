import { ConditionLevelAccessors } from '../ConditionLevel';
import { getDefinitionLevels } from './accessors';
/**
 *
 * @param condition
 */
export function getLevelEffectLookup(condition) {
    const levels = getDefinitionLevels(condition);
    if (levels.length === 0) {
        return null;
    }
    return levels.reduce((acc, levelData) => {
        const level = ConditionLevelAccessors.getLevel(levelData);
        const effect = ConditionLevelAccessors.getEffect(levelData);
        if (!acc[level] && effect !== null) {
            acc[level] = effect;
        }
        return acc;
    }, {});
}
