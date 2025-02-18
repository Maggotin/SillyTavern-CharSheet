import { useState } from "react";

import { Button } from "../../ttui/components/Button";

import { CharacterData } from "~/types";

import { logUnlockCharacterUnlocked } from "../../../../../helpers/analytics";
import { UnlockConfirmation } from "../../CharacterGrid/UnlockConfirmation";
import { ConfirmationModal } from "../../ConfirmationModal";

interface ActivateButtonProps {
  character: CharacterData;
  activateCharacter: (character: CharacterData) => void;
  maxCharacterSlotsAllowed: number | null;
}

export const ActivateButton: React.FC<ActivateButtonProps> = ({
  character,
  activateCharacter,
  maxCharacterSlotsAllowed,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onConfirm={() => {
          activateCharacter(character);
          logUnlockCharacterUnlocked();
          setIsOpen(false);
        }}
        title="Activate these characters?"
        confirmText="Activate"
        message={
          <UnlockConfirmation
            charactersToUnlock={[character]}
            maxCharacterSlotsAllowed={maxCharacterSlotsAllowed}
          />
        }
      />
      <Button size="small" variant="text" onClick={() => setIsOpen(true)}>
        Activate
      </Button>
    </div>
  );
};
