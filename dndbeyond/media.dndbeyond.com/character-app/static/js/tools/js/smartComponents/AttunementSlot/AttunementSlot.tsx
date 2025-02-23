import * as React from "react";

import {
  Item,
  ItemUtils,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import { ItemName } from "~/components/ItemName";

import BoxBackground from "../BoxBackground";
import {
  EmptyAttunementSlotBoxSvg,
  ThemedAttunementSlotBoxSvg,
  ThemedWithOpacityAttunementSlotBoxSvg,
} from "../Svg/boxes/AttunementSlotBoxSvg";

interface Props {
  slot: Item | null;
  onClick?: (slot: Item) => void;
  isMobile: boolean;
  className: string;
  theme: CharacterTheme;
}

export default class AttunementSlot extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
    isMobile: false,
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, slot } = this.props;

    if (onClick && slot !== null) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      onClick(slot);
    }
  };

  renderMetaItems = (): React.ReactNode => {
    const { slot } = this.props;

    if (slot === null) {
      return null;
    }

    let metaItems: Array<string> = [];

    if (ItemUtils.isLegacy(slot)) {
      metaItems.push("Legacy");
    }

    let type = ItemUtils.getType(slot);
    if (type !== null) {
      metaItems.push(type);
    }

    if (ItemUtils.isWeaponContract(slot)) {
      if (ItemUtils.isOffhand(slot)) {
        metaItems.push("Dual Wield");
      }
    } else if (ItemUtils.isArmorContract(slot)) {
      let baseArmorName = ItemUtils.getBaseArmorName(slot);
      if (baseArmorName) {
        metaItems.push(baseArmorName);
      }
    } else if (ItemUtils.isGearContract(slot)) {
      let subType = ItemUtils.getSubType(slot);
      if (subType) {
        metaItems.push(subType);
      }
      if (ItemUtils.isOffhand(slot)) {
        metaItems.push("Dual Wield");
      }
    }

    return (
      <div className="ddbc-attunement-slot__meta">
        {metaItems.map(
          (metaItem, idx): React.ReactNode => (
            <span className="ddbc-attunement-slot__meta-item" key={idx}>
              {metaItem}
            </span>
          )
        )}
      </div>
    );
  };

  renderItem = (): React.ReactNode => {
    const { slot } = this.props;

    if (slot === null) {
      return null;
    }

    let itemImage = ItemUtils.getAvatarUrl(slot);
    let previewStyles: React.CSSProperties = {
      backgroundImage: `url(${itemImage})`,
    };

    return (
      <React.Fragment>
        <div className="ddbc-attunement-slot__preview" style={previewStyles} />
        <div className="ddbc-attunement-slot__content">
          <div className="ddbc-attunement-slot__name">
            <ItemName item={slot} showAttunement={false} />
          </div>
          {this.renderMetaItems()}
        </div>
      </React.Fragment>
    );
  };

  renderEmpty = (): React.ReactNode => {
    const { isMobile } = this.props;

    return (
      <React.Fragment>
        <div className="ddbc-attunement-slot__preview" />
        <div className="ddbc-attunement-slot__content">
          Choose an Item from {isMobile ? "Below" : " the Right"}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { slot, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-attunement-slot"];
    let StyleComponent: React.ComponentType<any> = theme?.isDarkMode
      ? ThemedWithOpacityAttunementSlotBoxSvg
      : EmptyAttunementSlotBoxSvg;
    if (slot) {
      classNames.push("ddbc-attunement-slot--filled");
      StyleComponent = ThemedAttunementSlotBoxSvg;
    } else {
      classNames.push("ddbc-attunement-slot--empty");
    }

    return (
      <div className={classNames.join(" ")} onClick={this.handleClick}>
        <BoxBackground StyleComponent={StyleComponent} theme={theme} />
        {slot ? this.renderItem() : this.renderEmpty()}
      </div>
    );
  }
}
