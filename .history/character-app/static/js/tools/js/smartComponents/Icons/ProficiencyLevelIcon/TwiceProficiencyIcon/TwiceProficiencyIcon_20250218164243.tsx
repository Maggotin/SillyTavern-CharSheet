import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Constants,
} from "../../character-rules-engine/es";

import {
  ModifiedProficiencyDoubleSvg,
  ProficiencyDoubleSvg,
} from "../../../Svg";

interface Props {
  isModified: boolean;
  className: string;
  theme?: CharacterTheme;
}

export default class TwiceProficiencyIcon extends React.PureComponent<Props> {
  static defaultProps = {
    isModified: false,
    className: "",
  };

  render() {
    const { isModified, className, theme } = this.props;

    let IconComponent: React.ComponentType<any> = isModified
      ? ModifiedProficiencyDoubleSvg
      : ProficiencyDoubleSvg;

    let classNames: Array<string> = ["ddbc-twice-proficiency-icon", className];
    if (isModified) {
      classNames.push("ddbc-twice-proficiency-icon--modified");
    }
    let secondaryFill;
    if (theme?.isDarkMode) {
      secondaryFill = isModified
        ? Constants.CharacterColorEnum.DARKMODE_TEXT
        : theme?.themeColor;
    }

    return (
      <Tooltip title="Expertise" isDarkMode={theme?.isDarkMode}>
        <span className={classNames.join(" ")}>
          <IconComponent
            className="ddbc-twice-proficiency-icon__inner"
            fillColor={theme?.isDarkMode ? theme.themeColor : undefined}
            secondaryFillColor={secondaryFill}
          />
        </span>
      </Tooltip>
    );
  }
}
