import { FC, HTMLAttributes } from "react";

type SvgProps = HTMLAttributes<SVGElement>;

export const FixedIcon: FC<SvgProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-labelledby="fixedTitle"
    {...props}
  >
    <title id="fixedTitle">Sidebar Fixed Icon</title>
    <path d="M15.5,3V21H3V3H15.5m3-3H0V24H18.5V0Z" />
    <rect x="17.59" y="0.5" width="5.91" height="23" />
    <path d="M23,1V23H18.09V1H23m1-1H17.09V24H24V0Z" />
    <line
      fill="none"
      stroke="#000"
      strokeMiterlimit={10}
      strokeWidth="3px"
      x1="12"
      y1="5.5"
      x2="12"
      y2="19"
    />
  </svg>
);
