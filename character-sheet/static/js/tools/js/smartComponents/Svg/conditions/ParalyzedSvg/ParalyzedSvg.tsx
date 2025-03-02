import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const ParalyzedSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 24 24">
      <path
        fill={fillColor}
        d="M17.5,12.6c0,0-0.1,0-0.1,0c0-0.1,0-0.1,0-0.2c0-4.3-3.2-7.8-7.2-7.8S3,8.1,3,12.4c0,0.1,0,0.1,0,0.2   c-0.1,0-0.1,0-0.2,0c-0.6,0.2-0.8,1.1-0.5,2.1c0.3,1,1,1.6,1.6,1.5c0.2,0.4,0.4,0.8,0.7,1.1c0.5,2.9,2.8,5.8,5.6,5.8   c2.8,0,5.1-3,5.6-5.8c0.3-0.3,0.5-0.7,0.7-1.1c0.6,0.1,1.2-0.5,1.5-1.5C18.3,13.8,18.1,12.8,17.5,12.6z"
      />

      <path
        fill={secondaryFillColor}
        d="M9.5,15v2.6H8v-7.3h2.5c0.7,0,1.3,0.2,1.7,0.6c0.4,0.4,0.6,1,0.6,1.7c0,0.7-0.2,1.3-0.6,1.7    c-0.4,0.4-1,0.6-1.7,0.6H9.5z M9.5,13.8h1.1c0.3,0,0.5-0.1,0.7-0.3c0.2-0.2,0.2-0.5,0.2-0.9c0-0.3-0.1-0.6-0.2-0.9    c-0.2-0.2-0.4-0.3-0.7-0.3H9.5V13.8z"
      />

      <polygon
        fill={secondaryFillColor}
        points="5.1,8.8 8.3,5.6 5.1,2.4 7,0.5 10.2,3.7 13.4,0.5 15.3,2.4 12.1,5.6 15.3,8.8 13.4,10.7 10.2,7.5     7,10.7   "
      />
      <polygon
        stroke={fillColor}
        fill={secondaryFillColor}
        points="5.1,8.8 8.3,5.6 5.1,2.4 7,0.5 10.2,3.7 13.4,0.5 15.3,2.4 12.1,5.6 15.3,8.8 13.4,10.7 10.2,7.5     7,10.7   "
      />

      <polygon
        fill={secondaryFillColor}
        points="0.5,10.8 2,9.3 0.5,7.9 1.8,6.7 3.2,8.1 4.7,6.7 5.9,7.9 4.4,9.3 5.9,10.8 4.7,12 3.2,10.6 1.8,12       "
      />
      <polygon
        stroke={fillColor}
        fill={secondaryFillColor}
        points="0.5,10.8 2,9.3 0.5,7.9 1.8,6.7 3.2,8.1 4.7,6.7 5.9,7.9 4.4,9.3 5.9,10.8 4.7,12 3.2,10.6 1.8,12       "
      />

      <polygon
        fill={secondaryFillColor}
        points="15.5,10.8 17,9.3 15.5,7.9 16.8,6.7 18.2,8.1 19.7,6.7 20.9,7.9 19.4,9.3 20.9,10.8 19.7,12     18.2,10.6 16.8,12   "
      />
      <polygon
        stroke={fillColor}
        fill={secondaryFillColor}
        points="15.5,10.8 17,9.3 15.5,7.9 16.8,6.7 18.2,8.1 19.7,6.7 20.9,7.9 19.4,9.3 20.9,10.8 19.7,12     18.2,10.6 16.8,12   "
      />
    </BaseSvg>
  );
};

export default ParalyzedSvg;
