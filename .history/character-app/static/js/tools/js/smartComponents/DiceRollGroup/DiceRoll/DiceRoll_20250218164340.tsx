import React, { useCallback } from "react";

import { RollRequest } from "../../dice";

import LoadingPlaceholder from "../../LoadingPlaceholder";
import { DataLoadingStatusEnum } from "../../componentConstants";
import {
  DiceRollActionNode,
  DiceRollActionNodeProps,
} from "./DiceRollActionNode";
import { DiceRollValues, DiceRollValuesProps } from "./DiceRollValues";

export interface DiceRollProps {
  rollKey: string;
  nextRollKey: string | null;
  rollTotal: number | null;
  diceRollRequest: RollRequest;
  onChange?: (
    key: string,
    newValue: string | null,
    prevValue: string | null,
    nextRollKey: string | null,
    rollTotal: number | null,
    rollValues: DiceRollValuesProps["rollValues"]
  ) => void;
  onRoll: (
    key: string,
    diceRollRequest: RollRequest,
    nextRollKey: string | null
  ) => void;
  rollValues: DiceRollValuesProps["rollValues"];
  rollStatus: DiceRollActionNodeProps["rollStatus"];
  options?: DiceRollActionNodeProps["options"];
  assignedValue: DiceRollActionNodeProps["assignedValue"];
  rollButtonText?: DiceRollActionNodeProps["rollButtonText"];
  selectPlaceholderText?: DiceRollActionNodeProps["selectPlaceholderText"];
}
const DiceRoll: React.FunctionComponent<DiceRollProps> = ({
  rollKey,
  nextRollKey,
  options,
  rollTotal,
  rollValues,
  assignedValue,
  diceRollRequest,
  onChange,
  onRoll,
  rollStatus,
  rollButtonText,
  selectPlaceholderText,
}) => {
  const handleChange = useCallback(
    (changedValue: string): void => {
      const prevValue = assignedValue;
      const newValue: string | null = changedValue ?? null;

      if (newValue !== prevValue) {
        if (onChange) {
          onChange(
            rollKey,
            newValue,
            prevValue,
            nextRollKey,
            rollTotal,
            rollValues
          );
        }
      }
    },
    [onChange, rollKey, assignedValue, nextRollKey, rollTotal, rollValues]
  );

  const handleRollClick = useCallback((): void => {
    onRoll(rollKey, diceRollRequest, nextRollKey);
  }, [onRoll, rollKey, diceRollRequest, nextRollKey]);

  let contentNode: React.ReactNode = null;
  switch (rollStatus) {
    case DataLoadingStatusEnum.LOADING:
      contentNode = <LoadingPlaceholder label="Rolling" />;
      break;

    default: {
      const diceTotalClassNames: Array<string> = ["ddbc-dice-roll__total"];
      if (rollTotal === null) {
        diceTotalClassNames.push("ddbc-dice-roll__total--empty");
      }

      contentNode = (
        <React.Fragment>
          <div className={diceTotalClassNames.join(" ")}>
            <label className="ddbc-dice-roll__total-label" htmlFor={rollKey}>
              {rollTotal ?? "--"}
            </label>
          </div>
          <div className="ddbc-dice-roll__dice">
            <DiceRollValues rollValues={rollValues} />
          </div>
          <DiceRollActionNode
            rollKey={rollKey}
            rollStatus={rollStatus}
            rollTotal={rollTotal}
            assignedValue={assignedValue}
            options={options}
            onRoll={handleRollClick}
            onChange={handleChange}
            rollButtonText={rollButtonText}
            selectPlaceholderText={selectPlaceholderText}
          />
        </React.Fragment>
      );
      break;
    }
  }

  return <div className="ddbc-dice-roll">{contentNode}</div>;
};

export default React.memo(DiceRoll);
