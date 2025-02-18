import { FC, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

import {
  DarkPlayButtonSvg,
  LightPlayButtonSvg,
} from "@dndbeyond/character-components/es";

import { Button } from "~/components/Button/Button";
import { HtmlContent } from "~/components/HtmlContent";
import { PreferencePrivacyTypeEnum } from "~/constants";
import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneInitFailureContent } from "~/subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";
import { NavigationUtils } from "~/tools/js/Shared/utils";
import { CampaignCharacterContract } from "~/types";

import { CampaignCharacter } from "./CampaignCharacter";
import styles from "./styles.module.css";

/*
This is the Sidebar for a Campaign. If the character has joined a Campaign, you can click on the campaign button in the Character Sheet header to see this Sidebar. It displays the Campaign name, maps link, DM, and all characters in the campaign. If the character is the DM, they will see all characters in the campaign. If the character is not the DM, they will only see characters that have been set to public or campaign only.
*/

interface CampaignPaneProps extends HTMLAttributes<HTMLDivElement> {}
export const CampaignPane: FC<CampaignPaneProps> = ({ ...props }) => {
  const { campaign, campaignUtils } = useCharacterEngine();
  const { isDarkMode } = useCharacterTheme();
  const isReadonly = useSelector(appEnvSelectors.getIsReadonly);

  if (!campaign) {
    return <PaneInitFailureContent />;
  }

  const characters = campaignUtils.getCharacters(campaign);
  const description = campaignUtils.getDescription(campaign);

  const filteredCharacters = characters
    ? characters.filter(
        (character) =>
          character.privacyType === PreferencePrivacyTypeEnum.PUBLIC ||
          character.privacyType === PreferencePrivacyTypeEnum.CAMPAIGN_ONLY
      )
    : [];

  const orderedCharacters = filteredCharacters.sort((a, b) =>
    (a.characterName ?? "").localeCompare(b.characterName ?? "")
  );

  return (
    <div {...props}>
      <div className={styles.header}>
        <Header>Campaign</Header>
        <Button
          href={NavigationUtils.getLaunchGameUrl(campaign)}
          target="_blank"
          size="x-small"
          variant="text"
          className={styles.launchButton}
          themed
        >
          {isDarkMode ? <LightPlayButtonSvg /> : <DarkPlayButtonSvg />}
          <span>Launch Game</span>
        </Button>
      </div>
      <div className={styles.name}>
        {isReadonly ? (
          campaignUtils.getName(campaign)
        ) : (
          <a
            className={styles.link}
            href={campaignUtils.getLink(campaign) ?? ""}
          >
            {campaignUtils.getName(campaign)}
          </a>
        )}
      </div>
      {!isReadonly && description !== null && (
        <HtmlContent html={description} withoutTooltips />
      )}
      <div className={styles.dm}>
        <span className={styles.dmLabel}>DM:</span>
        <span>{campaignUtils.getDmUsername(campaign)}</span>
      </div>
      <div className={styles.characters}>
        {orderedCharacters.map((character: CampaignCharacterContract) => (
          <CampaignCharacter
            key={character.characterId}
            characterId={character.characterId}
            avatarUrl={character.avatarUrl ?? ""}
            characterName={character.characterName ?? ""}
            userName={character.username ?? ""}
          />
        ))}
      </div>
    </div>
  );
};
