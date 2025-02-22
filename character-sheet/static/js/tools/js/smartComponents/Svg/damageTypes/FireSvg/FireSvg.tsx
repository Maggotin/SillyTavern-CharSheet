import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const FireSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 13.05 19">
      <path
        fill={fillColor}
        d="M7,19c-3.06,0-7-2.49-7-6.33a3.68,3.68,0,0,0,3,1.81S.19,10.63,5,7.24,7,0,7,0s3.06,1.81,2,4.52S8.06,11.26,9,12c0,0-.37-5.55,3-6.57,0,0-1.94,2.94,0,4.52S13.69,19,7,19Z"
      />
    </BaseSvg>
  );
};

export default FireSvg;
