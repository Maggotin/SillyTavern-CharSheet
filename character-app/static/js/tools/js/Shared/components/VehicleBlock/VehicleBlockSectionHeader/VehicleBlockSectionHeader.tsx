import React from "react";

interface Props {
  label: React.ReactNode;
  callout: React.ReactNode;
}
export default class VehicleBlockSectionHeader extends React.PureComponent<Props> {
  static defaultProps = {
    callout: null,
  };

  render() {
    const { label, callout } = this.props;

    return (
      <div className="ct-vehicle-block__section-header">
        <div className="ct-vehicle-block__section-header-content">
          <div className="ct-vehicle-block__section-header-content-primary">
            {label}
          </div>
          {callout !== null && (
            <div className="ct-vehicle-block__section-header-content-callout">
              {callout}
            </div>
          )}
        </div>
      </div>
    );
  }
}
