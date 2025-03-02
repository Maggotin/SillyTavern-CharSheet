import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const FrightenedSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 20 20">
      <ellipse fill={fillColor} cx="8" cy="7.8" rx="7.2" ry="7.8" />
      <path
        fill={fillColor}
        d="M13.7,11.7c0,3.1-2.5,6.9-5.7,6.9s-5.7-3.8-5.7-6.9S4.8,7.2,8,7.2S13.7,8.5,13.7,11.7z"
      />
      <path
        fill={secondaryFillColor}
        d="M6.4,8.9c0,0.9-0.7,1-1.5,1s-1.5-0.1-1.5-1S4,7.4,4.9,7.4S6.4,8.1,6.4,8.9z"
      />
      <path
        fill={secondaryFillColor}
        d="M10.3,14.5c0,1.3-1,0-2.3,0s-2.3,1.3-2.3,0s1-2.3,2.3-2.3S10.3,13.2,10.3,14.5z"
      />
      <path
        fill={secondaryFillColor}
        d="M12.4,8.9c0,0.9-0.7,1-1.5,1c-0.9,0-1.5-0.1-1.5-1s0.7-1.5,1.5-1.5C11.8,7.4,12.4,8.1,12.4,8.9z"
      />
      <ellipse
        transform="matrix(0.2904 -0.9569 0.9569 0.2904 1.0307 21.1022)"
        fill={fillColor}
        cx="14.7"
        cy="9.9"
        rx="1.9"
        ry="1.1"
      />
      <ellipse
        transform="matrix(0.9569 -0.2904 0.2904 0.9569 -2.812 0.7634)"
        fill={fillColor}
        cx="1.2"
        cy="9.9"
        rx="1.1"
        ry="1.9"
      />
    </BaseSvg>
  );
};

export default FrightenedSvg;
