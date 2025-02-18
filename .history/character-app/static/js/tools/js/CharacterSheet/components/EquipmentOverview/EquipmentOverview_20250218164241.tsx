import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterCurrencyContract,
  Constants,
  FormatUtils,
  RuleDataUtils,
} from "../../character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

import CurrencyButton from "../CurrencyButton";

interface Props {
  currencies: CharacterCurrencyContract | null;
  weight: number;
  weightSpeedType: Constants.WeightSpeedTypeEnum;
  onCurrencyClick?: (evt: React.MouseEvent | React.KeyboardEvent) => void;
  onWeightClick?: () => void;
  onCampaignClick?: () => void;
  onManageClick?: () => void;
  enableManage: boolean;
  isReadonly: boolean;
  isDarkMode: boolean;
  shouldShowPartyInventory: boolean;
  campaignName: string | null;
}
export default class EquipmentOverview extends React.PureComponent<Props> {
  static defaultProps = {
    enableManage: true,
    isReadonly: false,
  };

  handleCurrencyClick = (evt: React.MouseEvent | React.KeyboardEvent): void => {
    const { onCurrencyClick } = this.props;

    if (onCurrencyClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onCurrencyClick(evt);
    }
  };

  handleCampaignClick = (evt: React.MouseEvent | React.KeyboardEvent): void => {
    const { onCampaignClick } = this.props;

    if (onCampaignClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onCampaignClick();
    }
  };

  handleWeightClick = (evt: React.MouseEvent | React.KeyboardEvent): void => {
    const { onWeightClick } = this.props;

    if (onWeightClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onWeightClick();
    }
  };

  handleManageClick = (evt: React.MouseEvent | React.KeyboardEvent): void => {
    const { onManageClick } = this.props;

    if (onManageClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onManageClick();
    }
  };

  render() {
    const {
      weight,
      weightSpeedType,
      enableManage,
      isReadonly,
      isDarkMode,
      shouldShowPartyInventory,
      campaignName,
      currencies,
    } = this.props;

    let weightSpeedLabel =
      RuleDataUtils.getWeightSpeedTypeLabel(weightSpeedType);

    return (
      // TODO: add a min height?
      <div className="ct-equipment-overview">
        {!shouldShowPartyInventory ? (
          <div
            role="button"
            className="ct-equipment-overview__weight"
            onClick={this.handleWeightClick}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                this.handleWeightClick(evt);
              }
            }}
          >
            <div className="ct-equipment-overview__weight-carried">
              <span
                className={`ct-equipment-overview__weight-carried-label ${
                  isDarkMode
                    ? "ct-equipment-overview__weight-carried--dark-mode"
                    : ""
                }`}
              >
                Weight Carried:
              </span>
              <span
                className={`ct-equipment-overview__weight-carried-amount ${
                  isDarkMode
                    ? "ct-equipment-overview__weight-carried--dark-mode"
                    : ""
                }`}
              >
                <NumberDisplay
                  data-testid="weight-carried-number"
                  type="weightInLb"
                  number={weight}
                />
              </span>
            </div>
            <div
              className={`ct-equipment-overview__weight-speed ct-equipment-overview__weight-speed--${FormatUtils.slugify(
                weightSpeedLabel
              )}`}
            >
              {weightSpeedLabel}
            </div>
          </div>
        ) : (
          <div
            role="button"
            className="ct-equipment-overview__weight"
            onClick={this.handleCampaignClick}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                this.handleCampaignClick(evt);
              }
            }}
          >
            <div className="ct-equipment-overview__weight-carried">
              <span
                className={`ct-equipment-overview__weight-carried-label ${
                  isDarkMode
                    ? "ct-equipment-overview__weight-carried--dark-mode"
                    : ""
                }`}
              >
                CAMPAIGN:
                <span
                  className={`ct-equipment-overview__weight-carried-amount ${
                    isDarkMode
                      ? "ct-equipment-overview__weight-carried--dark-mode"
                      : ""
                  }`}
                >
                  {campaignName || "N/A"}
                </span>
              </span>
            </div>
          </div>
        )}
        <div className="ct-equipment-overview__sep" />
        <CurrencyButton
          handleCurrencyClick={this.handleCurrencyClick}
          coin={currencies}
          isDarkMode={isDarkMode}
          shouldShowPartyInventory={shouldShowPartyInventory}
        />
        {enableManage && !isReadonly && (
          <div
            role="button"
            className="ct-equipment-overview__manage"
            onClick={this.handleManageClick}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                this.handleManageClick(evt);
              }
            }}
          >
            <Tooltip title="Manage Equipment" isDarkMode={isDarkMode}>
              <span className="ct-equipment-overview__manage-icon" />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}
