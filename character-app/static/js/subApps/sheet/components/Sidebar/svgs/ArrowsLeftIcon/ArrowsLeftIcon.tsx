import { FC, HTMLAttributes } from "react";

type SvgProps = HTMLAttributes<SVGElement>;

export const ArrowsLeftIcon: FC<SvgProps> = (props) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    aria-labelledby="leftArrowsTitle"
    {...props}
  >
    <title id="leftArrowsTitle">Left Arrows Icon</title>
    <path d="M11,2.48,5,8l6,5.52a1.3,1.3,0,0,1-.21,2.12h0a2.25,2.25,0,0,1-2.68-.17L0,8,8.11.53A2.25,2.25,0,0,1,10.79.36h0A1.3,1.3,0,0,1,11,2.48Z" />
    <polygon points="6.92 8 16 0 16 16 6.92 8" />
  </svg>
);
