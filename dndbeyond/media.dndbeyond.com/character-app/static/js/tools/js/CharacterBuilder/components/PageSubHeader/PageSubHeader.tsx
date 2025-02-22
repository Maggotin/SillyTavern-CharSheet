import React from "react";

export default class PageSubHeader extends React.PureComponent {
  render() {
    const { children } = this.props;

    return <div className="builder-page-subheader">{children}</div>;
  }
}
