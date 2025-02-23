import { ClassAccessors } from '../Class';
import { DataOriginTypeEnum } from '../DataOrigin';
import { getLevelDivisor } from './accessors';
export function deriveContextLevelChallengeMax(rule, dataOrigin, xpInfo) {
    if (!getLevelDivisor(rule)) {
        return null;
    }
    let levelDivisor = getLevelDivisor(rule);
    if (levelDivisor === null) {
        levelDivisor = 1;
    }
    if (dataOrigin) {
        switch (dataOrigin.type) {
            case DataOriginTypeEnum.CLASS_FEATURE:
                return Math.floor(ClassAccessors.getLevel(dataOrigin.parent) / levelDivisor);
            default:
            // not implemented
        }
    }
    return Math.floor(xpInfo.currentLevel / levelDivisor);
}
