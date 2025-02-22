import { createContext, useContext, useState } from "react";
import { Helmet } from "react-helmet";

interface HeadContextProps {
  title: string;
  setTitle: (title: string) => void;
}

export const HeadContext = createContext<HeadContextProps>(null!);

export const HeadContextProvider = ({ children }) => {
  const [title, setTitle] = useState("Character App");

  const setNewTitle = (title) => {
    setTitle(`${title} - D&D Beyond`);
  };

  return (
    <HeadContext.Provider value={{ title, setTitle: setNewTitle }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </HeadContext.Provider>
  );
};

export const useHeadContext = () => {
  const context = useContext(HeadContext);

  if (!context) {
    throw new Error("useHead must be used within a HeadProvider");
  }

  return context;
};
