import { ClassAccessors } from '../Class';
import { DataOriginTypeEnum } from '../DataOrigin';
import { getLevel, getDataOrigin, getDataOriginType } from './accessors';
/**
 *
 * @param infusionChoice
 */
export function validateIsAvailable(infusionChoice) {
    const dataOrigin = getDataOrigin(infusionChoice);
    const dataOriginType = getDataOriginType(infusionChoice);
    if (dataOrigin) {
        switch (dataOriginType) {
            case DataOriginTypeEnum.CLASS_FEATURE:
                const charClass = dataOrigin.parent;
                if (getLevel(infusionChoice) <= ClassAccessors.getLevel(charClass)) {
                    return true;
                }
                break;
            default:
            // not implemented
        }
    }
    return false;
}
