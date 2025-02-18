import clsx from "clsx";
import { FC, HTMLAttributes, useEffect, useMemo, useState } from "react";

import {
  CharacterUtils,
  FormatUtils,
  HelperUtils,
  HtmlSelectOption,
  RuleDataUtils,
} from "../../character-rules-engine";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import XpBar from "~/tools/js/smartComponents/XpBar";
import { Select } from "~/tools/js/smartComponents/legacy";

import { Button } from "../Button";
import styles from "./styles.module.css";

const XP_CHANGE_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};

interface XpManagerProps extends HTMLAttributes<HTMLDivElement> {
  handleXpUpdates: (newXpTotal: number) => void;
  shouldReset: boolean;
}

export const XpManager: FC<XpManagerProps> = ({
  handleXpUpdates,
  shouldReset,
  ...props
}) => {
  const { experienceInfo: xpInfo, ruleData } = useCharacterEngine();

  const [xpNew, setXpNew] = useState<number | null>(null);
  const [xpChange, setXpChange] = useState<number | null>(null);
  const [levelChosen, setLevelChosen] = useState<number | null>(null);
  const [changeType, setChangeType] = useState<string>(XP_CHANGE_TYPE.ADD);
  const [newXpTotal, setNewXpTotal] = useState<number>(xpInfo.currentLevelXp);

  useEffect(() => {
    let xpDiff: number = xpChange ?? 0;
    if (changeType === XP_CHANGE_TYPE.REMOVE) {
      xpDiff *= -1;
    }

    let newXpTotal: number = xpInfo.currentLevelXp;
    if (xpDiff) {
      newXpTotal += xpDiff;
    } else if (levelChosen !== null) {
      newXpTotal = CharacterUtils.deriveCurrentLevelXp(levelChosen, ruleData);
    } else if (xpNew !== null) {
      newXpTotal = xpNew;
    }

    newXpTotal = Math.min(
      Math.max(0, newXpTotal),
      CharacterUtils.deriveMaxXp(ruleData)
    );

    setNewXpTotal((prev) => {
      if (newXpTotal !== prev) {
        handleXpUpdates(newXpTotal);
      }
      return newXpTotal;
    });
  }, [
    xpChange,
    changeType,
    levelChosen,
    xpNew,
    xpInfo,
    ruleData,
    handleXpUpdates,
  ]);

  useEffect(() => {
    if (shouldReset) {
      setXpNew(null);
      setXpChange(null);
      setLevelChosen(null);
      setChangeType(XP_CHANGE_TYPE.ADD);
      setNewXpTotal(xpInfo.currentLevelXp);
    }
  }, [shouldReset, xpInfo]);

  const levelOptions = useMemo(() => {
    let levelOptions: Array<HtmlSelectOption> = [];
    for (let i = 1; i <= RuleDataUtils.getMaxCharacterLevel(ruleData); i++) {
      levelOptions.push({
        label: `${i}`,
        value: i,
      });
    }

    return levelOptions;
  }, [ruleData]);

  const displayCurrentLevelXp = useMemo(() => {
    return xpInfo.currentLevel === ruleData.maxCharacterLevel
      ? CharacterUtils.deriveCurrentLevelXp(
          ruleData.maxCharacterLevel - 1,
          ruleData
        )
      : xpInfo.currentLevelXp;
  }, [xpInfo, ruleData]);

  const handleChooseLevel = (value: string): void => {
    setXpNew(null);
    setXpChange(null);
    setLevelChosen(HelperUtils.parseInputInt(value));
  };

  const handleXpChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setXpNew(null);
    setXpChange(HelperUtils.parseInputInt(evt.target.value));
    setLevelChosen(null);
  };

  const handleXpSet = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setXpNew(HelperUtils.parseInputInt(evt.target.value));
    setXpChange(null);
    setLevelChosen(null);
  };

  return (
    <div {...props}>
      <h2 className={styles.levelTotal}>
        Current XP Total:{" "}
        {FormatUtils.renderLocaleNumber(xpInfo.currentLevelXp)} (Level{" "}
        {xpInfo.currentLevel})
      </h2>
      <div className={styles.xpBar}>
        <XpBar
          xp={xpInfo.currentLevelXp}
          showCurrentMarker={true}
          ruleData={ruleData}
        />
      </div>
      <div className={styles.currentLevelAmounts}>
        <div>{FormatUtils.renderLocaleNumber(displayCurrentLevelXp)}</div>
        <div>{FormatUtils.renderLocaleNumber(xpInfo.nextLevelXp)}</div>
      </div>
      <div className={clsx([styles.controls, styles.withDivider])}>
        <div className={styles.control}>
          <label id="set-level" className={styles.label}>
            Set Level
          </label>
          <Select
            aria-labelledby="set-level"
            options={levelOptions}
            onChange={handleChooseLevel}
            value={levelChosen}
            placeholder={"--"}
          />
        </div>
        <div className={clsx([styles.control, styles.setXp])}>
          <label id="set-xp" className={styles.label}>
            Set XP
          </label>
          <input
            aria-labelledby="set-xp"
            type="number"
            value={xpNew === null ? "" : xpNew}
            onChange={handleXpSet}
          />
        </div>
        <div className={styles.adjustGroup}>
          <div className={styles.adjustTabs}>
            <Button
              variant="text"
              size="xx-small"
              className={clsx([
                styles.tab,
                changeType === XP_CHANGE_TYPE.ADD && styles.active,
              ])}
              onClick={() => setChangeType(XP_CHANGE_TYPE.ADD)}
            >
              Add Xp
            </Button>
            <Button
              variant="text"
              size="xx-small"
              className={clsx([
                styles.tab,
                changeType === XP_CHANGE_TYPE.REMOVE && styles.active,
              ])}
              onClick={() => setChangeType(XP_CHANGE_TYPE.REMOVE)}
            >
              Remove Xp
            </Button>
          </div>
          <input
            type="number"
            value={xpChange === null ? "" : xpChange}
            onChange={handleXpChange}
            placeholder="Type XP Value"
          />
        </div>
      </div>
      <h2 className={clsx([styles.levelTotal, styles.withDivider])}>
        New XP Total: {FormatUtils.renderLocaleNumber(newXpTotal)} (Level{" "}
        {CharacterUtils.deriveXpLevel(newXpTotal, ruleData)})
      </h2>
    </div>
  );
};
