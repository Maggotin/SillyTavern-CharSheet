import React from "react";

import { NumberDisplay } from "~/components/NumberDisplay";

import { ThemeButton } from "../common/Button";

interface Props {
  used: number;
  available: number;
  label: string;
  onSet?: (usedAmount: number) => void;
  isReadonly: boolean;
  isInteractive: boolean;
}
interface State {
  startUsed: number;
  newUsed: number;
}
export default class SlotManagerLarge extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    label: "",
    isInteractive: true,
    isReadonly: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      startUsed: props.used,
      newUsed: props.used,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { used } = this.props;

    if (used !== prevState.startUsed) {
      this.setState({
        startUsed: used,
        newUsed: used,
      });
    }
  }

  handleSetClick = (): void => {
    const { newUsed } = this.state;
    const { onSet } = this.props;

    if (onSet) {
      onSet(newUsed);
    }

    this.setState({
      startUsed: newUsed,
    });
  };

  handleResetClick = (): void => {
    const { startUsed } = this.state;

    this.setState({
      newUsed: startUsed,
    });
  };

  handleUseClick = (): void => {
    const { isReadonly } = this.props;

    if (!isReadonly) {
      this.setState((prevState, props) => ({
        newUsed: Math.min(prevState.newUsed + 1, props.available),
      }));
    }
  };

  handleGainClick = (): void => {
    const { isReadonly } = this.props;

    if (!isReadonly) {
      this.setState((prevState, props) => ({
        newUsed: Math.max(prevState.newUsed - 1, 0),
      }));
    }
  };

  render() {
    const { newUsed, startUsed } = this.state;
    const { label, available, isInteractive } = this.props;

    const usedDiff: number = startUsed - newUsed;

    let classNames: Array<string> = ["ct-slot-manager-large__values"];
    if (usedDiff > 0) {
      classNames.push("ct-slot-manager-large__values--gain");
    } else if (usedDiff < 0) {
      classNames.push("ct-slot-manager-large__values--use");
    }

    return (
      <div className="ct-slot-manager-large">
        <div className={classNames.join(" ")}>
          {label && <div className="ct-slot-manager-large__label">{label}</div>}
          <div className="ct-slot-manager-large__value-control ct-slot-manager-large__value-control--use">
            <ThemeButton
              size="small"
              className={"button-action-decrease button-action-decrease--small"}
              onClick={this.handleUseClick}
              disabled={newUsed === available}
              isInteractive={isInteractive}
            />
          </div>
          <div className="ct-slot-manager-large__value ct-slot-manager-large__value--cur">
            {available - newUsed}
          </div>
          <div className="ct-slot-manager-large__value-control ct-slot-manager-large__value-control--gain">
            <ThemeButton
              size="small"
              className={"button-action-increase button-action-increase--small"}
              onClick={this.handleGainClick}
              disabled={newUsed === 0}
              isInteractive={isInteractive}
            />
          </div>
        </div>
        {usedDiff !== 0 && (
          <div className="ct-slot-manager-large__diff">
            <div className="ct-slot-manager-large__diff-explain">
              <NumberDisplay type="signed" number={usedDiff} />
            </div>
            <div className="ct-slot-manager-large__diff-actions">
              <ThemeButton
                className="ct-slot-manager-large__diff-action"
                size={"small"}
                onClick={this.handleSetClick}
              >
                Confirm
              </ThemeButton>
              <ThemeButton
                className="ct-slot-manager-large__diff-action"
                size={"small"}
                style={"outline"}
                onClick={this.handleResetClick}
              >
                Clear
              </ThemeButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}
