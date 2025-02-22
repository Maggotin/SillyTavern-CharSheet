import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../../BaseSvg";

export default class ExtrasSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 21.41 4.34" className={className}>
        <circle fill={fillColor} cx="10.7" cy="2.17" r="2.17" />
        <circle fill={fillColor} cx="2.17" cy="2.17" r="2.17" />
        <circle fill={fillColor} cx="19.24" cy="2.17" r="2.17" />
      </BaseSvg>
    );
  }
}
