import { groupBy, keyBy, uniqBy } from "lodash";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { useSource } from "~/hooks/useSource";
import { apiCreatorSelectors } from "~/tools/js/Shared/selectors";
import { TypeScriptUtils } from "~/tools/js/Shared/utils";
import {
  HtmlSelectOption,
  HtmlSelectOptionGroup,
  RaceDefinitionContract as RaceDef,
  RaceDefinitionContract,
  SimpleSourcedDefinitionContract,
} from "~/types";

import { GroupedListingItem, ListingItem } from "../../types";

export interface SpeciesContextType {
  closeModal: () => void;
  defaultSpeciesImageUrl: string;
  isLegacyShowing: boolean;
  isModalShowing: boolean;
  query: string;
  selectedSpecies?: RaceDef;
  setQuery: (query: string) => void;
  source: string;
  sourceOptions: (HtmlSelectOptionGroup | HtmlSelectOption)[];
  filteredSpecies: RaceDef[];
  allSpecies: RaceDef[];
  toggleLegacyContent: () => void;
  transformSpecies: (data: RaceDef[]) => ListingItem[];
  setSource: (source: string) => void;
  isLoading: boolean;
  getSpeciesInGroups: (
    species: ListingItem[]
  ) => (ListingItem | GroupedListingItem)[];
}

export const SpeciesContext = createContext<SpeciesContextType>(null!);

