import React from "react";

export default class DescriptionPaneEntryContent extends React.PureComponent {
  render() {
    return (
      <div className="ct-description-pane__entry-content">
        {this.props.children}
      </div>
    );
  }
}
