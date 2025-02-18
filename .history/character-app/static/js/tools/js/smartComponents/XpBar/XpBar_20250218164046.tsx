import * as React from "react";

import {
  CharacterUtils,
  FormatUtils,
  RuleData,
  RuleDataUtils,
} from "../../rules-engine/es";

interface Props {
  className: string;
  xp: number;
  showCurrentMarker: boolean;
  ruleData: RuleData;
}
export default class XpBar extends React.PureComponent<Props> {
  static defaultProps = {
    showCurrentMarker: false,
    className: "",
  };

  render() {
    const { xp, showCurrentMarker, ruleData, className } = this.props;

    let level = CharacterUtils.deriveXpLevel(xp, ruleData);
    const maxCharacterLevel = RuleDataUtils.getMaxCharacterLevel(ruleData);
    const nextLevel: number = Math.min(level + 1, maxCharacterLevel);

    let xpBarStyles: React.CSSProperties = {};
    if (level < maxCharacterLevel) {
      const currentLevelXp = CharacterUtils.deriveCurrentLevelXp(
        level,
        ruleData
      );
      const nextLevelXp = CharacterUtils.deriveNextLevelXp(level, ruleData);
      const percentage: string =
        ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100 + "%";
      xpBarStyles = {
        width: percentage,
      };
    }

    const displayCurrentLevel: number =
      level === maxCharacterLevel ? maxCharacterLevel - 1 : level;

    let classNames: Array<string> = [className, "ddbc-xp-bar"];

    return (
      <div className={classNames.join(" ")}>
        <span className="ddbc-xp-bar__item ddbc-xp-bar__item--cur">
          <span className="ddbc-xp-bar__label">LVL {displayCurrentLevel}</span>
        </span>
        <span className="ddbc-xp-bar__item ddbc-xp-bar__item--progress">
          <span className="ddbc-xp-bar__progress">
            <span className="ddbc-xp-bar__progress-inner" style={xpBarStyles}>
              {showCurrentMarker && (
                <span className="ddbc-xp-bar__progress-marker">
                  <span className="ddbc-xp-bar__progress-marker-amount">
                    {FormatUtils.renderLocaleNumber(xp)}
                  </span>
                </span>
              )}
            </span>
          </span>
        </span>
        <span className="ddbc-xp-bar__item ddbc-xp-bar__item--next">
          <span className="ddbc-xp-bar__label">LVL {nextLevel}</span>
        </span>
      </div>
    );
  }
}
