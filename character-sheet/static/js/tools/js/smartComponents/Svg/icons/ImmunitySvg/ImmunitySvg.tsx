import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ImmunitySvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 40.89941 48">
      <path
        fill={fillColor}
        d="M40.4497,8c-11,0-20-6-20-8,0,2-9,8-20,8-4,35,20,40,20,40S44.4497,43,40.4497,8Zm-16.75,29.42h-6.5V10.4h6.5Z"
      />
    </BaseSvg>
  );
};

export default ImmunitySvg;
