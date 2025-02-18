import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Constants,
} from "../../rules-engine/es";

import { ModifiedProficiencyHalfSvg, ProficiencyHalfSvg } from "../../../Svg";

interface Props {
  isModified: boolean;
  className: string;
  theme?: CharacterTheme;
}

export default class HalfProficiencyIcon extends React.PureComponent<Props> {
  static defaultProps = {
    isModified: false,
    className: "",
  };

  render() {
    const { isModified, className, theme } = this.props;

    let IconComponent: React.ComponentType<any> = isModified
      ? ModifiedProficiencyHalfSvg
      : ProficiencyHalfSvg;
    let classNames: Array<string> = ["ddbc-half-proficiency-icon", className];
    if (isModified) {
      classNames.push("ddbc-half-proficiency-icon--modified");
    }
    let fillColor;
    if (theme?.isDarkMode) {
      fillColor = isModified
        ? Constants.CharacterColorEnum.DARKMODE_TEXT
        : theme?.themeColor;
    }

    return (
      <Tooltip title="Half Proficiency" isDarkMode={theme?.isDarkMode}>
        <IconComponent className={classNames.join(" ")} fillColor={fillColor} />
      </Tooltip>
    );
  }
}
