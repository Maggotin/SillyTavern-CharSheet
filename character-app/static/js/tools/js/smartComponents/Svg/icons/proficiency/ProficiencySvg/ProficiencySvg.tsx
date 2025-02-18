import React from "react";

import BaseSvg from "../../../BaseSvg";
import { InjectedSvgProps } from "../../../hocs";

export default class ProficiencySvg extends React.PureComponent<InjectedSvgProps> {
  static defaultProps = {
    fillColor: "#383838",
    secondaryFillColor: "#383838",
  };

  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-proficiency-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 10 10">
        <g
          id="ProficiencySvg-c0f57d66-982a-4b7b-ab3f-1a660eb9a0fa"
          data-name="Layer 2"
        >
          <g
            id="ProficiencySvg-20287332-c962-4a67-9f75-8501a8b7818d"
            data-name="v1"
          >
            <circle fill={fillColor} cx="5" cy="5" r="5" />
          </g>
        </g>
      </BaseSvg>
    );
  }
}
