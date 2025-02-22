import React from "react";

export default class PageHeader extends React.PureComponent {
  render() {
    const { children } = this.props;

    return <div className="builder-page-header">{children}</div>;
  }
}
