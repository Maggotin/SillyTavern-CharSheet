import * as React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class LockSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 10.2299 15.0756" className={className}>
        <path
          fill={fillColor}
          d="M9.30491,6.41174V4.19A4.19,4.19,0,0,0,.925,4.19V6.41174L0,6.54333v7.61309l5.115.91918,5.115-.91918V6.54333ZM2.30862,4.19a2.80632,2.80632,0,0,1,5.61264,0V6.21491L5.115,5.81568l-2.80633.39923Z"
        />
      </BaseSvg>
    );
  }
}
