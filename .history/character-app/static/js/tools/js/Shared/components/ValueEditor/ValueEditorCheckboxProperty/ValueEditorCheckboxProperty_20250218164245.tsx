import React from "react";

import { Checkbox } from "@dndbeyond/character-components/es";
import { Constants } from "../../character-rules-engine/es";

import ValueEditorProperty from "../ValueEditorProperty";
import ValueEditorPropertySource from "../ValueEditorPropertySource";
import ValueEditorPropertyValue from "../ValueEditorPropertyValue";

interface Props {
  label: string;
  propertyKey: Constants.AdjustmentTypeEnum;
  initiallyEnabled: boolean;
  defaultSource: string | null;
  onUpdate?: (
    propertyKey: Constants.AdjustmentTypeEnum,
    isEnabled: boolean,
    source: string | null
  ) => void;
  enableSource: boolean;
}
interface State {
  value: boolean;
  source: string | null;
}
export default class ValueEditorCheckboxProperty extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enableSource: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.initiallyEnabled,
      source: props.defaultSource,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { initiallyEnabled } = this.props;
    const { value } = this.state;

    if (
      initiallyEnabled !== prevProps.initiallyEnabled &&
      initiallyEnabled !== value
    ) {
      this.setState({
        value: initiallyEnabled,
      });
    }
  }

  handleChange = (isEnabled: boolean): void => {
    const { source } = this.state;
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, isEnabled, source);
    }
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
    const {
      propertyKey,
      label,
      initiallyEnabled,
      defaultSource,
      enableSource,
    } = this.props;

    return (
      <ValueEditorProperty
        className="ct-value-editor__property--checkbox"
        propertyKey={propertyKey}
      >
        <ValueEditorPropertyValue>
          <Checkbox
            stopPropagation={true}
            label={label}
            initiallyEnabled={initiallyEnabled}
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
