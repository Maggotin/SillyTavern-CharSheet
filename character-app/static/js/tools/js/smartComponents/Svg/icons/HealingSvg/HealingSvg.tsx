import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

const HealingSvg: React.FunctionComponent<InjectedSvgProps> = ({
  className = "",
  fillColor,
}) => {
  let classNames: Array<string> = ["ddbc-attunement-svg"];

  if (className) {
    classNames.push(className);
  }

  return (
    <BaseSvg className={classNames.join(" ")} viewBox="0 0 18.4 20.1">
      <path
        fill={fillColor}
        d="M9.2,2.9c3.4-6.9,13.8,0,6.9,6.9c-6.9,6.9-6.9,10.4-6.9,10.4s0-3.5-6.9-10.4C-4.6,2.9,5.8-4,9.2,2.9"
      />
    </BaseSvg>
  );
};
export default HealingSvg;
