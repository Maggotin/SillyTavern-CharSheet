import React from "react";

interface Props {
  clsNames: Array<string>;
}
export default class Page extends React.PureComponent<Props> {
  static defaultProps = {
    clsNames: [],
  };

  render() {
    const { clsNames, children } = this.props;

    const conClassNames = [...clsNames, "builder-page"];

    return <div className={conClassNames.join(" ")}>{children}</div>;
  }
}
