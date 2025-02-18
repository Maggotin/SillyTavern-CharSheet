import clsx from "clsx";
import {
  FC,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import ChevronDown from "../../fontawesome-cache/svgs/solid/chevron-down.svg";

import styles from "./styles.module.css";

export interface AccordionProps extends HTMLAttributes<HTMLElement> {
  variant?: "default" | "text" | "paper";
  summary: ReactNode;
  description?: ReactNode;
  size?: "small" | "medium";
  forceShow?: boolean;
  useTheme?: boolean;
  resetOpen?: boolean;
  override?: boolean | null;
  handleIsOpen?: (id: string, isOpen: boolean) => void;
  summaryMetaItems?: Array<string>;
}

export const Accordion: FC<AccordionProps> = ({
  className,
  summary,
  description,
  size = "medium",
  variant = "default",
  children,
  forceShow = false,
  // style,
  useTheme,
  resetOpen,
  handleIsOpen,
  override = null,
  id = "",
  summaryMetaItems,
  ...props
}) => {
  const summaryRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [isOpen, setIsOpen] = useState<boolean>(forceShow);
  const [height, setHeight] = useState<number | string>();

  const handleToggle = (e: MouseEvent) => {
    e.preventDefault();
    setIsOpen((current) => {
      if (handleIsOpen && id) handleIsOpen(id, !current);
      return !current;
    });
  };

  useEffect(() => {
    const summaryHeight = summaryRef.current?.clientHeight;
    const contentHeight = contentRef.current?.getBoundingClientRect().height;

    if (isOpen) {
      // If the dialog is open and it's not the first load, set the height to the summary + content
      if (summaryHeight && contentHeight && loaded.current === true)
        setHeight(summaryHeight + contentHeight);
    } else {
      // If the dialog is closed, set the height to the summary
      if (summaryHeight) setHeight(summaryHeight);
    }
    loaded.current = true;
  }, [isOpen, resetOpen]);

  useEffect(() => {
    if (resetOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [resetOpen]);

  useEffect(() => {
    if (override !== null) {
      setIsOpen(override);
    }
  }, [override]);

  return (
    <details
      className={clsx([
        styles.details,
        styles[size],
        styles[variant],
        useTheme && styles.theme,
        className,
      ])}
      open={isOpen}
      // style={{ height, ...style }} INVESTIGATE THIS LATER
      {...props}
    >
      <summary
        className={styles.summary}
        onClick={handleToggle}
        ref={summaryRef}
      >
        <div className={styles.heading}>
          <div>
            {summary}
            {summaryMetaItems && (
              <div className={styles.metaItems}>
                {summaryMetaItems.map((metaItem, idx) => (
                  <div key={uuidv4()} className={styles.metaItem}>
                    {metaItem}
                  </div>
                ))}
              </div>
            )}
          </div>
          <ChevronDown className={styles.icon} />
        </div>
        {description && <div className={styles.description}>{description}</div>}
      </summary>
      <div className={styles.content} ref={contentRef}>
        {children}
      </div>
    </details>
  );
};
