import clsx from "clsx";
import { FC, HTMLAttributes } from "react";
import { useSelector } from "react-redux";

import { CharacterAvatarPortrait } from "../../character-components/es";

import { useCharacterTheme } from "~/contexts/CharacterTheme";
import { appEnvSelectors } from "~/tools/js/Shared/selectors";

import styles from "./styles.module.css";

/*
This is a single character in the CampaignPane. It displays the character's avatar, name, and user name.

*/

export interface CampaignCharacterProps extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  avatarUrl: string;
  characterName: string;
  userName: string;
}

export const CampaignCharacter: FC<CampaignCharacterProps> = ({
  characterId,
  avatarUrl,
  characterName,
  userName,
  className,
  ...props
}) => {
  const { isDarkMode } = useCharacterTheme();
  const currentCharacterId = useSelector(appEnvSelectors.getCharacterId);
  const isCurrentCharacter = currentCharacterId === characterId;

  return (
    <div
      className={clsx([
        styles.character,
        isCurrentCharacter && styles.current,
        className,
      ])}
      key={characterId}
      {...props}
    >
      <CharacterAvatarPortrait
        className={styles.preview}
        avatarUrl={avatarUrl}
      />
      <div className={styles.content}>
        <div className={styles.name}>
          {isCurrentCharacter ? (
            <span>{characterName}</span>
          ) : (
            <a
              href={`/characters/${characterId}`}
              className={clsx([styles.link, isDarkMode && styles.darkMode])}
              target="_blank"
              rel="noreferrer"
            >
              {characterName}
            </a>
          )}
        </div>
        <div className={styles.user}>{userName}</div>
      </div>
    </div>
  );
};
