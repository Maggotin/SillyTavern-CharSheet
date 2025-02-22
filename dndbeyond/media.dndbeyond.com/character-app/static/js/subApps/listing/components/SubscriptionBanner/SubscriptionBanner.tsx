import { HTMLAttributes } from "react";

import { Button } from "~/components/Button";

import heroIcon from "../../../../images/icons/hero-tier-icon.png";
import masterIcon from "../../../../images/icons/master-tier-icon.png";
import styles from "./styles.module.css";

export interface SubscriptionBannerProps
  extends HTMLAttributes<HTMLDivElement> {
  iconType: "hero" | "master" | null;
  text: string;
  buttonLabel: string;
  onClick: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  iconType,
  text,
  buttonLabel,
  onClick,
  ...props
}) => {
  return (
    <div className={styles.container} data-testid="subscription-banner">
      <div className={styles.detailContainer}>
        {iconType && (
          <img
            src={iconType === "master" ? masterIcon : heroIcon}
            alt={`${iconType} tier icon`}
            className={styles.icon}
          />
        )}
        <div className={styles.text}>{text || props.children}</div>
      </div>
      {onClick && (
        <Button variant="builder" onClick={onClick} className={styles.button}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
