import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const TransmutationSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 32 32">
      <path
        fill={fillColor}
        d="M19.827 6.569s1.097-.084 2.636-.052c1.993.04 1.902 1.415.999 2.01-.892.659-1.689 1.214-1.096 2.784 1.626 2.555 3.508 1.885 5.092.586 1.03-.902.275-1.555.275-1.555-.74-.79-2.25 2.522-3.405.28-.548-1.25 2.142-1.39 2.084-3.607 0-1.846-1.421-2.451-2.831-2.451H5.892L4 6.584h4.223v12.857l-1.116 2.743a1.8 1.8 0 00.32 1.871l2.989 3.381V6.57h7.218v18.364l-1.391 1.392h4.824l-1.24-1.392z"
      />
    </BaseSvg>
  );
};

export default TransmutationSvg;
