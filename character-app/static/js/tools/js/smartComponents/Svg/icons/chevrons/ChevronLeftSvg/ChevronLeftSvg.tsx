import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ChevronLeftSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = [
      "ddbc-chevron-svg",
      "ddbc-chevron-left-svg",
    ];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 1035 1612">
        <path
          fill={fillColor}
          d="M1184,90q26.5,0,45.5,19l165,166q19,19,19,45t-19,45l-531,531,531,531q19,19,19,45t-19,45l-165,166q-19,19-45.5,19t-45.5-19l-741-742q-19-19-19-45t19-45l741-742Q1157.5,90,1184,90Z"
          transform="translate(-378.5 -90)"
        />
      </BaseSvg>
    );
  }
}
