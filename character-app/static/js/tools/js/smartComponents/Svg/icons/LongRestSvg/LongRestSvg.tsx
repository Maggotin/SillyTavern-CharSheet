import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class LongRestSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-long-rest-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 443.5 443.5">
        <path
          fill={fillColor}
          d="M221.75.25c122.33,0,221.5,99.17,221.5,221.5s-99.17,221.5-221.5,221.5S.25,344.08.25,221.75,99.42.25,221.75.25ZM370.58,353.13c69.03-39.84,83.21-144.48,31.66-233.72C350.7,30.17,252.96-9.88,183.92,29.97c-69.03,39.84-83.21,144.48-31.66,233.72C203.8,352.93,301.54,392.98,370.58,353.13Z"
        />
        <ellipse
          fill="none"
          stroke={fillColor}
          strokeMiterlimit={10}
          strokeWidth="10px"
          cx="277.25"
          cy="191.55"
          rx="144.3145"
          ry="186.5974"
          transform="matrix(0.86569, -0.50058, 0.50058, 0.86569, -58.64876, 164.51324)"
        />
      </BaseSvg>
    );
  }
}
