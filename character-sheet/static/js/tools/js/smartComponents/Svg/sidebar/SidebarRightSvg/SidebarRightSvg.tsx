import * as React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class SidebarLeftSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, fillColor } = this.props;

    return (
      <BaseSvg viewBox="0 0 16 16" className={className}>
        <path
          fill={fillColor}
          d="M5.21.36h0A2.25,2.25,0,0,1,7.89.53L16,8,7.89,15.47a2.25,2.25,0,0,1-2.68.17h0A1.3,1.3,0,0,1,5,13.52L11,8,5,2.48A1.3,1.3,0,0,1,5.21.36Z"
        />
        <polygon fill={fillColor} points="9.09 8 0 0 0 16 9.09 8" />
      </BaseSvg>
    );
  }
}
