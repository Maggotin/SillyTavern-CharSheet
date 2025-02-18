import React from "react";

import {
  CharacterTheme,
  ConditionContract,
  ConditionUtils,
} from "../../character-rules-engine/es";

import ConditionManagePaneStandardCondition from "../ConditionManagePaneStandardCondition";

interface Props {
  standardConditions: Array<ConditionContract>;
  activeConditionIds: Array<number>;
  onConditionToggle: (condition: ConditionContract, isEnabled: boolean) => void;
  isReadonly: boolean;
  theme: CharacterTheme;
}
export default class ConditionManagePaneStandardConditions extends React.PureComponent<Props> {
  render() {
    const {
      standardConditions,
      activeConditionIds,
      onConditionToggle,
      isReadonly,
      theme,
    } = this.props;

    return (
      <React.Fragment>
        {standardConditions.map((condition) => {
          let isActive = activeConditionIds.includes(
            ConditionUtils.getId(condition)
          );

          return (
            <ConditionManagePaneStandardCondition
              key={ConditionUtils.getUniqueKey(condition)}
              isActive={isActive}
              condition={condition}
              onConditionToggle={onConditionToggle}
              isReadonly={isReadonly}
              theme={theme}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
