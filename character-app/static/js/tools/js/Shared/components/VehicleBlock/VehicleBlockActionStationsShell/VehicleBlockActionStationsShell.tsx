import React from "react";

import VehicleBlockSectionHeader from "../VehicleBlockSectionHeader";

export default class VehicleBlockActionStationsShell extends React.PureComponent<{}> {
  render() {
    return (
      <div className="ct-vehicle-block__action-stations">
        <VehicleBlockSectionHeader label="Action Stations" />
        {this.props.children}
      </div>
    );
  }
}
