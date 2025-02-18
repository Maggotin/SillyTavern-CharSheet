import React from "react";

import { CoinIcon } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  FormatUtils,
  CharacterCurrencyContract,
  Constants,
} from "../../rules-engine/es";

import { CURRENCY_VALUE } from "../../../../constants/App";
import { CurrencyErrorTypeEnum } from "../CurrencyPaneConstants";

interface Props {
  name: string;
  value: number | null;
  conversion?: string;
  onChange: (value: number) => void;
  onError?: (errorType: CurrencyErrorTypeEnum) => void;
  isReadonly: boolean;
  minValue: number;
  maxValue: number;
  coinType: Constants.CoinTypeEnum;
}
interface State {
  value: number | null;
  preValue: number | null;
  errorType: CurrencyErrorTypeEnum | null;
  isEditorVisible: boolean;
}
export default class Currency extends React.PureComponent<Props, State> {
  static defaultProps = {
    minValue: CURRENCY_VALUE.MIN,
    maxValue: CURRENCY_VALUE.MAX,
  };

  editorRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value,
      preValue: props.value,
      errorType: null,
      isEditorVisible: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { value } = this.props;

    if (value !== prevProps.value) {
      this.setState({
        value,
        preValue: value,
      });
    }
  }

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { value, preValue, errorType } = this.state;
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
      value: targetValue,
      preValue: targetValue,
      errorType: null,
      isEditorVisible: false,
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
      value: newValue,
      errorType,
    });
  };

  handleCurrencyClick = (): void => {
    this.setState(
      {
        isEditorVisible: true,
      },
      () => {
        this.editorRef.current && this.editorRef.current.focus();
      }
    );
  };

  renderError = (): React.ReactNode => {
    const { errorType } = this.state;

    if (errorType === null) {
      return null;
    }

    let errorMessage: React.ReactNode;
    if (errorType === CurrencyErrorTypeEnum.MIN) {
      errorMessage =
        "Cannot accept a negative value. To remove currency, please use the Currency Adjuster options below.";
    }
    if (errorType === CurrencyErrorTypeEnum.MAX) {
      errorMessage = `The max amount allowed is ${FormatUtils.renderLocaleNumber(
        CURRENCY_VALUE.MAX
      )}.`;
    }

    return (
      <div className="ct-currency-pane__currency-error">
        <div className="ct-currency-pane__currency-error-text">
          {errorMessage}
        </div>
      </div>
    );
  };

  renderCurrencyValue = (): React.ReactNode => {
    const { value, isEditorVisible } = this.state;
    const { isReadonly, minValue, maxValue } = this.props;

    if (isEditorVisible) {
      return (
        <input
          ref={this.editorRef}
          type="number"
          className="ct-currency-pane__currency-value-input"
          value={value === null ? "" : value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          readOnly={isReadonly}
          min={minValue}
          max={maxValue}
        />
      );
    }

    return (
      <div
        className="ct-currency-pane__currency-value-text"
        onClick={this.handleCurrencyClick}
      >
        {value === null ? "" : FormatUtils.renderLocaleNumber(value)}
      </div>
    );
  };

  render() {
    const { name, conversion, coinType } = this.props;

    let classNames: Array<string> = ["ct-currency-pane__currency"];
    if (name) {
      classNames.push(
        `ct-currency-pane__currency--${FormatUtils.slugify(name)}`
      );
    }

    let conversionNode: React.ReactNode;
    if (conversion) {
      conversionNode = (
        <div className="ct-currency-pane__currency-conversion">
          {conversion}
        </div>
      );
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ct-currency-pane__currency-row">
          <div className="ct-currency-pane__currency-icon">
            <CoinIcon coinType={coinType} />
          </div>
          <div className="ct-currency-pane__currency-info">
            <div className="ct-currency-pane__currency-name">{name}</div>
            {conversionNode}
          </div>
          <div className="ct-currency-pane__currency-value">
            {this.renderCurrencyValue()}
          </div>
        </div>
        {this.renderError()}
      </div>
    );
  }
}
