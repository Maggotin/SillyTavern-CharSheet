import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  characterActions,
  CharacterUtils,
  Constants,
} from "../../rules-engine/es";

import { Button } from "~/components/Button";
import { ConfirmModal } from "~/components/ConfirmModal";
import { XpManager } from "~/components/XpManager";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { toastMessageActions } from "~/tools/js/Shared/actions";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const ProgressionManager: FC<Props> = ({ ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newXpTotal, setNewXpTotal] = useState<number | null>(null);
  const [shouldReset, setShouldReset] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { currentXp, preferences, totalClassLevel, ruleData } =
    useCharacterEngine();

  useEffect(() => {
    setShouldReset(newXpTotal === null);
  }, [newXpTotal]);

  const handleManageXpClick = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setNewXpTotal(null);
    setIsModalOpen(false);
  };

  const onConfirm = (): void => {
    if (newXpTotal !== null) {
      closeModal();

      dispatch(characterActions.xpSet(newXpTotal));
      dispatch(
        toastMessageActions.toastSuccess(
          "Experience Points Updated",
          "You have successfully updated your XP"
        )
      );
    }
  };

  const handleXpUpdates = (newXpTotal: number): void => {
    setNewXpTotal(newXpTotal);
  };

  const levelDiff = useMemo(() => {
    const currentLevel = CharacterUtils.deriveXpLevel(currentXp, ruleData);
    return currentLevel - totalClassLevel;
  }, [currentXp, totalClassLevel]);

  return (
    <div className="progression-manager" {...props}>
      <div className="progression-manager-info">
        <div className="progression-manager-heading">
          Character Level: {totalClassLevel}
          {preferences.progressionType ===
            Constants.PreferenceProgressionTypeEnum.XP &&
            levelDiff !== 0 && (
              <span
                className={clsx([
                  "progression-manager-heading-diff",
                  levelDiff > 0 && "progression-manager-heading-diff-positive",
                  levelDiff < 0 && "progression-manager-heading-diff-negative",
                ])}
              >
                <span className="progression-manager-heading-diff-icon" />
                <span className="progression-manager-heading-diff-amount">
                  {Math.abs(levelDiff)}
                </span>
              </span>
            )}
        </div>
      </div>
      {preferences.progressionType ===
      Constants.PreferenceProgressionTypeEnum.MILESTONE ? (
        <div className="progression-manager-meta">Milestone Advancement</div>
      ) : (
        <div className="progression-manager-action">
          <Button
            color="info"
            variant="builder-text"
            size="x-small"
            onClick={handleManageXpClick}
          >
            Manage XP
          </Button>
        </div>
      )}
      <ConfirmModal
        open={isModalOpen}
        onClose={closeModal}
        onConfirm={onConfirm}
        heading="Manage XP"
        className={styles.xpManagerModal}
        confirmButtonText="Apply"
      >
        <XpManager
          handleXpUpdates={handleXpUpdates}
          shouldReset={shouldReset}
          className={styles.xpManager}
        />
      </ConfirmModal>
    </div>
  );
};
