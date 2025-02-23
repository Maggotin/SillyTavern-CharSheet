import * as React from "react";

import { AnimatedLoadingRingSvg } from "../Svg";

interface LoadingPlaceholderProps {
  label?: React.ReactNode;
}

const LoadingPlaceholder: React.FunctionComponent<LoadingPlaceholderProps> = ({
  label = "Loading",
}) => (
  <div className="ddbc-loading-placeholder">
    <AnimatedLoadingRingSvg className="ddbc-loading-placeholder__icon" />
    <div className="ddbc-loading-placeholder__label">{label}</div>
  </div>
);

export default React.memo(LoadingPlaceholder);
