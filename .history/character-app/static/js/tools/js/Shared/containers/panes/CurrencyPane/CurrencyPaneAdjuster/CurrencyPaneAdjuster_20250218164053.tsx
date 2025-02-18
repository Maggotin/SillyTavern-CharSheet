import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useContext } from "react";

import { Button } from "@dndbeyond/character-components/es";
import {
  CharacterCurrencyContract,
  CoinManager,
  Constants,
} from "../../rules-engine/es";

import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import { ThemeButton } from "../../../../components/common/Button";
import { CURRENCY_VALUE } from "../../../../constants/App";
import { CoinManagerContext } from "../../../../managers/CoinManagerContext";
import CurrencyPaneAdjusterType from "../CurrencyPaneAdjusterType";

interface Props {
  onAdjust?: (
    currencyTransaction: Partial<CharacterCurrencyContract>,
    multiplier: number,
    containerDefinitionKey: string
  ) => void;
  containerDefinitionKey: string;
  isReadonly: boolean;
  coinManager: CoinManager;
}
interface CurrencyPaneAdjusterState {
  pp: number | null;
  gp: number | null;
  sp: number | null;
  ep: number | null;
  cp: number | null;
}
class CurrencyPaneAdjuster extends React.PureComponent<
  Props,
  CurrencyPaneAdjusterState
> {
  constructor(props) {
    super(props);

    this.state = {
      pp: null,
      gp: null,
      sp: null,
      ep: null,
      cp: null,
    };
  }

  convertStateToCoin = (): Partial<CharacterCurrencyContract> => {
    const currencyAdjustments = {
      ...this.state,
    };

    return Object.keys(currencyAdjustments).reduce((acc, key) => {
      if (
        currencyAdjustments.hasOwnProperty(key) &&
        currencyAdjustments[key] !== null
      ) {
        acc[key] = currencyAdjustments[key];
      }
      return acc;
    }, {});
  };

  handleAdjust = (multiplier: number): void => {
    const { onAdjust, containerDefinitionKey } = this.props;

    this.handleReset();

    if (onAdjust) {
      onAdjust(this.convertStateToCoin(), multiplier, containerDefinitionKey);
    }
  };

  handleAdd = (): void => {
    this.handleAdjust(1);
  };

  handleRemove = (): void => {
    this.handleAdjust(-1);
  };

  handleChange = (currencyKey: string, value: number | null): void => {
    this.setState(
      (prevState: CurrencyPaneAdjusterState): CurrencyPaneAdjusterState => ({
        ...prevState,
        [currencyKey]:
          value === null ? null : Math.min(value, CURRENCY_VALUE.MAX),
      })
    );
  };

  handleBlur = (currencyKey: string, value: number | null): void => {
    this.setState(
      (prevState: CurrencyPaneAdjusterState): CurrencyPaneAdjusterState => ({
        ...prevState,
        [currencyKey]:
          value === null ? null : Math.min(value, CURRENCY_VALUE.MAX),
      })
    );
  };

  handleReset = (): void => {
    this.setState({
      pp: null,
      gp: null,
      sp: null,
      ep: null,
      cp: null,
    });
  };

  render() {
    const { pp, gp, sp, ep, cp } = this.state;
    const { isReadonly, containerDefinitionKey, coinManager } = this.props;

    return (
      <div className="ct-currency-pane__adjuster">
        <div className="ct-currency-pane__adjuster-heading">
          <Heading>{`Adjust${
            containerDefinitionKey ===
            coinManager.getPartyEquipmentContainerDefinitionKey()
              ? " Party"
              : ""
          } Coin`}</Heading>
        </div>
        <div className="ct-currency-pane__adjuster-types">
          <CurrencyPaneAdjusterType
            containerDefinitionKey={containerDefinitionKey}
            name="PP"
            currencyKey="pp"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            coinType={Constants.CoinTypeEnum.pp}
            value={pp}
            isReadonly={isReadonly}
          />
          <CurrencyPaneAdjusterType
            containerDefinitionKey={containerDefinitionKey}
            name="GP"
            currencyKey="gp"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            coinType={Constants.CoinTypeEnum.gp}
            value={gp}
            isReadonly={isReadonly}
          />
          <CurrencyPaneAdjusterType
            containerDefinitionKey={containerDefinitionKey}
            name="EP"
            currencyKey="ep"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            coinType={Constants.CoinTypeEnum.ep}
            value={ep}
            isReadonly={isReadonly}
          />
          <CurrencyPaneAdjusterType
            containerDefinitionKey={containerDefinitionKey}
            name="SP"
            currencyKey="sp"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            coinType={Constants.CoinTypeEnum.sp}
            value={sp}
            isReadonly={isReadonly}
          />
          <CurrencyPaneAdjusterType
            containerDefinitionKey={containerDefinitionKey}
            name="CP"
            currencyKey="cp"
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            coinType={Constants.CoinTypeEnum.cp}
            value={cp}
            isReadonly={isReadonly}
          />
        </div>
        <div className="ct-currency-pane__adjuster-actions">
          <div className="ct-currency-pane__adjuster-action ct-currency-pane__adjuster-action--positive">
            <Button size="medium" onClick={this.handleAdd}>
              <span className="ct-currency-pane__adjuster-actions-button-content">
                <AddIcon sx={{ width: "13px", height: "13px" }} />
                Add
              </span>
            </Button>
          </div>
          <div className="ct-currency-pane__adjuster-action ct-currency-pane__adjuster-action--negative">
            <Button size="medium" onClick={this.handleRemove}>
              <span className="ct-currency-pane__adjuster-actions-button-content">
                <RemoveIcon sx={{ width: "13px", height: "13px" }} />
                Remove
              </span>
            </Button>
          </div>
          <div className="ct-currency-pane__adjuster-action">
            <ThemeButton
              size="medium"
              style="outline"
              onClick={this.handleReset}
            >
              <span className="ct-currency-pane__adjuster-actions-button-content">
                <CloseIcon sx={{ width: "13px", height: "13px" }} />
                Clear
              </span>
            </ThemeButton>
          </div>
        </div>
      </div>
    );
  }
}

const CurrencyPaneAdjusterContainer = (props) => {
  const { coinManager } = useContext(CoinManagerContext);
  return <CurrencyPaneAdjuster coinManager={coinManager} {...props} />;
};

export default CurrencyPaneAdjusterContainer;
