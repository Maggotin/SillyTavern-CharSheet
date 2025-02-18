import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ChevronRightSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = [
      "ddbc-chevron-svg",
      "ddbc-chevron-right-svg",
    ];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 1035 1612">
        <path
          fill={fillColor}
          d="M653.5,109l741,742q19,19,19,45t-19,45l-741,742q-19,19-45.5,19t-45.5-19l-165-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l165-166q19-19,45.5-19T653.5,109Z"
          transform="translate(-378.5 -90)"
        />
      </BaseSvg>
    );
  }
}
