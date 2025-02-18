import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  onClick?: (menuKey: string) => void;
  menukey: string;
  className?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}
export const PaneMenuItem: FC<Props> = ({
  onClick,
  menukey,
  prefixIcon,
  suffixIcon,
  className,
  children,
  ...props
}) => {
  const handleClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    if (onClick) {
      onClick(menukey);
    }
  };

  return (
    <div
      className={clsx([styles.item, className])}
      onClick={handleClick}
      {...props}
    >
      {prefixIcon && <div className={styles.prefixIcon}>{prefixIcon}</div>}
      <div className={styles.label}>{children}</div>
      <div className={styles.suffixIcon}>{suffixIcon}</div>
    </div>
  );
};
