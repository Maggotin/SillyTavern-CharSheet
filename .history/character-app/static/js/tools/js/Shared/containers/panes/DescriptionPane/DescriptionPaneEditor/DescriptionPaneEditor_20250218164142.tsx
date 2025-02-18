import React from "react";

import { FormatUtils } from "@dndbeyond/character-rules-engine/es";

interface Props {
  propertyKey: string;
  className: string;
}
export default class DescriptionPaneEditor extends React.PureComponent<Props> {
  render() {
    const { propertyKey, className } = this.props;

    let classNames: Array<string> = [
      "ct-description-pane__editor",
      `ct-description-pane__editor--${FormatUtils.slugify(propertyKey)}`,
      className,
    ];

    return <div className={classNames.join(" ")}>{this.props.children}</div>;
  }
}
