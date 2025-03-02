import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ProneSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 22 22">
      <path
        fill={fillColor}
        d="M13.72,15.63c-1.05.86-2,1.51-3.77,0s-3-3.71-4.52-3.77-5.21.75-5.4,0,.57-1.51,1.51-1.51S4.61,11,6.18,9.6s2.76-2.07,3-3.77S8.57.94,9.19.31s1.32-.25,1.51.75,1,5.27,0,7c0,0-.19,3.14.75,3.77,0,0,1.44-2.39,3-3S19.18,8,19,8.84s-.13,1.44-1.51,1.51-3.08.38-4.52,3a6.44,6.44,0,0,1,3-.75,4.28,4.28,0,0,1,3,3c.06.94-.63,1.88-1.51,1.51S16.79,13.11,13.72,15.63Z"
      />
      <ellipse
        fill={fillColor}
        cx="5.72"
        cy="6.7"
        rx="1.88"
        ry="2.49"
        transform="translate(-2.03 2.51) rotate(-21.1)"
      />
    </BaseSvg>
  );
};

export default ProneSvg;
