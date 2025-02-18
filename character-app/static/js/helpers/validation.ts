/**
 * https://github.com/Microsoft/TypeScript/issues/16069#issuecomment-369374214
 * Used to get around array filter function that errors because it doesn't recognize the filter
 * is removing nulls
 * @param input
 */
export const isNotNullOrUndefined = <T extends Object>(
  input: null | undefined | T
): input is T => {
  return input !== null;
};
