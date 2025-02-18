import { createContext, FC, useContext, useState } from "react";

export interface FiltersContextType {
  showItemTypes: boolean;
  setShowItemTypes: (show: boolean) => void;
  showItemSourceCategories: boolean;
  setShowItemSourceCategories: (show: boolean) => void;
  showSpellLevels: boolean;
  setShowSpellLevels: (show: boolean) => void;
  showSpellSourceCategories: boolean;
  setShowSpellSourceCategories: (show: boolean) => void;
}

export const FiltersContext = createContext<FiltersContextType>(null!);

export const FiltersProvider: FC = ({ children }) => {
  const [showItemTypes, setShowItemTypes] = useState(true);
  const [showItemSourceCategories, setShowItemSourceCategories] =
    useState(true);

  const [showSpellLevels, setShowSpellLevels] = useState(true);
  const [showSpellSourceCategories, setShowSpellSourceCategories] =
    useState(true);

  return (
    <FiltersContext.Provider
      value={{
        showItemTypes,
        setShowItemTypes,
        showItemSourceCategories,
        setShowItemSourceCategories,
        showSpellLevels,
        setShowSpellLevels,
        showSpellSourceCategories,
        setShowSpellSourceCategories,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => {
  return useContext(FiltersContext);
};
