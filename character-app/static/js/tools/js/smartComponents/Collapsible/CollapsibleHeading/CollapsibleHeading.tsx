import * as React from "react";

export default class CollapsibleHeading extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className="ddbc-collapsible__heading">{this.props.children}</div>
    );
  }
}
