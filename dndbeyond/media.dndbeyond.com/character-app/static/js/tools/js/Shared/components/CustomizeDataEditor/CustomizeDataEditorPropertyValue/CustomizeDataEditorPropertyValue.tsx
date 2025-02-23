import React from "react";

export default class CustomizeDataEditorPropertyValue extends React.PureComponent {
  render() {
    return (
      <div className="ct-customize-data-editor__property-value">
        {this.props.children}
      </div>
    );
  }
}
