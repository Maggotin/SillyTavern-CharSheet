import clsx from "clsx";
import React, { type FC, type HTMLAttributes } from "react";
import styles from "./InfoItem.module.css";

interface InfoItemProps extends HTMLAttributes<HTMLDivElement> {
  center?: boolean;
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "error";
  label: string;
  inline?: boolean;
  italic?: boolean;
}

export const InfoItem: FC<InfoItemProps> = ({
  center,
  color,
  className,
  inline,
  italic,
  label,
  children,
  ...props
}) => (
  <div
    className={clsx([
      center && styles.center,
      inline && styles.inline,
      className,
    ])}
    {...props}
  >
    <p
      className={clsx([
        styles.label,
        color && styles[color],
        italic && styles.italic,
      ])}
    >
      {label}
    </p>
    {typeof children === "string" ? (
      <p
        className={clsx([styles.value, color && styles[color]])}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    ) : (
      <p className={clsx([styles.value, color && styles[color]])}>{children}</p>
    )}
  </div>
);
