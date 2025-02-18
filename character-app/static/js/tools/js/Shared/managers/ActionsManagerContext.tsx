import React, { useMemo } from "react";

import { ActionsManager } from "@dndbeyond/character-rules-engine/es";

interface ActionsManagerContextValue {
  actionsManager: ActionsManager;
}

const initContext: ActionsManagerContextValue = {
  actionsManager: new ActionsManager(),
};
export const ActionsManagerContext =
  React.createContext<ActionsManagerContextValue>(initContext);

export function ActionsManagerProvider({ children }) {
  const actionsManager: ActionsManager = useMemo(
    () => new ActionsManager(),
    []
  );
  return (
    <ActionsManagerContext.Provider value={{ actionsManager }}>
      {children}
    </ActionsManagerContext.Provider>
  );
}
