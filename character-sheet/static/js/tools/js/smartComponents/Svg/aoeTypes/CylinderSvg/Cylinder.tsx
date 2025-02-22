import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const Cylinder: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 17.49 18.31">
      <path
        fill={fillColor}
        d="M8.74,5.38C4.53,5.38,0,4.54,0,2.69S4.53,0,8.74,0s8.74.84,8.74,2.69S13,5.38,8.74,5.38ZM8.74,1C3.63,1,1,2.19,1,2.69S3.63,4.38,8.74,4.38s7.74-1.19,7.74-1.69S13.85,1,8.74,1Z"
      />
      <path
        fill={fillColor}
        d="M8.74,18.31C4.53,18.31,0,17.47,0,15.62V2.69a.5.5,0,0,1,1,0V15.62c0,.51,2.63,1.69,7.74,1.69s7.74-1.19,7.74-1.69V2.69a.5.5,0,0,1,1,0V15.62C17.49,17.47,13,18.31,8.74,18.31Z"
      />
    </BaseSvg>
  );
};

export default Cylinder;
