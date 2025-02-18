import * as React from "react";

import { Tooltip } from "../../character-common-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

import { DarkModePositiveImmunitySvg, PositiveImmunitySvg } from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}

interface Props {
  title: string;
  className: string;
  theme?: CharacterTheme;
  secondaryFill?: string;
}
export default class ImmunityIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "Immunity",
    className: "",
    theme: {},
  };

  render() {
    const { title, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-immunity-icon"];

    let SvgIcon: React.ComponentType<SvgInjectedProps> = theme?.isDarkMode
      ? DarkModePositiveImmunitySvg
      : PositiveImmunitySvg;

    return (
      <Tooltip title={title} isDarkMode={theme?.isDarkMode}>
        <SvgIcon className={classNames.join(" ")} />
      </Tooltip>
    );
  }
}
