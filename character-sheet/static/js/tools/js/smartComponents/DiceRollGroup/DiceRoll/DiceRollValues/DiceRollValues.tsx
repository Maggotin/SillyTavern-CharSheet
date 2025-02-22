import { orderBy } from "lodash";
import React from "react";

import {
  RollValueContract,
  Constants,
} from "@dndbeyond/character-rules-engine/es";

//eventually use RollValueContract.dieType to display dice svgs
export interface DiceRollValuesProps {
  rollValues: Array<RollValueContract>;
}
const DiceRollValues: React.FunctionComponent<DiceRollValuesProps> = ({
  rollValues,
}) => {
  if (rollValues.length === 0) {
    return null;
  }

  const keptDiceValues = rollValues.filter(
    (valueContract) =>
      valueContract.excludeType === Constants.DiceRollExcludeTypeEnum.ALL
  );
  const discardedValues = rollValues.filter(
    (valueContract) =>
      valueContract.excludeType === Constants.DiceRollExcludeTypeEnum.NONE
  );

  const orderedKeptDiceValues = orderBy(
    keptDiceValues,
    (valueContract) => valueContract.value,
    "desc"
  );
  const orderedDiscardedValues = orderBy(
    discardedValues,
    (valueContract) => valueContract.value,
    "desc"
  );

  const classNames: Array<string> = ["ddbc-dice-roll__dice-value"];

  return (
    <React.Fragment>
      {orderedKeptDiceValues.map((rollValue: RollValueContract, idx) => {
        return (
          <div key={idx} className={classNames.join(" ")}>
            {rollValue.value}
          </div>
        );
      })}
      {orderedDiscardedValues.map((rollValue: RollValueContract, idx) => {
        classNames.push("ddbc-dice-roll__dice-value--discarded");

        return (
          <div key={idx} className={classNames.join(" ")}>
            {rollValue.value}
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default React.memo(DiceRollValues);
