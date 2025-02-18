import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { v4 as uuidv4 } from "uuid";

import { Tooltip } from "../Tooltip";
import styles from "./styles.module.css";

export interface ReferenceProps extends HTMLAttributes<HTMLDivElement> {
  name: string | null;
  tooltip?: string | null;
  page?: number | null;
  chapter?: number | null;
  isDarkMode?: boolean;
}

/**
 * This component acts as a reference to a specific page or chapter in a book
 * where the information can be found.
 */

export const Reference: FC<ReferenceProps> = ({
  chapter,
  className,
  isDarkMode,
  name,
  page,
  tooltip,
  ...props
}) => {
  const id = uuidv4();
  const reference: string[] = [];
  if (chapter) reference.push(`ch. ${chapter}`);
  if (page) reference.push(`pg. ${page}`);

  return (
    <>
      <p
        className={clsx([styles.reference, className])}
        data-tooltip-id={id}
        data-tooltip-content={tooltip}
        data-tooltip-delay-show={1500}
        {...props}
      >
        <span className={styles.name}>{name}</span>
        {reference.length > 0 && (
          <span className={styles.ref}>, {reference.join(", ")}</span>
        )}
      </p>
      <Tooltip
        className={styles.tooltip}
        id={id}
        variant={isDarkMode ? "light" : "dark"}
      />
    </>
  );
};
