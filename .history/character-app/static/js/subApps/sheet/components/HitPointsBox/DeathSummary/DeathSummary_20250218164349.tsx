import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

import { Constants } from "../../character-rules-engine";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const DeathSummary: FC<Props> = ({ className, onClick, ...props }) => {
  const { deathSaveInfo, ruleData, ruleDataUtils, deathCause, characterTheme } =
    useCharacterEngine();

  const renderDeathSavesSummaryMarkGroup = (
    key: string,
    label: string,
    activeCount: number,
    totalCount: number,
    isDarkMode: boolean
  ): React.ReactNode => {
    let marks: Array<React.ReactNode> = [];
    for (let i = 0; i < totalCount; i++) {
      marks.push(
        <span
          key={`${key}-${i}`}
          className={clsx([
            styles.mark,
            i < activeCount ? styles[`activeMark-${key}`] : styles.inactiveMark,
            isDarkMode &&
              i < activeCount &&
              styles[`activeMarkDarkMode-${key}`],
          ])}
        />
      );
    }

    return (
      <div className={styles.group}>
        <h2 className={styles.label}>{label}</h2>
        <span className={styles.marks}>{marks}</span>
      </div>
    );
  };

  return (
    <>
      {/* If the death cause is exhaustion, render the exhaustion summary. Otherwise, render the death saves summary. */}
      {deathCause === Constants.DeathCauseEnum.CONDITION ? (
        <div
          className={clsx([styles.container, className])}
          onClick={onClick}
          {...props}
        >
          <div className={styles.exhaustion}>
            <div
              className={clsx([
                styles.icon,
                characterTheme.isDarkMode && styles.iconDarkMode,
              ])}
            />
            <h2 className={clsx([styles.label, styles.exhaustionLabel])}>
              Exhaustion Level 6
            </h2>
          </div>
          <h1 className={styles.deathLabel}>Death</h1>
        </div>
      ) : (
        <div
          className={clsx([styles.container, className])}
          onClick={onClick}
          {...props}
        >
          <div className={styles.deathSaves}>
            <div
              className={clsx([
                styles.icon,
                characterTheme.isDarkMode && styles.iconDarkMode,
              ])}
            />
            <div className={styles.markGroupsContainer}>
              {renderDeathSavesSummaryMarkGroup(
                "fail",
                "Failure",
                deathSaveInfo.failCount,
                ruleDataUtils.getMaxDeathsavesFail(ruleData),
                characterTheme.isDarkMode
              )}
              {renderDeathSavesSummaryMarkGroup(
                "success",
                "Success",
                deathSaveInfo.successCount,
                ruleDataUtils.getMaxDeathsavesSuccess(ruleData),
                characterTheme.isDarkMode
              )}
            </div>
          </div>
          <h1 className={styles.deathLabel}>Death Saves</h1>
        </div>
      )}
    </>
  );
};
