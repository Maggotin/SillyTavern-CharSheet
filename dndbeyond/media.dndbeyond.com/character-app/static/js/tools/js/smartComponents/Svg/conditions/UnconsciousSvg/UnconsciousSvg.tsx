import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const UnconsciousSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 15.9 18.6">
      <path
        fill={fillColor}
        d="M15.3,8.1c0,0-0.1,0-0.1,0c0-0.1,0-0.1,0-0.2C15.2,3.5,11.9,0,8,0S0.8,3.5,0.8,7.8c0,0.1,0,0.1,0,0.2   c-0.1,0-0.1,0-0.2,0c-0.6,0.2-0.8,1.1-0.5,2.1c0.3,1,1,1.6,1.6,1.5c0.2,0.4,0.4,0.8,0.7,1.1c0.5,2.9,2.8,5.8,5.6,5.8   c2.8,0,5.1-3,5.6-5.8c0.3-0.3,0.5-0.7,0.7-1.1c0.6,0.1,1.2-0.5,1.5-1.5C16.1,9.2,15.9,8.2,15.3,8.1z"
      />
      <path
        fill={secondaryFillColor}
        d="M10.4,13.9c0,1.3-1,0-2.3,0s-2.3,1.3-2.3,0s1-2.3,2.3-2.3S10.4,12.6,10.4,13.9z"
      />
      <rect
        x="4.6"
        y="5.8"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 14.1626 10.267)"
        fill={secondaryFillColor}
        width="0.7"
        height="4.5"
      />
      <rect
        x="4.6"
        y="5.8"
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 2.7546 17.2743)"
        fill={secondaryFillColor}
        width="0.7"
        height="4.5"
      />
      <rect
        x="10.6"
        y="5.8"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 24.4054 6.0243)"
        fill={secondaryFillColor}
        width="0.7"
        height="4.5"
      />
      <rect
        x="10.6"
        y="5.8"
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.9974 21.517)"
        fill={secondaryFillColor}
        width="0.7"
        height="4.5"
      />
    </BaseSvg>
  );
};

export default UnconsciousSvg;
