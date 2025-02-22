import { createContext, FC, useContext, useState } from "react";

import { MobileSections } from "../../types";

export interface SheetContextType {
  mobileActiveSectionId: MobileSections;
  setMobileActiveSectionId: (sectionId: MobileSections) => void;
  setSwipedAmount: (amount: number) => void;
  swipedAmount: number;
}

export const SheetContext = createContext<SheetContextType>(null!);

export const SheetProvider: FC = ({ children }) => {
  const [mobileActiveSectionId, setMobileActiveSectionId] =
    useState<MobileSections>("main");
  const [swipedAmount, setSwipedAmount] = useState(0);

  return (
    <SheetContext.Provider
      value={{
        mobileActiveSectionId,
        setMobileActiveSectionId,
        setSwipedAmount,
        swipedAmount,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheetContext = () => {
  return useContext(SheetContext);
};
