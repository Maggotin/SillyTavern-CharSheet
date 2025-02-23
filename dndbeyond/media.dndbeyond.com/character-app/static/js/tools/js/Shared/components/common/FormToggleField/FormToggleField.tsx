import React from "react";

import { Toggle } from "~/components/Toggle";

interface Props {
  initiallyEnabled: boolean;
  onChange?: (isEnabled?: boolean) => void;
  onChangePromise?: (
    newIsEnabled: boolean,
    accept: () => void,
    reject: () => void
  ) => void;
  heading: React.ReactNode;
  description?: React.ReactNode;
  toggleLabel: string;
  isReadOnly?: boolean;
}
export default class FormToggleField extends React.PureComponent<Props, {}> {
  static defaultProps = {
    initiallyEnabled: false,
  };

  render() {
    const {
      heading,
      description,
      initiallyEnabled,
      onChange,
      onChangePromise,
      toggleLabel,
      isReadOnly,
    } = this.props;

    return (
      <div className="builder-field builder-field-toggle">
        <div className="builder-field-toggle-summary">
          <div className="builder-field-toggle-heading">{heading}</div>
          {description && (
            <div className="builder-field-toggle-description">
              {description}
            </div>
          )}
        </div>
        <div className="builder-field-toggle-input">
          {onChange && (
            <Toggle
              checked={initiallyEnabled}
              onClick={onChange}
              color="secondary"
              aria-label={toggleLabel}
            />
          )}
        </div>
      </div>
    );
  }
}
