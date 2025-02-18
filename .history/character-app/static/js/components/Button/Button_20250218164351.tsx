import clsx from "clsx";
import { FC } from "react";

import {
  Button as TtuiButton,
  ButtonProps as TtuiButtonProps,
} from "../../ttui/components/Button";

import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { ThemeMode } from "~/types";

import styles from "./styles.module.css";

interface ButtonProps
  extends Omit<TtuiButtonProps, "size" | "variant" | "color"> {
  size?: "xx-small" | TtuiButtonProps["size"];
  themed?: boolean;
  forceThemeMode?: ThemeMode;
  variant?: "builder" | "builder-text" | TtuiButtonProps["variant"];
  color?: "builder-green" | TtuiButtonProps["color"];
}

export const Button: FC<ButtonProps> = ({
  className,
  size = "medium",
  themed,
  variant = "solid",
  forceThemeMode,
  color,
  ...props
}) => {
  // Check if the button has a custom size
  const isCustomSize = size === "xx-small";
  const isCustomVariant = variant === "builder" || variant === "builder-text";
  const isCustomColor = color === "builder-green";
  const { isDarkMode } = useCharacterTheme();

  return (
    <TtuiButton
      // If the button has a custom size, use local styles
      className={clsx([
        styles[size],
        themed && styles.themed,
        forceThemeMode && styles[forceThemeMode],
        styles[variant],
        !forceThemeMode && isDarkMode && styles.dark,
        isCustomColor && styles[color],
        className,
      ])}
      // If the button has a normal size, pass prop normally
      size={!isCustomSize ? size : undefined}
      // If the button is themed, use theme colors
      variant={!isCustomVariant ? variant : undefined}
      // Children are included in props
      color={!isCustomColor ? color : undefined}
      {...props}
    />
  );
};
