import React from "react";

import { HelperUtils } from "@dndbeyond/character-rules-engine/es";

import { ThemeButton } from "../common/Button";

interface Props {
  quantity: number;
  minimum: number;
  maximum: number | null;
  label: string;
  onUpdate?: (quantity: number) => void;
  isReadonly: boolean;
}
interface State {
  quantity: number;
  newQuantity: number | null;
}
export default class SimpleQuantity extends React.PureComponent<Props, State> {
  static defaultProps = {
    label: "Quantity",
    minimum: 0,
    maximum: null,
    isReadonly: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      quantity: props.quantity,
      newQuantity: props.quantity,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { quantity } = this.props;

    if (quantity !== prevState.quantity) {
      this.setState({
        quantity,
        newQuantity: quantity,
      });
    }
  }

  handleUpdate = (): void => {
    const { newQuantity } = this.state;
    const { onUpdate, quantity } = this.props;

    if (newQuantity !== quantity && onUpdate) {
      onUpdate(newQuantity === null ? 0 : newQuantity);
    }
  };

  handleAmountChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      newQuantity: HelperUtils.parseInputInt(evt.target.value, null),
    });
  };

  handleAmountKeyUp = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
    const { minimum, maximum } = this.props;

    if (evt.key === "Enter") {
      const parsedValue = HelperUtils.parseInputInt(
        (evt.target as HTMLInputElement).value
      );
      const clampedValue = HelperUtils.clampInt(
        parsedValue ?? minimum,
        minimum,
        maximum
      );
      this.setState(
        {
          quantity: clampedValue,
          newQuantity: clampedValue,
        },
        this.handleUpdate
      );
    }
  };

  handleAmountBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { minimum, maximum } = this.props;

    const parsedValue = HelperUtils.parseInputInt(evt.target.value);
    const clampedValue = HelperUtils.clampInt(
      parsedValue ?? minimum,
      minimum,
      maximum
    );
    this.setState(
      {
        quantity: clampedValue,
        newQuantity: clampedValue,
      },
      this.handleUpdate
    );
  };

  handleIncrementClick = () => {
    const { quantity, isReadonly } = this.props;

    if (!isReadonly) {
      let newValue: number = quantity + 1;
      this.setState(
        {
          quantity: newValue,
          newQuantity: newValue,
        },
        this.handleUpdate
      );
    }
  };

  handleDecrementClick = () => {
    const { quantity, isReadonly } = this.props;

    if (!isReadonly) {
      let newValue: number = quantity - 1;
      this.setState(
        {
          quantity: newValue,
          newQuantity: newValue,
        },
        this.handleUpdate
      );
    }
  };

  render() {
    const { newQuantity } = this.state;
    const { label, quantity, minimum, maximum, isReadonly } = this.props;

    return (
      <div className="ct-simple-quantity">
        <div className="ct-simple-quantity__label">{label}</div>
        <div className="ct-simple-quantity__controls">
          <div className="ct-simple-quantity__decrease">
            <ThemeButton
              className="button-action-decrease button-action-decrease--small"
              onClick={this.handleDecrementClick}
              disabled={minimum !== null && quantity <= minimum}
              size="small"
              isInteractive={!isReadonly}
              aria-label={"decrease quantity"}
              data-testid={"decrease-quantity"}
            />
          </div>
          <div className="ct-simple-quantity__value">
            <input
              type="number"
              value={newQuantity === null ? "" : newQuantity}
              className="character-input ct-simple-quantity__input"
              onChange={this.handleAmountChange}
              onBlur={this.handleAmountBlur}
              onKeyUp={this.handleAmountKeyUp}
              min={0}
              readOnly={isReadonly}
              data-testid={"change-quantity"}
            />
          </div>
          <div className="ct-simple-quantity__increase">
            <ThemeButton
              className="button-action-increase button-action-increase--small"
              onClick={this.handleIncrementClick}
              size="small"
              disabled={maximum !== null && quantity >= maximum}
              isInteractive={!isReadonly}
              aria-label={"increase quantity"}
              data-testid={"increase-quantity"}
            />
          </div>
        </div>
      </div>
    );
  }
}
