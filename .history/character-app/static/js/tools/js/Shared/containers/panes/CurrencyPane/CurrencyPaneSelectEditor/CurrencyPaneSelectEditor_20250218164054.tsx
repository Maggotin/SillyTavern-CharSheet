import React from "react";

import { Select } from "@dndbeyond/character-components/es";
import {
  HelperUtils,
  HtmlSelectOption,
} from "../../rules-engine/es";

import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import CurrencyPaneEditor from "../CurrencyPaneEditor";
import CurrencyPaneEditorValue from "../CurrencyPaneEditorValue";

interface Props {
  label: string;
  propertyKey: string;
  defaultValue: number | null;
  options: Array<HtmlSelectOption>;
  onUpdate?: (propertyKey: string, value: number | null) => void;
  isReadonly: boolean;
}
interface State {
  value: number | null;
}
export default class CurrencyPaneSelectEditor extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.defaultValue,
    };
  }

  handleChange = (value) => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, HelperUtils.parseInputInt(value));
      this.setState({
        value,
      });
    }
  };

  render() {
    const { value } = this.state;
    const { propertyKey, label, options, isReadonly } = this.props;

    return (
      <CurrencyPaneEditor
        propertyKey={propertyKey}
        className="ct-currency-pane__editor--select"
      >
        <Heading>{label}</Heading>
        <CurrencyPaneEditorValue>
          <Select
            className="ct-currency-pane__editor-input"
            placeholder="--"
            options={options}
            value={value}
            onChange={this.handleChange}
            isReadonly={isReadonly}
          />
        </CurrencyPaneEditorValue>
      </CurrencyPaneEditor>
    );
  }
}
