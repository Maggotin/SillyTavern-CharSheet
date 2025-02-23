import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class CloseSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-close-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 1092 1092">
        <path
          fill={fillColor}
          d="M849.9,990L990,849.9L639.9,499.9L990,150L849.9,10L499.9,359.9L150,10L10,150l349.9,349.9L10,849.9L150,990l349.9-350.1L849.9,990z"
        />
      </BaseSvg>
    );
  }
}
