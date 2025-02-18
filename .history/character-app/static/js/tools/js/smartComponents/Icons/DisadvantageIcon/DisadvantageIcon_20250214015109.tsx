import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import {
  DarkModeNegativeDisadvantageSvg,
  NegativeDisadvantageSvg,
} from "../../Svg";

interface Props {
  title: string;
  className: string;
  theme?: CharacterTheme;
}
export default class DisadvantageIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "Disadvantage",
    className: "",
    theme: {},
  };

  render() {
    const { title, className, theme } = this.props;

    const classNames: Array<string> = [className, "ddbc-disadvantage-icon"];

    return (
      <Tooltip
        title={title}
        className={classNames.join(" ")}
        isDarkMode={theme?.isDarkMode}
      >
        <span aria-label="Disadvantage">
          {theme?.isDarkMode ? (
            <DarkModeNegativeDisadvantageSvg />
          ) : (
            <NegativeDisadvantageSvg />
          )}
        </span>
      </Tooltip>
    );
  }
}
