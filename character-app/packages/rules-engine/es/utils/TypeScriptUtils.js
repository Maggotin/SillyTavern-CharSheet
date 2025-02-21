/**
 * https://github.com/Microsoft/TypeScript/issues/16069#issuecomment-369374214
 * Used to get around array filter function that errors because it doesn't recognize the filter
 * is removing nulls
 * @param input
 */
export function isNotNullOrUndefined(input) {
    return input !== null;
}
/**
 *
 * @param x
 */
export function testUnreachable(x) {
    // not implemented, only here for param check
}
