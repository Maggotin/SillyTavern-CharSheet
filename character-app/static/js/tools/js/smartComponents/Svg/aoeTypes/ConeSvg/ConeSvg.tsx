import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ConeSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 16.73 17.49">
      <path
        fill={fillColor}
        d="M14,17.49c-1.85,0-2.69-4.53-2.69-8.74S12.18,0,14,0s2.69,4.53,2.69,8.74S15.88,17.49,14,17.49ZM14,1c-.51,0-1.69,2.63-1.69,7.74s1.19,7.74,1.69,7.74,1.69-2.63,1.69-7.74S14.54,1,14,1Z"
      />
      <path
        fill={fillColor}
        d="M14,17.49a.5.5,0,0,1-.26-.07L.24,9.17a.5.5,0,0,1,0-.85L13.77.07a.5.5,0,1,1,.52.85L1.46,8.74l12.83,7.82a.5.5,0,0,1-.26.93Z"
      />
    </BaseSvg>
  );
};

export default ConeSvg;
