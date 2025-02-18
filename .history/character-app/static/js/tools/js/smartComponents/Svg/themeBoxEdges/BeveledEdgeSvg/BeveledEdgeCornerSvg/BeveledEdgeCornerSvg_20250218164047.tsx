import React from "react";

import { CharacterTheme } from "../../rules-engine/es";

import { BaseSvg } from "../../../BaseSvg";
import { SvgConstantDarkModeBackgroundColor } from "../../../SvgConstants";

interface Props {
  theme: CharacterTheme;
  className: string;
  isTablet: boolean;
}
export default class BeveledEdgeCornerSvg extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { theme, className, isTablet } = this.props;

    let classNames: Array<string> = ["ddbc-beveled-edge-corner-svg", className];

    let themeBackground = theme.backgroundColor;
    if (theme.isDarkMode && !isTablet) {
      themeBackground = SvgConstantDarkModeBackgroundColor;
    } else if (theme.isDarkMode) {
      themeBackground = "none";
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 14.625 10.27083">
        <path
          fill={theme.themeColor}
          d="M236.61517,5.86462v2.707a11.33993,11.33993,0,0,0-4.256-5.07v-.046h-.071a16.08764,16.08764,0,0,0-3.756-1.799h3.876Zm-4.207,362.337h-3.876a16.00871,16.00871,0,0,0,3.756-1.799h.071v-.045a11.34783,11.34783,0,0,0,4.256-5.071v2.707Zm-232.457-4.208v-2.707a11.34832,11.34832,0,0,0,4.256,5.071v.045h.071a16.01053,16.01053,0,0,0,3.756,1.799h-3.875Zm10.354,4.208a17.36725,17.36725,0,0,1-4.873-1.799h225.717c-.297.167-.579.344-.898.496a17.88761,17.88761,0,0,1-3.94,1.303Z"
        />
        <path
          fill={theme.themeColor}
          d="M237.99,5.29V364.56l-5.01,5.02H3.59l-5.01-5.02V5.29L3.59.28H232.98Zm-1.37,354.09V10.51a10.73922,10.73922,0,0,0-4.31-6.3H4.23A10.50987,10.50987,0,0,0-.05,10.48V359.35a10.67983,10.67983,0,0,0,4.3,6.3H232.34A10.58242,10.58242,0,0,0,236.62,359.38ZM5.42,3.46H231.13a17.19832,17.19832,0,0,0-4.87-1.8h-216a17.50959,17.50959,0,0,0-3.94,1.3C6,3.11,5.71,3.29,5.42,3.46Zm2.61-1.8H4.16L-.05,5.86V8.57A11.37376,11.37376,0,0,1,4.21,3.5V3.46h.07A15.98212,15.98212,0,0,1,8.03,1.66Z"
        />
        <path
          fill={themeBackground}
          d="M236.62,10.51V359.38a10.58242,10.58242,0,0,1-4.28,6.27H4.25a10.67983,10.67983,0,0,1-4.3-6.3V10.48A10.50987,10.50987,0,0,1,4.23,4.21H232.31A10.73922,10.73922,0,0,1,236.62,10.51Z"
        />
      </BaseSvg>
    );
  }
}
