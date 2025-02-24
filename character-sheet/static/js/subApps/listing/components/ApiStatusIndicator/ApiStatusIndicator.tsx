import React from "react";

import CircleExclamation from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/circle-exclamation.svg";
import SpinnerThird from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/solid/spinner-third.svg";

import styles from "./styles.module.css";

export interface ApiStatusIndicatorProps {
  isLoading: boolean;
  error?: Error;
  loadingMessage: string;
  errorMessage: string;
}
export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  isLoading,
  error,
  loadingMessage,
  errorMessage,
}) => {
  if (!isLoading && !error) {
    return null;
  }

  return (
    <div className={styles.indicator}>
      {isLoading && (
        <>
          <SpinnerThird className={styles.spinner} />
          <span>{loadingMessage}</span>
        </>
      )}
      {error && (
        <>
          <CircleExclamation className={styles.error} />
          <span>{errorMessage}</span>
        </>
      )}
    </div>
  );
};

export default ApiStatusIndicator;
