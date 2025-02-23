import React from "react";

export default class DescriptionPaneEditorLabel extends React.PureComponent {
  render() {
    return (
      <div className="ct-description-pane__editor-label">
        {this.props.children}
      </div>
    );
  }
}
