import React from "react";

import { Select } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  HtmlSelectOption,
} from "../../rules-engine/es";

import DescriptionPaneEditor from "../DescriptionPaneEditor";
import DescriptionPaneEditorLabel from "../DescriptionPaneEditorLabel";
import DescriptionPaneEditorValue from "../DescriptionPaneEditorValue";

interface Props {
  label: string;
  propertyKey: string;
  defaultValue: number | null;
  options: Array<HtmlSelectOption>;
  onUpdate?: (propertyKey: string, value: number | null) => void;
}
interface State {
  value: number | null;
}
export default class DescriptionPaneSelectEditor extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  handleChange = (value: string): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      const parsedValue = HelperUtils.parseInputInt(value);
      onUpdate(propertyKey, parsedValue);
      this.setState({
        value: parsedValue,
      });
    }
  };

  render() {
    const { value } = this.state;
    const { propertyKey, label, options } = this.props;

    return (
      <DescriptionPaneEditor
        propertyKey={propertyKey}
        className="ct-description-pane__editor--select"
      >
        <DescriptionPaneEditorLabel>{label}</DescriptionPaneEditorLabel>
        <DescriptionPaneEditorValue>
          <Select
            className="ct-description-pane__editor-input"
            placeholder="--"
            options={options}
            value={value}
            onChange={this.handleChange}
          />
        </DescriptionPaneEditorValue>
      </DescriptionPaneEditor>
    );
  }
}
