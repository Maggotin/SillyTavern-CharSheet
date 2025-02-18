import { CharacterTheme } from "@dndbeyond/character-rules-engine";
import { HTMLAttributes } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";


interface ActionListSectionProps extends HTMLAttributes<HTMLDivElement> {
    headingText: string;
    theme: CharacterTheme;
    testId?: string;
  };

export const ActionListSection = ({
    // Component Props
    theme,
    headingText,
    testId = "",
    // From HTMLAttributes
    className,
    children,
    ...props
}: ActionListSectionProps) => {
    const headingTestId = `actions-list-${testId}-heading`;
    const listTestId = `actions-list-${testId}-list`;

    return (
      <div className={clsx([styles.section, className])} {...props}>
        <div 
            className={clsx([
                styles.sectionHeading,
                theme?.isDarkMode && styles.darkMode,
            ])}
            data-testid={headingTestId}
        >
            {headingText}
        </div>
        <div
            className={clsx([
                styles.list,
                theme?.isDarkMode && styles.darkMode,
            ])}
            data-testid={listTestId}
        >
            {children}
        </div>
      </div>
    );
  };
  