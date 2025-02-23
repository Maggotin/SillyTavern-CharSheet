import React from "react";

export default class VehicleBlockComponentsShell extends React.PureComponent {
  render() {
    return (
      <div className="ct-vehicle-block__components-block">
        {this.props.children}
      </div>
    );
  }
}
