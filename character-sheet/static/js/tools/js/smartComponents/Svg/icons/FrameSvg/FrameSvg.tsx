import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class FrameSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-frame-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 26 26">
        <rect
          fill="none"
          stroke={fillColor}
          strokeMiterlimit={10}
          strokeWidth="3px"
          x="1.5"
          y="1.5"
          width="23"
          height="23"
          rx="3"
          ry="3"
        />
      </BaseSvg>
    );
  }
}
