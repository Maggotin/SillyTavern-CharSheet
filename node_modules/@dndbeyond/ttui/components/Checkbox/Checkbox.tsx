import clsx from "clsx";
import type { ChangeEvent, FC, ReactNode } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  id?: string;
  label?: ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  value?: string | number | readonly string[];
  name?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  id,
  label,
  defaultChecked,
  checked,
  value,
  name,
  disabled,
  onChange,
  className,
}) => (
  <div className={clsx([styles.container, className])}>
    <span className={clsx(styles.inputContainer)}>
      <input
        className={styles.checkbox}
        id={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        checked={checked}
        value={value}
        name={name}
        aria-disabled={disabled}
        onChange={onChange ? (e) => !disabled && onChange?.(e) : undefined}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 7.47 6.833 11 12.5 5"
        />
      </svg>
    </span>
    {label && (
      <label
        className={clsx([styles.label, disabled && styles.disabled])}
        htmlFor={id}
      >
        {label}
      </label>
    )}
  </div>
);
