import clsx from "clsx";
import { FC, HTMLAttributes, useState } from "react";

import {
  ExclusiveCheckbox,
  TypeScriptUtils,
} from "@dndbeyond/character-components/es";

import { Button } from "~/components/Button";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { ShortModelInfoContract } from "~/types";

import { Heading } from "../../../components/Heading";
import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  onSave?: (restoreType: ShortModelInfoContract) => void;
}

export const RestoreLifeManager: FC<Props> = ({
  onSave,
  className,
  ...props
}) => {
  const { characterTheme, ruleData, ruleDataUtils } = useCharacterEngine();

  const [activeChoice, setActiveChoice] = useState<number | null>(null);

  const onClickRestore = () => {
    if (onSave && activeChoice !== null) {
      let restoreTypes = ruleDataUtils.getRestoreTypes(ruleData);
      onSave(restoreTypes[activeChoice]);
    }
  };

  const onClickReset = () => {
    setActiveChoice(null);
  };

  const onSelection = (slotIdx: number) => {
    setActiveChoice(slotIdx);
  };

  const renderRestoreLifeChoices = (): React.ReactNode => {
    const restoreLifeChoices: Array<string> = ruleDataUtils
      .getRestoreTypes(ruleData)
      .map((type) => type.description)
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    return (
      <ExclusiveCheckbox
        theme={characterTheme}
        choices={restoreLifeChoices}
        activeChoice={activeChoice}
        onSelection={onSelection}
      />
    );
  };

  const renderActions = (): React.ReactNode => {
    if (activeChoice === null) {
      return null;
    }

    return (
      <div className={styles.actions}>
        <Button onClick={onClickRestore} themed size="xx-small">
          Restore Life
        </Button>
        <Button onClick={onClickReset} themed size="xx-small" variant="outline">
          Reset
        </Button>
      </div>
    );
  };

  return (
    <div className={clsx([className])} {...props}>
      <Heading className={styles.heading}>Restore Life</Heading>
      {renderRestoreLifeChoices()}
      {renderActions()}
    </div>
  );
};
