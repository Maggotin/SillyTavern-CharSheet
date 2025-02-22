import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class BonusNegativeSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-bonus-negative-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.241 1.13253C12.0909 1.05 11.9091 1.05 11.759 1.13252L2.25904 6.35753C2.09927 6.4454 2 6.61329 2 6.79563V17.2044C2 17.3867 2.09927 17.5546 2.25904 17.6425L11.759 22.8675C11.9091 22.95 12.0909 22.95 12.241 22.8675L21.741 17.6425C21.9007 17.5546 22 17.3867 22 17.2044V6.79563C22 6.61329 21.9007 6.4454 21.741 6.35753L12.241 1.13253ZM18 10.5H6V13.5H18V10.5Z"
          fill={fillColor}
        />
      </BaseSvg>
    );
  }
}
