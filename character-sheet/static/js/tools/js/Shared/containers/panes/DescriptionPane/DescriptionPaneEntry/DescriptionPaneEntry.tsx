import React from "react";

export default class DescriptionPaneEntry extends React.PureComponent {
  render() {
    return (
      <div className="ct-description-pane__entry">{this.props.children}</div>
    );
  }
}
