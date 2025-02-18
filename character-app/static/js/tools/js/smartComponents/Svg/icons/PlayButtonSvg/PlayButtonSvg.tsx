import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class PlayButtonSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-play-button-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 11 14">
        <path
          fill={fillColor}
          d="M2 3.64L7.27 7L2 10.36V3.64ZM0 0V14L11 7L0 0Z"
        />
      </BaseSvg>
    );
  }
}
