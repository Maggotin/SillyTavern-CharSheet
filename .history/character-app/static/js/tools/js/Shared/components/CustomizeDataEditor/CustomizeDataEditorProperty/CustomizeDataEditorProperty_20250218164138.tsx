import React from "react";

import { FormatUtils } from "@dndbeyond/character-rules-engine/es";

interface Props {
  isBlock: boolean;
  propertyKey: string;
}
export default class CustomizeDataEditorProperty extends React.PureComponent<Props> {
  static defaultProps = {
    isBlock: false,
  };

  render() {
    const { isBlock, propertyKey } = this.props;

    let classNames: Array<string> = [
      "ct-customize-data-editor__property",
      `ct-customize-data-editor__property--${FormatUtils.slugify(propertyKey)}`,
    ];
    if (isBlock) {
      classNames.push("ct-customize-data-editor__property--block");
    }

    return <div className={classNames.join(" ")}>{this.props.children}</div>;
  }
}
