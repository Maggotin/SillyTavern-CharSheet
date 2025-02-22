import * as React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class PaneLeftSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 9.05327 16" className={className}>
        <path
          fill={fillColor}
          d="M8.691,2.48379,3.96263,8,8.691,13.5167a1.50431,1.50431,0,0,1-.16326,2.12119h0a1.50431,1.50431,0,0,1-2.12107-.16324L0,8,6.40628.52548A1.50456,1.50456,0,0,1,8.528.36242h0A1.50457,1.50457,0,0,1,8.691,2.48379Z"
        />
      </BaseSvg>
    );
  }
}
