import React from "react";

import {
  Constants,
  HitPointInfo,
  RuleData,
  RuleDataUtils,
} from "@dndbeyond/character-rules-engine/es";

import { Inspiration } from "~/subApps/sheet/components/Inspiration";

interface Props {
  hitPointInfo: HitPointInfo;
  fails: number;
  successes: number;
  deathCause: string;
  inspiration: boolean;
  ruleData: RuleData;
  onHealthClick?: () => void;
  onInspirationClick?: () => void;
  isInteractive: boolean;
}
export default class StatusSummaryMobile extends React.PureComponent<Props> {
  static defaultProps = {
    isInteractive: true,
  };

  handleHealthClick = (evt: React.MouseEvent): void => {
    const { onHealthClick } = this.props;

    if (onHealthClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onHealthClick();
    }
  };

  handleInspirationToggle = (): void => {
    const { onInspirationClick } = this.props;

    if (onInspirationClick) {
      onInspirationClick();
    }
  };

  renderHitPointSummary = (): React.ReactNode => {
    const { hitPointInfo } = this.props;

    let tempHp: number = hitPointInfo.tempHp === null ? 0 : hitPointInfo.tempHp;

    let classNames: Array<string> = [
      "ct-status-summary-mobile__data",
      "ct-status-summary-mobile__hp",
    ];
    if (tempHp > 0) {
      classNames.push("ct-status-summary-mobile__hp--has-temp");
    }
    return (
      <div className={classNames.join(" ")}>
        <span className="ct-status-summary-mobile__hp-current">
          {hitPointInfo.remainingHp + tempHp}
        </span>
        <span className="ct-status-summary-mobile__hp-sep">/</span>
        <span className="ct-status-summary-mobile__hp-max">
          {hitPointInfo.totalHp + tempHp}
        </span>
      </div>
    );
  };

  renderDeathSavesSummaryMarkGroup = (
    key: string,
    label: string,
    activeCount: number,
    totalCount: number
  ): React.ReactNode => {
    let marks: Array<React.ReactNode> = [];
    for (let i = 0; i < totalCount; i++) {
      let classNames: Array<string> = [
        "ct-status-summary-mobile__deathsaves-mark",
        `ct-status-summary-mobile__deathsaves-mark--${
          i < activeCount ? "active" : "inactive"
        }`,
      ];
      marks.push(<span key={`${key}-${i}`} className={classNames.join(" ")} />);
    }

    return (
      <div
        className={`ct-status-summary-mobile__deathsaves-groupstcs-status-summary-mobile__deathsaves--${key}`}
      >
        <span className="ct-status-summary-mobile__deathsaves-label">
          {label}
        </span>
        <span className="ct-status-summary-mobile__deathsaves-marks">
          {marks}
        </span>
      </div>
    );
  };

  renderDeathSavesSummary = (): React.ReactNode => {
    const { fails, successes, ruleData } = this.props;

    return (
      <div className="ct-status-summary-mobile__datastcs-status-summary-mobile__deathsaves">
        <div className="ct-status-summary-mobile__deathsaves-icon" />
        <div className="ct-status-summary-mobile__deathsaves-content">
          {this.renderDeathSavesSummaryMarkGroup(
            "fail",
            "f",
            fails,
            RuleDataUtils.getMaxDeathsavesFail(ruleData)
          )}
          {this.renderDeathSavesSummaryMarkGroup(
            "success",
            "s",
            successes,
            RuleDataUtils.getMaxDeathsavesSuccess(ruleData)
          )}
        </div>
      </div>
    );
  };

  renderDeathExhaustionSummary = (): React.ReactNode => {
    return (
      <div className="ct-status-summary-mobile__datastcs-status-summary-mobile__exhaustion">
        <div className="ct-status-summary-mobile__exhaustion-icon" />
        <div className="ct-status-summary-mobile__exhaustion-content">
          <div className="ct-status-summary-mobile__exhaustion-label">
            Exhaustion Level 6
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { hitPointInfo, deathCause, isInteractive, inspiration } = this.props;

    let statusSummaryNode: React.ReactNode;
    let statusSummaryLabel: React.ReactNode;

    if (deathCause === Constants.DeathCauseEnum.CONDITION) {
      statusSummaryNode = this.renderDeathExhaustionSummary();
      statusSummaryLabel = null;
    } else if (hitPointInfo.remainingHp <= 0) {
      statusSummaryNode = this.renderDeathSavesSummary();
      statusSummaryLabel = "Death Saves";
    } else {
      statusSummaryNode = this.renderHitPointSummary();
      statusSummaryLabel = "Hit Points";
    }

    return (
      <div
        className="ct-status-summary-mobile"
        onClick={this.handleHealthClick}
      >
        <div className="ct-status-summary-mobile__health">
          <div className="ct-status-summary-mobile__health-label">
            {statusSummaryLabel}
          </div>
          {statusSummaryNode}
        </div>
        <Inspiration
          onToggle={this.handleInspirationToggle}
          isMobile
          isInteractive={isInteractive}
          inspiration={inspiration}
        />
      </div>
    );
  }
}
