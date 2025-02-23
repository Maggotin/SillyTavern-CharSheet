import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ChevronDownSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = [
      "ddbc-chevron-svg",
      "ddbc-chevron-down-svg",
    ];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 1792 1792">
        <path
          fill={fillColor}
          d="M1683,653.5l-742,741c-12.7,12.7-27.7,19-45,19s-32.3-6.3-45-19l-742-741c-12.7-12.7-19-27.8-19-45.5
                        s6.3-32.8,19-45.5l166-165c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l531,531l531-531c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l166,165
                        c12.7,12.7,19,27.8,19,45.5S1695.7,640.8,1683,653.5z"
        />
      </BaseSvg>
    );
  }
}
