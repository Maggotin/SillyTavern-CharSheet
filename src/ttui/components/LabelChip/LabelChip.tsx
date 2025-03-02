import clsx from "clsx";
import React, { type HTMLAttributes, type ReactNode } from "react";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./LabelChip.module.css";

interface LabelChipProps extends HTMLAttributes<HTMLSpanElement> {
  tooltipContent?: ReactNode;
  tooltipClickable?: boolean;
}

export const LabelChip = ({
  className = "",
  children,
  tooltipContent,
  tooltipClickable,
  ...props
}: LabelChipProps) => (
  <>
    <span className={clsx([styles.labelChip, className])} {...props}>
      {children}
    </span>
    {props["data-tooltip-id"] && (
      <Tooltip id={props["data-tooltip-id"]} clickable={tooltipClickable}>
        {tooltipContent}
      </Tooltip>
    )}
  </>
);
