import clsx from "clsx";
import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { ThemedPlayButtonSvg } from "@dndbeyond/character-components/es";
import {
  CampaignDataContract,
  CampaignUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";
import D6 from "@dndbeyond/fontawesome-cache/svgs/regular/dice-d6.svg";
import { GameLogNotificationWrapper } from "@dndbeyond/game-log-components";

import { Link } from "~/components/Link";

import { useSidebar } from "../../../../contexts/Sidebar";
import { PaneComponentEnum } from "../../../../subApps/sheet/components/Sidebar/types";
import { GameLogState } from "../../Shared/stores/typings";
import { NavigationUtils } from "../../Shared/utils";
import styles from "./styles.module.css";

interface Props {
  campaign: CampaignDataContract;
  onCampaignShow?: () => void;
  className?: string;
  gameLog?: GameLogState;
  theme: CharacterTheme;
}

const CampaignSummary: React.FC<Props> = ({
  campaign,
  onCampaignShow,
  className = "",
  gameLog,
  theme,
}) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  const handleClick = (evt: React.MouseEvent): void => {
    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();

    if (onCampaignShow) {
      onCampaignShow();
    }
  };

  const handleGameLogClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    // Assuming dispatch is available in props or context
    paneHistoryStart(PaneComponentEnum.GAME_LOG);
  };

  return (
    <div className={clsx(styles.container)}>
      <div
        className={clsx(styles.campaignSummary)}
        onClick={handleClick}
        data-testid="campaign-summary"
      >
        <span className={clsx(styles.summaryLabel)}>Campaign:</span>
        <span className={clsx(styles.summaryName)}>
          {CampaignUtils.getName(campaign)}
        </span>
      </div>
      <Tooltip title="Launch Game" isDarkMode={theme.isDarkMode}>
        <Link
          href={NavigationUtils.getLaunchGameUrl(campaign)}
          target="maps"
          aria-label="Launch Game"
        >
          <div className={clsx(styles.campaignButtonGroup)}>
            <div className={clsx(styles.campaignButton)}>
              <ThemedPlayButtonSvg
                className={clsx([
                  styles.campaignButtonIcon,
                  styles.campaignPlayButtonIcon,
                ])}
                theme={theme}
              />
            </div>
          </div>
        </Link>
      </Tooltip>
      <GameLogNotificationWrapper
        themeColor={theme.themeColor}
        gameLogIsOpen={gameLog?.isOpen ?? false}
        notificationOnClick={handleGameLogClick}
      >
        <Tooltip title="Game Log" isDarkMode={theme.isDarkMode}>
          <div
            role="button"
            aria-roledescription="Game Log"
            className={clsx(styles.campaignButtonGroup)}
            onClick={handleGameLogClick}
          >
            <div className={clsx(styles.campaignButton)}>
              <D6 className={clsx(styles.campaignButtonIcon)} />
            </div>
          </div>
        </Tooltip>
      </GameLogNotificationWrapper>
    </div>
  );
};

export default CampaignSummary;
