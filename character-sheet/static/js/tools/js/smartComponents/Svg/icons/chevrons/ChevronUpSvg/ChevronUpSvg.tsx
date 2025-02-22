import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ChevronUpSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-chevron-svg", "ddbc-chevron-up-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 1792 1792">
        <path
          fill={fillColor}
          d="M109,1138.5l742-741c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l742,741c12.7,12.7,19,27.8,19,45.5
                        c0,17.7-6.3,32.8-19,45.5l-166,165c-12.7,12.7-27.7,19-45,19s-32.3-6.3-45-19l-531-531l-531,531c-12.7,12.7-27.7,19-45,19
                        s-32.3-6.3-45-19l-166-165c-12.7-12.7-19-27.8-19-45.5C90,1166.3,96.3,1151.2,109,1138.5z"
        />
      </BaseSvg>
    );
  }
}
