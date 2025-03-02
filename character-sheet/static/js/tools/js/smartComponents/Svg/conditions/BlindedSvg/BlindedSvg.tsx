import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const BlindedSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 20 20">
      <path
        fill={fillColor}
        d="M9.55,3.05A10.27,10.27,0,0,0,0,9.47a10.33,10.33,0,0,0,19.12,0A10.29,10.29,0,0,0,9.55,3.05Zm0,11.3A8.67,8.67,0,0,1,1.71,9.47a8.75,8.75,0,0,1,15.69,0A8.71,8.71,0,0,1,9.55,14.35Z"
      />
      <line
        stroke={fillColor}
        fill={fillColor}
        x1="18.17"
        y1="0.71"
        x2="1.17"
        y2="17.79"
      />
      <path
        fill={fillColor}
        d="M8,10.56a1,1,0,0,1-.11.16,2.4,2.4,0,0,1-.48.44,1.16,1.16,0,0,1-.24.15A3.4,3.4,0,0,0,12.36,7C11,8.3,9.34,9.25,8,10.56Z"
      />
    </BaseSvg>
  );
};

export default BlindedSvg;
