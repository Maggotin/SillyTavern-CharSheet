import React from "react";

export default class CurrencyPaneEditorValue extends React.PureComponent {
  render() {
    return (
      <div className="ct-currency-pane__editor-value">
        {this.props.children}
      </div>
    );
  }
}
