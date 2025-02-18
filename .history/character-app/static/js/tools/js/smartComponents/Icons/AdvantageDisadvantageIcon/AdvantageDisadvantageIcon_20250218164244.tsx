import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

import { AdvantageDisadvantageSvg } from "../../Svg";
import {
  SvgConstantDarkModePositiveTheme,
  SvgConstantDarkModeNegativeTheme,
  SvgConstantPositiveTheme,
  SvgConstantNegativeTheme,
} from "../../componentConstants";

interface Props {
  title: string;
  className: string;
  theme: CharacterTheme;
}
export default class AdvantageDisadvantageIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "",
    className: "",
    theme: {},
  };

  render() {
    const { title, className, theme } = this.props;

    let classNames: Array<string> = [
      className,
      "ddbc-advantage-disadvantage-icon",
    ];

    return (
      <Tooltip
        title={title}
        className={classNames.join(" ")}
        isDarkMode={theme?.isDarkMode}
      >
        <AdvantageDisadvantageSvg
          fillColor={
            theme.isDarkMode
              ? SvgConstantDarkModePositiveTheme.fill
              : SvgConstantPositiveTheme.fill
          }
          secondaryFillColor={
            theme.isDarkMode
              ? SvgConstantDarkModeNegativeTheme.fill
              : SvgConstantNegativeTheme.fill
          }
        />
      </Tooltip>
    );
  }
}
