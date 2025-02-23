import { ClassAccessors } from '../Class';
import { DataOriginTypeEnum } from '../DataOrigin';
import { getDataOrigin, getDataOriginType } from './accessors';
export function getContextData(option) {
    const dataOrigin = getDataOrigin(option);
    const dataOriginType = getDataOriginType(option);
    let classLevel;
    switch (dataOriginType) {
        case DataOriginTypeEnum.CLASS_FEATURE:
            classLevel = ClassAccessors.getLevel(dataOrigin.parent);
            break;
        default:
        // not implemented
    }
    return {
        classLevel,
    };
}
