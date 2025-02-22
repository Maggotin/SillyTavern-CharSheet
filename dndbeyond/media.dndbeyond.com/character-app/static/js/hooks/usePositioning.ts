import { useSelector } from "react-redux";

import { useSidebar } from "~/contexts/Sidebar";
import {
  SidebarAlignmentEnum,
  SidebarPlacementEnum,
  SidebarPositionInfo,
} from "~/subApps/sheet/components/Sidebar/types";
import { SheetPositioningInfo } from "~/tools/js/CharacterSheet/typings";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

export const usePositioning = () => {
  const {
    sidebar: { isVisible, placement, alignment, width },
  } = useSidebar();

  const getSheetPositioning = (): SheetPositioningInfo => {
    let offset: number = 0;
    if (!isVisible) {
      return { offset, left: offset };
    }

    if (placement === SidebarPlacementEnum.FIXED) {
      offset = width / 2;
    }

    return {
      offset,
      left: alignment === SidebarAlignmentEnum.LEFT ? offset : -1 * offset,
    };
  };

  const getSidebarPositioning = (): SidebarPositionInfo => {
    const sheetDimensions = useSelector(appEnvSelectors.getDimensions);
    const sheetPosition = getSheetPositioning();

    const { sheet, window } = sheetDimensions;

    let posX: number = 0;
    let sidebarGutter: number = 15;
    let screenGutterSize: number = (window.width - sheet.width) / 2;

    if (placement === SidebarPlacementEnum.FIXED) {
      posX = screenGutterSize + sheetPosition.offset - sidebarGutter - width;
    } else {
      screenGutterSize -= sidebarGutter;
      let overflowOffset: number =
        width > screenGutterSize ? width - screenGutterSize : 0;
      posX = screenGutterSize - width + overflowOffset;
    }

    return {
      left: alignment === SidebarAlignmentEnum.LEFT ? posX : "auto",
      right: alignment === SidebarAlignmentEnum.RIGHT ? posX : "auto",
    };
  };

  return {
    getSheetPositioning,
    getSidebarPositioning,
  };
};
