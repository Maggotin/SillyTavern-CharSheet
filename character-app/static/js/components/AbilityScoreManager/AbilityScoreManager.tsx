import clsx from "clsx";
import { HTMLAttributes, ReactNode, useState } from "react";

import {
  AbilityManager,
  AbilityScoreSupplierData,
  DataOrigin,
  DataOriginUtils,
  HelperUtils,
} from "@dndbeyond/character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";
import { useSidebar } from "~/contexts/Sidebar";
import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { getDataOriginComponentInfo } from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";
import DataOriginName from "~/tools/js/smartComponents/DataOriginName";
import { AbilityIcon } from "~/tools/js/smartComponents/Icons";

import styles from "./styles.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  ability: AbilityManager;
  showHeader?: boolean;
  isReadonly: boolean;
  isBuilder?: boolean;
}

export function AbilityScoreManager({
  ability,
  isReadonly,
  showHeader = true,
  className = "",
  isBuilder = false,
  ...props
}: Props) {
  const { characterTheme: theme, originRef } = useCharacterEngine();
  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  const [overrideScore, setOverrideScore] = useState(
    ability.getOverrideScore()
  );
  const [otherBonus, setOtherBonus] = useState(ability.getOtherBonus());

  const handleOtherBonusBlur = (
    evt: React.FocusEvent<HTMLInputElement>
  ): void => {
    let value: number | null = HelperUtils.parseInputInt(evt.target.value);
    setOtherBonus(ability.handleOtherBonusChange(value));
  };

  const handleOverrideScoreBlur = (
    evt: React.FocusEvent<HTMLInputElement>
  ): void => {
    const value: number | null = HelperUtils.parseInputInt(evt.target.value);
    setOverrideScore(ability.handleOverrideScoreChange(value));
  };

  const handleOtherBonusChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOtherBonus(HelperUtils.parseInputInt(evt.target.value));
  };

  const handleOverrideScoreChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOverrideScore(HelperUtils.parseInputInt(evt.target.value));
  };

  const handleDataOriginClick = (dataOrigin: DataOrigin) => {
    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  const label = ability.getLabel();
  const modifier = ability.getModifier();
  const baseScore = ability.getBaseScore();
  const statId = ability.getId();
  const totalScore = ability.getTotalScore();
  const speciesBonus = ability.getRacialBonus();
  const classBonuses = ability.getClassBonuses();
  const miscBonus = ability.getMiscBonus();
  const stackingBonus = ability.getStackingBonus();
  const setScore = ability.getSetScore();

  const allStatsBonusSuppliers = ability.getAllStatBonusSuppliers();
  const statSetScoreSuppliers = ability.getStatSetScoreSuppliers();
  const stackingBonusSuppliers = ability.getStackingBonusSuppliers();

  const getSupplierData = (
    suppliers: Array<AbilityScoreSupplierData>
  ): ReactNode => {
    return (
      <div className={styles.suppliers}>
        {suppliers.map((supplier) => {
          const origin = supplier.dataOrigin;
          let expandedOrigin: DataOrigin | null = null;

          if (supplier.expandedOriginRef) {
            const primaryOrigin = DataOriginUtils.getRefPrimary(
              supplier.expandedOriginRef,
              originRef
            );

            if (primaryOrigin && primaryOrigin["componentId"] !== null) {
              expandedOrigin = primaryOrigin["dataOrigin"];
            }
          }
          return (
            <div
              className={clsx(styles.supplier, isBuilder && styles.builder)}
              key={supplier.key}
            >
              <div className={styles.label}>
                <DataOriginName
                  className={isBuilder ? styles.builder : ""}
                  dataOrigin={origin}
                  tryParent
                  theme={theme}
                  onClick={!isBuilder ? handleDataOriginClick : undefined}
                />
                {expandedOrigin && (
                  <span>
                    {" "}
                    (
                    <DataOriginName
                      className={isBuilder ? styles.builder : ""}
                      dataOrigin={expandedOrigin}
                      tryParent
                      theme={theme}
                      onClick={!isBuilder ? handleDataOriginClick : undefined}
                    />
                    )
                  </span>
                )}
              </div>
              <div className={styles.value}>
                (
                {supplier.type === "set" ? (
                  supplier.value
                ) : (
                  <NumberDisplay
                    className={styles.number}
                    type="signed"
                    number={supplier.value}
                  />
                )}
                )
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div {...props}>
      {showHeader && (
        <div className={styles.header}>
          <AbilityIcon
            statId={statId}
            themeMode="light"
            className={styles.icon}
          />
          <div className={styles.name}>{label}</div>
        </div>
      )}
      <div className={styles.table}>
        <div className={clsx([styles.row, isBuilder && styles.highlight])}>
          <div className={styles.label}>Total Score</div>
          <div className={styles.value}>
            {totalScore === null ? "--" : totalScore}
          </div>
        </div>
        <div className={clsx([styles.row, isBuilder && styles.highlight])}>
          <div className={styles.label}>Modifier</div>
          <div className={styles.value}>
            <NumberDisplay type="signed" number={modifier} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Base Score</div>
          <div className={styles.value}>
            {baseScore === null ? "--" : baseScore}
          </div>
        </div>
        <div
          className={clsx(
            styles.row,
            allStatsBonusSuppliers.length > 0 && styles.hasSuppliers
          )}
        >
          <div className={styles.label}>
            <div>Bonus</div>
          </div>
          <div className={styles.value}>
            <NumberDisplay
              type="signed"
              number={classBonuses + speciesBonus + miscBonus}
            />
          </div>
        </div>
        {getSupplierData(allStatsBonusSuppliers)}

        <div
          className={clsx(
            styles.row,
            statSetScoreSuppliers.length > 0 && styles.hasSuppliers
          )}
        >
          <div className={styles.label}>
            <div>Set Score</div>
          </div>
          <div className={styles.value}>{setScore}</div>
        </div>
        {getSupplierData(statSetScoreSuppliers)}

        <div
          className={clsx(
            styles.row,
            stackingBonusSuppliers.length > 0 && styles.hasSuppliers
          )}
        >
          <div className={styles.label}>
            <div>Stacking Bonus</div>
          </div>
          <div className={styles.value}>
            <NumberDisplay type="signed" number={stackingBonus} />
          </div>
        </div>
        {getSupplierData(stackingBonusSuppliers)}
      </div>

      <div className={styles.overrides}>
        <div className={styles.override}>
          <div className={styles.label}>Other Modifier</div>
          <div className={styles.value}>
            <input
              type="number"
              value={otherBonus === null ? "" : otherBonus}
              placeholder="--"
              onChange={handleOtherBonusChange}
              onBlur={handleOtherBonusBlur}
              readOnly={isReadonly}
            />
          </div>
        </div>
        <div className={styles.override}>
          <div className={styles.label}>Override Score</div>
          <div className={styles.value}>
            <input
              type="number"
              value={overrideScore === null ? "" : overrideScore}
              placeholder="--"
              onChange={handleOverrideScoreChange}
              onBlur={handleOverrideScoreBlur}
              readOnly={isReadonly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
