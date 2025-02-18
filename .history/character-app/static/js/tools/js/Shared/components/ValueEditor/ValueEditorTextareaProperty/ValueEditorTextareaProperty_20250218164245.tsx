import React from "react";

import { Constants } from "../../character-rules-engine/es";

import ValueEditorProperty from "../ValueEditorProperty";
import ValueEditorPropertyLabel from "../ValueEditorPropertyLabel";
import ValueEditorPropertyValue from "../ValueEditorPropertyValue";

interface Props {
  label: string;
  propertyKey: Constants.AdjustmentTypeEnum;
  defaultValue: string | null;
  onUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    value: string | null,
    source: string | null
  ) => void;
  enableSource: boolean;
}
interface State {
  value: string | null;
}
export default class ValueEditorTextareaProperty extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enableSource: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.defaultValue,
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

  handleChange = (evt: React.FocusEvent<HTMLTextAreaElement>): void => {
    const { value } = this.state;

    if (value !== evt.target.value) {
      this.setState({
        value: evt.target.value,
      });
    }
  };

  handleBlur = (evt: React.FocusEvent<HTMLTextAreaElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      let value: string | null = evt.target.value ? evt.target.value : null;
      onUpdate(propertyKey, value, null);
    }
  };

  render() {
    const { propertyKey, label } = this.props;

    const { value } = this.state;

    return (
      <ValueEditorProperty
        className="ct-value-editor__property--textarea"
        propertyKey={propertyKey}
        isBlock={true}
      >
        <ValueEditorPropertyLabel>{label}</ValueEditorPropertyLabel>
        <ValueEditorPropertyValue>
          <textarea
            className="ct-value-editor__property-input"
            value={value === null ? "" : value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </ValueEditorPropertyValue>
      </ValueEditorProperty>
    );
  }
}
