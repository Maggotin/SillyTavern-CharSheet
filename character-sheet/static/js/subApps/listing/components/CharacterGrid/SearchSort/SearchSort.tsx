import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from "react";

import Gear from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/regular/gear.svg";
import CircleXMark from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/circle-xmark.svg";
import MagnifyingGlass from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/magnifying-glass.svg";
import { Button } from "@dndbeyond/ttui/components/Button";
import { Select } from "@dndbeyond/ttui/components/Select";

import PreferenceUpdateLocation from "~/tools/js/Shared/constants/PreferenceUpdateLocation";
import CharacterSettingsModal from "~/tools/js/smartComponents/CharacterSettingsModal";
import { SortOrderEnum, SortTypeEnum } from "~/types";

import { logListingSortChanged } from "../../../../../helpers/analytics";
import { createSortValue } from "../../../../../helpers/sortUtils";
import { SortState } from "../CharacterGrid";
import styles from "./styles.module.css";

const sortOptions = [
  {
    value: createSortValue(SortTypeEnum.Created, SortOrderEnum.Descending),
    label: "Created: Newest",
  },
  {
    value: createSortValue(SortTypeEnum.Created, SortOrderEnum.Ascending),
    label: "Created: Oldest",
  },
  {
    value: createSortValue(SortTypeEnum.Name, SortOrderEnum.Ascending),
    label: "Name: A to Z",
  },
  {
    value: createSortValue(SortTypeEnum.Name, SortOrderEnum.Descending),
    label: "Name: Z to A",
  },
  {
    value: createSortValue(SortTypeEnum.Level, SortOrderEnum.Ascending),
    label: "Level: Low to High",
  },
  {
    value: createSortValue(SortTypeEnum.Level, SortOrderEnum.Descending),
    label: "Level: High to Low",
  },
  {
    value: createSortValue(SortTypeEnum.Modified, SortOrderEnum.Descending),
    label: "Modified: Latest",
  },
  {
    value: createSortValue(SortTypeEnum.Modified, SortOrderEnum.Ascending),
    label: "Modified: Oldest",
  },
];

interface SearchSortProps {
  search: string;
  onSearch: Dispatch<SetStateAction<string>>;
  sort: SortState;
  onSort: Dispatch<SetStateAction<SortState>>;
  sortPreference: string;
  onSortPreference: Dispatch<SetStateAction<string>>;
}

export const SearchSort: FC<SearchSortProps> = ({
  search,
  onSearch,
  sort,
  onSort,
  sortPreference,
  onSortPreference,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSort = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const [sortBy, sortOrder] = value.split("-");

    onSort({
      sortBy: sortBy as SortTypeEnum,
      sortOrder: sortOrder as SortOrderEnum,
    });

    onSortPreference(value);

    logListingSortChanged(value);
  };

  const getSortValue =
    sortOptions.find(
      (opt) => opt.value === createSortValue(sort.sortBy, sort.sortOrder)
    ) || sortOptions[0];

  return (
    <div className={styles.searchSort}>
      <div className={styles.search} onClick={handleSearchClick}>
        <MagnifyingGlass />
        <label className={styles.searchLabel} htmlFor="search">
          Search
        </label>
        <input
          className={styles.searchInput}
          type="search"
          id="search"
          placeholder={"Search by Name, Level, Class, Species, or Campaign"}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          ref={searchInputRef}
        />
        {search && (
          <button
            className={styles.clearButton}
            onClick={(e) => onSearch("")}
            aria-label="Clear search terms"
          >
            <CircleXMark className={styles.clearIcon} />
          </button>
        )}
      </div>
      <Select
        className={styles.sort}
        placeholder="Select a movement"
        name="sort"
        label="Sort By"
        value={getSortValue.label}
        options={sortOptions}
        onChange={handleSort}
      />

      <>
        <Button
          className={styles.settingsButton}
          variant="outline"
          size="small"
          onClick={() => setShowSettingsModal(true)}
        >
          <Gear />
          <span className={styles.settingsButtonText}>Settings</span>
        </Button>
        <CharacterSettingsModal
          open={showSettingsModal}
          updateLocation={PreferenceUpdateLocation.CharacterListing}
          handleClose={() => setShowSettingsModal(false)}
        />
      </>
    </div>
  );
};
