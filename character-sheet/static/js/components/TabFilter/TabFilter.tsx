import React from 'react';
import clsx from "clsx";
import { FC, Fragment, HTMLAttributes, ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCharacterTheme } from "../../contexts/CharacterTheme/CharacterTheme";
import { Actions } from './tools/js/CharacterSheet/containers/Actions/Actions';

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
  const { themeColor } = useCharacterTheme();
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
    <div className={clsx('stcs-tabs', className)} {...props}>
      <div className="stcs-tabs__tabs">
        {showAllTab && (
          <button
            className={clsx('stcs-tabs__tab', activeFilter === 0 && 'stcs-tabs__tab--active')}
            onClick={() => setActiveFilter(0)}
          >
            All
          </button>
        )}
        {nonEmptyFilters.map((filter, i) => {
          const index = showAllTab ? i + 1 : i;
          return (
            <button
              key={typeof filter.label === 'string' ? filter.label : i}
              className={clsx('stcs-tabs__tab', activeFilter === index && 'stcs-tabs__tab--active')}
              onClick={() => setActiveFilter(index)}
            >
              {filter.badge && (
                <span className="stcs-tabs__badge">{filter.badge}</span>
              )}
              {filter.label}
            </button>
          );
        })}
      </div>
      <div className="stcs-tabs__content">
        {sharedChildren}
        {!showAllTab || activeFilter !== 0
          ? nonEmptyFilters[activeIndex]?.content
          : getAllContent()}
      </div>
    </div>
  );
};
