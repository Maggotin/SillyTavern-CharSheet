import React, { useMemo } from "react";

import { CharacterFeaturesManager } from "../../rules-engine/es";

interface CharacterFeaturesManagerContextValue {
  characterFeaturesManager: CharacterFeaturesManager;
}
const initContext: CharacterFeaturesManagerContextValue = {
  characterFeaturesManager: new CharacterFeaturesManager(),
};
export const CharacterFeaturesManagerContext =
  React.createContext<CharacterFeaturesManagerContextValue>(initContext);

export function CharacterFeaturesManagerProvider({ children }) {
  const characterFeaturesManager: CharacterFeaturesManager = useMemo(
    () => new CharacterFeaturesManager(),
    []
  );
  return (
    <CharacterFeaturesManagerContext.Provider
      value={{ characterFeaturesManager }}
    >
      {children}
    </CharacterFeaturesManagerContext.Provider>
  );
}
