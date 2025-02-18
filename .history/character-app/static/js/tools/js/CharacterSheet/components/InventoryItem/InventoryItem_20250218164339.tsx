import React, { useContext } from "react";

import { Tooltip } from "../../character-common-components/es";
import { NoteComponents } from "../../character-components/es";
import {
  CharacterTheme,
  ItemManager,
} from "../../character-rules-engine/es";

import { ItemName } from "~/components/ItemName";
import { NumberDisplay } from "~/components/NumberDisplay";

import { ItemSlotManager } from "../../../Shared/components/ItemSlotManager";
import { InventoryManagerContext } from "../../../Shared/managers/InventoryManagerContext";

interface Props {
  item: ItemManager;
  onEquip?: () => void;
  onUnequip?: () => void;
  onItemShow?: (mappingId: number) => void;
  className?: string;
  showNotes?: boolean;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export const InventoryItem: React.FC<Props> = ({
  item,
  onEquip,
  onUnequip,
  onItemShow,
  className = "",
  showNotes = true,
  isReadonly,
  theme,
}) => {
  const { inventoryManager } = useContext(InventoryManagerContext);

  const quantity = item.getQuantity();
  const isStackable = item.isStackable();
  const canEquip = inventoryManager.canEquipUnequipItem(item.item);
  const isEquippedToCurrentCharacter = item.isEquippedToCurrentCharacter();
  const isEquipped = item.isEquipped();
  const weight = item.getWeight();
  const cost = item.getCost();

  return (
    <div
      className={`ct-inventory-item ${className}`}
      onClick={(evt) => {
        evt.nativeEvent.stopImmediatePropagation();
        evt.stopPropagation();

        if (onItemShow) {
          onItemShow(item.getMappingId());
        }
      }}
      role="button"
      data-testid={`inventory-item-${item.getName()}`
        .toLowerCase()
        .replace(/\s/g, "-")}
    >
      <div className="ct-inventory-item__action">
        <ItemSlotManager
          isUsed={!!item.isEquipped()}
          isReadonly={isReadonly}
          canUse={canEquip}
          onSet={(used) => {
            //TODO use different component than SlotManager for equip/unequip
            if (used === 0 && onUnequip) {
              onUnequip();
            }

            if (used === 1 && onEquip) {
              onEquip();
            }
          }}
          theme={theme}
          useTooltip={!!isEquipped && !isEquippedToCurrentCharacter}
          tooltipTitle={`Equipped by ${item.getEquippedCharacterName()}`}
        />
      </div>
      <div className="ct-inventory-item__name">
        <div className="ct-inventory-item__heading">
          <ItemName item={item.item} />
        </div>
        <div
          className={`ct-inventory-item__meta ${
            theme?.isDarkMode ? "ct-inventory-item__meta--dark-mode" : ""
          }`}
        >
          {item.getMetaText().map((metaItem, idx) => (
            <span className="ct-inventory-item__meta-item" key={idx}>
              {metaItem}
            </span>
          ))}
        </div>
      </div>
      <div className="ct-inventory-item__weight">
        {weight ? (
          <Tooltip title={`${weight} lb.`} isDarkMode={theme?.isDarkMode}>
            <NumberDisplay type="weightInLb" number={weight} />
          </Tooltip>
        ) : (
          "--"
        )}
      </div>
      <div
        className={`ct-inventory-item__quantity ${
          theme?.isDarkMode ? "ct-inventory-item__quantity--dark-mode" : ""
        }`}
      >
        {isStackable ? (
          <Tooltip title={quantity.toString()} isDarkMode={theme?.isDarkMode}>
            {quantity}
          </Tooltip>
        ) : (
          "--"
        )}
      </div>
      <div
        className={`ct-inventory-item__cost ${
          theme?.isDarkMode ? "ct-inventory-item__cost--dark-mode" : ""
        }`}
      >
        {cost ? (
          <Tooltip title={cost.toString()} isDarkMode={theme?.isDarkMode}>
            {cost}
          </Tooltip>
        ) : (
          "--"
        )}
      </div>
      {showNotes && (
        <div className="ct-inventory-item__notes">
          <NoteComponents notes={item.getNotes()} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default InventoryItem;
