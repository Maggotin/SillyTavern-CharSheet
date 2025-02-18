import React from "react";

import { Button } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  Item,
  ItemUtils,
} from "../../rules-engine/es";

import Collapsible, { CollapsibleHeader } from "../common/Collapsible";

export class EquipmentListItemHeaderAction extends React.PureComponent<{
  item: Item;
  heading: any;
  metaItems: Array<string>;
  imageUrl: string;

  onUnequip?: (item: Item) => void;
  onEquip?: (item: Item) => void;

  unequipLabel: string;
  equipLabel: string;
}> {
  static defaultProps = {
    showHeaderAction: false,
    consumeLabel: "Consume",
  };

  handleUnequip = () => {
    const { onUnequip, item } = this.props;

    if (onUnequip) {
      onUnequip(item);
    }
  };

  handleEquip = () => {
    const { onEquip, item } = this.props;

    if (onEquip) {
      onEquip(item);
    }
  };

  render() {
    const { item, heading, imageUrl, metaItems, unequipLabel, equipLabel } =
      this.props;

    const isEquipped = ItemUtils.isEquipped(item);
    const isStackable = ItemUtils.isStackable(item);
    const canEquip = ItemUtils.canEquip(item);
    const quantity = ItemUtils.getQuantity(item);

    const callout = (
      <div className="equipment-list-item-callout">
        {isStackable && (
          <div className="equipment-list-item-callout-quantity">
            <span className="equipment-list-item-callout-quantity-extra">
              Qty
            </span>
            <span className="equipment-list-item-callout-quantity-value">
              {quantity}
            </span>
          </div>
        )}
        {canEquip && (
          <div className="equipment-list-item-callout-action">
            <Button
              onClick={isEquipped ? this.handleUnequip : this.handleEquip}
              style={isEquipped ? "" : "outline"}
              size="small"
            >
              {isEquipped ? unequipLabel : equipLabel}
            </Button>
          </div>
        )}
      </div>
    );

    return (
      <CollapsibleHeader
        imgSrc={imageUrl}
        heading={heading}
        metaItems={metaItems}
        callout={callout}
      />
    );
  }
}

interface EquipmentListItemProps {
  item: Item;

  atAttuneMax: boolean;

  showRemove: boolean;
  showEquip: boolean;
  showUnequip: boolean;
  showAttuning: boolean;

  removeLabel: string;
  removeInfusionLabel: string;
  unequipLabel: string;
  equipLabel: string;
  attuneLabel: string;
  unattuneLabel: string;
  consumeLabel: string;

  onRemove?: (item: Item) => void;
  onRemoveInfusion: (item: Item) => void;
  onUnequip?: (item: Item) => void;
  onEquip?: (item: Item) => void;
  onAttune?: (item: Item) => void;
  onUnattune?: (item: Item) => void;
  onQuantitySet: (item: Item, quantity: number) => void;
}
interface EquipmentListItemState {
  quantity: number;
  newQuantity: number;
}
export class EquipmentListItemActions extends React.PureComponent<
  EquipmentListItemProps,
  EquipmentListItemState
