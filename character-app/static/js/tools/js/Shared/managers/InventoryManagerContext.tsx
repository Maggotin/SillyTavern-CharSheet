import React, { useMemo } from "react";

import { InventoryManager } from "@dndbeyond/character-rules-engine/es";

interface InventoryManagerContextValue {
  inventoryManager: InventoryManager;
}
const initContext: InventoryManagerContextValue = {
  inventoryManager: new InventoryManager(),
};
export const InventoryManagerContext =
  React.createContext<InventoryManagerContextValue>(initContext);

export function InventoryManagerProvider({ children }) {
  const inventoryManager: InventoryManager = useMemo(
    () => new InventoryManager(),
    []
  );
  return (
    <InventoryManagerContext.Provider value={{ inventoryManager }}>
      {children}
    </InventoryManagerContext.Provider>
  );
}
