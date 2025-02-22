import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { useUnpropagatedClick } from "~/hooks/useUnpropagatedClick";

import styles from "./styles.module.css";

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  callout?: ReactNode;
  onClick?: () => void;
  parent?: ReactNode;
  preview?: ReactNode;
}

export const Header: FC<HeaderProps> = ({
  callout,
  children,
  className,
  onClick,
  parent,
  preview,
  ...props
}) => {
  const handleClick = useUnpropagatedClick(onClick);

  return (
    <header className={clsx(["ct-sidebar__header", className])} {...props}>
      <div onClick={handleClick} className={onClick && styles.interactive}>
        {parent}
      </div>
      <div className="ct-sidebar__header-primary">
        {preview}
        <h1 className={clsx(["ct-sidebar__heading", styles.heading])}>
          {children}
        </h1>
        {callout && <div className={styles.callout}>{callout}</div>}
      </div>
    </header>
  );
};
