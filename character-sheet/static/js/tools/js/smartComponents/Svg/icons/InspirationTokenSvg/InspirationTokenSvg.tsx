import React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import BaseSvg from "../../BaseSvg";

interface Props {
  theme: CharacterTheme;
  className: string;
}
export default class InspirationTokenSvg extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { theme, className } = this.props;

    let classNames: Array<string> = ["ddbc-inspiration-token-svg", className];

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 50 30">
        <g>
          <path
            fill={theme.themeColor}
            d="M25,14.2c-6.4,0-11.7,5.1-12.2,11.5H2.2V30h10.9h23.8h10.9v-4.3H37.2C36.7,19.3,31.4,14.2,25,14.2z"
          />
          <path
            fill={theme.themeColor}
            d="M26.9,10.3V0h-3.7v10.3c0.6-0.1,1.2-0.1,1.9-0.1S26.3,10.2,26.9,10.3z"
          />
          <path
            fill={theme.themeColor}
            d="M42.4,5.3l-3-2.3l-6.4,9.1c1.1,0.5,2.2,1.2,3.1,2.1L42.4,5.3z"
          />
          <path
            fill={theme.themeColor}
            d="M41.7,22.1l8.3-3.1l-1.3-3.6L40,18.7C40.7,19.7,41.3,20.9,41.7,22.1z"
          />
          <path
            fill={theme.themeColor}
            d="M17.1,12.1L10.6,3l-3,2.3l6.3,8.9C14.9,13.3,16,12.6,17.1,12.1z"
          />
          <path
            fill={theme.themeColor}
            d="M10,18.7l-8.7-3.3L0,18.9l8.3,3.1C8.7,20.9,9.3,19.7,10,18.7z"
          />
        </g>
      </BaseSvg>
    );
  }
}
