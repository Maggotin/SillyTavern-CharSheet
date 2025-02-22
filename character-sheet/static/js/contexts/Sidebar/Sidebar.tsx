import { createContext, FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  PaneComponentEnum,
  PaneComponentInfo,
  PaneIdentifiers,
  SidebarAlignmentEnum,
  SidebarPlacementEnum,
} from "~/subApps/sheet/components/Sidebar/types";
import { SIDEBAR_FIXED_POSITION_START_WIDTH } from "~/tools/js/CharacterSheet/config";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

export interface SidebarInfo {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
  placement: SidebarPlacementEnum;
  setPlacement: (placement: SidebarPlacementEnum) => void;
  alignment: SidebarAlignmentEnum;
  setAlignment: (alignment: SidebarAlignmentEnum) => void;
  width: number;
}

export interface PaneInfo {
  activePane: PaneComponentInfo | null;
  showControls: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  paneHistoryStart: (
    componentType: PaneComponentEnum,
    componentIdentifiers?: PaneIdentifiers | null
  ) => void;
  paneHistoryPush: (
    componentType: PaneComponentEnum,
    componentIdentifiers?: PaneIdentifiers | null
  ) => void;
  paneHistoryPrevious: () => void;
  paneHistoryNext: () => void;
}

export interface SidebarContextType {
  sidebar: SidebarInfo;
  pane: PaneInfo;
}

export const SidebarContext = createContext<SidebarContextType>(null!);

export const SidebarProvider: FC = ({ children }) => {
  const isMobile = useSelector(appEnvSelectors.getIsMobile);
  const sheetDimensions = useSelector(appEnvSelectors.getDimensions);

  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [placement, setPlacement] = useState(SidebarPlacementEnum.OVERLAY);
  const [alignment, setAlignment] = useState(SidebarAlignmentEnum.RIGHT);

  const [paneIdx, setPaneIdx] = useState<number>(0);
  const [paneHistory, setPaneHistory] = useState<Array<PaneComponentInfo>>([]);

  const [activePane, setActivePane] = useState<PaneComponentInfo | null>(null);

  const width: number = 340;

  //Create a new pane history
  const paneHistoryStart = (
    type: PaneComponentEnum,
    identifiers: PaneIdentifiers | null = null
  ) => {
    setIsVisible(true);
    setPaneIdx(0);
    setPaneHistory([
      {
        type,
        identifiers,
      },
    ]);
  };

  //Add a new pane to the history
  const paneHistoryPush = (
    type: PaneComponentEnum,
    identifiers: PaneIdentifiers | null = null
  ) => {
    if (paneIdx === null) {
      paneHistoryStart(type, identifiers);
    } else {
      let newHistory = [
        ...paneHistory.slice(0, paneIdx + 1),
        {
          type,
          identifiers,
        },
      ];
      setPaneHistory(newHistory);
      setPaneIdx(newHistory.length - 1);
    }
    setIsVisible(true);
  };

  //Go back to the previous pane in the history
  const paneHistoryPrevious = () => {
    setPaneIdx(Math.max(0, paneIdx - 1));
  };

  //Go to the next pane in the history
  const paneHistoryNext = () => {
    setPaneIdx(Math.min(paneHistory.length - 1, paneIdx + 1));
  };

  useEffect(() => {
    //If the window less than the fixed position start width (1600px), set the placement to overlay
    if (
      isMobile ||
      sheetDimensions.window.width < SIDEBAR_FIXED_POSITION_START_WIDTH
    ) {
      setPlacement(SidebarPlacementEnum.OVERLAY);
    }

    //set Right alignment if mobile
    setAlignment(isMobile ? SidebarAlignmentEnum.RIGHT : alignment);
  }, [isMobile, sheetDimensions]);

  useEffect(() => {
    const activePane = paneHistory[paneIdx];
    setActivePane(activePane);
  }, [paneIdx, paneHistory]);

  return (
    <SidebarContext.Provider
      value={{
        sidebar: {
          isVisible,
          setIsVisible,
          isLocked,
          setIsLocked,
          placement,
          setPlacement,
          alignment,
          setAlignment,
          width,
        },
        pane: {
          activePane,
          showControls: paneHistory.length > 1,
          isAtStart: paneIdx === 0,
          isAtEnd: paneIdx === paneHistory.length - 1,
          paneHistoryStart,
          paneHistoryPush,
          paneHistoryPrevious,
          paneHistoryNext,
        },
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
