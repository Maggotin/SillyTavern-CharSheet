import React from "react";

import { Constants, HelperUtils } from "../../rules-engine/es";

import ValueEditorProperty from "../ValueEditorProperty";
import ValueEditorPropertyLabel from "../ValueEditorPropertyLabel";
import ValueEditorPropertySource from "../ValueEditorPropertySource";
import ValueEditorPropertyValue from "../ValueEditorPropertyValue";

interface Props {
  label: string;
  propertyKey: Constants.AdjustmentTypeEnum;
  defaultValue: number | null;
  defaultSource: string | null;
  minimumValue?: number;
  maximumValue?: number;
  onUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    value: number | null,
    source: string | null
  ) => void;
  enableSource: boolean;
  step: number;
}
interface State {
  value: number | null;
  source: string | null;
}
export default class ValueEditorNumberProperty extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enableSource: true,
    step: 1,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.defaultValue,
      source: props.defaultSource,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { defaultValue } = this.props;
    const { value } = this.state;

    if (defaultValue !== prevProps.defaultValue && defaultValue !== value) {
      this.setState({
        value: defaultValue,
      });
    }
  }

  getDataValue = (value: number | null): number | null => {
    const { minimumValue, maximumValue } = this.props;

    if (value === null) {
      return null;
    }
    return HelperUtils.clampInt(
      value,
      minimumValue ? minimumValue : null,
      maximumValue
    );
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { source } = this.state;
    const { propertyKey, onUpdate, step } = this.props;

    let newValue = this.getDataValue(
      step < 1
        ? HelperUtils.parseInputFloat(evt.target.value)
        : HelperUtils.parseInputInt(evt.target.value)
    );
    if (onUpdate) {
      onUpdate(propertyKey, newValue, source);
    }
    this.setState({
      value: newValue,
    });
  };

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    const { step } = this.props;
    this.setState({
      value:
        step < 1
          ? HelperUtils.parseInputFloat(evt.target.value)
          : HelperUtils.parseInputInt(evt.target.value),
    });
  };

  handleSourceUpdate = (source: string | null): void => {
    const { value } = this.state;
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, this.getDataValue(value), source);
    }
    this.setState({
      source,
    });
  };

  render() {
    const { value } = this.state;
    const {
      propertyKey,
      label,
      minimumValue,
      maximumValue,
      defaultSource,
      enableSource,
      step,
    } = this.props;

    return (
      <ValueEditorProperty
        className="ct-value-editor__property--number"
        propertyKey={propertyKey}
      >
        <ValueEditorPropertyLabel>{label}</ValueEditorPropertyLabel>
        <ValueEditorPropertyValue>
          <input
            className="ct-value-editor__property-input"
            type="number"
            min={minimumValue}
            max={maximumValue}
            step={step}
            value={value === null ? "" : value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </ValueEditorPropertyValue>
        {enableSource && (
          <ValueEditorPropertySource
            onUpdate={this.handleSourceUpdate}
            defaultValue={defaultSource}
          />
        )}
      </ValueEditorProperty>
    );
  }
}
