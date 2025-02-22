import React from "react";

import DescriptionPaneEditor from "../DescriptionPaneEditor";
import DescriptionPaneEditorLabel from "../DescriptionPaneEditorLabel";
import DescriptionPaneEditorValue from "../DescriptionPaneEditorValue";

interface Props {
  label: string;
  propertyKey: string;
  defaultValue: string | null;
  onUpdate?: (propertyKey: string, value: string) => void;
  maxLength: number | null;
}
export default class DescriptionPaneTextEditor extends React.PureComponent<Props> {
  static defaultProps = {
    maxLength: null,
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, evt.target.value);
    }
  };

  render() {
    const { propertyKey, label, defaultValue, maxLength } = this.props;

    return (
      <DescriptionPaneEditor
        propertyKey={propertyKey}
        className="ct-description-pane__editor--text"
      >
        <DescriptionPaneEditorLabel>{label}</DescriptionPaneEditorLabel>
        <DescriptionPaneEditorValue>
          <input
            className="ct-description-pane__editor-input"
            type="text"
            defaultValue={defaultValue === null ? "" : defaultValue}
            onBlur={this.handleBlur}
            maxLength={maxLength === null ? undefined : maxLength}
          />
        </DescriptionPaneEditorValue>
      </DescriptionPaneEditor>
    );
  }
}
