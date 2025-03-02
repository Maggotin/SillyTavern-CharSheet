import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ExhaustedSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 20 10">
      <path
        fill={fillColor}
        d="M1.65,0A1.66,1.66,0,0,0,.45.45c-.81.81-.51,2.44.68,3.63S4,5.58,4.77,4.77A1.47,1.47,0,0,0,5,4.38a13.15,13.15,0,0,1-3.57,7.83H4.12C5.67,10.7,6.64,7.72,7.25,5.76a6.78,6.78,0,0,1,4.22,2l-3.85,4.5h11.2l-1.15-2.08h-5.2C16.62,7,14,3.55,10.55,2.05V2a10.23,10.23,0,0,0-1.47-.49h0a5.93,5.93,0,0,0-4.41.32,4.35,4.35,0,0,0-.59-.73A3.59,3.59,0,0,0,1.65,0Z"
      />
    </BaseSvg>
  );
};

export default ExhaustedSvg;
