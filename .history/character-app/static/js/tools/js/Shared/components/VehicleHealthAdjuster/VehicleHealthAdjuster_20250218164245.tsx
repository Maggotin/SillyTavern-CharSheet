import * as React from "react";

import {
  Collapsible,
  CollapsibleHeaderCallout,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import { HitPointInfo } from "../../character-rules-engine/es";

import HealthAdjuster from "../HealthAdjuster";

interface Props {
  hitPointInfo: HitPointInfo;
  isInteractive: boolean;
  initiallyCollapsed: boolean;
  onSave: (hitPointDiff: number) => void;
  heading?: string;
}
export default class VehicleHealthAdjuster extends React.PureComponent<Props> {
  static defaultProps = {
    isInteractive: false,
    initiallyCollapsed: true,
  };

  handleAdjustHealth = (hitPointDiff: number): void => {
    const { onSave } = this.props;

    if (onSave) {
      onSave(hitPointDiff);
    }
  };

  render() {
    const { hitPointInfo, isInteractive, initiallyCollapsed, heading } =
      this.props;

    let tempHp: number = hitPointInfo.tempHp === null ? 0 : hitPointInfo.tempHp;
    let extraNode: React.ReactNode = (
      <div className="ct-vehicle-health-adjuster__summary">
        <span className="ct-vehicle-health-adjuster__summary-value">
          {hitPointInfo.remainingHp + tempHp}
        </span>
        <span className="ct-vehicle-health-adjuster__summary-sep">/</span>
        <span className="ct-vehicle-health-adjuster__summary-value">
          {hitPointInfo.totalHp + tempHp}
        </span>
      </div>
    );

    let headerCalloutNode: React.ReactNode = (
      <CollapsibleHeaderCallout extra={extraNode} value={null} />
    );

    let headerNode: React.ReactNode = (
      <CollapsibleHeaderContent
        heading={heading ? heading : "Hit Points"}
        callout={headerCalloutNode}
      />
    );

    return (
      <div className="ct-vehicle-health-adjuster">
        <Collapsible
          header={headerNode}
          initiallyCollapsed={initiallyCollapsed}
        >
          <div className="ct-vehicle-health-adjuster__groups">
            <div className="ct-vehicle-health-adjuster__group">
              <div className="ct-vehicle-health-adjuster__group-label">
                Current HP
              </div>
              <div className="ct-vehicle-health-adjuster__group-value">
                {hitPointInfo.remainingHp}
              </div>
            </div>
            <div className="ct-vehicle-health-adjuster__group">
              <div className="ct-vehicle-health-adjuster__group-label">
                Max HP
              </div>
              <div className="ct-vehicle-health-adjuster__group-value">
                {hitPointInfo.totalHp}
              </div>
            </div>
          </div>
          {isInteractive && (
            <HealthAdjuster
              hitPointInfo={hitPointInfo}
              onSave={this.handleAdjustHealth}
            />
          )}
        </Collapsible>
      </div>
    );
  }
}
