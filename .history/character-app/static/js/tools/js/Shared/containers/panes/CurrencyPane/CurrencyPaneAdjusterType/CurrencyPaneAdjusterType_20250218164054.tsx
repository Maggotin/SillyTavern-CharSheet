import React from "react";

import { CoinIcon } from "@dndbeyond/character-components/es";
import {
  Constants,
  FormatUtils,
  HelperUtils,
} from "../../rules-engine/es";

import { CURRENCY_VALUE } from "../../../../constants/App";

interface Props {
  currencyKey: string;
  name: string;
  value: number | null;
  onBlur?: (currencyKey: string, value: number | null) => void;
  onChange?: (currencyKey: string, value: number | null) => void;
  minValue: number;
  maxValue: number;
  isReadonly: boolean;
  coinType: Constants.CoinTypeEnum;
  containerDefinitionKey: string;
}
interface State {
  value: number | null;
}
export default class CurrencyPaneAdjusterType extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    minValue: CURRENCY_VALUE.MIN,
    maxValue: CURRENCY_VALUE.MAX,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange, currencyKey } = this.props;

    if (onChange) {
      onChange(currencyKey, HelperUtils.parseInputInt(evt.target.value));
    }
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { onBlur, currencyKey } = this.props;

    if (onBlur) {
      onBlur(currencyKey, HelperUtils.parseInputInt(evt.target.value));
    }
  };

  render() {
    const {
      value,
      name,
      isReadonly,
      minValue,
      maxValue,
      coinType,
      containerDefinitionKey,
    } = this.props;

    let classNames: Array<string> = ["ct-currency-pane__adjuster-type"];
    if (name) {
      classNames.push(
        `ct-currency-pane__adjuster-type--${FormatUtils.slugify(name)}`
      );
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-currency-pane__adjuster-type-labels">
          <div className="ct-currency-pane__icon">
            <CoinIcon coinType={coinType} />
          </div>
          <div
            id={`${containerDefinitionKey}-${coinType}-label`}
            className="ct-currency-pane__adjuster-type-name"
          >
            {name}
          </div>
        </div>
        <div className="ct-currency-pane__adjuster-type-value">
          <input
            aria-labelledby={`${containerDefinitionKey}-${coinType}-label`}
            type="number"
            className="ct-currency-pane__adjuster-type-value-input"
            value={value === null ? "" : value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            readOnly={isReadonly}
            min={minValue}
            max={maxValue}
          />
        </div>
      </div>
    );
  }
}
