import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class FilterSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-filter-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 29 31.43435">
        <g id="5980cc6f-d687-4543-b0ac-5355a2132dc6" data-name="Layer 2">
          <g id="567f4281-9d41-458b-8080-e577c6ec19c5" data-name="Layer 2">
            <path
              fill={fillColor}
              d="M10,18,.38675,3.58013A2.30282,2.30282,0,0,1,0,2.30278H0A2.30278,2.30278,0,0,1,2.30277,0H26.69723A2.30278,2.30278,0,0,1,29,2.30277h0a2.30282,2.30282,0,0,1-.38675,1.27735L19,18V30.78071a.65255.65255,0,0,1-1.01451.543L10.44556,26.297A1.00058,1.00058,0,0,1,10,25.46451Z"
            />
          </g>
        </g>
      </BaseSvg>
    );
  }
}
