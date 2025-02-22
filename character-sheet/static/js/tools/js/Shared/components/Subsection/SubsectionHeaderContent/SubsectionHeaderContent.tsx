import React from "react";

export default class SubsectionHeaderContent extends React.PureComponent {
  render() {
    const { children } = this.props;

    return <div className="ct-subsection__header-content">{children}</div>;
  }
}
