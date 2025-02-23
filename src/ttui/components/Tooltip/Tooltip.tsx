"use client";

import React, { type FC } from "react";
import { Tooltip as ReactTooltip, type ITooltip } from "react-tooltip";
import styles from "./Tooltip.module.css";

export interface TooltipProps extends ITooltip {
  id: string;
  "data-testid"?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  id,
  "data-testid": testId,
  children,
  ...props
}) => {
  return (
    <div
      className={styles.container}
      {...(testId && { "data-testid": testId })}
    >
      <ReactTooltip id={id} className={styles.tooltip} {...props}>
        {children}
      </ReactTooltip>
    </div>
  );
};
