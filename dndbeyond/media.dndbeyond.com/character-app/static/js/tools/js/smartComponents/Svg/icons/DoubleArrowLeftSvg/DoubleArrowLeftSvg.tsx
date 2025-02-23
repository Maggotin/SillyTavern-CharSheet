import * as React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

export default class DoubleArrowLeftSvg extends React.PureComponent<BaseSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 16 16" className={className}>
        <path
          fill={fillColor}
          d="M11,2.48,5,8l6,5.52a1.3,1.3,0,0,1-.21,2.12h0a2.25,2.25,0,0,1-2.68-.17L0,8,8.11.53A2.25,2.25,0,0,1,10.79.36h0A1.3,1.3,0,0,1,11,2.48Z"
        />
        <polygon fill={fillColor} points="6.92 8 16 0 16 16 6.92 8" />
      </BaseSvg>
    );
  }
}