> {
  static defaultProps = {
    consumeLabel: "Consume",
    removeLabel: "Remove Item",
    removeInfusionLabel: "Remove Infusion",
    unequipLabel: "Unequip",
    equipLabel: "Equip",
    attuneLabel: "Attune",
    unattuneLabel: "Attuned",
    showRemove: false,
    showEquip: false,
    showUnequip: false,
    showAttuning: false,
    atAttuneMax: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      quantity: ItemUtils.getQuantity(props.item),
      newQuantity: ItemUtils.getQuantity(props.item),
    };
  }

  componentDidUpdate(
    prevProps: Readonly<EquipmentListItemProps>,
    prevState: Readonly<EquipmentListItemState>,
    snapshot?: any
  ): void {
    const { item } = this.props;

    const nextQuantity = ItemUtils.getQuantity(item);
    if (nextQuantity !== prevState.quantity) {
      this.setState({
        quantity: nextQuantity,
        newQuantity: nextQuantity,
      });
    }
  }

  handleQuantitySave = (newValue) => {
    const { onQuantitySet, item } = this.props;

    const quantity = ItemUtils.getQuantity(item);
    const quantityDiff = newValue - quantity;

    if (quantityDiff === 0) {
      return;
    }

    if (onQuantitySet) {
      onQuantitySet(item, newValue);
    }

    this.setState((prevState) => ({
      quantity: newValue,
      newQuantity: newValue,
    }));
  };

  handleAttune = () => {
    const { onAttune, item } = this.props;
    if (onAttune) {
      onAttune(item);
    }
  };

  handleUnattune = () => {
    const { onUnattune, item } = this.props;
    if (onUnattune) {
      onUnattune(item);
    }
  };

  handleUnequip = () => {
    const { onUnequip, item } = this.props;
    if (onUnequip) {
      onUnequip(item);
    }
  };

  handleEquip = () => {
    const { onEquip, item } = this.props;
    if (onEquip) {
      onEquip(item);
    }
  };

  handleRemove = () => {
    const { onRemove, item } = this.props;
    if (onRemove) {
      onRemove(item);
    }
  };

  handleRemoveInfusion = () => {
    const { onRemoveInfusion, item } = this.props;
    if (onRemoveInfusion) {
      onRemoveInfusion(item);
    }
  };

  handleAmountChange = (evt) => {
    this.setState({
      newQuantity: evt.target.value,
    });
  };

  handleAmountKeyUp = (evt) => {
    const parsedValue = HelperUtils.parseInputInt(evt.target.value);
    const clampedValue = HelperUtils.clampInt(parsedValue ? parsedValue : 0, 0);

    if (evt.key === "Enter") {
      this.handleQuantitySave(clampedValue);
    }
  };

  handleAmountBlur = (evt) => {
    const parsedValue = HelperUtils.parseInputInt(evt.target.value);
    const clampedValue = HelperUtils.clampInt(parsedValue ? parsedValue : 0, 0);

    this.handleQuantitySave(clampedValue);
  };

  handleIncrementClick = () => {
    const { onQuantitySet, item } = this.props;

    this.setState((prevState, props) => {
      const quantity = prevState.quantity + 1;
      if (onQuantitySet) {
        onQuantitySet(item, quantity);
      }

      return {
        quantity,
        newQuantity: quantity,
      };
    });
  };

  handleDecrementClick = () => {
    const { onQuantitySet, item } = this.props;

    this.setState((prevState, props) => {
      const quantity = prevState.quantity - 1;
      if (onQuantitySet) {
        onQuantitySet(item, quantity);
      }

      return {
        quantity: Math.max(prevState.quantity - 1, 0),
        newQuantity: Math.max(prevState.quantity - 1, 0),
      };
    });
  };

  render() {
    const { quantity, newQuantity } = this.state;
    const {
      item,
      removeLabel,
      removeInfusionLabel,
      unequipLabel,
      equipLabel,
      attuneLabel,
      unattuneLabel,
      consumeLabel,
      showRemove,
      showEquip,
      showUnequip,
      showAttuning,
      atAttuneMax,
    } = this.props;

    const hasActions = showRemove || showEquip || showUnequip || showAttuning;

    if (!hasActions) {
      return null;
    }

    const isEquipped = ItemUtils.isEquipped(item);
    const isAttuned = ItemUtils.isAttuned(item);
    const isConsumable = ItemUtils.isConsumable(item);
    const isStackable = ItemUtils.isStackable(item);
    const canAttune = ItemUtils.canAttune(item);
    const canEquip = ItemUtils.canEquip(item);
    const infusion = ItemUtils.getInfusion(item);

    return (
      <div className="equipment-list-item-actions">
        {isStackable && (
          <div className="equipment-list-item-amount">
            <div className="equipment-list-item-amount-label">
              Total Quantity
            </div>
            <div className="equipment-list-item-amount-controls">
              <div className="equipment-list-item-amount-decrease">
                <Button
                  clsNames={["button-action-decrease"]}
                  onClick={this.handleDecrementClick}
                  disabled={quantity === 0}
                />
              </div>
              <div className="equipment-list-item-amount-value">
                <input
                  type="number"
                  value={newQuantity}
                  className="character-input equipment-list-item-amount-input"
                  onChange={this.handleAmountChange}
                  onBlur={this.handleAmountBlur}
                  onKeyUp={this.handleAmountKeyUp}
                  min={0}
                />
              </div>
              <div className="equipment-list-item-amount-increase">
                <Button
                  clsNames={["button-action-increase"]}
                  onClick={this.handleIncrementClick}
                />
              </div>
            </div>
          </div>
        )}
        {canEquip && showEquip && showUnequip && (
          <Button
            onClick={isEquipped ? this.handleUnequip : this.handleEquip}
            style={isEquipped ? "" : "outline"}
            size="small"
          >
            {isEquipped ? unequipLabel : equipLabel}
          </Button>
        )}
        {canEquip && showEquip && !showUnequip && (
          <Button onClick={this.handleEquip} style={"outline"} size="small">
            {equipLabel}
          </Button>
        )}
        {canEquip && !showEquip && showUnequip && (
          <Button onClick={this.handleUnequip} style={"outline"} size="small">
            {unequipLabel}
          </Button>
        )}
        {canAttune && showAttuning && (
          <Button
            onClick={isAttuned ? this.handleUnattune : this.handleAttune}
            style={isAttuned ? "" : "outline"}
            size="small"
            disabled={atAttuneMax && !isAttuned}
          >
            {isAttuned ? unattuneLabel : attuneLabel}
          </Button>
        )}
        {infusion && (
          <div
            className="equipment-list-item-remove"
            onClick={this.handleRemoveInfusion}
            data-testid="remove-infusion-button"
          >
            <span className="equipment-list-item-remove-icon" />{" "}
            {removeInfusionLabel}
          </div>
        )}
        {showRemove && !infusion && (
          <div
            className="equipment-list-item-remove"
            onClick={this.handleRemove}
          >
            <span className="equipment-list-item-remove-icon" /> {removeLabel}
          </div>
        )}
      </div>
    );
  }
}

export default class EquipmentListItem extends React.PureComponent<{
  header: any;
  clsNames: Array<string>;
}> {
  static defaultProps = {
    clsNames: [],
  };

  render() {
    let { header, children, clsNames } = this.props;

    return (
      <Collapsible
        trigger={header}
        clsNames={["equipment-list-item", ...clsNames]}
      >
        {children}
      </Collapsible>
    );
  }
}
