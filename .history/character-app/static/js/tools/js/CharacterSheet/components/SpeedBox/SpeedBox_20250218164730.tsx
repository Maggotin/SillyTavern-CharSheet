import { visuallyHidden } from "@mui/utils";
import React from "react";

import {
  BeveledBoxSvg94x89,
  BoxBackground,
} from "@dndbeyond/character-components/es";
import {
  CharacterPreferences,
  CharacterTheme,
  RuleData,
  RuleDataUtils,
  SpeedInfo,
} from "../../character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

interface Props {
  speeds: SpeedInfo;
  preferences: CharacterPreferences;
  theme: CharacterTheme;
  ruleData: RuleData;
  onClick?: () => void;
}
export default class SpeedBox extends React.PureComponent<Props> {
  handleSpeedsClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  render() {
    const { preferences, speeds, theme, ruleData } = this.props;

    const displaySpeedValue: number =
      speeds[
        RuleDataUtils.getSpeedMovementKeyById(preferences.primaryMovement)
      ];
    const displaySpeedLabel = RuleDataUtils.getMovementDescription(
      preferences.primaryMovement,
      ruleData
    );

    return (
      <section className="ct-speed-box" onClick={this.handleSpeedsClick}>
        <h2 style={visuallyHidden}>Speed</h2>
        <BoxBackground StyleComponent={BeveledBoxSvg94x89} theme={theme} />
        <div
          className={`ct-speed-box__heading ${
            theme.isDarkMode ? "ct-speed-box__heading--dark-mode" : ""
          }`}
        >
          {displaySpeedLabel}
        </div>
        <div
          className={`ct-speed-box__box-value ${
            theme.isDarkMode ? "ct-speed-box__box-value--dark-mode" : ""
          }`}
        >
          <NumberDisplay
            type="distanceInFt"
            number={displaySpeedValue}
            size={"large"}
          />
        </div>
        <div
          className={`ct-speed-box__label ${
            theme.isDarkMode ? "ct-speed-box__label--dark-mode" : ""
          }`}
        >
          Speed
        </div>
      </section>
    );
  }
}
