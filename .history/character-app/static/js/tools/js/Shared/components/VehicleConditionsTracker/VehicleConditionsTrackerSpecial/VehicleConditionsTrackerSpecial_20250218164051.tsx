import * as React from "react";

import {
  Collapsible,
  CollapsibleHeaderCallout,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import { ConditionLevelEffectLookup } from "../../rules-engine/es";

import ConditionLevelsTable from "../../ConditionLevelsTable";

interface Props {
  name: string;
  conditionId: number;
  activeLevel: number | null;
  isInteractive: boolean;
  initiallyCollapsed: boolean;
  levels: Array<number>;
  levelOverrides: Record<number, string>;
  levelEffectLookup: ConditionLevelEffectLookup | null;
  onLevelChange?: (
    conditionId: number,
    newLevel: number | null,
    activeLevel: number | null
  ) => void;
}
export default class VehicleConditionsTrackerSpecial extends React.PureComponent<Props> {
  static defaultProps = {
    isInteractive: false,
    initiallyCollapsed: true,
    activeLevel: null,
  };

  handleConditionLevelChange = (newLevel: number | null): void => {
    const { onLevelChange, conditionId, isInteractive, activeLevel } =
      this.props;

    if (onLevelChange && isInteractive) {
      onLevelChange(conditionId, newLevel, activeLevel);
    }
  };

  render() {
    const {
      name,
      activeLevel,
      levels,
      levelEffectLookup,
      levelOverrides,
      initiallyCollapsed,
      isInteractive,
    } = this.props;

    let extraNode: React.ReactNode = (
      <div className="ct-vehicle-condition-tracker__summary">
        <span className="ct-vehicle-condition-tracker__summary-value">
          Level {activeLevel ? activeLevel : "--"}
        </span>
      </div>
    );
    let headerCalloutNode: React.ReactNode = (
      <CollapsibleHeaderCallout extra={extraNode} value={null} />
    );
    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent heading={name} callout={headerCalloutNode} />
    );

    return (
      <div className="ct-vehicle-condition-tracker">
        <Collapsible
          header={headerNode}
          initiallyCollapsed={initiallyCollapsed}
        >
          <div className="ct-vehicle-condition-tracker__content">
            <ConditionLevelsTable
              conditionName={name}
              levelEffectLookup={levelEffectLookup}
              isInteractive={isInteractive}
              activeLevel={activeLevel}
              levels={levels}
              onLevelChange={this.handleConditionLevelChange}
              levelOverrides={levelOverrides}
            />
          </div>
        </Collapsible>
      </div>
    );
  }
}
