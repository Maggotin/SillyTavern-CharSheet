import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  Constants,
} from "../../character-rules-engine/es";

import { ProficiencySvg, ModifiedProficiencySvg } from "../../../Svg";

interface Props {
  isModified: boolean;
  className: string;
  theme?: CharacterTheme;
}

export default class ProficiencyIcon extends React.PureComponent<Props> {
  static defaultProps = {
    isModified: false,
    className: "",
  };

  render() {
    const { isModified, className, theme } = this.props;

    let IconComponent: React.ComponentType<any> = isModified
      ? ModifiedProficiencySvg
      : ProficiencySvg;
    let classNames: Array<string> = ["ddbc-proficiency-icon", className];

    if (isModified) {
      classNames.push("ddbc-proficiency-icon--modified");
    }

    return (
      <Tooltip title="Proficiency" isDarkMode={theme?.isDarkMode}>
        <IconComponent
          className={classNames.join(" ")}
          fillColor={
            theme?.isDarkMode && !isModified
              ? theme.themeColor
              : theme?.isDarkMode
              ? Constants.CharacterColorEnum.DARKMODE_TEXT
              : undefined
          }
        />
      </Tooltip>
    );
  }
}
