import React from "react";

import { FormatUtils } from "../../rules-engine/es";

interface Props {
  propertyKey: string;
  className: string;
}
export default class CurrencyPaneEditor extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { propertyKey, className } = this.props;

    let classNames: Array<string> = [
      "ct-currency-pane__editor",
      `ct-currency-pane__editor--${FormatUtils.slugify(propertyKey)}`,
      className,
    ];

    return <div className={classNames.join(" ")}>{this.props.children}</div>;
  }
}
