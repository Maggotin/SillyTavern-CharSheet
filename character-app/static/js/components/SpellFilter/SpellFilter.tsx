import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useState } from "react";

import { useFiltersContext } from "~/contexts/Filters";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { SimpleSourceCategoryContract, Spell } from "~/types";

import { FilterGroup } from "../FilterGroup";
import { FilterButtonData } from "../FilterGroup/FilterGroup";
import styles from "./styles.module.css";

export interface SpellFilterProps extends HTMLAttributes<HTMLDivElement> {
  spells: Array<Spell>;
  filterQuery: string;
  filterLevels: Array<number>;
  onQueryChange: (value: string) => void;
  onLevelFilterClick: (level: number) => void;
  sourceCategories: Array<SimpleSourceCategoryContract>;
  onSourceCategoryClick: (categoryId: number) => void;
  filterSourceCategories: Array<number>;
  themed?: boolean;
  buttonSize?: "x-small" | "xx-small";
  filterStyle?: "builder";
}

export const SpellFilter: FC<SpellFilterProps> = ({
  spells,
  filterQuery,
  filterLevels,
  onQueryChange,
  onLevelFilterClick,
  sourceCategories,
  onSourceCategoryClick,
  filterSourceCategories,
  themed,
  buttonSize = "xx-small",
  filterStyle,
  className,
  ...props
}) => {
  const { ruleData, spellUtils, ruleDataUtils, formatUtils } =
    useCharacterEngine();
  const {
    showSpellLevels,
    showSpellSourceCategories,
    setShowSpellLevels,
    setShowSpellSourceCategories,
  } = useFiltersContext();

  const [spellLevels, setSpellLevels] = useState<Array<number>>([]);

  useEffect(() => {
    const activeSpellLevelCounts: Array<number> = [];
    const spellsLevels: Array<number> = [];
    const maxSpellLevel = ruleDataUtils.getMaxSpellLevel(ruleData);

    for (let i = 0; i <= maxSpellLevel; i++) {
      activeSpellLevelCounts.push(0);
      spellsLevels.push(i);
    }

    spells.forEach((spell) => {
      activeSpellLevelCounts[spellUtils.getLevel(spell)] += 1;
    });

    setSpellLevels(
      spellsLevels.filter((level) => activeSpellLevelCounts[level] !== 0)
    );
  }, [spells]);

  const filterButtons: Array<FilterButtonData> = spellLevels.map((level) => {
    let buttonLabel: React.ReactNode;
    if (level === 0) {
      buttonLabel = formatUtils.renderSpellLevelAbbreviation(0);
    } else {
      buttonLabel = (
        <div className={styles.buttonText}>
          <span>{level}</span>
          <span
            className={clsx([
              styles.ordinal,
              buttonSize === "xx-small" && styles.ordinalSmall,
            ])}
          >
            {formatUtils.getOrdinalSuffix(level)}
          </span>
        </div>
      );
    }
    return { type: level, label: buttonLabel, className: styles.filterButton };
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
      searchPlaceholder={"Enter Spell Name"}
      filterQuery={filterQuery}
      filterButtonData={filterButtons}
      activeFilterButtonTypes={filterLevels}
      onQueryChange={onQueryChange}
      onSourceCategoryClick={onSourceCategoryClick}
      activeFilterSourceCategories={filterSourceCategories}
      sourceCategoryButtonData={sourcesData}
      themed={themed}
      onFilterButtonClick={onLevelFilterClick}
      buttonGroupLabel={"Filter By Spell Level"}
      buttonSize={buttonSize}
      filterStyle={filterStyle}
      shouldOpenSourceCategoryButtons={showSpellSourceCategories}
      shouldOpenFilterButtons={showSpellLevels}
      onFilterButtonsCollapse={() => setShowSpellLevels(!showSpellLevels)}
      onSourceCategoriesCollapse={() =>
        setShowSpellSourceCategories(!showSpellSourceCategories)
      }
      className={className}
      {...props}
    />
  );
};
