import React from "react";

export default class DescriptionPaneEditorValue extends React.PureComponent {
  render() {
    return (
      <div className="ct-description-pane__editor-value">
        {this.props.children}
      </div>
    );
  }
}
