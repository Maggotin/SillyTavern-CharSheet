import * as React from "react";

import {
  Collapsible,
  CollapsibleHeaderCallout,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  VehicleFuelData,
} from "../../rules-engine/es";

import { QuickActions } from "~/subApps/sheet/components/Sidebar/components/QuickActions/QuickActions";

import SimpleQuantity from "../SimpleQuantity";
import { ThemeButton } from "../common/Button";

interface Props {
  fuelData: VehicleFuelData;
  onChange: (value: number) => void;
  initiallyCollapsed: boolean;
  isInteractive: boolean;
  defaultAdjusterValue: number;
}
interface State {
  remainingFuel: number | null;
  adjusterValue: number;
}
export default class VehicleFuelTracker extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    initiallyCollapsed: true,
    isInteractive: false,
    defaultAdjusterValue: 1,
  };

  remainingFuelInput = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);

    this.state = {
      remainingFuel: props.fuelData.remainingFuel,
      adjusterValue: props.defaultAdjusterValue,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { fuelData } = this.props;

    if (fuelData.remainingFuel !== prevProps.fuelData.remainingFuel) {
      this.setState({
        remainingFuel: fuelData.remainingFuel,
      });
    }
  }

  handleRemainingFuelSet = (newValue: number): void => {
    const { onChange, fuelData } = this.props;

    if (fuelData.remainingFuel !== newValue && onChange) {
      onChange(newValue);
    }

    this.setState({
      remainingFuel: newValue,
    });
  };

  handleRemainingFuelInputBlur = (
    evt: React.FocusEvent<HTMLInputElement>
  ): void => {
    this.handleRemainingFuelSet(HelperUtils.parseInputInt(evt.target.value, 0));
  };

  handleRemainingFuelInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({
      remainingFuel: HelperUtils.parseInputInt(evt.target.value),
    });
  };

  updateAdjusterValue = (newValue: number): void => {
    const { adjusterValue } = this.state;

    if (newValue !== adjusterValue) {
      this.setState({
        adjusterValue: newValue,
      });
    }
  };

  resetAdjusterValue = (): void => {
    const { defaultAdjusterValue } = this.props;
    const { adjusterValue } = this.state;

    if (adjusterValue !== defaultAdjusterValue) {
      this.setState({
        adjusterValue: defaultAdjusterValue,
      });
    }
  };

  handleAdjusterUse = (): void => {
    const { adjusterValue, remainingFuel } = this.state;

    let remainingFuelValue: number = remainingFuel === null ? 0 : remainingFuel;
    this.handleRemainingFuelSet(
      Math.max(remainingFuelValue - adjusterValue, 0)
    );
    this.resetAdjusterValue();
  };

  handleAdjusterAdd = (): void => {
    const { adjusterValue, remainingFuel } = this.state;
    const { fuelData } = this.props;

    let remainingFuelValue: number = remainingFuel === null ? 0 : remainingFuel;
    let value: number = adjusterValue + remainingFuelValue;

    if (fuelData.maxAmount !== null) {
      value = Math.max(value, fuelData.maxAmount);
    }

    this.handleRemainingFuelSet(value);
    this.resetAdjusterValue();
  };

  handleQuickAction = (value: number): void => {
    const { fuelData } = this.props;
    const { remainingFuel } = this.state;

    let remainingFuelValue: number = remainingFuel === null ? 0 : remainingFuel;
    let newValue: number = remainingFuelValue + value;

    if (fuelData.maxAmount !== null) {
      newValue = Math.max(newValue, fuelData.maxAmount);
    }

    this.handleRemainingFuelSet(newValue);
  };

  renderRemainingFuelInput = (): React.ReactNode => {
    const { remainingFuel } = this.state;
    const { fuelData, isInteractive } = this.props;

    return (
      <div className="ct-vehicle-fuel-tracker__primary">
        <div className="ct-vehicle-fuel-tracker__primary-label">
          Fuel remaining (HRS)
        </div>
        <div className="ct-vehicle-fuel-tracker__primary-value">
          <input
            ref={this.remainingFuelInput}
            className="ct-vehicle-fuel-tracker__primary-input"
            type="number"
            value={remainingFuel !== null ? remainingFuel : ""}
            onBlur={this.handleRemainingFuelInputBlur}
            onChange={this.handleRemainingFuelInputChange}
            min={0}
            max={fuelData.maxAmount !== null ? fuelData.maxAmount : undefined}
            readOnly={!isInteractive}
          />
        </div>
      </div>
    );
  };

  renderSimpleQuantityAdjuster = (): React.ReactNode => {
    const { adjusterValue } = this.state;
    const { isInteractive } = this.props;

    return (
      <div className="ct-vehicle-fuel-tracker__adjuster">
        <div className="ct-vehicle-fuel-tracker__adjuster-simple-quantity">
          <SimpleQuantity
            label={""}
            quantity={adjusterValue}
            minimum={1}
            maximum={null}
            onUpdate={this.updateAdjusterValue}
            isReadonly={!isInteractive}
          />
        </div>
        <div className="ct-vehicle-fuel-tracker__adjuster-actions">
          <ThemeButton
            size="small"
            style="outline"
            className="ct-vehicle-fuel-tracker__adjuster-button ct-vehicle-fuel-tracker__adjuster-button--use"
            onClick={this.handleAdjusterUse}
            isInteractive={isInteractive}
          >
            Use
          </ThemeButton>
          <ThemeButton
            size="small"
            className="ct-vehicle-fuel-tracker__adjuster-button ct-vehicle-fuel-tracker__adjuster-button--add"
            onClick={this.handleAdjusterAdd}
            isInteractive={isInteractive}
          >
            Add
          </ThemeButton>
        </div>
      </div>
    );
  };

  renderQuickActions = (): React.ReactNode => {
    const { fuelData, isInteractive } = this.props;

    if (fuelData.fuelItems === null) {
      return null;
    }

    const actions = [] as {
      label: string;
      onClick: () => void;
      disabled: boolean;
    }[];
    fuelData.fuelItems.forEach((item) => {
      actions.push({
        label: `Add ${item.amountPerCharge} HRS`,
        onClick: this.handleQuickAction.bind(this, item.amountPerCharge),
        disabled: !isInteractive,
      });
    });

    return <QuickActions actions={actions}></QuickActions>;
  };

  render() {
    const { fuelData, initiallyCollapsed } = this.props;

    let extraNode: React.ReactNode = (
      <div className="ct-vehicle-fuel-tracker__summary">
        <span className="ct-vehicle-fuel-tracker__summary-value">
          {fuelData.remainingFuel} hrs
        </span>
      </div>
    );

    let headerCalloutNode: React.ReactNode = (
      <CollapsibleHeaderCallout extra={extraNode} value={null} />
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading="Fuel Management"
        callout={headerCalloutNode}
      />
    );

    return (
      <div className="ct-vehicle-fuel-tracker">
        <Collapsible
          header={headerNode}
          initiallyCollapsed={initiallyCollapsed}
        >
          <div className="ct-vehicle-fuel-tracker__content">
            {this.renderRemainingFuelInput()}
            {this.renderSimpleQuantityAdjuster()}
            {this.renderQuickActions()}
          </div>
        </Collapsible>
      </div>
    );
  }
}
