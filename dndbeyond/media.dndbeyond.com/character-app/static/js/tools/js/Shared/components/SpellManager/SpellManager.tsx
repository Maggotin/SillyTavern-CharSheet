import { sortBy } from "lodash";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { LoadingPlaceholder } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  DataOriginRefData,
  EntityValueLookup,
  rulesEngineSelectors,
  SimpleSourceCategoryContract,
  SpellManager as SpellManagerType,
} from "@dndbeyond/character-rules-engine";

import { Link } from "~/components/Link";
import { SpellFilter } from "~/components/SpellFilter";

import DataLoadingStatusEnum from "../../constants/DataLoadingStatusEnum";
import { SpellsManagerContext } from "../../managers/SpellsManagerContext";
import { FilterUtils } from "../../utils";
import SpellManagerItem from "./SpellManagerItem";

interface Props {
  charClassId: number;
  characterClassId: number;
  shouldFetch?: boolean;
  hasActiveSpells?: boolean;

  isPrepareMaxed: boolean;
  isCantripsKnownMaxed: boolean;
  isSpellsKnownMaxed: boolean;
  addButtonText: string;
  enableAdd?: boolean;
  enablePrepare?: boolean;
  enableUnprepare?: boolean;
  enableSpellRemove?: boolean;
  showFilters?: boolean;
  showExpandedType?: boolean;
  showCustomize: boolean;
  buttonActiveStyle?: string;
  buttonUnprepareText?: string;
  entityValueLookup: EntityValueLookup;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}

