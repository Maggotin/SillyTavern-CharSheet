import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Item,
  Constants,
  ItemUtils,
} from "@dndbeyond/character-rules-engine/es";

import { AttunementIcon } from "~/tools/js/smartComponents/Icons";

import { Tooltip } from "../Tooltip";
import styles from "./styles.module.css";

/**
 * Component to display the name of an item with an attunement icon and a color
 * to identify the rarity of the object. It is used in the equipment tab on the
 * character sheet as well as the manage inventory pane.
 */
interface ItemNameProps extends HTMLAttributes<HTMLSpanElement> {
  item: Item;
  className?: string;
  onClick?: () => void;
  showAttunement?: boolean;
  showLegacy?: boolean;
}

export const ItemName: FC<ItemNameProps> = ({
  showAttunement = true,
  showLegacy = false,
  className,
  onClick,
  item,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent): void => {
    if (onClick) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  const getDisplayName = () => {
    const name = ItemUtils.getName(item);
    if (!name) return ItemUtils.getDefinitionName(item);
    if (!name) return "Item";
    return name;
  };

  const getItemRarity = () => {
    switch (ItemUtils.getRarity(item)) {
      case Constants.ItemRarityNameEnum.ARTIFACT:
        return "artifact";
      case Constants.ItemRarityNameEnum.LEGENDARY:
        return "legendary";
      case Constants.ItemRarityNameEnum.VERY_RARE:
        return "veryrare";
      case Constants.ItemRarityNameEnum.RARE:
        return "rare";
      case Constants.ItemRarityNameEnum.UNCOMMON:
        return "uncommon";
      case Constants.ItemRarityNameEnum.COMMON:
      default:
        return "common";
    }
  };

  const tooltipId = `itemName-${uuidv4()}`;

  return (
    <>
      <span
        className={clsx([styles.itemName, styles[getItemRarity()], className])}
        onClick={handleClick}
        {...props}
      >
        {getDisplayName()}
        {item.isCustomized && (
          <>
            <span
              className={styles.asterisk}
              data-tooltip-id={tooltipId}
              data-tooltip-content="Item is Customized"
            >
              *
            </span>
            <Tooltip id={tooltipId} />
          </>
        )}
        {showAttunement && item.isAttuned && (
          <span className={styles.icon}>
            <AttunementIcon />
          </span>
        )}
        {showLegacy && ItemUtils.isLegacy(item) && (
          <span className={styles.legacy}>(Legacy)</span>
        )}
      </span>
    </>
  );
};
