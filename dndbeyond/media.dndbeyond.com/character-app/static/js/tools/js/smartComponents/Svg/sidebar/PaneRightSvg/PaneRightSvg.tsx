import * as React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class PaneRightSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 9.05327 16" className={className}>
        <path
          fill={fillColor}
          d="M.36226,2.48379,5.09065,8,.36225,13.5167a1.50431,1.50431,0,0,0,.16326,2.12119h0a1.5043,1.5043,0,0,0,2.12106-.16324L9.05327,8,2.647.52548A1.50458,1.50458,0,0,0,.52524.36242h0A1.50457,1.50457,0,0,0,.36226,2.48379Z"
        />
      </BaseSvg>
    );
  }
}
