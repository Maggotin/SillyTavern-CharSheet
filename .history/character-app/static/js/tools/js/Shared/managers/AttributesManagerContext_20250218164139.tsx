import React, { useMemo } from "react";

import { AttributesManager } from "@dndbeyond/character-rules-engine/es";

interface AttributesManagerContextValue {
  attributesManager: AttributesManager;
}
const initContext: AttributesManagerContextValue = {
  attributesManager: new AttributesManager(),
};
export const AttributesManagerContext =
  React.createContext<AttributesManagerContextValue>(initContext);

export function AttributesManagerProvider({ children }) {
  const attributesManager: AttributesManager = useMemo(
    () => new AttributesManager(),
    []
  );
  return (
    <AttributesManagerContext.Provider value={{ attributesManager }}>
      {children}
    </AttributesManagerContext.Provider>
  );
}
