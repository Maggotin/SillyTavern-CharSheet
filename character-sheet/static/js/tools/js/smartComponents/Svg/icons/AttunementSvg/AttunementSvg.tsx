import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class AttunementSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-attunement-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 18.54 16.05">
        <path
          fill={fillColor}
          d="M9.27,0,0,16.05H18.54Zm1.25,11.53H8l-.49,1.54H6.08L8.54,5.93H10l2.45,7.14H11Z"
        />
        <polygon
          fill={fillColor}
          points="9.26 7.6 8.37 10.41 10.17 10.41 9.29 7.6 9.26 7.6"
        />
      </BaseSvg>
    );
  }
}
