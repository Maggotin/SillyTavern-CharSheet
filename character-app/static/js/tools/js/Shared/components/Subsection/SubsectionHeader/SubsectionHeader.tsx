import React from "react";

export default class SubsectionHeader extends React.PureComponent {
  render() {
    const { children } = this.props;

    return <div className="ct-subsection__header">{children}</div>;
  }
}
