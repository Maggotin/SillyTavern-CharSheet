import React, { useMemo } from "react";

import { CoinManager } from "@dndbeyond/character-rules-engine/es";

interface CoinManagerContextValue {
  coinManager: CoinManager | null;
}
const initContext: CoinManagerContextValue = {
  coinManager: null,
};
export const CoinManagerContext =
  React.createContext<CoinManagerContextValue>(initContext);

export function CoinManagerProvider({ children }) {
  const coinManager: CoinManager = useMemo(() => new CoinManager(), []);
  return (
    <CoinManagerContext.Provider value={{ coinManager }}>
      {children}
    </CoinManagerContext.Provider>
  );
}
