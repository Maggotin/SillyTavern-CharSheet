import React from "react";

import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import BaseSvg from "../../../../BaseSvg";

interface Props {
  theme: CharacterTheme;
  className: string;
}
export default class SquaredBoxSvg228x338 extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { theme, className } = this.props;

    return (
      <BaseSvg className={className} viewBox="0 0 228 338">
        <polygon
          fill={theme.backgroundColor}
          points="8 336 221 336 221 2 8 2 8 336"
        />
        <path
          fill={theme.themeColor}
          d="M228,6.39V4.47h-6.14V0h-2.68s-1.06,1.54-3.91,1.54H12.73C9.88,1.54,8.82,0,8.82,0H6.14V4.47H0V6.39c2.53,0,2.67,4.14,2.67,4.14V324.91S2.53,329,0,329v2H6.14v7H8.82V3.31H219.18V334.69H8.82V338s1.06-1.54,3.91-1.54H215.27c2.84,0,3.9,1.52,3.91,1.54h2.68v-7H228v-2c-2.53,0-2.67-4.13-2.67-4.13V10.53S225.47,6.39,228,6.39ZM6.27,324.91H4.14V12.12H6.27Zm217.79.48h-2.12V12.61h2.12Z"
        />
      </BaseSvg>
    );
  }
}
