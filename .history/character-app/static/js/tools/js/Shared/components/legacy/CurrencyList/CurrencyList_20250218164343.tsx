import React from "react";

import { CoinIcon } from "../../character-components/es";
import {
  Constants,
  FormatUtils,
  HelperUtils,
} from "../../character-rules-engine/es";

import { CURRENCY_VALUE } from "../../../constants/App";
import { CurrencyErrorTypeEnum } from "../../../containers/panes/CurrencyPane/CurrencyPaneConstants";

interface CurrencyListItemProps {
  name: string;
  value: number;
  conversionAmount?: number;
  conversionType?: string;
  onChange: (value: number) => void;
  onError?: (errorType: CurrencyErrorTypeEnum) => void;
  minValue: number;
  maxValue: number;
  coinType: Constants.CoinTypeEnum;
}
interface CurrencyListItemState {
  latestValue: number | null;
  preValue: number | null;
  errorType: CurrencyErrorTypeEnum | null;
}
export class CurrencyListItem extends React.PureComponent<
  CurrencyListItemProps,
  CurrencyListItemState
> {
  static defaultProps = {
    minValue: CURRENCY_VALUE.MIN,
    maxValue: CURRENCY_VALUE.MAX,
  };

  constructor(props) {
    super(props);

    this.state = {
      latestValue: props.value,
      preValue: props.value,
      errorType: null,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<CurrencyListItemProps>,
    prevState: Readonly<CurrencyListItemState>
  ): void {
    const { value } = this.props;

    if (value !== prevProps.value) {
      this.setState({
        latestValue: value,
        preValue: value,
      });
    }
  }

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { latestValue, preValue, errorType } = this.state;
    const { onChange, onError } = this.props;

    let parsedValue = HelperUtils.parseInputInt(evt.target.value);
    let targetValue: number | null =
      errorType === null && parsedValue !== null ? parsedValue : preValue;
    if (targetValue !== null && onChange) {
      onChange(targetValue);
    }

    if (errorType !== null && onError) {
      onError(errorType);
    }

    this.setState({
      latestValue: targetValue,
      preValue: targetValue,
      errorType: null,
    });
  };

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const { minValue, maxValue } = this.props;

    let newValue = HelperUtils.parseInputInt(evt.target.value);
    let errorType: CurrencyErrorTypeEnum | null = null;

    if (newValue !== null) {
      if (newValue < minValue) {
        errorType = CurrencyErrorTypeEnum.MIN;
      } else if (newValue > maxValue) {
        errorType = CurrencyErrorTypeEnum.MAX;
      }
    }

    this.setState({
      latestValue: newValue,
      errorType,
    });
  };

  renderError = (): React.ReactNode => {
    const { errorType } = this.state;

    const { name } = this.props;

    if (errorType === null) {
      return null;
    }

    let errorMessage: React.ReactNode;
    if (errorType === CurrencyErrorTypeEnum.MIN) {
      errorMessage = `Cannot set ${name} to a negative value.`;
    }
    if (errorType === CurrencyErrorTypeEnum.MAX) {
      errorMessage = `The max amount of ${name} allowed is ${FormatUtils.renderLocaleNumber(
        CURRENCY_VALUE.MAX
      )}.`;
    }

    return (
      <div className="currency-list-item__error">
        <div className="currency-list-item__error-text">{errorMessage}</div>
      </div>
    );
  };

  render() {
    const { latestValue } = this.state;
    const {
      name,
      conversionAmount,
      conversionType,
      minValue,
      maxValue,
      coinType,
    } = this.props;

    let clsNames = ["currency-list-item"];
    if (name) {
      clsNames.push(`currency-list-item-${FormatUtils.slugify(name)}`);
    }

    let conversionNode;
    if (conversionAmount && conversionType) {
      conversionNode = (
        <div className="currency-list-item-conversion">
          = {conversionAmount} {conversionType}
        </div>
      );
    }

    return (
      <div className={clsNames.join(" ")}>
        <div className="currency-list-item-row">
          <div className="currency-list-item-icon">
            <CoinIcon coinType={coinType} />
          </div>
          <div className="currency-list-item-info">
            <div className="currency-list-item-name">{name}</div>
            {conversionNode}
          </div>
          <div className="currency-list-item-value">
            <input
              className="currency-list-item-value-input"
              type="number"
              onBlur={this.handleBlur}
              value={latestValue === null ? "" : latestValue}
              onChange={this.handleChange}
              min={minValue}
              max={maxValue}
            />
          </div>
        </div>
        {this.renderError()}
      </div>
    );
  }
}

