import * as React from "react";

import {
  Constants,
  ExperienceInfo,
  FormatUtils,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import XpBar from "../XpBar";

interface Props {
  className: string;
  ruleData: RuleData;
  xpInfo: ExperienceInfo;
  progressionType: Constants.PreferenceProgressionTypeEnum;
}
export default class CharacterProgressionSummary extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, ruleData, xpInfo, progressionType } = this.props;

    const classNames: Array<string> = [
      "ddbc-character-progression-summary",
      className,
    ];

    return (
      <div className={classNames.join(" ")}>
        {progressionType ===
          Constants.PreferenceProgressionTypeEnum.MILESTONE && (
          <div className="ddbc-character-progression-summary__level">
            Level {xpInfo.currentLevel}
          </div>
        )}
        {progressionType === Constants.PreferenceProgressionTypeEnum.XP && (
          <div className="ddbc-character-progression-summary__xp-bar">
            <XpBar xp={xpInfo.currentLevelXp} ruleData={ruleData} />
            <div className="ddbc-character-progression-summary__xp-data">
              {FormatUtils.renderLocaleNumber(xpInfo.currentLevelXp)} /{" "}
              {FormatUtils.renderLocaleNumber(xpInfo.nextLevelXp)} XP
            </div>
          </div>
        )}
      </div>
    );
  }
}
