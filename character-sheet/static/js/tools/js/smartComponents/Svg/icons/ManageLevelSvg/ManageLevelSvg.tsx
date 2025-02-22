import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class ManageLevelSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-manage-level-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 16 16">
        <g
          id="Sheet"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Character-Drop-Down"
            transform="translate(-30.000000, -140.000000)"
          >
            <g id="Group-45-Copy" transform="translate(30.000000, 140.000000)">
              <circle
                id="Oval-4"
                fill={fillColor}
                cx="8"
                cy="8"
                r="7.51098633"
              ></circle>
              <path
                d="M9.83015873,7.3467308 L12,7.3467308 L8,3.3467308 L4,7.3467308 L6.16984127,7.3467308 L6.16984127,11.8389386 L9.83015873,11.8389386 L9.83015873,7.3467308 Z"
                id="Combined-Shape"
                fill="#242528"
              ></path>
            </g>
          </g>
        </g>
      </BaseSvg>
    );
  }
}
