import React from "react";

import { HelperUtils } from "@dndbeyond/character-rules-engine/es";

import { CHARACTER_DESCRIPTION_NUMBER_VALUE } from "../../../../constants/App";
import DescriptionPaneEditor from "../DescriptionPaneEditor";
import DescriptionPaneEditorLabel from "../DescriptionPaneEditorLabel";
import DescriptionPaneEditorValue from "../DescriptionPaneEditorValue";

interface Props {
  label: string;
  propertyKey: string;
  defaultValue: number | null;
  minValue: number;
  maxValue: number;
  onUpdate?: (propertyKey: string, value: number | null) => void;
}
interface State {
  value: number | null;
}
export default class DescriptionPaneNumberEditor extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    minValue: CHARACTER_DESCRIPTION_NUMBER_VALUE.MIN,
    maxValue: CHARACTER_DESCRIPTION_NUMBER_VALUE.MAX,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate, maxValue, minValue } = this.props;

    let parsedValue = HelperUtils.parseInputInt(evt.target.value);
    let clampedValue: number | null =
      parsedValue === null
        ? null
        : HelperUtils.clampInt(parsedValue, minValue, maxValue);
    if (onUpdate) {
      onUpdate(propertyKey, clampedValue);
    }
    this.setState({
      value: clampedValue,
    });
  };

  handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      value: HelperUtils.parseInputInt(evt.target.value),
    });
  };

  render() {
    const { value } = this.state;
    const { propertyKey, label, maxValue, minValue } = this.props;

    return (
      <DescriptionPaneEditor
        propertyKey={propertyKey}
        className="ct-description-pane__editor--number"
      >
        <DescriptionPaneEditorLabel>{label}</DescriptionPaneEditorLabel>
        <DescriptionPaneEditorValue>
          <input
            className="ct-description-pane__editor-input"
            type="number"
            min={minValue}
            max={maxValue}
            value={value === null ? "" : value}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
        </DescriptionPaneEditorValue>
      </DescriptionPaneEditor>
    );
  }
}