export const SpeciesProvider: FC = ({ children }) => {
  const {
    apiAdapterUtils: { getResponseData },
    raceUtils: { getSubRaceShortName, getBaseName, getIsHomebrew, getSources },
    ruleData,
    ruleDataUtils: { getDefaultRaceImageUrl, getRaceGroups },
    characterUtils: { isPrimarySource },
  } = useCharacterEngine();
  const { getSourceDescription, getGroupedOptionsBySourceCategory } =
    useSource();

  const [allSpecies, setAllSpecies] = useState<Array<RaceDef>>([]);
  const [isLegacyShowing, setIsLegacyShowing] = useState(true);
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<RaceDef>();
  const [source, setSource] = useState("");
  const [sourceOptions, setSourceOptions] = useState<
    (HtmlSelectOptionGroup | HtmlSelectOption)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSpecies = useSelector(apiCreatorSelectors.makeLoadAvailableRaces);

  const defaultSpeciesImageUrl = getDefaultRaceImageUrl(ruleData) ?? "";

  const handleFilteredSpecies = () => {
    let filtered = allSpecies;
    //Check legacy toggle
    if (!isLegacyShowing) {
      filtered = filtered.filter((s) => !s.isLegacy);
    }

    // Check sources
    if (source !== "") {
      if (source === "HOMEBREW") {
        filtered = filtered.filter((s) => s.isHomebrew);
      } else {
        filtered = filtered.filter((s) =>
          s.sources?.some(({ sourceId }) => source === sourceId.toString())
        );
      }
    }
    // Check querys
    if (query !== "") {
      filtered = filtered.filter((s) => {
        return s.fullName?.toLowerCase().includes(query.toLowerCase());
      });
    }
    return filtered;
  };
  // Handle searching through items
  const filteredSpecies = handleFilteredSpecies();

  const onSelectSpecies = (id: string) => {
    const entity = allSpecies.find(
      (s) => `${s.entityRaceId}-${s.entityRaceTypeId}` === id
    );
    if (entity) {
      setSelectedSpecies(entity);
      setIsModalShowing(true);
      window.scrollTo(0, 0);
    }
  };

  const closeModal = () => setIsModalShowing(false);

  const toggleLegacyContent = () => {
    setIsLegacyShowing(!isLegacyShowing);
  };

  //Transform Species data into ListingItems
  const transformSpecies = (data: RaceDef[]): ListingItem[] => {
    return data.map((species) => {
      const shortName = getSubRaceShortName(species);
      const baseName = getBaseName(species);
      const heading = shortName ? `${shortName} ${baseName}` : baseName || "";
      const text = getIsHomebrew(species)
        ? "Homebrew"
        : getSourceDescription(species?.sources?.[0]?.sourceId || 0) || "";

      return {
        type: "species",
        id: `${species.entityRaceId}-${species.entityRaceTypeId}`,
        entityTypeId: species.entityRaceTypeId,
        heading,
        text,
        image: species.portraitAvatarUrl || defaultSpeciesImageUrl,
        entity: species,
        isLegacy: species.isLegacy,
        onClick: onSelectSpecies,
      };
    });
  };

  // get the ListingItems for species, both grouped and individual
  const getSpeciesInGroups = (
    species: ListingItem[]
  ): (ListingItem | GroupedListingItem)[] => {
    let groupedSpecies: ListingItem[] = [];
    let unGroupedSpecies: ListingItem[] = [];

    //species that have a groupId go into the groupedSpecies array and species that don't have a groupId go into the unGroupedSpecies array
    species.forEach((s) => {
      const groupIds = (s.entity as RaceDefinitionContract)?.groupIds;
      if (groupIds && groupIds.length > 0) {
        groupIds.forEach((groupId) => {
          groupedSpecies.push({
            ...s,
            groupId,
          });
        });
      } else {
        unGroupedSpecies.push(s);
      }
    });

    //Create a lookup of grouped species by groupId
    const groupedSpeciesLookup = groupBy(groupedSpecies, "groupId");
    //Create a lookup from all Species Groups from rules data
    const groupDataLookup = keyBy(getRaceGroups(ruleData), "id");
    //This array will hold the final list of grouped species
    const groups: GroupedListingItem[] = [];

    //Iterate through the grouped species lookup to create final groupings
    Object.keys(groupedSpeciesLookup).forEach((groupId) => {
      const groupItems = groupedSpeciesLookup[groupId];
      //If the group only has one item, it is not a group - put it in the unGroupedSpecies array, otherwise create the Grouped Listing Item for the group
      if (groupItems.length === 1) {
        unGroupedSpecies.push(groupItems[0]);
      } else {
        const groupInfo = groupDataLookup[parseInt(groupId)];
        groups.push({
          id: groupId,
          type: "group",
          image: groupInfo.avatarUrl ?? "",
          heading: groupInfo.name ?? "",
          groupId: parseInt(groupId),
          listItems: groupItems,
          onClick: undefined,
        });
      }
    });

    return [...groups, ...unGroupedSpecies];
  };

  const getSpecies = async () => {
    const species = getResponseData(await loadSpecies()) || [];

    setAllSpecies(species);
    if (species.length > 0) {
      setIsLoading(false);
    }
  };

  // Set the source options when the species are loaded
  useEffect(() => {
    let shouldContaineHomebrewCategory = false;
    let sourceShouldReset = true;

    const sourcesData: Array<SimpleSourcedDefinitionContract> = allSpecies
      .map((species) => {
        //Flag homebrew category
        if (species.isHomebrew) {
          if (!shouldContaineHomebrewCategory) {
            shouldContaineHomebrewCategory = true;
          }

          //don't reset source state if we have a homebrew category and the current source is homebrew
          if (shouldContaineHomebrewCategory && source === "HOMEBREW") {
            sourceShouldReset = false;
          }
          return null;
        }

        const primarySourceId =
          getSources(species).filter(isPrimarySource)[0]?.sourceId;

        //If there is no primary source and the above filter hasn't already returned null for isHombrew, return null
        if (!primarySourceId) {
          return null;
        }

        //don't reset source state if the current source is the sourceId of a species
        if (primarySourceId.toString() === source) {
          sourceShouldReset = false;
        }

        return {
          sources: getSources(species),
          name: getSourceDescription(primarySourceId) || "Unknown",
          id: primarySourceId,
        };
      })
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    const uniqueSources = uniqBy(sourcesData, "id");
    const groupedOptions = getGroupedOptionsBySourceCategory(uniqueSources);

    const homebrewOptions: HtmlSelectOption[] = [
      {
        label: "Homebrew",
        value: "HOMEBREW",
      },
      {
        label: "---------",
        disabled: true,
        value: "-----",
      },
    ];
    const sourceOptions: (HtmlSelectOptionGroup | HtmlSelectOption)[] = [];
    if (shouldContaineHomebrewCategory) {
      sourceOptions.push(...homebrewOptions);
    }

    sourceOptions.push(...groupedOptions);

    setSourceOptions(sourceOptions);

    //reset source state if the source isn't valid for the list of current species so that the list is updated
    if (sourceShouldReset) {
      setSource("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSpecies, source]);

  useEffect(() => {
    getSpecies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSpecies]);

  return (
    <SpeciesContext.Provider
      value={{
        closeModal,
        defaultSpeciesImageUrl,
        isLegacyShowing,
        isModalShowing,
        query,
        selectedSpecies,
        setQuery,
        sourceOptions,
        filteredSpecies,
        allSpecies,
        toggleLegacyContent,
        transformSpecies,
        source,
        setSource,
        isLoading,
        getSpeciesInGroups,
      }}
    >
      {children}
    </SpeciesContext.Provider>
  );
};

export const useSpeciesContext = () => {
  return useContext(SpeciesContext);
};
