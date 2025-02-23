import { orderBy } from "lodash";
import React from "react";

import { Toggle } from "~/components/Toggle";

import { ToggleInfo } from "./typings";

interface Props {
  toggles: Array<ToggleInfo>;
  heading: React.ReactNode;
  description: React.ReactNode;
}
export default class FormTogglesField extends React.PureComponent<Props, {}> {
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
      <div className="builder-field builder-field-toggles">
        <div className="builder-field-toggles-summary">
          <div className="builder-field-toggles-heading">{heading}</div>
          {description && (
            <div className="builder-field-toggle-description">
              {description}
            </div>
          )}
        </div>
        <div className="builder-field-toggles-fields">
          {sortedToggles.map((toggle, idx) => (
            <div className="builder-field-toggles-field" key={idx}>
              <div className="builder-field-toggles-field-input">
                <Toggle
                  checked={toggle.initiallyEnabled}
                  onClick={toggle.onChange}
                  onChangePromise={toggle.onChangePromise}
                  color="secondary"
                  aria-label={toggle.label}
                />
              </div>
              <div className="builder-field-toggles-field-label">
                {toggle.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
