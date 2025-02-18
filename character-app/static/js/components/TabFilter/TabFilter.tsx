import clsx from "clsx";
import { FC, Fragment, HTMLAttributes, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCharacterTheme } from "~/contexts/CharacterTheme";

import styles from "./styles.module.css";

export interface TabFilterProps extends HTMLAttributes<HTMLDivElement> {
  filters:
    | {
        label: ReactNode;
        content: ReactNode;
        badge?: ReactNode;
      }[];
  showAllTab?: boolean;
  sharedChildren?: ReactNode;
}

export const TabFilter: FC<TabFilterProps> = ({
  children,
  className,
  filters,
  sharedChildren,
  showAllTab = true,
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState(0);
  const { isDarkMode } = useCharacterTheme();
  const activeIndex = showAllTab ? activeFilter - 1 : activeFilter;
  const nonEmptyFilters = filters.filter((f) => f.label !== "");

  const getDefaultLabel = (label: ReactNode) => {
    if (typeof label === "string") return label;
    return uuidv4();
  };

  const getAllContent = () => {
    return (
      nonEmptyFilters
        // Remove optional tabs with duplicate content
        .filter(
          (f) =>
            // Don't render tabs with icons such as ritual or concentration spells
            typeof f.label === "string" &&
            // Don't render tabs with the same content as the Attack or Limited Use tab
            !getDefaultLabel(f.label).match(/(Attack|Limited Use)/)
        )
        // Return the content of the remaining tabs to be rendered
        .map((f) => (
          <Fragment key={getDefaultLabel(f.label)}>{f.content}</Fragment>
        ))
    );
  };

  return (
    <div
      className={clsx([styles.tabFilter, isDarkMode && styles.dark, className])}
      {...props}
    >
      <div className={styles.buttons} data-testid="tab-filters">
        {showAllTab && (
          <button
            className={clsx([activeFilter === 0 && styles.active])}
            onClick={() => setActiveFilter(0)}
            data-testid="tab-filter-all"
          >
            All
          </button>
        )}
        {nonEmptyFilters.map((filter, i) => {
          const index = showAllTab ? i + 1 : i;
          return (
            <button
              className={clsx([activeFilter === index && styles.active])}
              onClick={() => setActiveFilter(index)}
              data-testid={`tab-filter-${getDefaultLabel(filter.label)
                .toLowerCase()
                .replace(/\s/g, "-")}`}
              key={`${index} + ${filter.label as string}`}
            >
              {filter.badge && (
                <span className={styles.badge}>{filter.badge}</span>
              )}
              {filter.label}
            </button>
          );
        })}
      </div>
      <div className={styles.content}>
        {sharedChildren}
        {!showAllTab || activeFilter !== 0
          ? nonEmptyFilters[activeIndex]?.content
          : getAllContent()}
      </div>
    </div>
  );
};
