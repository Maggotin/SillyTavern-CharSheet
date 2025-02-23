import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const SquareSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 13.75 13.33">
      <rect
        fill={secondaryFillColor}
        stroke={fillColor}
        strokeMiterlimit={10}
        className="cls-1"
        x="0.71"
        y="0.29"
        width="12.33"
        height="12.75"
        transform="translate(0.21 13.54) rotate(-90)"
      />
    </BaseSvg>
  );
};

export default SquareSvg;
