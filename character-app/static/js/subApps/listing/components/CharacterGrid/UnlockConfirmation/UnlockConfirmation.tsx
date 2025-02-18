import { LabelChip } from "@dndbeyond/ttui/components/LabelChip";

import { getName } from "../../../../../state/selectors/characterUtils";
import { CharacterData } from "../../../../../types";
import styles from "./styles.module.css";

export interface UnlockConfirmationProps {
  charactersToUnlock: Array<CharacterData>;
  maxCharacterSlotsAllowed: number | null;
  message?: React.ReactNode;
}

export const UnlockConfirmation: React.FC<UnlockConfirmationProps> = ({
  charactersToUnlock,
  maxCharacterSlotsAllowed,
  message = null,
}) => {
  // TODO: Character Slots update copy
  if (charactersToUnlock.length === 0)
    return (
      <p className={styles.unlockText}>
        Are you sure you want to unlock no characters? All of your characters
        will be permanently locked until a new subscription is applied to your
        account, but you will be able to create and access up to{" "}
        {maxCharacterSlotsAllowed} new characters. Locked characters do not
        count towards your character limit.
      </p>
    );

  return (
    <div className={styles.pills}>
      {charactersToUnlock.map(getName).map((characterName) => (
        <LabelChip className={styles.pill} key={characterName}>
          {characterName}
        </LabelChip>
      ))}
      {message && message}
    </div>
  );
};
