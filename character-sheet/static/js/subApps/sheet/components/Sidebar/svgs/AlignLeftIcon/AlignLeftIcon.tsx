import { FC, HTMLAttributes } from "react";

type SvgProps = HTMLAttributes<SVGElement>;

export const AlignLeftIcon: FC<SvgProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-labelledby="alignLeftTitle"
    {...props}
  >
    <title id="alignLeftTitle">Sidebar Align Left Icon</title>
    <path d="M21,3V21H9.5V3H21m3-3H6.5V24H24V0Z" />
    <rect x="0.5" y="0.5" width="5.91" height="23" />
    <path d="M5.91,1V23H1V1H5.91m1-1H0V24H6.91V0Z" />
  </svg>
);
