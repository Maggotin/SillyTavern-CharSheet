import { FC, HTMLAttributes } from "react";

type SvgProps = HTMLAttributes<SVGElement>;

export const OverlayIcon: FC<SvgProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-labelledby="overlayTitle"
    {...props}
  >
    <title id="overlayTitle">Sidebar Overlay Icon</title>
    <path d="M14.5,3V21H3V3H14.5m3-3H0V24H17.5V0Z" />
    <rect x="17.59" y="0.5" width="5.91" height="23" />
    <path d="M23,1V23H18.09V1H23m1-1H17.09V24H24V0Z" />
    <polygon points="6.28 12.32 12.5 19.14 12.5 5.5 6.28 12.32" />
  </svg>
);
