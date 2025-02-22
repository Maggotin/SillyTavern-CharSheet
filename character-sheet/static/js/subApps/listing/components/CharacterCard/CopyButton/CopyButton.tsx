import { useState } from "react";

import { Button } from "@dndbeyond/ttui/components/Button";

import {
  logCharacterCopyCancelled,
  logCharacterCopyClicked,
  logCharacterCopyConfirmed,
} from "../../../../../helpers/analytics";
import { getName } from "../../../../../state/selectors/characterUtils";
import { CharacterData } from "../../../../../types";
import { ConfirmationModal } from "../../ConfirmationModal";

interface CopyProps {
  character: CharacterData;
  copyCharacter: () => void;
}

export const CopyButton: React.FC<CopyProps> = ({
  character,
  copyCharacter,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ConfirmationModal
        onClose={() => {
          setIsOpen(false);
          logCharacterCopyCancelled();
        }}
        isOpen={isOpen}
        onConfirm={() => {
          copyCharacter();
          logCharacterCopyConfirmed();
          setIsOpen(false);
        }}
        message={`Are you sure you want to copy ${getName(character)}?`}
        title="Copy this character?"
        confirmText="Copy"
      />
      <Button
        variant="text"
        size="small"
        onClick={() => {
          logCharacterCopyClicked();
          setIsOpen(true);
        }}
      >
        Copy
      </Button>
    </div>
  );
};
