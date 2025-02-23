import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class ExportSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-export-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 13 16">
        <path
          d="M9 0H0V16H13V4L9 0ZM8.7 1.8L10.7 3.8H8.7V1.8ZM1.5 14.5V12.4H9.1V10.9H1.5V8.7H9.1V7.2H1.5V5H4.3V3.5H1.5V1.5H7.2V5.3H11.5V14.5H1.5Z"
          fill={fillColor}
        />
      </BaseSvg>
    );
  }
}
