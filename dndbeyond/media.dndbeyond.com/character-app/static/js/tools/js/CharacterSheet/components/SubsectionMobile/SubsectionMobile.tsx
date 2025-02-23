import React from "react";

import { FormatUtils } from "@dndbeyond/character-rules-engine/es";

interface Props {
  name?: string;
  className: string;
}
export default class SubsectionMobile extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { name, children, className } = this.props;

    let classNames: Array<string> = [className, "ct-subsection-mobile"];
    if (name) {
      classNames.push(`ct-subsection-mobile--${FormatUtils.slugify(name)}`);
    }

    return <div className={classNames.join(" ")}>{children}</div>;
  }
}
