import { useState } from "react";

import {
  logCharacterLeaveCampaignCancelled,
  logCharacterLeaveCampaignClicked,
  logCharacterLeaveCampaignConfirmed,
} from "../../../../../helpers/analytics";
import {
  getCampaignName,
  getName,
} from "../../../../../state/selectors/characterUtils";
import { CharacterData } from "../../../../../types";
import { ConfirmationModal } from "../../ConfirmationModal";
import styles from "./styles.module.css";

interface LeaveCampaignProps {
  character: CharacterData;
  leaveCampaign: () => void;
}

export const LeaveCampaignButton: React.FC<LeaveCampaignProps> = ({
  character,
  leaveCampaign,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => {
          logCharacterLeaveCampaignCancelled();
          setIsOpen(false);
        }}
        onConfirm={() => {
          leaveCampaign();
          logCharacterLeaveCampaignConfirmed();
          setIsOpen(false);
        }}
        message={`Are you sure you want ${getName(
          character
        )} to leave ${getCampaignName(character)}?`}
        title="Leave this Campaign?"
        confirmText="Leave"
      />
      <button
        className={styles.button}
        onClick={() => {
          logCharacterLeaveCampaignClicked();
          setIsOpen(true);
        }}
      >
        Leave Campaign
      </button>
    </div>
  );
};