export default class CurrencyList extends React.PureComponent<
  {
    pp: number;
    gp: number;
    ep: number;
    sp: number;
    cp: number;
    onChange: (currencies: any) => void;
    onError?: (currencyName: string, errorType: CurrencyErrorTypeEnum) => void;
    totalGp: number;
  },
  {
    currencies: {
      pp: number;
      gp: number;
      ep: number;
      sp: number;
      cp: number;
    };
  }
> {
  constructor(props) {
    super(props);

    const { pp, gp, ep, sp, cp } = props;

    this.state = {
      currencies: {
        pp,
        gp,
        ep,
        sp,
        cp,
      },
    };
  }

  handleCurrencyChange = (currencyKey: string, value: number): void => {
    const { onChange } = this.props;
    const { currencies } = this.state;

    const newCurrencies = {
      ...currencies,
      [currencyKey]: value,
    };

    this.setState({
      currencies: newCurrencies,
    });

    onChange(newCurrencies);
  };

  handleCurrencyChangeError = (
    currencyName: string,
    errorType: CurrencyErrorTypeEnum
  ): void => {
    const { onError } = this.props;

    if (onError) {
      onError(currencyName, errorType);
    }
  };

  render() {
    const { props } = this;
    const { pp, gp, ep, sp, cp, totalGp } = props;

    return (
      <div className="currency-list">
        <div className="currency-list-gp-total">
          <div className="currency-list-gp-total-heading">
            Total Currency in GP
          </div>
          <div className="currency-list-gp-total-info">
            <div className="currency-list-gp-total-icon">
              <CoinIcon coinType={Constants.CoinTypeEnum.gp} />
            </div>
            <div className="currency-list-gp-total-count">
              {totalGp.toLocaleString ? totalGp.toLocaleString() : totalGp}
            </div>
          </div>
        </div>
        <div className="currency-list-items">
          <CurrencyListItem
            name="Platinum"
            onChange={this.handleCurrencyChange.bind(this, "pp")}
            onError={this.handleCurrencyChangeError.bind(this, "Platinum")}
            value={pp}
            coinType={Constants.CoinTypeEnum.pp}
            conversionAmount={10}
            conversionType="gp"
          />
          <CurrencyListItem
            name="Gold"
            onChange={this.handleCurrencyChange.bind(this, "gp")}
            onError={this.handleCurrencyChangeError.bind(this, "Gold")}
            value={gp}
            coinType={Constants.CoinTypeEnum.gp}
            conversionAmount={10}
            conversionType="sp"
          />
          <CurrencyListItem
            name="Electrum"
            onChange={this.handleCurrencyChange.bind(this, "ep")}
            onError={this.handleCurrencyChangeError.bind(this, "Electrum")}
            value={ep}
            coinType={Constants.CoinTypeEnum.ep}
            conversionAmount={5}
            conversionType="sp"
          />
          <CurrencyListItem
            name="Silver"
            onChange={this.handleCurrencyChange.bind(this, "sp")}
            onError={this.handleCurrencyChangeError.bind(this, "Silver")}
            value={sp}
            coinType={Constants.CoinTypeEnum.sp}
            conversionAmount={10}
            conversionType="cp"
          />
          <CurrencyListItem
            name="Copper"
            onChange={this.handleCurrencyChange.bind(this, "cp")}
            onError={this.handleCurrencyChangeError.bind(this, "Copper")}
            value={cp}
            coinType={Constants.CoinTypeEnum.cp}
          />
        </div>
      </div>
    );
  }
}
