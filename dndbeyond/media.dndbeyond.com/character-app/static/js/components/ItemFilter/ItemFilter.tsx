import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { useFiltersContext } from "~/contexts/Filters";
import { SimpleSourceCategoryContract } from "~/types";

import { FilterGroup } from "../FilterGroup";
import {
  FilterButtonData,
  FilterCheckboxData,
} from "../FilterGroup/FilterGroup";
import styles from "./styles.module.css";

export interface ItemFilterProps extends HTMLAttributes<HTMLDivElement> {
  filterQuery: string;
  onQueryChange: (value: string) => void;
  filterTypes: Array<string>;
  onFilterButtonClick: (type: string) => void;
  onCheckboxChange: (type: string) => void;
  sourceCategories: Array<SimpleSourceCategoryContract>;
  onSourceCategoryClick: (categoryId: number) => void;
  filterSourceCategories: Array<number>;
  filterProficient: boolean;
  filterBasic: boolean;
  filterMagic: boolean;
  filterContainer: boolean;
  themed?: boolean;
  buttonSize?: "x-small" | "xx-small";
  filterStyle?: "builder";
}

export const ItemFilter: FC<ItemFilterProps> = ({
  filterQuery,
  onQueryChange,
  filterTypes,
  onFilterButtonClick,
  onCheckboxChange,
  sourceCategories,
  onSourceCategoryClick,
  filterSourceCategories,
  filterProficient,
  filterBasic,
  filterMagic,
  filterContainer,
  themed,
  buttonSize = "xx-small",
  filterStyle,
  className,
  ...props
}) => {
  const {
    showItemTypes,
    showItemSourceCategories,
    setShowItemSourceCategories,
    setShowItemTypes,
  } = useFiltersContext();

  const itemTypes: Array<string> = [
    "Armor",
    "Potion",
    "Ring",
    "Rod",
    "Scroll",
    "Staff",
    "Wand",
    "Weapon",
    "Wondrous item",
    "Other Gear",
  ];

  const toggleTypes: Array<string> = [
    "Proficient",
    "Common",
    "Magical",
    "Container",
  ];

  const isChecked = (type: string): boolean => {
    switch (type) {
      case "Proficient":
        return filterProficient;
      case "Common":
        return filterBasic;
      case "Magical":
        return filterMagic;
      case "Container":
        return filterContainer;
      default:
        return false;
    }
  };

  const filterCheckboxData: Array<FilterCheckboxData> = toggleTypes.map(
    (type) => {
      return {
        label: type,
        type: type,
        onChange: () => onCheckboxChange(type),
        initiallyEnabled: isChecked(type),
      };
    }
  );

  const filterButtons: Array<FilterButtonData> = itemTypes.map((itemType) => {
    return {
      type: itemType,
      label: itemType === "Wondrous item" ? "Wondrous" : itemType,
      className: clsx([
        styles.filterButton,
        buttonSize === "xx-small" && styles.filterButtonSmall,
      ]),
    };
  });

  const sourcesData: Array<FilterButtonData> = sourceCategories.map(
    (sourceCategory) => {
      return {
        label: sourceCategory.name,
        type: sourceCategory.id,
        className: styles.sourceCategoryButton,
        sortOrder: sourceCategory.sortOrder,
      };
    }
  );

  return (
    <FilterGroup
      searchPlaceholder={"Weapon, Longsword, Vorpal Longsword, etc."}
      filterQuery={filterQuery}
      filterButtonData={filterButtons}
      activeFilterButtonTypes={filterTypes}
      onQueryChange={onQueryChange}
      themed={themed}
      onFilterButtonClick={onFilterButtonClick}
      onSourceCategoryClick={onSourceCategoryClick}
      activeFilterSourceCategories={filterSourceCategories}
      sourceCategoryButtonData={sourcesData}
      buttonGroupLabel={"Filter By Type"}
      buttonSize={buttonSize}
      filterStyle={filterStyle}
      filterCheckboxData={filterCheckboxData}
      shouldOpenSourceCategoryButtons={showItemSourceCategories}
      shouldOpenFilterButtons={showItemTypes}
      onFilterButtonsCollapse={() => setShowItemTypes(!showItemTypes)}
      onSourceCategoriesCollapse={() =>
        setShowItemSourceCategories(!showItemSourceCategories)
      }
      className={className}
      {...props}
    />
  );
};
