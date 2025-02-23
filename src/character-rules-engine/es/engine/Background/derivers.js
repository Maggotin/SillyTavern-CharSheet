import { getEntityTypeId, getId } from './accessors';
/**
 *
 * @param background
 */
export function deriveUniqueKey(background) {
    return [getId(background), getEntityTypeId(background)].join('-');
}
