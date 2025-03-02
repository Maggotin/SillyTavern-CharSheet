import React from "react";

import { FormatUtils } from "@dndbeyond/character-rules-engine/es";

interface Props {
  name?: string;
  className: string;
}
export default class SubsectionTablet extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { name, children, className } = this.props;

    let classNames: Array<string> = [className, "ct-subsection-tablet"];
    if (name) {
      classNames.push(`ct-subsection-tablet--${FormatUtils.slugify(name)}`);
    }

    return <div className={classNames.join(" ")}>{children}</div>;
  }
}
