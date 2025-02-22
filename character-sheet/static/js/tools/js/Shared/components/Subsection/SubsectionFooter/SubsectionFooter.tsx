import React from "react";

export default class SubsectionFooter extends React.PureComponent {
  render() {
    const { children } = this.props;

    return <div className="ct-subsection__footer">{children}</div>;
  }
}