// TODO: migrate this all into here
export default function SpellManagerContainer({
  showFilters = true,
  enableAdd = true,
  enableSpellRemove = true,
  showExpandedType = true,
  enablePrepare = true,
  enableUnprepare = true,
  shouldFetch = false,
  hasActiveSpells = false,
  charClassId,
  // TODO: get from manager?
  characterClassId,
  isPrepareMaxed,
  isCantripsKnownMaxed,
  isSpellsKnownMaxed,
  addButtonText,
  buttonActiveStyle,
  buttonUnprepareText,
  entityValueLookup,
  dataOriginRefData,
  showCustomize,
  proficiencyBonus,
  theme,
}: Props) {
  const ruleData = useSelector(rulesEngineSelectors.getRuleData);
  const spellCasterInfo = useSelector(rulesEngineSelectors.getSpellCasterInfo);
  const { spellsManager } = useContext(SpellsManagerContext);

  const [availableSpells, setAvailableSpells] = useState<
    Array<SpellManagerType>
  >([]);
  const [spells, setSpells] = useState<Array<SpellManagerType>>([]);
  const [sourceCategories, setSourceCategories] = useState<
    Array<SimpleSourceCategoryContract>
  >([]);
  const [loadingStatus, setLoadingStatus] = useState(
    DataLoadingStatusEnum.LOADING
  );
  const [filterLevels, setFilterLevels] = useState<Array<number>>([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterSourceCategories, setFilterSourceCategories] = useState<
    Array<number>
  >([]);

  const getData = useCallback(
    async function getData() {
      let classSpellMap = await spellsManager.getSpellShoppe();
      if (!classSpellMap[charClassId] || shouldFetch) {
        classSpellMap = await spellsManager.getSpellShoppe(true);
      }
      setSpells(
        hasActiveSpells
          ? classSpellMap[charClassId].activeSpells
          : classSpellMap[charClassId].knownSpells
      );
      setAvailableSpells(
        shouldFetch ? classSpellMap[charClassId].availableSpells : []
      );
      setSourceCategories(classSpellMap[charClassId].sourceCategories);
      setLoadingStatus(DataLoadingStatusEnum.LOADED);
    },
    [spellsManager, hasActiveSpells, shouldFetch, charClassId]
  );
  useEffect(() => {
    getData();
  }, [getData]);

  function getCombinedSpells(): Array<SpellManagerType> {
    // const remainingLazySpells = availableSpells.filter((spell) => !knownSpellIds.includes(spell.deriveKnownKey()));

    return sortBy(
      [...availableSpells, ...spells],
      [
        (spell) => spell.getLevel(),
        (spell) => spell.getName(),
        (spell) => spell.getExpandedDataOriginRef() !== null,
        (spell) => spell.getUniqueKey(),
      ]
    );
  }
  function getFilteredSpells(
    combinedSpells: Array<SpellManagerType>
  ): Array<SpellManagerType> {
    return combinedSpells.filter((spell) => {
      if (filterSourceCategories.length !== 0) {
        const sourceCategoryId = spell.getPrimarySourceCategoryId();
        if (!filterSourceCategories.includes(sourceCategoryId)) {
          return false;
        }
      }

      if (
        filterLevels.length !== 0 &&
        !filterLevels.includes(spell.getLevel())
      ) {
        return false;
      }

      if (
        filterQuery !== "" &&
        !FilterUtils.doesQueryMatchData(filterQuery, spell.getName())
      ) {
        return false;
      }

      return true;
    });
  }

  function handleFilterSpellLevel(level: number): void {
    setFilterLevels(
      filterLevels.includes(level)
        ? filterLevels.filter((l) => l !== level)
        : [...filterLevels, level]
    );
  }

  function handleSourceCategoryClick(categoryId: number): void {
    setFilterSourceCategories(
      filterSourceCategories.includes(categoryId)
        ? filterSourceCategories.filter((cat) => cat !== categoryId)
        : [...filterSourceCategories, categoryId]
    );
  }

  function onSuccess() {
    getData();
  }
  function onFailure() {
    getData();
  }

  function renderUi(): React.ReactNode {
    const combinedSpells = getCombinedSpells();
    const filteredSpells = getFilteredSpells(combinedSpells);

    return (
      <React.Fragment>
        {showFilters && (
          <React.Fragment>
            <SpellFilter
              spells={combinedSpells.map((manager) => manager.getSpell())}
              sourceCategories={sourceCategories}
              filterQuery={filterQuery}
              filterLevels={filterLevels}
              onLevelFilterClick={handleFilterSpellLevel}
              onQueryChange={setFilterQuery}
              onSourceCategoryClick={handleSourceCategoryClick}
              filterSourceCategories={filterSourceCategories}
              themed
            />
            <div className="ct-character-tools__marketplace-callout">
              Looking for something not in the list below? Unlock all official
              options in the <Link href="/marketplace">Marketplace</Link>.
            </div>
          </React.Fragment>
        )}
        {filteredSpells.length === 0 && <div>No Results Found</div>}
        {filteredSpells.map((spell, idx) => (
          <SpellManagerItem
            theme={theme}
            spell={spell}
            key={`${spell.getId()}-${idx}`}
            onPrepare={() => {
              spell.handlePrepare({ characterClassId }, onSuccess, onFailure);
            }}
            onUnprepare={() => {
              spell.handleUnprepare({ characterClassId }, onSuccess, onFailure);
            }}
            onRemove={() => {
              spell.handleRemove({ characterClassId }, onSuccess, onFailure);
            }}
            onAdd={() => {
              spell.handleAdd({ characterClassId }, onSuccess, onFailure);
            }}
            isPrepareMaxed={isPrepareMaxed}
            isCantripsKnownMaxed={isCantripsKnownMaxed}
            isSpellsKnownMaxed={isSpellsKnownMaxed}
            addButtonText={addButtonText}
            enableAdd={enableAdd}
            enablePrepare={enablePrepare}
            enableUnprepare={enableUnprepare}
            enableSpellRemove={enableSpellRemove}
            buttonUnprepareText={buttonUnprepareText}
            buttonActiveStyle={buttonActiveStyle}
            spellCasterInfo={spellCasterInfo}
            ruleData={ruleData}
            entityValueLookup={entityValueLookup}
            showExpandedType={showExpandedType ?? true}
            showCustomize={showCustomize}
            dataOriginRefData={dataOriginRefData}
            proficiencyBonus={proficiencyBonus}
          />
        ))}
      </React.Fragment>
    );
  }

  function renderLoading(): React.ReactNode {
    return <LoadingPlaceholder />;
  }

  let content: React.ReactNode;
  switch (loadingStatus) {
    case DataLoadingStatusEnum.LOADED:
      content = renderUi();
      break;

    case DataLoadingStatusEnum.LOADING:
    default:
      content = renderLoading();
      break;
  }

  return <div className="ct-spell-manager">{content}</div>;
}
