import React, { useCallback, useMemo } from "react";

import {
  HelperUtils,
  HtmlSelectOption,
  RollResultContract,
  RollValueContract,
} from "../../character-rules-engine/es";
import { Dice, RollRequest } from "../../dice";

import { DataLoadingStatusEnum } from "../componentConstants";
import { Button, RemoveButton } from "../legacy";
import { TypeScriptUtils, DiceComponentUtils } from "../utils";
import { DiceRoll, DiceRollProps } from "./DiceRoll";

export interface DiceRollGroupProps {
  className: string;
  componentKey: string;
  diceRolls: Array<RollResultContract>;
  exclusiveOptions?: boolean;
  confirmButtonText?: string;
  onConfirm?: (
    groupKey: string,
    rollResults: Array<RollResultContract>
  ) => void;
  onUpdateGroup?: (
    groupKey: string,
    rollResults: Array<RollResultContract>
  ) => void;
  onRollError?: (errorMessage: string) => void;
  groupKey: string;
  nextGroupKey: string | null;
  showRemoveButton?: boolean;
  onRemoveGroup?: (groupKey: string, nextGroupKey: string | null) => void;
  onResetGroup?: (
    groupKey: string,
    rollResults: Array<RollResultContract>
  ) => void;
  onUpdateDiceRoll: (
    rollKey: string,
    properties: Omit<Partial<RollResultContract>, "rollKey">,
    nextRollKey: string | null
  ) => void;
  onSetRollStatus: (rollKey: string, status: DataLoadingStatusEnum) => void;
  rollStatusLookup: Record<string, DataLoadingStatusEnum>;
  options?: DiceRollProps["options"];
  diceRollRequest:
    | DiceRollProps["diceRollRequest"]
    | Array<DiceRollProps["diceRollRequest"]>;
}
const DiceRollGroup: React.FunctionComponent<DiceRollGroupProps> = ({
  className = "",
  componentKey,
  diceRolls,
  options,
  confirmButtonText = "Confirm",
  showRemoveButton = false,
  exclusiveOptions = false,
  diceRollRequest,
  groupKey,
  nextGroupKey,
  onUpdateGroup,
  onRemoveGroup,
  onRollError,
  onConfirm,
  onResetGroup,
  onSetRollStatus,
  onUpdateDiceRoll,
  rollStatusLookup,
}) => {
  const classNames = useMemo<Array<string>>(
    () => ["ddbc-dice-roll-group", className],
    [className]
  );

  const areRollsEmpty = useMemo<boolean>(
    () => !diceRolls.some((roll) => roll.rollTotal !== null),
    [diceRolls]
  );

  const areScoresUnassigned = useMemo<boolean>(
    () =>
      !diceRolls.some(
        (roll) => roll.assignedValue !== null && roll.assignedValue !== ""
      ),
    [diceRolls]
  );

  const assignedValues = useMemo<Array<string>>(() => {
    return diceRolls
      .map((roll) => roll.assignedValue)
      .filter(TypeScriptUtils.isNotNullOrUndefined);
  }, [diceRolls]);

  const generatedOptions = useMemo<Array<Array<HtmlSelectOption>>>(() => {
    if (!options) {
      return [];
    }

    return diceRolls.map((roll): Array<HtmlSelectOption> => {
      if (!exclusiveOptions) {
        return options;
      }

      return options.filter(
        (option) =>
          roll.assignedValue === option.value ||
          !assignedValues.includes(option.value.toString())
      );
    });
  }, [options, diceRolls, exclusiveOptions, assignedValues]);

  const generatedRollRequests = useMemo<Array<RollRequest>>(() => {
    let requests: Array<RollRequest> = [];
    for (let i = 0; i < diceRolls.length; i++) {
      if (!Array.isArray(diceRollRequest)) {
        requests.push(diceRollRequest);
      } else {
        if (diceRollRequest[i]) {
          requests.push(diceRollRequest[i]);
        } else {
          requests.push(diceRollRequest[0]);
        }
      }
    }

    return requests;
  }, [diceRollRequest, diceRolls]);

  const handleRoll = useCallback(
    (
      rollKey: string,
      diceRollRequest: RollRequest,
      nextRollKey: string | null
    ): void => {
      onSetRollStatus(rollKey, DataLoadingStatusEnum.LOADING);

      Dice.roll(diceRollRequest)
        .then((result) => {
          //RollResult | undefined - RollResult is not exported from Dice;
          //  only expect to have one single rollRequest.
          const rollResult = result.rolls[0].result ?? null;

          if (!rollResult) {
            throw new Error("error in rollResult");
          }

          const rollValues =
            DiceComponentUtils.generateRollValueContracts(result);

          if (!rollValues) {
            throw new Error("error in rollResult values");
          }

          //update status
          onSetRollStatus(rollKey, DataLoadingStatusEnum.LOADED);

          //update diceRoll
          onUpdateDiceRoll(
            rollKey,
            { rollValues, rollTotal: rollResult.total },
            nextRollKey
          );
        })
        .catch((error: Error) => {
          //this could handle different errors types from dice package or thrown errors from result

          onSetRollStatus(rollKey, DataLoadingStatusEnum.NOT_LOADED);

          if (onRollError) {
            onRollError(error.message);
          }
          console.log("roll error", error);
        });
    },
    []
  );

  const handleChange = useCallback(
    (
      rollKey: string,
      newValue: string | null,
      prevValue: string | null,
      nextRollKey: string | null,
      rollTotal: number | null,
      rollValues: Array<RollValueContract>
    ): void => {
      if (newValue === prevValue) {
        return;
      }

      onUpdateDiceRoll(
        rollKey,
        { assignedValue: newValue, rollTotal, rollValues },
        nextRollKey
      );
    },
    []
  );

  const handleConfirm = useCallback((): void => {
    if (onConfirm) {
      return onConfirm(groupKey, diceRolls);
    }
  }, [onConfirm, groupKey, diceRolls]);

  const handleResetGroup = useCallback((): void => {
    if (onResetGroup) {
      onResetGroup(groupKey, diceRolls);
    }

    diceRolls.forEach((roll) => {
      onSetRollStatus(roll.rollKey, DataLoadingStatusEnum.NOT_INITIALIZED);
    });
  }, [onResetGroup, groupKey]);

  const handleRemoveGroup = useCallback((): void => {
    if (onRemoveGroup) {
      onRemoveGroup(groupKey, nextGroupKey);
    }
  }, [onRemoveGroup, groupKey, nextGroupKey]);

  return (
    <div className={classNames.join(" ")}>
      <div className="ddbc-dice-roll-group__actions">
        {showRemoveButton && (
          <RemoveButton
            size="small"
            onClick={handleRemoveGroup}
            enableConfirm={true}
          >
            Delete group
          </RemoveButton>
        )}
      </div>
      <div className="ddbc-dice-roll-group__rolls">
        {diceRolls.map((diceRoll, idx) => {
          const diceRollRequest = generatedRollRequests[idx];
          if (!diceRollRequest) {
            return null;
          }
          const rollStatus = HelperUtils.lookupDataOrFallback(
            rollStatusLookup,
            diceRoll.rollKey,
            DataLoadingStatusEnum.NOT_INITIALIZED
          );

          return (
            <DiceRoll
              key={diceRoll.rollKey}
              rollKey={diceRoll.rollKey}
              nextRollKey={diceRoll.nextRollKey}
              rollTotal={diceRoll.rollTotal}
              rollValues={diceRoll.rollValues}
              assignedValue={diceRoll.assignedValue}
              options={generatedOptions[idx]}
              onChange={handleChange}
              onRoll={handleRoll}
              diceRollRequest={diceRollRequest}
              rollStatus={rollStatus}
            />
          );
        })}
      </div>
      <div className="ddbc-dice-roll-group__actions">
        <RemoveButton
          size="medium"
          style="filled"
          onClick={handleResetGroup}
          disabled={areRollsEmpty}
          enableConfirm={true}
        >
          Reset Group
        </RemoveButton>
        {onConfirm && (
          <Button
            size="medium"
            onClick={handleConfirm}
            disabled={areScoresUnassigned}
          >
            {confirmButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(DiceRollGroup);
