import * as React from "react";

import { Tooltip } from "../../character-common-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

import { DarkModePositiveAdvantageSvg, PositiveAdvantageSvg } from "../../Svg";

interface Props {
  title: string;
  className: string;
  theme?: CharacterTheme;
  secondaryFill?: string;
}
export default class AdvantageIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "Advantage",
    className: "",
    theme: {},
  };

  render() {
    const { title, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-advantage-icon"];

    return (
      <Tooltip
        title={title}
        className={classNames.join(" ")}
        isDarkMode={theme?.isDarkMode}
      >
        <span aria-label="Advantage">
          {theme?.isDarkMode ? (
            <DarkModePositiveAdvantageSvg />
          ) : (
            <PositiveAdvantageSvg />
          )}
        </span>
      </Tooltip>
    );
  }
}
