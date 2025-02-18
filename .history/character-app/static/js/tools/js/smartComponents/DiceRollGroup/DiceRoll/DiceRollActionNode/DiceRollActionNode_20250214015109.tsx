import React from "react";

import { HtmlSelectOption } from "@dndbeyond/character-rules-engine/es";

import { DataLoadingStatusEnum } from "../../../componentConstants";
import { Button } from "../../../legacy/Button";
import { Select } from "../../../legacy/Select";

export interface DiceRollActionNodeProps {
  rollKey: string;
  rollStatus: DataLoadingStatusEnum;
  rollTotal: number | null;
  assignedValue: string | null;
  options?: Array<HtmlSelectOption>;
  rollButtonText?: string;
  selectPlaceholderText?: string;
  onRoll: () => void;
  onChange?: (newValue: string | null) => void;
}
const DiceRollActionNode: React.FunctionComponent<DiceRollActionNodeProps> = ({
  rollKey,
  rollStatus,
  rollTotal,
  assignedValue,
  options,
  onRoll,
  onChange,
  rollButtonText = "Roll",
  selectPlaceholderText = "--",
}) => {
  if (options?.length && rollTotal !== null) {
    return (
      <Select
        id={rollKey}
        value={assignedValue}
        options={options}
        placeholder={selectPlaceholderText}
        onChange={onChange}
      />
    );
  }

  return (
    <Button
      size="large"
      // style='outline'
      onClick={onRoll}
    >
      {rollButtonText}
    </Button>
  );
};
export default React.memo(DiceRollActionNode);
