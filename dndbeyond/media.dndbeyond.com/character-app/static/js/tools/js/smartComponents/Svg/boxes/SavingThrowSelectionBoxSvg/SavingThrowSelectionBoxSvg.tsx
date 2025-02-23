import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";
import SavingThrowRowBoxSvg from "../SavingThrowRowBoxSvg";

export default class SavingThrowSelectionBoxSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-saving-throw-selection-box-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <React.Fragment>
        <BaseSvg className={classNames.join(" ")} viewBox="0 0 41 36">
          <path
            d="M10.8724 1H30.3426C30.9246 1 31.4467 1.15738 31.8408 1.45807C35.0159 3.88086 40 9.69489 40 18C40 26.3051 35.0159 32.1191 31.8408 34.5419C31.4467 34.8426 30.9246 35 30.3426 35H10.8724C10.1907 35 9.57613 34.7818 9.1371 34.3765C6.08124 31.555 1.5 25.4781 1.5 18C1.5 10.5219 6.08124 4.44504 9.1371 1.62354C9.57613 1.21818 10.1907 1 10.8724 1Z"
            stroke="#BFCCD6"
            strokeWidth="1"
          />
        </BaseSvg>
      </React.Fragment>
    );
  }
}
