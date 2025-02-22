import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode } from "react";

import { AnimatedLoadingRingSvg } from "~/tools/js/smartComponents/Svg";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
}

export const Spinner: FC<SpinnerProps> = ({
  label = "Loading",
  className,
  ...props
}) => {
  return (
    <div className={clsx(["ddbc-loading-placeholder", className])} {...props}>
      <AnimatedLoadingRingSvg className="ddbc-loading-placeholder__icon" />
      <span className="ddbc-loading-placeholder__label">{label}</span>
    </div>
  );
};
