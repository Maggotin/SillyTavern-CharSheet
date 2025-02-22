import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ProficiencyDoubleSvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    fillColor: "#383838",
    secondaryFillColor: "#999",
  };

  render() {
    const { fillColor, secondaryFillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-proficiency-half-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 17 17">
        <g
          id="ProficiencyDoubleSvg-14be38f8-41fa-4aaa-a375-bf5579c9481f"
          data-name="Layer 2"
        >
          <g
            id="ProficiencyDoubleSvg-a914e018-db39-4f0d-b4c9-818c43e09af7"
            data-name="v1"
          >
            <g>
              <path
                fill={secondaryFillColor}
                d="M8.5,0A8.5,8.5,0,1,0,17,8.5,8.49382,8.49382,0,0,0,8.5,0Zm0,15.00854A6.50854,6.50854,0,1,1,15.00854,8.5,6.509,6.509,0,0,1,8.5,15.00854Z"
              />
              <circle fill={fillColor} cx="8.5" cy="8.5" r="4.25" />
            </g>
          </g>
        </g>
      </BaseSvg>
    );
  }
}
