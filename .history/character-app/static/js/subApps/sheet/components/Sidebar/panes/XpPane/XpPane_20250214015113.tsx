import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { characterActions } from "@dndbeyond/character-rules-engine/es";

import { Button } from "~/components/Button";
import { XpManager } from "~/components/XpManager";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { toastMessageActions } from "~/tools/js/Shared/actions";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const XpPane: FC<Props> = ({ ...props }) => {
  const dispatch = useDispatch();
  const [newXpTotal, setNewXpTotal] = useState<number | null>(null);
  const [shouldReset, setShouldReset] = useState<boolean>(false);

  useEffect(() => {
    setShouldReset(newXpTotal === null);
  }, [newXpTotal]);

  const handleReset = (): void => {
    setNewXpTotal(null);
  };

  const handleSave = (): void => {
    if (newXpTotal !== null) {
      setNewXpTotal(null);

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

  return (
    <div {...props}>
      <Header>Manage XP</Header>
      <XpManager handleXpUpdates={handleXpUpdates} shouldReset={shouldReset} />
      {newXpTotal !== null && (
        <div className={styles.buttonGroup}>
          <Button themed variant="solid" size="x-small" onClick={handleSave}>
            Apply Changes
          </Button>
          <Button themed onClick={handleReset} size="x-small" variant="outline">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
