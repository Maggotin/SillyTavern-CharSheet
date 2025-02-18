import { createContext, FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ApiAdapterUtils } from "../../character-rules-engine";

import { builderActions } from "~/tools/js/CharacterBuilder/actions";
import { modalActions } from "~/tools/js/Shared/actions";
import { apiCreatorSelectors } from "~/tools/js/Shared/selectors";
import { ClassDefinitionContract as ClassDef } from "~/types";

/**
 * A context to provide data to the application without causing a re-render or
 * unnecessary fetches and transforms. This context is used in places where
 * character-specific data is not needed.
 */
export interface ClassContextType {
  query: string;
  setQuery: (query: string) => void;
  filteredClasses: Array<ClassDef>;
  allClasses: Array<ClassDef>;
  handleSelectClass: (id: number) => void;
  isLoading: boolean;
  isModalShowing: boolean;
  closeModal: () => void;
}

export const ClassContext = createContext<ClassContextType>(null!);

export const ClassProvider: FC = ({ children }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [allClasses, setAllClasses] = useState<Array<ClassDef>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalShowing, setIsModalShowing] = useState(false);
  const closeModal = () => setIsModalShowing(false);

  const loadClasses = useSelector(apiCreatorSelectors.makeLoadAvailableClasses);

  const handleSelectClass = (id: number) => {
    const entity = allClasses.find((c) => c.id === id);
    if (entity) {
      dispatch(builderActions.confirmClassSet(entity));
      setIsModalShowing(true);
      window.scrollTo(0, 0);
    }
  };

  // Handle searching through items
  const filteredClasses = query
    ? allClasses.filter((c) =>
        c.name?.toLowerCase().includes(query.toLowerCase())
      )
    : allClasses;

  useEffect(() => {
    const getAllData = async () => {
      // Load all classes
      const response = await loadClasses();
      const classes = ApiAdapterUtils.getResponseData(response) || [];

      setAllClasses(classes);

      if (classes.length > 0) {
        setIsLoading(false);
      }
    };

    getAllData();
  }, [loadClasses]);

  return (
    <ClassContext.Provider
      value={{
        query,
        setQuery,
        filteredClasses,
        allClasses,
        handleSelectClass,
        isLoading,
        isModalShowing,
        closeModal,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClassContext = () => {
  return useContext(ClassContext);
};
