import React, { useMemo } from "react";

import {
  getSpellsManager,
  SpellsManager,
} from "../../character-rules-engine/es";

interface SpellsManagerContextValue {
  spellsManager: SpellsManager;
}

const initContext: SpellsManagerContextValue = {
  spellsManager: null!,
};
export const SpellsManagerContext =
  React.createContext<SpellsManagerContextValue>(initContext);

export function SpellsManagerProvider({ children }) {
  // TODO: try getting the initialized sub and cleaning it up in here?
  const spellsManager: SpellsManager = useMemo(() => getSpellsManager(), []);
  return (
    <SpellsManagerContext.Provider value={{ spellsManager }}>
      {children}
    </SpellsManagerContext.Provider>
  );
}
