import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { Constants } from "../../rules-engine/es";

import { NumberDisplayType } from "~/types";

import styles from "./styles.module.css";

const { FEET_IN_MILES } = Constants;

export interface NumberDisplayProps extends HTMLAttributes<HTMLSpanElement> {
  number: number | null;
  type: NumberDisplayType;
  isModified?: boolean;
  size?: "large";
  numberFallback?: ReactNode;
}

export const NumberDisplay: FC<NumberDisplayProps> = ({
  number,
  type,
  isModified = false,
  size,
  numberFallback = "--",
  className,
  ...props
}) => {
  let label = "";
  let sign = "";
  switch (type) {
    case "weightInLb":
      label = "lb.";
      number = number && Math.round((number + Number.EPSILON) * 100) / 100;
      break;
    case "distanceInFt":
      if (number && number % FEET_IN_MILES === 0) {
        number = number / FEET_IN_MILES;
        label = `mile${Math.abs(number) === 1 ? "" : "s"}`;
      } else {
        label = "ft.";
      }
      break;
    case "signed":
      if (number != null) {
        sign = number >= 0 ? "+" : "-";
        number = Math.abs(number);
      }
      break;
    default:
      break;
  }

  return (
    <span
      className={clsx([
        styles.numberDisplay,
        type === "signed" && styles.signed,
        type === "distanceInFt" && size && styles[size + "Distance"],
        isModified && styles.modified,
        size && styles[size],
        className,
      ])}
      {...props}
    >
      {type === "signed" && (
        /* NOTE: aria-label needs to go on an interactable element, not a span.
          This will need to be refactored onto the containing button.
        */
        <span
          className={clsx([
            styles.sign,
            size && styles[size + "Sign"],
            styles.labelSignColor,
          ])}
          aria-label={sign === "+" ? "plus" : "minus"}
        >
          {sign}
        </span>
      )}
      <span>{number === null ? numberFallback : number}</span>
      {type !== "signed" && (
        <span
          className={clsx([
            styles.label,
            size && styles[size + "Label"],
            styles.labelSignColor,
          ])}
        >
          {label}
        </span>
      )}
    </span>
  );
};
