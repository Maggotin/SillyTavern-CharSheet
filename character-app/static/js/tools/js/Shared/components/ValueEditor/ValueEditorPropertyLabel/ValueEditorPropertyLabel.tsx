import React from "react";

export default class ValueEditorPropertyLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-value-editor__property-label">
        {this.props.children}
      </div>
    );
  }
}
