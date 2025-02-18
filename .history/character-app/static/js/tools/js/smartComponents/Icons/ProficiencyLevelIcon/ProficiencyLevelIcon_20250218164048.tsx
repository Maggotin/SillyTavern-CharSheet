import * as React from "react";

import {
  CharacterTheme,
  Constants,
} from "../../rules-engine/es";

import HalfProficiencyIcon from "./HalfProficiencyIcon";
import NoProficiencyIcon from "./NoProficiencyIcon";
import ProficiencyIcon from "./ProficiencyIcon";
import TwiceProficiencyIcon from "./TwiceProficiencyIcon";

interface Props {
  proficiencyLevel: number;
  isModified: boolean;
  theme?: CharacterTheme;
}
export default class ProficiencyLevelIcon extends React.PureComponent<Props> {
  static defaultProps = {
    isModified: false,
  };

  render() {
    const { proficiencyLevel, isModified, theme } = this.props;

    let IconComponent: React.ComponentType<any> | null = null;
    let proficiencyVerbiage: string = "Not Proficient";

    switch (proficiencyLevel) {
      case Constants.ProficiencyLevelEnum.NONE:
        IconComponent = NoProficiencyIcon;
        break;
      case Constants.ProficiencyLevelEnum.HALF:
        IconComponent = HalfProficiencyIcon;
        proficiencyVerbiage = "Half Proficient";
        break;
      case Constants.ProficiencyLevelEnum.FULL:
        IconComponent = ProficiencyIcon;
        proficiencyVerbiage = "Proficient";
        break;
      case Constants.ProficiencyLevelEnum.EXPERT:
        IconComponent = TwiceProficiencyIcon;
        proficiencyVerbiage = "Expert";
        break;
      default:
      //not implemented
    }

    if (IconComponent === null) {
      return null;
    }

    return (
      <span aria-label={proficiencyVerbiage}>
        <IconComponent
          className="ddbc-proficiency-level-icon"
          isModified={isModified}
          theme={theme}
        />
      </span>
    );
  }
}
