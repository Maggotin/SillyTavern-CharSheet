import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { PaneMenuItem } from "../PaneMenuItem";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  label: string;
}
export const PaneMenuGroup: FC<Props> = ({
  label,
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={clsx([styles.group, className])} {...props}>
      <PaneMenuItem menukey={label} className={styles.label}>
        {label}
      </PaneMenuItem>
      {children}
    </div>
  );
};
