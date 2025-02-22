import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { v4 as uuidv4 } from "uuid";

import { LabelChip } from "@dndbeyond/ttui/components/LabelChip";

import { Link } from "../Link";
import styles from "./styles.module.css";

interface LegacyBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "margin-left";
}

export const LegacyBadge: FC<LegacyBadgeProps> = ({
  variant,
  className,
  ...props
}) => (
  <LabelChip
    className={clsx([styles.chip, variant && styles[variant], className])}
    data-tooltip-id={`legacybadge_${uuidv4()}`}
    tooltipContent={
      <span>
        This doesn't reflect the latest rules and lore.{" "}
        <Link
          className={styles.tooltipLink}
          href="https://dndbeyond.com/legacy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {}} //TODO - can fix this after we refactor Link to not stop propgation inside the component
        >
          Learn More
        </Link>
      </span>
    }
    tooltipClickable
    {...props}
  >
    Legacy
  </LabelChip>
);
