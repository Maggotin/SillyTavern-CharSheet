import { SourceTypeEnum } from '../../Core';
/**
 *
 * @param source
 */
export function isPrimarySource(source) {
    return source.sourceType === SourceTypeEnum.PRIMARY;
}
/**
 *
 * @param source
 */
export function isSecondarySource(source) {
    return source.sourceType === SourceTypeEnum.SECONDARY;
}
/**
 *
 * @param source
 */
export function isHiddenSource(source) {
    return source.sourceType === SourceTypeEnum.HIDDEN;
}
