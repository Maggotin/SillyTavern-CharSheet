import React from "react";

import {
  CharacterTheme,
  Condition,
  ConditionContract,
  ConditionUtils,
} from "../../rules-engine/es";

import ConditionManagePaneSpecialCondition from "../ConditionManagePaneSpecialCondition";

interface Props {
  specialConditions: Array<ConditionContract>;
  activeConditions: Array<Condition>;
  isReadonly: boolean;
  onConditionLevelChange: (
    condition: ConditionContract,
    level: number | null
  ) => void;
  theme: CharacterTheme;
}
export default class ConditionManagePaneSpecialConditions extends React.PureComponent<Props> {
  render() {
    const {
      specialConditions,
      activeConditions,
      isReadonly,
      onConditionLevelChange,
      theme,
    } = this.props;

    return (
      <React.Fragment>
        {specialConditions.map((condition) => {
          let activeCondition = activeConditions.find(
            (activeCondition) =>
              ConditionUtils.getId(activeCondition) ===
              ConditionUtils.getId(condition)
          );
          let conditionLevel: number | null = activeCondition
            ? ConditionUtils.getActiveLevel(activeCondition)
            : null;

          return (
            <ConditionManagePaneSpecialCondition
              key={ConditionUtils.getUniqueKey(condition)}
              isActive={!!activeCondition}
              condition={condition}
              onConditionLevelChange={onConditionLevelChange}
              conditionLevel={conditionLevel}
              isReadonly={isReadonly}
              theme={theme}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
