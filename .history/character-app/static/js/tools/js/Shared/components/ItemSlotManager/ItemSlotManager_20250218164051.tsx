import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "../../rules-engine/es";

import SlotManager from "../SlotManager";

interface Props {
  isUsed: boolean;
  isReadonly?: boolean;
  canUse: boolean;
  onSet?: (uses: number) => void;
  theme: CharacterTheme;
  useTooltip?: boolean;
  showEmptySlot?: boolean;
  tooltipTitle?: string;
}
export const ItemSlotManager: React.FC<Props> = ({
  isUsed,
  isReadonly = false,
  canUse,
  onSet,
  theme,
  useTooltip = true,
  showEmptySlot = true,
  tooltipTitle,
}) => {
  return (
    <div className="ct-item-slot-manager">
      {canUse ? (
        <SlotManager
          size="small"
          used={isUsed ? 1 : 0}
          available={1}
          onSet={onSet}
          isInteractive={!isReadonly}
        />
      ) : showEmptySlot ? (
        <Tooltip
          enabled={useTooltip}
          title={tooltipTitle ?? ""}
          isDarkMode={theme.isDarkMode}
        >
          <div className="ct-item-slot-manager--empty">--</div>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default ItemSlotManager;
