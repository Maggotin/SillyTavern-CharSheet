"use client";

import AngleDown from "./fontawesome-cache/svgs/regular/angle-down.svg";
import XMark from "./fontawesome-cache/svgs/regular/xmark.svg";
import clsx from "clsx";
import React, { type FC, type MouseEvent, type SelectHTMLAttributes } from "react";
import { useIsVisible } from "../../hooks/useIsVisible/useIsVisible";
import { Checkbox } from "../Checkbox/Checkbox";
import styles from "./Select.module.css";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLDivElement>, "value"> {
  label: string;
  options: Array<Option>;
  value: string | string[] | number[];
  placeholder?: string;
  onDelete?: (e: MouseEvent) => void;
  error?: string;
}

export const Select: FC<SelectProps> = ({
  className = "",
  placeholder,
  name,
  label,
  onChange,
  onDelete,
  options,
  value,
  disabled,
  error,
  ...props
}) => {
  const { ref, isVisible, setIsVisible } = useIsVisible(false);
  const multiple = Array.isArray(value) || false;
  const handleDelete = (e: MouseEvent) => {
    if (onDelete) {
      e.stopPropagation();
      onDelete(e);
    }
  };
  const getDisplay = () => {
    // If value is an array, show tags
    if (multiple && Array.isArray(value) && value.length) {
      return (
        <span className={styles.tags}>
          {value.map((v) => (
            <span
              className={styles.tag}
              onClick={(e: MouseEvent) => handleDelete(e)}
              key={v}
            >
              {v}
              <XMark />
            </span>
          ))}
        </span>
      );
    }
    // If value is string, show string
    else if (!multiple && value) {
      return value;
    }
    // If there is no value, show the placeholder
    else {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
  };

  return (
    <>
      <div ref={ref} className={clsx([styles.container, className])} {...props}>
        <label id={`${name}Label`}>{label}</label>
        <button
          className={clsx([styles.button, error && styles.buttonError])}
          id={`${name}Button`}
          onClick={() => setIsVisible(!isVisible)}
          role="combobox"
          aria-haspopup="listbox"
          aria-controls={`${name}Dropdown`}
          aria-labelledby={`${name}Label`}
          aria-expanded={isVisible}
          tabIndex={0}
          disabled={disabled || false}
        >
          {getDisplay()}
          <AngleDown />
        </button>
        <div
          className={styles.options}
          role="group"
          id={`${name}Dropdown`}
          tabIndex={-1}
        >
          {options.map((option) =>
            multiple ? (
              <Checkbox
                id={`checkbox-${option.value}`}
                label={option.label}
                key={option.value}
                name={name}
                value={option.value}
                onChange={(e) => onChange?.(e)}
                checked={value.includes(option.value as never)}
              />
            ) : (
              <label className={styles.option} key={option.value}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  onChange={(e) => onChange?.(e)}
                  checked={value === option.value}
                />
                {option.label}
              </label>
            ),
          )}
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
};
