import React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import { BaseSvg } from "../../../BaseSvg";
import { SvgConstantDarkModeBackgroundColor } from "../../../SvgConstants";

interface Props {
  theme: CharacterTheme;
  className: string;
  isTablet: boolean;
}
export default class BeveledEdgeRepeatSvg extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { theme, className, isTablet } = this.props;

    let classNames: Array<string> = ["ddbc-beveled-edge-repeat-svg", className];

    let themeBackground = theme.backgroundColor;
    if (theme.isDarkMode && !isTablet) {
      themeBackground = SvgConstantDarkModeBackgroundColor;
    } else if (theme.isDarkMode) {
      themeBackground = "none";
    }

    return (
      <BaseSvg
        className={classNames.join(" ")}
        viewBox="0 0 14.625 10.27083"
        preserveAspectRatio="none"
      >
        <path
          fill={theme.themeColor}
          d="M127.99,5.29V364.56l-5.01,5.02H-106.41l-5.01-5.02V5.29l5.01-5.01H122.98Zm-1.37,354.09V10.51a10.73922,10.73922,0,0,0-4.31-6.3H-105.77a10.50987,10.50987,0,0,0-4.28,6.27V359.35a10.67983,10.67983,0,0,0,4.3,6.3H122.34A10.58242,10.58242,0,0,0,126.62,359.38ZM-104.58,3.46H121.13a17.19832,17.19832,0,0,0-4.87-1.8h-216a17.50959,17.50959,0,0,0-3.94,1.3C-104,3.11-104.29,3.29-104.58,3.46Z"
        />
        <path
          fill={themeBackground}
          d="M126.62,10.51V359.38a10.58242,10.58242,0,0,1-4.28,6.27H-105.75a10.67983,10.67983,0,0,1-4.3-6.3V10.48a10.50987,10.50987,0,0,1,4.28-6.27H122.31A10.73922,10.73922,0,0,1,126.62,10.51Z"
        />
      </BaseSvg>
    );
  }
}
