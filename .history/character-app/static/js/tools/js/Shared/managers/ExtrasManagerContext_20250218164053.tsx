import React, { useMemo } from "react";

import { ExtrasManager } from "../../rules-engine/es";

interface ExtrasManagerContextValue {
  extrasManager: ExtrasManager;
}
const initContext: ExtrasManagerContextValue = {
  extrasManager: new ExtrasManager(),
};
export const ExtrasManagerContext =
  React.createContext<ExtrasManagerContextValue>(initContext);

export function ExtrasManagerProvider({ children }) {
  const extrasManager: ExtrasManager = useMemo(() => new ExtrasManager(), []);
  return (
    <ExtrasManagerContext.Provider value={{ extrasManager }}>
      {children}
    </ExtrasManagerContext.Provider>
  );
}
