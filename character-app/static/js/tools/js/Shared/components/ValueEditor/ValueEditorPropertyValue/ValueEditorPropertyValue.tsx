import React from "react";

export default class ValueEditorPropertyValue extends React.PureComponent {
  render() {
    return (
      <div className="ct-value-editor__property-value">
        {this.props.children}
      </div>
    );
  }
}
