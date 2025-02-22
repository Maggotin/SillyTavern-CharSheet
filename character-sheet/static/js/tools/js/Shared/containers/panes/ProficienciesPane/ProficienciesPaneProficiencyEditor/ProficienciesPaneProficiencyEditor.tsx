import React from "react";

interface Props {
  label?: string;
  propertyKey: string;
  defaultValue: string | null;
  onUpdate?: (propertyKey: string, value: string) => void;
  placeholder: string;
}
export default class ProficienciesPaneProficiencyEditor extends React.PureComponent<Props> {
  static defaultProps = {
    placeholder: "",
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>): void => {
    const { propertyKey, onUpdate } = this.props;

    if (onUpdate) {
      onUpdate(propertyKey, evt.target.value);
    }
  };

  render() {
    const { label, defaultValue, placeholder } = this.props;

    return (
      <div className="ct-proficiencies-pane__proficiency-editor">
        <div className="ct-proficiencies-pane__proficiency-editor-field">
          <input
            type="text"
            defaultValue={defaultValue === null ? "" : defaultValue}
            onBlur={this.handleBlur}
            className="ct-proficiencies-pane__proficiency-editor-input"
            placeholder={placeholder}
          />
        </div>
        {label && (
          <div className="ct-proficiencies-pane__proficiency-editor-label">
            {label}
          </div>
        )}
      </div>
    );
  }
}
