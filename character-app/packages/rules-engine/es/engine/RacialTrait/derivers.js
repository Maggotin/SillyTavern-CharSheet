import { AppContextTypeEnum } from '../Core';
import { getHideInBuilder, getHideInSheet } from './accessors';
/**
 *
 * @param racialTrait
 * @param context
 */
export function deriveHideInContext(racialTrait, context) {
    if (context !== null && context === AppContextTypeEnum.SHEET) {
        return getHideInSheet(racialTrait);
    }
    return getHideInBuilder(racialTrait);
}
/**
 *
 * @param racialTrait
 */
export function deriveContextData(racialTrait) {
    return {};
}
