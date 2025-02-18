import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

export interface BarProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "active" | "implied" | "inactive";
  value?: string | number | null;
}

export const Bar: FC<BarProps> = ({
  children,
  className,
  variant = "inactive",
  value,
  ...props
}) => (
  <button className={clsx([styles.bar, styles[variant], className])} {...props}>
    {children}
  </button>
);
