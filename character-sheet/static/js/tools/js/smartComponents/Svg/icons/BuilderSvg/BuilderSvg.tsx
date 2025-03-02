import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class BuilderSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-builder-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 46.82 38.62">
        <path
          fill={fillColor}
          d="M46.17,16.56v4.51s-8.16-.94-12,2.56-3.32,6.47-2.11,7.43,4.17,1.27,4.17,1.27l2.48,3.2v3.08H32.81S31,36.08,26.35,36.08s-6.89,2.48-6.89,2.48H14V35.41l2.36-2.9s2.54.12,3.87-1.27.54-5.32-1.45-5.32H15.35v-.66S5.74,25.44,0,18.31H18V16.56Z"
        />
        <path
          fill={fillColor}
          d="M27.49,0a52.76,52.76,0,0,0-4.33,11.7,13,13,0,0,0,5.25,2.07,41.51,41.51,0,0,0,4.4-11.55A12.5,12.5,0,0,0,27.49,0Z"
        />
        <path
          fill={fillColor}
          d="M32.74,6.78a8.53,8.53,0,0,1-1.14,3l13.52,4.79c.57.2,1.32-.69,1.45-1s.62-1.62-.27-1.93Z"
        />
        <path
          fill={fillColor}
          d="M24.63,3.51A28.29,28.29,0,0,0,23.36,6.7a1.64,1.64,0,0,1-.42-2.14A1.63,1.63,0,0,1,24.63,3.51Z"
        />
        <path
          fill={fillColor}
          d="M21.76,12,18.94,2.57l-.22,8.23-3.42-4,1.93,5.69L11.15,9.86l7.07,5.36h9.63l-1.73-.44a11.47,11.47,0,0,1-3.83-1.85Z"
        />
      </BaseSvg>
    );
  }
}
