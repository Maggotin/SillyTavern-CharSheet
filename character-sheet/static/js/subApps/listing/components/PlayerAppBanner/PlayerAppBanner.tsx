import clsx from "clsx";
import React from "react";

import XMark from "../../../../../../public/scripts/extensions/third-party/SillyTavern-CharSheet/src/fontawesome-cache/svgs/regular/xmark.svg";
import { Button } from "@dndbeyond/ttui/components/Button";

import {
  logPlayerAppBannerClickedCta,
  logPlayerAppBannerDismissed,
} from "../../../../helpers/analytics";
import appleStoreBadge from "../../../../images/apple-store-badge.svg?url";
import cellphones from "../../../../images/cellphones.png";
import googlePlayBadge from "../../../../images/google-play-badge.png";
import styles from "./styles.module.css";

export interface PlayerAppBannerProps {
  appleStoreLink: string | "DISABLED";
  className?: string;
  googlePlayStoreLink: string | "DISABLED";
  onDismiss: () => void;
}

export const PlayerAppBanner: React.FC<PlayerAppBannerProps> = ({
  appleStoreLink,
  className = "",
  googlePlayStoreLink,
  onDismiss,
}) => {
  const handleClose = () => {
    logPlayerAppBannerDismissed();
    onDismiss();
  };

  return (
    <aside
      className={clsx(["ddbcl-player-app-banner", styles.banner, className])}
    >
      <p className={styles.text}>Play Anywhere, Anytime</p>
      <img
        className={styles.image}
        src={cellphones}
        alt="3 cell phones with Dungeons & Dragons"
        width={200}
      />
      <div className={styles.buttons}>
        {appleStoreLink && appleStoreLink !== "DISABLED" && (
          <a
            className={styles.storeLink}
            href={appleStoreLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => logPlayerAppBannerClickedCta("Apple")}
            aria-label="Download the D&amp;D Beyond Player App on the Apple App Store"
          >
            <img
              className={styles.storeImage}
              src={appleStoreBadge}
              alt="Apple app store button"
              width={120}
            />
          </a>
        )}
        {googlePlayStoreLink && googlePlayStoreLink !== "DISABLED" && (
          <a
            className={styles.storeLink}
            href={googlePlayStoreLink}
            target="_blank"
            rel="noreferrer"
            onClick={() => logPlayerAppBannerClickedCta("Apple")}
            aria-label="Download the D&amp;D Beyond Player App on Google Play"
          >
            <img
              className={styles.storeImage}
              src={googlePlayBadge}
              alt="Google Play store button"
              width={134}
            />
          </a>
        )}
        <Button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Dismiss player app banner"
        >
          <XMark className={styles.closeIcon} />
        </Button>
      </div>
    </aside>
  );
};
