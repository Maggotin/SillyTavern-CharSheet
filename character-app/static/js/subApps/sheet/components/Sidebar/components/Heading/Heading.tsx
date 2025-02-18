import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import styles from "./styles.module.css";

/**
 * This component is used to render a subheading in the sidebar.
 */

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const Heading: FC<HeadingProps> = ({
  className,
  children,
  ...props
}) => (
  <h2
    className={clsx([
      "ct-sidebar__subheading",
      props.onClick && styles.clickable,
      className,
    ])}
    {...props}
  >
    {children}
  </h2>
);
