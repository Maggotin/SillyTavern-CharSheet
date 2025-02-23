import React from "react";

import { Toggle } from "~/components/Toggle";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

interface Props {
  initiallyEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
  heading: React.ReactNode;
  description: string;
}
export default class PreferencesPaneToggleField extends React.PureComponent<Props> {
  static defaultProps = {
    initiallyEnabled: false,
  };

  render() {
    const { heading, description, initiallyEnabled, onChange } = this.props;

    return (
      <div className="ct-preferences-pane__field ct-preferences-pane__field--toggle">
        <div className="ct-preferences-pane__field-heading-input">
          <Heading className="ct-preferences-pane__field-heading">
            {heading}
            <Toggle
              checked={initiallyEnabled}
              onClick={onChange}
              color="themed"
              aria-label={description}
            />
          </Heading>
        </div>
        <div className="ct-preferences-pane__field-summary">
          {description && (
            <div className="ct-preferences-pane__field-description">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }
}
