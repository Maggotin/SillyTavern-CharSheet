import { Button } from "../../ttui/components/Button";

import { CharacterStatusEnum } from "~/types";

import {
  logCharacterEditClicked,
  logCharacterViewClicked,
  logUnlockCharacterLocked,
  logUnlockCharacterUnlocked,
} from "../../../../../helpers/analytics";
import {
  getDetailsLink,
  getEditLink,
  getStatus,
} from "../../../../../state/selectors/characterUtils";
import { ActivateButton } from "../ActivateButton";
import type { CharacterCardProps } from "../CharacterCard";
import { CopyButton } from "../CopyButton";
import { DeleteButton } from "../DeleteButton";
import styles from "./styles.module.css";

interface CharacterCardLinksProps
  extends Omit<CharacterCardProps, "reloadListing"> {
  copyCharacter: () => void;
  deleteCharacter: () => void;
  activateCharacter: () => void;
}

export const CharacterCardLinks: React.FC<CharacterCardLinksProps> = ({
  character,
  hasLockedCharacters,
  overCharacterLimit,
  copyCharacter,
  deleteCharacter,
  lockCharacter,
  unlockCharacter,
  canUnlockMore,
  maxCharacterSlotsAllowed,
  activateCharacter,
  currentCharacterCount,
}) => {
  const isLocked = getStatus(character) === CharacterStatusEnum.Locked;
  const showActivateButton =
    maxCharacterSlotsAllowed === null ||
    currentCharacterCount < maxCharacterSlotsAllowed;

  const handleToggleLock = () => {
    if (isLocked) {
      unlockCharacter(character);
      logUnlockCharacterUnlocked();
    } else {
      lockCharacter(character);
      logUnlockCharacterLocked();
    }
  };

  if (hasLockedCharacters)
    return (
      <>
        <Button
          size="small"
          variant={isLocked ? "outline" : "solid"}
          onClick={handleToggleLock}
          disabled={isLocked && !canUnlockMore}
          title={
            isLocked && !canUnlockMore
              ? "Max characters selected to unlock. Lock other characters to unlock this character."
              : undefined
          }
        >
          {isLocked ? "Select" : "Deselect"}
        </Button>
        <p className={styles.text}>
          {isLocked
            ? "This Character will be deactivated."
            : "This Character will be activated."}
        </p>
      </>
    );

  return (
    <>
      {!isLocked && (
        <>
          <Button
            size="small"
            variant="text"
            href={getDetailsLink(character)}
            onClick={() => logCharacterViewClicked()}
          >
            View
          </Button>
          <Button
            size="small"
            variant="text"
            href={getEditLink(character)}
            onClick={() => logCharacterEditClicked()}
          >
            Edit
          </Button>
          {!overCharacterLimit && (
            <CopyButton character={character} copyCharacter={copyCharacter} />
          )}
        </>
      )}
      {isLocked && showActivateButton && (
        <ActivateButton
          character={character}
          activateCharacter={activateCharacter}
          maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
        />
      )}
      <DeleteButton character={character} deleteCharacter={deleteCharacter} />
    </>
  );
};
