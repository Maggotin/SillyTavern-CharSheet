import { orderBy } from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  rulesEngineSelectors,
  characterActions,
  ConditionUtils,
  Condition,
  Constants,
  ConditionContract,
  RuleData,
  RuleDataUtils,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import ConditionManagePaneSpecialConditions from "./ConditionManagePaneSpecialConditions";
import ConditionManagePaneStandardConditions from "./ConditionManagePaneStandardConditions";

interface Props extends DispatchProp {
  activeConditions: Array<Condition>;
  ruleData: RuleData;
  isReadonly: boolean;
  theme: CharacterTheme;
}
class ConditionManagePane extends React.PureComponent<Props> {
  handleStandardConditionToggle = (
    condition: ConditionContract,
    isEnabled: boolean
  ): void => {
    const { dispatch } = this.props;

    if (isEnabled) {
      dispatch(characterActions.conditionAdd(ConditionUtils.getId(condition)));
    } else {
      dispatch(
        characterActions.conditionRemove(ConditionUtils.getId(condition))
      );
    }
  };

  handleSpecialConditionLevelChange = (
    condition: ConditionContract,
    conditionLevel: number | null
  ): void => {
    const { dispatch, activeConditions } = this.props;

    const conditionId = ConditionUtils.getId(condition);
    if (conditionLevel === null) {
      dispatch(characterActions.conditionRemove(conditionId));
    } else {
      const foundActiveCondition = activeConditions.find(
        (activeCondition) =>
          ConditionUtils.getId(activeCondition) === conditionId
      );

      if (foundActiveCondition) {
        dispatch(characterActions.conditionSet(conditionId, conditionLevel));
      } else {
        dispatch(characterActions.conditionAdd(conditionId, conditionLevel));
      }
    }
  };

  render() {
    const { activeConditions, ruleData, isReadonly, theme } = this.props;

    const conditionData = RuleDataUtils.getConditions(ruleData);

    const displayedConditions = orderBy(conditionData, (condition) =>
      ConditionUtils.getName(condition)
    );
    const activeConditionIds = activeConditions.map((condition) =>
      ConditionUtils.getId(condition)
    );

    const standardConditions = displayedConditions.filter(
      (condition) =>
        ConditionUtils.getType(condition) ===
        Constants.ConditionTypeEnum.STANDARD
    );
    const specialConditions = displayedConditions.filter(
      (condition) =>
        ConditionUtils.getType(condition) ===
        Constants.ConditionTypeEnum.SPECIAL
    );

    return (
      <div className="ct-condition-manage-pane">
        <Header>Conditions</Header>
        <div className="ct-condition-manage-pane__conditions">
          <ConditionManagePaneStandardConditions
            standardConditions={standardConditions}
            activeConditionIds={activeConditionIds}
            onConditionToggle={this.handleStandardConditionToggle}
            isReadonly={isReadonly}
            theme={theme}
          />
        </div>
        <div className="ct-condition-manage-pane__conditions ct-condition-manage-pane__condition--special">
          <ConditionManagePaneSpecialConditions
            specialConditions={specialConditions}
            activeConditions={activeConditions}
            isReadonly={isReadonly}
            onConditionLevelChange={this.handleSpecialConditionLevelChange}
            theme={theme}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    activeConditions: rulesEngineSelectors.getActiveConditions(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(ConditionManagePane);
