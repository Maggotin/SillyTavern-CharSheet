import React from "react";

import { Select } from "../../character-components/es";
import { HelperUtils, Constants } from "../../character-rules-engine/es";

import ValueEditorProperty from "../ValueEditorProperty";
import ValueEditorPropertyLabel from "../ValueEditorPropertyLabel";
import ValueEditorPropertySource from "../ValueEditorPropertySource";
import ValueEditorPropertyValue from "../ValueEditorPropertyValue";

interface Props {
  label: string;
  propertyKey: Constants.AdjustmentTypeEnum;
  defaultValue: number | null;
  defaultSource: string | null;
  options: Array<any>; // TODO figure out type
  selectProps: any; // TODO use Partial<Select.props> somehow
  onUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    value: number | null,
    source: string | null
  ) => void;
  enableSource: boolean;
}
interface State {
  value: number | null;
  source: string | null;
}
export default class ValueEditorSelectProperty extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    selectProps: {},
    enableSource: true,
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

  handleSelectChange = (value: string): void => {
    const { source } = this.state;
    const { propertyKey, onUpdate } = this.props;

    let parsedValue = HelperUtils.parseInputInt(value);

    if (onUpdate) {
      onUpdate(propertyKey, parsedValue, source);
    }
    this.setState({
      value: parsedValue,
    });
  };

  handleSourceUpdate = (source: string | null): void => {
    const { value } = this.state;
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, value, source);
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
      options,
      selectProps,
      defaultSource,
      enableSource,
    } = this.props;

    return (
      <ValueEditorProperty
        className="ct-value-editor__property--select"
        propertyKey={propertyKey}
      >
        <ValueEditorPropertyLabel>{label}</ValueEditorPropertyLabel>
        <ValueEditorPropertyValue>
          <Select
            placeholder="--"
            {...selectProps}
            options={options}
            value={value}
            onChange={this.handleSelectChange}
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
