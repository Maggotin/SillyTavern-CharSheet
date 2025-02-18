import React from "react";

import { Constants } from "../../rules-engine/es";

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
  initialFocus?: boolean;
}
interface State {
  value: string | null;
}
export default class ValueEditorTextProperty extends React.PureComponent<
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
  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.inputRef.current && this.props.initialFocus) {
      this.inputRef.current.focus();
    }
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

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      let value: string | null = evt.target.value ? evt.target.value : null;
      onUpdate(propertyKey, value, null);
    }
  };

  handleChange = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { value } = this.state;

    if (value !== evt.target.value) {
      this.setState({
        value: evt.target.value,
      });
    }
  };

  render() {
    const { propertyKey, label } = this.props;

    const { value } = this.state;

    return (
      <ValueEditorProperty
        className="ct-value-editor__property--text"
        propertyKey={propertyKey}
        isBlock={true}
      >
        <ValueEditorPropertyValue>
          <input
            type="text"
            value={value === null ? "" : value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            className="ct-value-editor__property-input"
            ref={this.inputRef}
          />
        </ValueEditorPropertyValue>
        <ValueEditorPropertyLabel>{label}</ValueEditorPropertyLabel>
      </ValueEditorProperty>
    );
  }
}
