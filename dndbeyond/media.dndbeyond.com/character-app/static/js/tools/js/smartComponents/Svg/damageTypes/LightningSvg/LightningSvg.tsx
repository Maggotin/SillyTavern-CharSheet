import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const LightningSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 10.67 16">
      <path
        fill={fillColor}
        d="M3.62,0H9.33L6.07,6.67h4.6L1.33,16l1.9-6.67H0Z"
      />
    </BaseSvg>
  );
};

export default LightningSvg;
