import React from "react";

import {
  Collapsible,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import {
  CampaignUtils,
  Container,
  ContainerUtils,
  CharacterTheme,
  HelperUtils,
  Item,
  ItemUtils,
  RuleData,
  MenuOption,
  PartyInfo,
  Constants,
  ItemManager,
} from "@dndbeyond/character-rules-engine/es";

import { ItemName } from "~/components/ItemName";

import { AppNotificationUtils } from "../../../utils";
import ItemDetail from "../../ItemDetail";
import { ThemeButton, ThemeButtonWithMenu } from "../../common/Button";

interface Props {
  item: ItemManager;
  enableAdd: boolean;
  minAddAmount: number;
  maxAddAmount: number;
  ruleData: RuleData;
  proficiencyBonus: number;
  containers: Array<Container>;
  theme: CharacterTheme;
  partyInfo: PartyInfo | null;
}
interface State {
  amount: number | null;
}
export default class EquipmentShopItem extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enableAdd: true,
    minAddAmount: 1,
    maxAddAmount: 10,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      amount: 1,
    };
  }

  handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      amount: HelperUtils.parseInputInt(evt.target.value),
    });
  };

  handleAmountBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { minAddAmount, maxAddAmount } = this.props;

    const parsedValue = HelperUtils.parseInputInt(evt.target.value);
    const clampedValue = HelperUtils.clampInt(
      parsedValue === null ? 0 : parsedValue,
      minAddAmount,
      maxAddAmount
    );

    this.setState({
      amount: clampedValue,
    });
  };

  handleDecrementCountClick = (): void => {
    const { minAddAmount } = this.props;

    this.setState((prevState, props) => ({
      amount: Math.max(
        (prevState.amount === null ? 0 : prevState.amount) - 1,
        minAddAmount
      ),
    }));
  };

  handleIncrementCountClick = (): void => {
    this.setState((prevState, props) => ({
      amount: (prevState.amount === null ? 0 : prevState.amount) + 1,
    }));
  };

  handleAmountKeyUp = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
    const { minAddAmount, maxAddAmount } = this.props;

    const parsedValue = HelperUtils.parseInputInt(
      (evt.target as HTMLInputElement).value
    );
    const clampedValue = HelperUtils.clampInt(
      parsedValue === null ? 0 : parsedValue,
      minAddAmount,
      maxAddAmount
    );

    this.setState({
      amount: clampedValue,
    });
  };

  handleAdd = (containerDefinitionKey?: string): void => {
    const { amount: stateAmount } = this.state;
    const { item, minAddAmount } = this.props;

    const amount = stateAmount === null ? minAddAmount : stateAmount;
    item.handleAdd(
      { amount, containerDefinitionKey },
      AppNotificationUtils.handleItemAddAccepted.bind(this, item.item, amount),
      AppNotificationUtils.handleItemAddRejected.bind(this, item.item, amount)
    );
  };

  renderHeader = (
    item: ItemManager,
    metaItems: Array<string>
  ): React.ReactNode => {
    const { containers, partyInfo } = this.props;

    return (
      <CollapsibleHeaderContent
        heading={<ItemName item={item.item} />}
        metaItems={metaItems}
        callout={
          <ThemeButtonWithMenu
            groupedOptions={ContainerUtils.getGroupedOptions(
              null,
              containers,
              "Add To:",
              partyInfo
                ? CampaignUtils.getSharingState(partyInfo)
                : Constants.PartyInventorySharingStateEnum.OFF
            )}
            onSelect={this.handleAdd}
          >
            Add
          </ThemeButtonWithMenu>
        }
      />
    );
  };

  render() {
    const { amount } = this.state;
    const {
      item,
      minAddAmount,
      maxAddAmount,
      ruleData,
      proficiencyBonus,
      theme,
      containers,
      partyInfo,
    } = this.props;

    const totalAmount: number =
      (amount === null ? 1 : amount) * item.getBundleSize();

    return (
      <Collapsible
        layoutType={"minimal"}
        header={this.renderHeader(item, item.getMetaText())}
        className="ct-equipment-shop__item"
      >
        <ItemDetail
          theme={theme}
          item={item.item}
          ruleData={ruleData}
          showCustomize={false}
          showActions={false}
          showImage={false}
          proficiencyBonus={proficiencyBonus}
        />
        <div className="ct-equipment-shop__item-actions">
          <div className="ct-equipment-shop__item-action">
            <div className="ct-equipment-shop__item-amount">
              <div className="ct-equipment-shop__item-amount-label">
                Amount to add
              </div>
              <div className="ct-equipment-shop__item-amount-controls">
                <div className="ct-equipment-shop__item-amount-decrease">
                  <ThemeButton
                    className="button-action-decrease button-action-decrease--small"
                    onClick={this.handleDecrementCountClick}
                    disabled={amount !== null && amount <= minAddAmount}
                    size="small"
                  />
                </div>
                <div className="ct-equipment-shop__item-amount-value">
                  <input
                    type="number"
                    value={amount === null ? "" : amount}
                    className="character-inputstcs-equipment-shop__item-amount-input"
                    onChange={this.handleAmountChange}
                    onBlur={this.handleAmountBlur}
                    onKeyUp={this.handleAmountKeyUp}
                    min={minAddAmount}
                    max={maxAddAmount}
                  />
                </div>
                <div className="ct-equipment-shop__item-amount-increase">
                  <ThemeButton
                    className="button-action-increase button-action-increase--small"
                    onClick={this.handleIncrementCountClick}
                    disabled={amount !== null && amount >= maxAddAmount}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ct-equipment-shop__item-action">
            <ThemeButtonWithMenu
              onSelect={(definitionKey) => this.handleAdd(definitionKey)}
              containerEl={
                document.querySelector("stcs-sidebar__portal") as HTMLElement
              }
              groupedOptions={ContainerUtils.getGroupedOptions(
                null,
                containers,
                "Add To:",
                partyInfo
                  ? CampaignUtils.getSharingState(partyInfo)
                  : Constants.PartyInventorySharingStateEnum.OFF
              )}
            >
              Add {totalAmount === 1 ? " Item" : ` ${totalAmount} Items`}
            </ThemeButtonWithMenu>
          </div>
        </div>
      </Collapsible>
    );
  }
}
