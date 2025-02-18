import clsx from "clsx";
import { ChangeEvent, FC, useEffect, useState } from "react";

import {
  Checkbox as TtuiCheckbox,
  CheckboxProps as TtuiCheckboxProps,
} from "@dndbeyond/ttui/components/Checkbox";

import styles from "./styles.module.css";

interface CheckboxProps extends TtuiCheckboxProps {
  themed?: boolean;
  darkMode?: boolean;
  variant?: "default" | "builder" | "sidebar";
  onClick?: (isEnabled: boolean) => void;
  onChangePromise?: (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
}

export const Checkbox: FC<CheckboxProps> = ({
  className,
  themed,
  variant = "default",
  darkMode,
  checked = false,
  onChangePromise,
  onClick,
  disabled,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    const newCheckedState = !isChecked;

    // promise-based logic
    if (onChangePromise) {
      onChangePromise(
        newCheckedState,
        () => {
          // Promise accepted, update the state
          setIsChecked(newCheckedState);
        },
        () => {
          // Promise rejected, do nothing
        }
      );
    } else {
      // Update the state immediately if no promise handling - only IF onClick is provided
      if (onClick) {
        onClick(newCheckedState);
        setIsChecked(newCheckedState);
      }
    }
  };
  return (
    <TtuiCheckbox
      className={clsx([
        themed && styles.themed,
        darkMode && styles[darkMode ? "darkMode" : "lightMode"],
        className,
        variant === "default" && styles.default,
        variant === "builder" && styles.builder,
      ])}
      onChange={handleChange}
      aria-pressed={isChecked}
      checked={isChecked}
      disabled={disabled}
      {...props}
    />
  );
};
