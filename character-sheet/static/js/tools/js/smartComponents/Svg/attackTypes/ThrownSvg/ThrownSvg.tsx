import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ThrownSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 18.16 18.94">
      <path
        d="M8.82 5.68S6.78 6 6.07 7.09c0 0 1.19 1 2.07.54s1.25-1.17.68-1.95z"
        fill={secondaryFillColor}
      />
      <path
        fill={fillColor}
        d="M10.41 8.58L1.59 0s.76 7.26 5.77 10.47zM11.33 9.47l4.37 5.21-1.7.86-4.02-5.07 1.35-1zM16.29 8.66A24.79 24.79 0 0012 .62S10.82 4 14.15 9.06zM16.75 9.63c.19.16 1.4 4.07 1.4 4.07l-1.15.87L15.51 10zM15.38 17.8l-4.7-2.96-1.08 1.21 4.67 2.89 1.11-1.14zM9.6 14.38L0 11s3.13 5.07 7.72 5.72z"
      />
    </BaseSvg>
  );
};

export default ThrownSvg;
