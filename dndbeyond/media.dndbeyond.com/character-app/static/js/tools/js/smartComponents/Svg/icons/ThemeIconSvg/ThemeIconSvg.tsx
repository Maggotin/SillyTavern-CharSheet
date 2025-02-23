import React from "react";

import BaseSvg from "../../BaseSvg";
import { InjectedSvgProps } from "../../hocs";

export default class ThemeIconSvg extends React.PureComponent<InjectedSvgProps> {
  render() {
    const { fillColor, className } = this.props;

    let classNames: Array<string> = ["ddbc-theme-icon-svg"];

    if (className) {
      classNames.push(className);
    }

    return (
      <BaseSvg className={classNames.join(" ")} viewBox="0 0 16 16">
        <path
          fill={fillColor}
          d="M15,0H0v16h16V0H15z M12.3,3H3.7l-2-2h12.6L12.3,3z M4,12L4,12l0-8h8v8l0,0H4z M3,3.7v8.6l-2,2V1.7L3,3.7z M3.7,13h8.6
			            l2,2H1.7L3.7,13z M13,12.3V3.7l2-2v12.6L13,12.3z"
        />
      </BaseSvg>
    );
  }
}
