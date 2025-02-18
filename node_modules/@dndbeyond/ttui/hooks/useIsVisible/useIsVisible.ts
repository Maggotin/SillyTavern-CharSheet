import { useEffect, useRef, useState, type MutableRefObject } from "react";

/**
 * A hook to use for determining open and closed states
 * @param initialValue Whether the component should start visible or not
 *
 * @returns {ref} A ref to be given to parent object
 * @returns {isVisible} Boolean value to decide whether to show
 * element or not
 * @returns {setIsVisible} Dispatch function to update the value of
 * isVisible
 */

interface Return<T> {
  ref: MutableRefObject<T | null>;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const useIsVisible = <T = HTMLDivElement>(
  initialValue: boolean,
): Return<T> => {
  const [isVisible, setIsVisible] = useState(initialValue);
  const ref = useRef<T | null>(null);

  // Handles clicks outside the parent ref
  const handleClickOutside = (e: MouseEvent) => {
    const containsElement =
      e.composedPath().indexOf(ref.current as EventTarget) !== -1;

    if (ref.current && !containsElement) setIsVisible(false);
  };

  useEffect(
    () => {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { ref, isVisible, setIsVisible };
};
