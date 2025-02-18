import * as React from "react";

import {
  ConditionContract,
  ConditionLevelUtils,
  ConditionUtils,
  Constants,
  VehicleActiveConditionLookup,
} from "../../character-rules-engine/es";

import VehicleConditionsTrackerSpecial from "./VehicleConditionsTrackerSpecial";

interface Props {
  activeConditionLookup: VehicleActiveConditionLookup;
  enabledConditions: Array<ConditionContract>;
  isInteractive: boolean;
  initiallyCollapsed: boolean;
  onLevelChange?: (
    conditionId: number,
    newLevel: number | null,
    activeLevel: number | null
  ) => void;
}
export default class VehicleConditionTrackers extends React.PureComponent<Props> {
  static defaultProps = {
    isInteractive: false,
    initiallyCollapsed: true,
  };

  render() {
    const {
      activeConditionLookup,
      enabledConditions,
      onLevelChange,
      isInteractive,
    } = this.props;

    const specialConditions: Array<ConditionContract> = [];
    const standardConditions: Array<ConditionContract> = [];

    enabledConditions.forEach((condition) => {
      switch (ConditionUtils.getType(condition)) {
        case Constants.ConditionTypeEnum.SPECIAL:
          specialConditions.push(condition);
          break;
        case Constants.ConditionTypeEnum.STANDARD:
          standardConditions.push(condition);
          break;
        default:
        //not implemented
      }
    });

    //TODO handle standard conditions in future
    return (
      <React.Fragment>
        {specialConditions.map((condition, idx) => {
          const levels = ConditionUtils.getDefinitionLevels(condition).map(
            (level) => ConditionLevelUtils.getLevel(level)
          );
          const id = ConditionUtils.getId(condition);
          // get this override from data eventually
          let levelOverrides: Record<number, string> = {};
          if (id === Constants.ConditionIdEnum.EXHAUSTION) {
            levelOverrides = {
              6: 'The vehicle "breaks down" and hit points drop to 0',
            };
          }

          let activeLevel: number | null = null;

          if (activeConditionLookup.hasOwnProperty(id)) {
            activeLevel = ConditionUtils.getActiveLevel(
              activeConditionLookup[id]
            );
          }

          return (
            <VehicleConditionsTrackerSpecial
              key={`${idx}-${id}`}
              conditionId={id}
              name={ConditionUtils.getName(condition)}
              activeLevel={activeLevel}
              isInteractive={isInteractive}
              levels={levels}
              levelEffectLookup={ConditionUtils.getLevelEffectLookup(condition)}
              levelOverrides={levelOverrides}
              onLevelChange={onLevelChange}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
