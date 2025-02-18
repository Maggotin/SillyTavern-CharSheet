import React from "react";

export default class CustomizeDataEditorPropertyLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-customize-data-editor__property-label">
        {this.props.children}
      </div>
    );
  }
}
