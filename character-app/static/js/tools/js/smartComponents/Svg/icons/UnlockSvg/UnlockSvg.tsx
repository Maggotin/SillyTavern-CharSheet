import * as React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class UnlockSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 10.23313 16" className={className}>
        <path
          fill={fillColor}
          d="M5.11656,6.73717l-2.80744.39938V4.19033a2.8071,2.8071,0,0,1,5.6142,0H9.30741a4.19119,4.19119,0,0,0-8.38238,0V7.33344L0,7.465v7.61549L5.11656,16l5.11657-.91947V7.465Z"
        />
      </BaseSvg>
    );
  }
}
