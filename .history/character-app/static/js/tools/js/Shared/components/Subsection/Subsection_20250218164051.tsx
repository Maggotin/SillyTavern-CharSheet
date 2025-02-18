import React from "react";

import { FormatUtils } from "../../rules-engine/es";

interface Props {
  name: string;
  className: string;
}
export default class Subsection extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { name, children, className } = this.props;

    let classNames: Array<string> = [className, "ct-subsection"];
    if (name) {
      classNames.push(`ct-subsection--${FormatUtils.slugify(name)}`);
    }

    return <div className={classNames.join(" ")}>{children}</div>;
  }
}
