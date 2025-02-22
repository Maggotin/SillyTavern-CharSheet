import clsx from "clsx";
import { FC } from "react";

import Lock from "@dndbeyond/fontawesome-cache/svgs/regular/lock.svg";
import Check from "@dndbeyond/fontawesome-cache/svgs/sharp-regular/check.svg";
import { Button } from "@dndbeyond/ttui/components/Button";

import useApiCall from "~/hooks/useApiCall";

import {
  logCharacterCampaignClicked,
  logUnlockCharacterLocked,
  logUnlockCharacterUnlocked,
} from "../../../../helpers/analytics";
import {
  copyCharacter as copyCharacterApi,
  deleteCharacter as deleteCharacterApi,
  leaveCampaign as leaveCampaignApi,
  activateCharacter as activateCharacterApi,
} from "../../../../helpers/characterServiceApi";
import {
  getAvatarUrl,
  getBackdropUrl,
  getCampaignDetailsLink,
  getCampaignName,
  getCoverImageUrl,
  getDetailsLink,
  getIsAssigned,
  getName,
  getSecondaryInfo,
  getStatus,
  getStatusSlug,
  isInCampaign,
} from "../../../../state/selectors/characterUtils";
import { CharacterData, CharacterStatusEnum } from "../../../../types";
import { ApiStatusIndicator } from "../ApiStatusIndicator";
import "./CharacterCard.scss";
import { CharacterCardLinks } from "./CharacterCardLinks";
import { LeaveCampaignButton } from "./LeaveCampaignButton";
import styles from "./styles.module.css";

export interface CharacterCardProps {
  character: CharacterData;
  reloadListing: () => void;
  lockCharacter: (character: CharacterData) => void;
  unlockCharacter: (character: CharacterData) => void;
  canUnlockMore: boolean;
  hasLockedCharacters: boolean;
  overCharacterLimit: boolean;
  maxCharacterSlotsAllowed: number | null;
  currentCharacterCount: number;
}

