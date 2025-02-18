import React, { useContext } from "react";

import {
  CharacterTheme,
  InventoryManager,
  Item,
  ItemUtils,
} from "../../rules-engine/es";

import { ItemName } from "~/components/ItemName";

import { ItemSlotManager } from "../../../../Shared/components/ItemSlotManager";
import { InventoryManagerContext } from "../../../../Shared/managers/InventoryManagerContext";

interface Props {
  item: Item;
  onItemShow?: (item: Item) => void;
  className: string;
  theme: CharacterTheme;
  inventoryManager: InventoryManager;
}
export class AttunementItem extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleSetAttune = (uses: number): void => {
    const { inventoryManager, item } = this.props;

    //TODO use different component than SlotManager for attune/unattune
    if (uses === 1) {
      inventoryManager.handleAttune({ item });
    }

    if (uses === 0) {
      inventoryManager.handleUnattune({ item });
    }
  };

  handleItemClick = (evt: React.MouseEvent): void => {
    const { onItemShow, item } = this.props;

    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();

    if (onItemShow) {
      onItemShow(item);
    }
  };

  renderMetaItems = (): React.ReactNode => {
    const { item, inventoryManager } = this.props;

    let metaItems: Array<string> = [];

    if (ItemUtils.isLegacy(item)) {
      metaItems.push("Legacy");
    }

    let type = ItemUtils.getType(item);
    if (type !== null) {
      metaItems.push(type);
    }

    if (ItemUtils.isWeaponContract(item)) {
      if (ItemUtils.isOffhand(item)) {
        metaItems.push("Dual Wield");
      }
    } else if (ItemUtils.isArmorContract(item)) {
      let baseArmorName = ItemUtils.getBaseArmorName(item);
      if (baseArmorName) {
        metaItems.push(baseArmorName);
      }
    } else if (ItemUtils.isGearContract(item)) {
      let subType = ItemUtils.getSubType(item);
      if (subType) {
        metaItems.push(subType);
      }
      if (ItemUtils.isOffhand(item)) {
        metaItems.push("Dual Wield");
      }
    }

    if (
      ItemUtils.isEquipped(item) &&
      !inventoryManager.isEquippedToCurrentCharacter(item)
    ) {
      metaItems.push(
        `${
          ItemUtils.isAttuned(item) ? "Attuned" : "Equipped"
        } by ${inventoryManager.getEquippedCharacterName(item)}`
      );
    }

    return (
      <div className="ct-attunement__meta">
        {metaItems.map((metaItem, idx) => (
          <span className="ct-attunement__meta-item" key={idx}>
            {metaItem}
          </span>
        ))}
      </div>
    );
    //`
  };

  render() {
    const { item, className, theme, inventoryManager } = this.props;

    const canAttune = inventoryManager.canAttuneUnattuneItem(item);

    return (
      <div
        className={`ct-attunement__item ${className}`}
        onClick={this.handleItemClick}
      >
        <div className="ct-attunement__item-action">
          <ItemSlotManager
            isUsed={!!ItemUtils.isAttuned(item)}
            canUse={canAttune}
            theme={theme}
            onSet={this.handleSetAttune}
            useTooltip={
              !!ItemUtils.isEquipped(item) &&
              !inventoryManager.isEquippedToCurrentCharacter(item)
            }
            tooltipTitle={`${
              ItemUtils.isAttuned(item) ? "Attuned" : "Equipped"
            } by ${inventoryManager.getEquippedCharacterName(item)}`}
          />
        </div>
        <div className="ct-attunement__item-name">
          <div className="ct-attunement__item-heading">
            <ItemName item={item} />
          </div>
          {this.renderMetaItems()}
        </div>
      </div>
    );
    //`
  }
}

const AttunementItemContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  return <AttunementItem inventoryManager={inventoryManager} {...props} />;
};

export default AttunementItemContainer;
