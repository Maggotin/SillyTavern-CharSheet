import { useState } from "react";

import { Button } from "../../ttui/components/Button";

import {
  logUnlockFinishUnlockingCancelled,
  logUnlockFinishUnlockingClicked,
  logUnlockFinishUnlockingConfirmed,
} from "../../../../../helpers/analytics";
import { CharacterData } from "../../../../../types";
import { ConfirmationModal } from "../../ConfirmationModal";
import { UnlockConfirmation } from "../UnlockConfirmation";
import styles from "./styles.module.css";

interface FinalizeUnlockProps {
  charactersToUnlock: Array<CharacterData>;
  maxCharacterSlotsAllowed: number | null;
  finalizeUnlock: () => void;
  disabled: boolean;
}

export const FinalizeUnlock: React.FC<FinalizeUnlockProps> = ({
  charactersToUnlock,
  finalizeUnlock,
  disabled,
  maxCharacterSlotsAllowed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const charactersToUnlockCount = charactersToUnlock.length;

  const handleClose = () => {
    logUnlockFinishUnlockingCancelled(
      charactersToUnlockCount,
      maxCharacterSlotsAllowed
    );
    setIsOpen(false);
  };

  const handleConfirm = () => {
    finalizeUnlock();
    logUnlockFinishUnlockingConfirmed(
      charactersToUnlockCount,
      maxCharacterSlotsAllowed
    );
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(true);
    logUnlockFinishUnlockingClicked(
      charactersToUnlockCount,
      maxCharacterSlotsAllowed
    );
  };

  return (
    <>
      <ConfirmationModal
        onClose={handleClose}
        isOpen={isOpen}
        onConfirm={handleConfirm}
        message={
          <UnlockConfirmation
            charactersToUnlock={charactersToUnlock}
            maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
            message={
              <p className={styles.text}>
                Other characters will remain deactivated until you free up a
                slot or add slots with a D&D Beyond subscription.
              </p>
            }
          />
        }
        title="Activate these characters?"
      />
      <Button size="large" disabled={disabled} onClick={handleClick}>
        Continue
      </Button>
    </>
  );
};
