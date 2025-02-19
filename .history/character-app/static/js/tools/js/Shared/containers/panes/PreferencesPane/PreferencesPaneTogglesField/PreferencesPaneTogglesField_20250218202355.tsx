import { orderBy } from "lodash";
import React from "react";

import { Toggle } from "~/components/Toggle";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import { ToggleInfo } from "./typings";

interface Props {
  toggles: Array<ToggleInfo>;
  heading: React.ReactNode;
  description: string;
}

export default class PreferencesPaneTogglesField extends React.PureComponent<Props> {
  static defaultProps = {
    initiallyEnabled: false,
  };

  render() {
    const { heading, description, toggles } = this.props;

    if (!toggles.length) {
      return null;
    }

    const sortedToggles = orderBy(toggles, "sortOrder");

    return (
      <div className="ct-preferences-pane__fieldstcs-preferences-pane__field--toggle">
        <div className="ct-preferences-pane__field-summary">
          <Heading className="ct-preferences-pane__field-heading">
            {heading}
          </Heading>
          {description && (
            <div className="ct-preferences-pane__field-description">
              {description}
            </div>
          )}
        </div>
        <div className="ct-preferences-pane__field-toggles">
          {sortedToggles.map((toggle, idx) => (
            <div className="ct-preferences-pane__field-toggle" key={idx}>
              <div className="ct-preferences-pane__field-input">
                <Toggle
                  checked={toggle.initiallyEnabled}
                  onClick={toggle.onChange}
                  onChangePromise={toggle.onChangePromise}
                  color="themed"
                  aria-label={toggle.label}
                />
              </div>
              <div className="ct-preferences-pane__field-label">
                {toggle.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
