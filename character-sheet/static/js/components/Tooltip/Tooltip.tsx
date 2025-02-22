import clsx from "clsx";
import { FC } from "react";

import {
  Tooltip as TTUITooltip,
  TooltipProps as TTUITooltipProps,
} from "@dndbeyond/ttui/components/Tooltip";

import styles from "./styles.module.css";

interface TooltipProps extends TTUITooltipProps {}

/**
 * This tooltip component is a wrapper around the TTUI Tooltip component to provide styles which match the existing tooltip styles. It should be used in all new components so we can get rid of the tippy.js implementation. The TTUI component uses [React Tooltip](https://react-tooltip.com/) under the hood, so you can find all options [here](https://react-tooltip.com/docs/options).
 */

export const Tooltip: FC<TooltipProps> = ({ className, ...props }) => (
  <TTUITooltip
    className={clsx([styles.tooltip, className])}
    delayShow={300}
    {...props}
  />
);
