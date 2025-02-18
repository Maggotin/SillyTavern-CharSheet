import React from "react";

import { RollGroupContract } from "../../rules-engine/es";

import { DiceRollGroup, DiceRollGroupProps } from "../DiceRollGroup";
import { Button } from "../legacy/Button";

export interface DiceRollGroupManagerProps {
  groups: Array<RollGroupContract>;
  showAddGroupButton?: boolean;
  onAddGroup?: () => void;
  componentKey: DiceRollGroupProps["componentKey"];
  options?: DiceRollGroupProps["options"];
  exclusiveOptions?: DiceRollGroupProps["exclusiveOptions"];
  diceRollRequest: DiceRollGroupProps["diceRollRequest"];
  onConfirm?: DiceRollGroupProps["onConfirm"];
  confirmButtonText?: DiceRollGroupProps["confirmButtonText"];
  onRollError?: DiceRollGroupProps["onRollError"];
  onRemoveGroup?: DiceRollGroupProps["onRemoveGroup"];
  onUpdateGroup?: DiceRollGroupProps["onUpdateGroup"];
  onResetGroup: DiceRollGroupProps["onResetGroup"];
  onSetRollStatus: DiceRollGroupProps["onSetRollStatus"];
  rollStatusLookup: DiceRollGroupProps["rollStatusLookup"];
  onUpdateDiceRoll: DiceRollGroupProps["onUpdateDiceRoll"];
}
const DiceRollGroupManager: React.FunctionComponent<
  DiceRollGroupManagerProps
> = ({
  componentKey,
  groups,
  options,
  diceRollRequest,
  onConfirm,
  confirmButtonText,
  onRollError,
  showAddGroupButton = false,
  onUpdateGroup,
  onResetGroup,
  onAddGroup,
  onRemoveGroup,
  exclusiveOptions,
  onSetRollStatus,
  rollStatusLookup,
  onUpdateDiceRoll,
}) => {
  return (
    <div className="ddbc-dice-roll-group-manager">
      <div className="ddbc-dice-roll-group-manager__actions">
        {showAddGroupButton && (
          <Button
            size="small"
            onClick={onAddGroup}
            disabled={groups.length >= 10}
          >
            +Add Group
          </Button>
        )}
        <span className="ddbc-dice-roll-group-manager__actions-label">{`Groups: ${groups.length}`}</span>
      </div>
      <div className="ddbc-dice-roll-group-manager__groups">
        {groups.map((group, idx) => {
          return (
            <DiceRollGroup
              className="ddbc-dice-roll-group-manager__group"
              key={group.groupKey}
              componentKey={componentKey}
              groupKey={group.groupKey}
              nextGroupKey={group.nextGroupKey}
              options={options}
              exclusiveOptions={exclusiveOptions}
              confirmButtonText={confirmButtonText}
              onConfirm={onConfirm}
              onUpdateGroup={onUpdateGroup}
              onRollError={onRollError}
              showRemoveButton={groups.length > 1}
              onRemoveGroup={onRemoveGroup}
              onResetGroup={onResetGroup}
              diceRollRequest={diceRollRequest}
              diceRolls={group.rollResults}
              onSetRollStatus={onSetRollStatus}
              rollStatusLookup={rollStatusLookup}
              onUpdateDiceRoll={onUpdateDiceRoll}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(DiceRollGroupManager);
