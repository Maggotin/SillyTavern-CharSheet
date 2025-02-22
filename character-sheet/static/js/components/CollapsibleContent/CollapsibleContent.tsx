import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

import { HtmlContent } from "../HtmlContent";
import styles from "./styles.module.css";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  className?: string;
  forceShow?: boolean;
  heading?: ReactNode;
  maxLength?: number;
}

/**
 * A component that will display a "Show More" button if the content is longer
 * than the maxLength prop. It will also accept a heading prop to display text
 * above the content.
 */
export const CollapsibleContent: FC<Props> = ({
  forceShow,
  className,
  children,
  heading,
  maxLength = 600,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(forceShow);

  const handleToggleClick = (): void => {
    setIsOpen((prev) => !prev);
  };

  if (typeof children === "string" && children?.length <= maxLength && !heading)
    return (
      <HtmlContent html={children as string} className={className} {...props} />
    );

  return (
    <div
      className={clsx([
        styles.collapsible,
        heading && styles.withHeading,
        isOpen && styles.open,
        className,
      ])}
      {...props}
    >
      {heading && <div>{heading}</div>}
      {typeof children === "string" ? (
        <HtmlContent className={styles.content} html={children as string} />
      ) : (
        <div className={styles.content}>{children}</div>
      )}
      {!forceShow && (
        <button className={styles.button} onClick={handleToggleClick}>
          {isOpen ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
