import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { useFeatureFlags } from "~/contexts/FeatureFlag";
import { Search } from "~/subApps/builder/components/Search";
import Checkbox from "~/tools/js/smartComponents/Checkbox";

import { Accordion } from "../Accordion";
import { Button } from "../Button";
import styles from "./styles.module.css";

export interface FilterButtonData {
  label: ReactNode;
  type: number | string;
  className?: string;
  sortOrder?: number;
}
export interface FilterCheckboxData {
  label: string;
  type: string;
  initiallyEnabled: boolean;
  onChange: () => void;
  className?: string;
}
export interface FilterGroupProps extends HTMLAttributes<HTMLDivElement> {
  filterQuery: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder?: string;
  filterButtonData: Array<FilterButtonData>;
  activeFilterButtonTypes: Array<number | string>;
  onFilterButtonClick: (filterType: number | string) => void;
  filterCheckboxData?: Array<FilterCheckboxData>;
  sourceCategoryButtonData: Array<FilterButtonData>;
  onSourceCategoryClick: (categoryId: number) => void;
  activeFilterSourceCategories: Array<number>;
  themed?: boolean;
  buttonGroupLabel: string;
  buttonSize?: "x-small" | "xx-small";
  filterStyle?: "builder";
  shouldOpenFilterButtons?: boolean;
  shouldOpenSourceCategoryButtons?: boolean;
  onSourceCategoriesCollapse?: () => void;
  onFilterButtonsCollapse?: () => void;
}

export const FilterGroup: FC<FilterGroupProps> = ({
  filterQuery,
  searchPlaceholder = "Search",
  filterButtonData,
  activeFilterButtonTypes,
  onQueryChange,
  onFilterButtonClick,
  filterCheckboxData,
  sourceCategoryButtonData,
  onSourceCategoryClick,
  activeFilterSourceCategories,
  themed,
  buttonGroupLabel,
  buttonSize = "xx-small",
  filterStyle,
  shouldOpenFilterButtons,
  shouldOpenSourceCategoryButtons,
  onSourceCategoriesCollapse,
  onFilterButtonsCollapse,
  className,
  ...props
}) => {
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleSourceCategoryClick = (evt: React.MouseEvent, id: number) => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    onSourceCategoryClick(id);
  };

  const handleFilterButtonClick = (
    evt: React.MouseEvent,
    type: string | number
  ) => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    onFilterButtonClick(type);
  };

  return (
    <div {...props}>
      <div className={styles.filterGroup}>
        <label htmlFor="filter-input" className={styles.filterLabel}>
          Filter
        </label>
        <Search
          id="filter-input"
          value={filterQuery}
          onChange={handleQueryChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className={styles.filterGroup}>
        <Accordion
          variant="text"
          size="small"
          summary={<div className={styles.filterLabel}>{buttonGroupLabel}</div>}
          className={styles.accordion}
          forceShow={shouldOpenFilterButtons}
          onClick={onFilterButtonsCollapse}
        >
          <div className={styles.buttonGroup}>
            {filterButtonData.map((button) => {
              return (
                <div
                  className={clsx([button.className, styles.button])}
                  key={button.type}
                >
                  <Button
                    color={
                      filterStyle === "builder" ? "builder-green" : undefined
                    }
                    themed={themed}
                    variant={
                      activeFilterButtonTypes.includes(button.type)
                        ? "solid"
                        : "outline"
                    }
                    size={buttonSize}
                    onClick={(evt) => handleFilterButtonClick(evt, button.type)}
                  >
                    {button.label}
                  </Button>
                </div>
              );
            })}
          </div>
          {filterCheckboxData && filterCheckboxData.length > 0 && (
            <div className={styles.checkboxGroup}>
              {filterCheckboxData.map((checkbox) => {
                return (
                  <div
                    className={clsx([
                      styles.checkbox,
                      filterStyle === "builder" && styles.builder,
                    ])}
                    key={checkbox.type}
                  >
                    <Checkbox
                      stopPropagation={true}
                      initiallyEnabled={checkbox.initiallyEnabled}
                      onChange={checkbox.onChange}
                      label={checkbox.label}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Accordion>
      </div>

      {/* SOURCE CATEGORY FILTERS */}

      <div className={styles.filterGroup}>
        <Accordion
          variant="text"
          size="small"
          summary={
            <div className={styles.filterLabel}>Filter By Source Category</div>
          }
          className={styles.accordion}
          forceShow={shouldOpenSourceCategoryButtons}
          onClick={onSourceCategoriesCollapse}
        >
          <div className={styles.buttonGroup}>
            {sourceCategoryButtonData.map((button) => {
              return (
                <div
                  className={clsx([
                    button.className,
                    styles.button,
                    styles.sourceCategoryButton,
                    filterStyle === "builder" && styles.builder,
                  ])}
                  key={button.type}
                >
                  <Button
                    color={
                      filterStyle === "builder" ? "builder-green" : undefined
                    }
                    themed={themed}
                    variant={
                      activeFilterSourceCategories.includes(
                        button.type as number
                      )
                        ? "solid"
                        : "outline"
                    }
                    size={buttonSize}
                    onClick={(evt) =>
                      handleSourceCategoryClick(evt, button.type as number)
                    }
                  >
                    {button.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </Accordion>
      </div>
    </div>
  );
};
