import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLUListElement> {
  className?: string;
}
export const PaneMenu: FC<Props> = ({ className, children, ...props }) => {
  return (
    <ul className={clsx([styles.menu, className])} {...props}>
      {children}
    </ul>
  );
};
