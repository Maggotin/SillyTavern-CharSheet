import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const LineSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 17.49 7.1">
      <path
        fill={fillColor}
        d="M14,5.44H.5a.5.5,0,0,1-.5-.5V2a.5.5,0,0,1,.5-.5H14a.5.5,0,0,1,0,1H1v2H14a.5.5,0,0,1,0,1Z"
      />
      <path
        fill={fillColor}
        d="M14,7.1a.49.49,0,0,1-.18,0,.5.5,0,0,1-.32-.46V4.94a.5.5,0,0,1,1,0v.4l1.76-1.87L14.53,1.71v.17a.5.5,0,0,1-1,0V.5a.5.5,0,0,1,.85-.35l3,3a.5.5,0,0,1,0,.7l-3,3.15A.5.5,0,0,1,14,7.1Z"
      />
    </BaseSvg>
  );
};

export default LineSvg;
