import * as React from "react";

import {
  CharacterTheme,
  Item,
  ItemUtils,
} from "../../character-rules-engine/es";

import { ItemName } from "~/components/ItemName";

interface Props {
  item: Item;
  onClick?: (item: Item) => void;
  theme: CharacterTheme;
}
class ItemPreview extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, item } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(item);
    }
  };

  renderMetaText = (): React.ReactNode => {
    const { item } = this.props;

    let metaItems: Array<string> = [];

    if (ItemUtils.isLegacy(item)) {
      metaItems.push("Legacy");
    }

    const type = ItemUtils.getType(item);
    if (type) {
      metaItems.push(type);
    }

    if (ItemUtils.isArmorContract(item)) {
      let baseArmorName = ItemUtils.getBaseArmorName(item);
      if (baseArmorName) {
        metaItems.push(baseArmorName);
      }
    } else if (ItemUtils.isGearContract(item)) {
      let subType = ItemUtils.getSubType(item);
      if (subType) {
        metaItems.push(subType);
      }
    }

    return (
      <div className="ddbc-item-preview__meta">
        {metaItems.map((metaItem, idx) => (
          <span className="ddbc-item-preview__meta-item" key={idx}>
            {metaItem}
          </span>
        ))}
      </div>
    );
  };

  render() {
    const { item } = this.props;

    const imageStyles: React.CSSProperties = {
      backgroundImage: `url(${ItemUtils.getAvatarUrl(item)})`,
    };

    return (
      <div className="ddbc-item-preview" onClick={this.handleClick}>
        <div className="ddbc-item-preview__avatar" style={imageStyles} />
        <div className="ddbc-item-preview__name">
          <ItemName item={item} />
          {this.renderMetaText()}
        </div>
      </div>
    );
  }
}

export default ItemPreview;