export const CharacterCard: FC<CharacterCardProps> = ({
  character,
  reloadListing,
  lockCharacter,
  unlockCharacter,
  canUnlockMore,
  hasLockedCharacters,
  overCharacterLimit,
  maxCharacterSlotsAllowed,
  currentCharacterCount,
}) => {
  const [copyCharacter, isCopyingCharacter, errorCopyingCharacter] = useApiCall(
    copyCharacterApi,
    reloadListing
  );

  const [deleteCharacter, isDeletingCharacter, errorDeletingCharacter] =
    useApiCall(deleteCharacterApi, reloadListing);

  const [leaveCampaign, isLeavingCampaign, errorLeavingCampaign] = useApiCall(
    leaveCampaignApi,
    reloadListing
  );

  const [activateCharacter, isActivatingCharacter, errorActivatingCharacter] =
    useApiCall(activateCharacterApi, reloadListing);

  const isLocked = getStatus(character) === CharacterStatusEnum.Locked;

  const handleToggleLock = () => {
    if (isLocked) {
      unlockCharacter(character);
      logUnlockCharacterUnlocked();
    } else {
      lockCharacter(character);
      logUnlockCharacterLocked();
    }
  };

  return (
    <li className="ddb-campaigns-character-card-wrapper j-characters-listing__item">
      <div
        className={clsx([`status-${getStatusSlug(character)}`, styles.card])}
      >
        <div className="ddb-campaigns-character-card-header">
          {getBackdropUrl(character) ? (
            <div
              className="ddb-campaigns-character-card-header-cover-image ddb-campaigns-character-card-header-cover-image-user-backdrop"
              style={{
                backgroundImage: `url(${getBackdropUrl(character)})`,
              }}
            />
          ) : (
            <div
              className="ddb-campaigns-character-card-header-cover-image"
              style={{
                backgroundImage: `url(${getCoverImageUrl(character)})`,
              }}
            />
          )}
          <div className="ddb-campaigns-character-card-header-upper">
            {!hasLockedCharacters &&
              getStatus(character) === CharacterStatusEnum.Active && (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href={getDetailsLink(character)}
                  className="ddb-campaigns-character-card-header-upper-details-link"
                  // There already is a view link - this is just making the top area clickable so it shouldn't be tabbed to or announced
                  tabIndex={-1}
                  aria-hidden={true}
                />
              )}
            <div className="ddb-campaigns-character-card-header-upper-portrait">
              {getAvatarUrl(character) ? (
                <div
                  className="image user-selected-avatar"
                  style={{
                    backgroundImage: `url(${getAvatarUrl(character)})`,
                  }}
                />
              ) : (
                <div className="image default-character-avatar" />
              )}
            </div>
            <div className="ddb-campaigns-character-card-header-upper-character-info">
              <h2 className={styles.name}>{getName(character)}</h2>
              <div className="ddb-campaigns-character-card-header-upper-character-info-secondary">
                {getSecondaryInfo(character)}
              </div>
            </div>
          </div>
        </div>
        {hasLockedCharacters && (
          <Button
            className={clsx([styles.cornerButton, isLocked && styles.locked])}
            color="primary"
            aria-label={isLocked ? "Click to unlock" : "Click to lock"}
            onClick={handleToggleLock}
            disabled={isLocked && !canUnlockMore}
          >
            {isLocked ? (
              <Lock className={styles.lockIcon} />
            ) : (
              <Check className={styles.checkIcon} />
            )}
          </Button>
        )}
        {isInCampaign(character) && (
          <div className="ddb-campaigns-character-card-campaign-links">
            <div className="ddb-campaigns-character-card-campaign-links-campaign">
              <strong>Campaign:</strong>{" "}
              {!hasLockedCharacters ? (
                <a
                  className="ddb-campaigns-character-card-campaign-links-campaign-link"
                  href={getCampaignDetailsLink(character)}
                  onClick={() => logCharacterCampaignClicked()}
                >
                  {getCampaignName(character)}
                </a>
              ) : (
                <span>{getCampaignName(character)}</span>
              )}
              {!getIsAssigned(character) && " (Unassigned)"}
            </div>
            <div className="ddb-campaigns-character-card-campaign-links-actions">
              {!hasLockedCharacters && (
                <LeaveCampaignButton
                  character={character}
                  leaveCampaign={() => leaveCampaign(character)}
                />
              )}
            </div>
          </div>
        )}
        <div className="ddb-campaigns-character-card-footer">
          <div
            className={[
              "ddb-campaigns-character-card-footer-links",
              hasLockedCharacters && "is-unlocking",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <CharacterCardLinks
              character={character}
              hasLockedCharacters={hasLockedCharacters}
              overCharacterLimit={overCharacterLimit}
              copyCharacter={() => copyCharacter(character)}
              deleteCharacter={() => deleteCharacter(character)}
              lockCharacter={lockCharacter}
              unlockCharacter={unlockCharacter}
              canUnlockMore={canUnlockMore}
              maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
              activateCharacter={() => activateCharacter(character)}
              currentCharacterCount={currentCharacterCount}
            />
          </div>
          <ApiStatusIndicator
            isLoading={isCopyingCharacter}
            error={errorCopyingCharacter}
            loadingMessage={`Copying ${getName(character)}`}
            errorMessage={`Error copying ${getName(character)}`}
          />
          <ApiStatusIndicator
            isLoading={isDeletingCharacter}
            error={errorDeletingCharacter}
            loadingMessage={`Deleting ${getName(character)}`}
            errorMessage={`Error deleting ${getName(character)}`}
          />
          <ApiStatusIndicator
            isLoading={isActivatingCharacter}
            error={errorActivatingCharacter}
            loadingMessage={`Activating ${getName(character)}`}
            errorMessage={`Error activating ${getName(character)}`}
          />
          <ApiStatusIndicator
            isLoading={isLeavingCampaign}
            error={errorLeavingCampaign}
            loadingMessage={`Leaving ${getCampaignName(character)}`}
            errorMessage={`Error leaving ${getCampaignName(character)}`}
          />
        </div>
      </div>
    </li>
  );
};
