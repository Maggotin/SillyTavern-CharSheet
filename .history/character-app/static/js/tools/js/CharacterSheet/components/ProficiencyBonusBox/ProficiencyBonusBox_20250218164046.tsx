import { visuallyHidden } from "@mui/utils";
import React from "react";

import {
  BeveledBoxSvg94x89,
  BoxBackground,
} from "@dndbeyond/character-components/es";
import { CharacterTheme } from "../../rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

interface Props {
  proficiencyBonus: number;
  onClick?: () => void;
  theme: CharacterTheme;
}
export default class ProficiencyBonusBox extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  render() {
    const { proficiencyBonus, theme } = this.props;

    return (
      <section className="ct-proficiency-bonus-box" onClick={this.handleClick}>
        <BoxBackground StyleComponent={BeveledBoxSvg94x89} theme={theme} />
        <h2 style={visuallyHidden}>Proficiency Bonus</h2>
        <div
          className={`ct-proficiency-bonus-box__heading ${
            theme.isDarkMode
              ? "ct-proficiency-bonus-box__heading--dark-mode"
              : ""
          }`}
        >
          Proficiency
        </div>
        <div
          className={`ct-proficiency-bonus-box__value ${
            theme.isDarkMode ? "ct-proficiency-bonus-box__value--dark-mode" : ""
          }`}
        >
          <NumberDisplay
            type="signed"
            number={proficiencyBonus}
            size={"large"}
          />
        </div>
        <div
          className={`ct-proficiency-bonus-box__label ${
            theme.isDarkMode ? "ct-proficiency-bonus-box__label--dark-mode" : ""
          }`}
        >
          Bonus
        </div>
      </section>
    );
  }
}
