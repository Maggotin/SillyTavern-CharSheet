import { FC, HTMLAttributes } from "react";

type SvgProps = HTMLAttributes<SVGElement>;

export const ArrowsRightIcon: FC<SvgProps> = (props) => (
  <svg
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    aria-labelledby="rightArrowsTitle"
    {...props}
  >
    <title id="rightArrowsTitle">Right Arrows Icon</title>
    <path d="M5.21.36h0A2.25,2.25,0,0,1,7.89.53L16,8,7.89,15.47a2.25,2.25,0,0,1-2.68.17h0A1.3,1.3,0,0,1,5,13.52L11,8,5,2.48A1.3,1.3,0,0,1,5.21.36Z" />
    <polygon points="9.09 8 0 0 0 16 9.09 8" />
  </svg>
);
