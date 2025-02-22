import { useState } from "react";

import { Button } from "@dndbeyond/ttui/components/Button";

import {
  logCharacterDeleteCancelled,
  logCharacterDeleteClicked,
  logCharacterDeleteConfirmed,
} from "../../../../../helpers/analytics";
import { getName } from "../../../../../state/selectors/characterUtils";
import { CharacterData } from "../../../../../types";
import { ConfirmationModal } from "../../ConfirmationModal";

interface DeleteButtonProps {
  character: CharacterData;
  deleteCharacter: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  character,
  deleteCharacter,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => {
          logCharacterDeleteCancelled();
          setIsOpen(false);
        }}
        onConfirm={() => {
          deleteCharacter();
          logCharacterDeleteConfirmed();
          setIsOpen(false);
        }}
        message={`To delete ${getName(
          character
        )}, type the word DELETE into the field below.`}
        title="Delete this character?"
        typeValueToConfirm="delete"
        confirmText="Delete"
      />
      <Button
        size="small"
        variant="text"
        color="error"
        onClick={() => {
          logCharacterDeleteClicked();
          setIsOpen(true);
        }}
      >
        Delete
      </Button>
    </div>
  );
};
