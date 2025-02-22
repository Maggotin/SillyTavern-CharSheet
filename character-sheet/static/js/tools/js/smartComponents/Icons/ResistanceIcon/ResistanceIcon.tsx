import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CharacterTheme } from "@dndbeyond/character-rules-engine/es";

import {
  PositiveResistanceSvg,
  DarkModePositiveResistanceSvg,
} from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}

interface Props {
  title: string;
  className: string;
  theme?: CharacterTheme;
  secondaryFill?: string;
}
export default class ResistanceIcon extends React.PureComponent<Props> {
  static defaultProps = {
    title: "Resistance",
    className: "",
    theme: {},
  };

  render() {
    const { title, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-resistance-icon"];

    let SvgIcon: React.ComponentType<SvgInjectedProps> = theme?.isDarkMode
      ? DarkModePositiveResistanceSvg
      : PositiveResistanceSvg;

    return (
      <Tooltip title={title} isDarkMode={theme?.isDarkMode}>
        <SvgIcon className={classNames.join(" ")} />
      </Tooltip>
    );
  }
}
