"use client";

import clsx from "clsx";
import React, { type AllHTMLAttributes, type ButtonHTMLAttributes, type FC, type PropsWithChildren } from "react";
import styles from "../styles/Button.module.css";
import sizeStyles from "../styles/ButtonSizes.module.css";
import variantStyles from "../styles/ButtonVariants.module.css";

export interface ButtonProps
  extends PropsWithChildren,
    Omit<
      AllHTMLAttributes<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement>,
      "size" | "type"
    >,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  className?: string;
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  variant?: "solid" | "outline" | "text";
  size?: "x-small" | "small" | "medium" | "large" | "x-large";
  isDiv?: boolean;
}

export const Button: FC<ButtonProps> = ({
  className,
  color = "primary",
  variant = "solid",
  size = "medium",
  isDiv,
  ...props
}) => {
  const Element = props.href ? "a" : isDiv ? "div" : "button";

  return (
    <Element
      className={clsx([
        styles.button,
        color && variantStyles[color],
        variant && variantStyles[variant],
        size && sizeStyles[size],
        className,
      ])}
      aria-disabled={props.disabled}
      {...props}
    />
  );
};
