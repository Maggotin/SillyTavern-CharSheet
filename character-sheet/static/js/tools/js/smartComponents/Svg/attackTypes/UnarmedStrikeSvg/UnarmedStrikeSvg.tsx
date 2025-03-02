import React from "react";

import BaseSvg, { BaseSvgProps } from "../../BaseSvg";

const UnarmedStrikeSvg: React.FunctionComponent<BaseSvgProps> = ({
  className = "",
  fillColor,
  secondaryFillColor,
}) => {
  return (
    <BaseSvg className={className} viewBox="0 0 20 20">
      <g fill={fillColor}>
        <path d="M14.5 6.5l-2.793-2.793a1 1 0 00-1.414 0l-.864.864a.497.497 0 00.076.765L12.5 8.5zM7.707 4.707a1 1 0 00-1.414 0l-.584.584a1.003 1.003 0 000 1.418L10 11l2.102-1.898zM4.713 7.287l-1 1a1.004 1.004 0 00.003 1.423l4.578 4.55a1 1 0 001.43.017l.581-.582a.997.997 0 00.011-1.4l-4.978-5.07a.495.495 0 00-.625.062zM7.327 14.299l-2.99-3.074a.495.495 0 00-.624.062l-.999.999a1 1 0 00.008 1.421l2.575 2.543a.995.995 0 001.43.023l.586-.586a.992.992 0 00.014-1.388z" />
        <path d="M19 13V9l-3-3-5 5c2 2 5-1 5-1v1l-1 1a3.773 3.773 0 00-.742 3.258A2.798 2.798 0 0114 12s-1 1-3 0a1.385 1.385 0 010 2l-1 1a3.097 3.097 0 01-2 1l-1 1 2 2c1 1 4 0 4 0l1 1h5a1 1 0 001-1v-5zM7 0H0v7l1-6 6-1z" />
        <path d="M14 1L2 2 1 14 3 3l11-2z" />
      </g>
    </BaseSvg>
  );
};

export default UnarmedStrikeSvg;
