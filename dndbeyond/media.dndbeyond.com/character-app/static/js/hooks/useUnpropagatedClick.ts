import { MouseEvent, useCallback } from "react";

/**
 * Prevents click events from propagating to parent elements.
 * @param onClick The function to call when the element is clicked.
 * @returns A function that will prevent the click event from propagating.
 */
export const useUnpropagatedClick = (
  onClick?: (event: MouseEvent, ...args: unknown[]) => void
) => {
  const handleClick = useCallback(
    (event: MouseEvent, ...args: unknown[]) => {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      onClick?.(event, ...args);
    },
    [onClick]
  );

  return handleClick;
};
