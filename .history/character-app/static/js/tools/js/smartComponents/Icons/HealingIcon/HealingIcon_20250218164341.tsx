import * as React from "react";

import { Tooltip } from "../../character-common-components/es";
import { CharacterTheme } from "../../character-rules-engine/es";

import { DarkHealingSvg, GrayHealingSvg } from "../../Svg";

interface SvgInjectedProps {
  className?: string;
}
interface Props {
  className: string;
  isHp: boolean;
  isTemp: boolean;
  showTooltip: boolean;
  theme?: CharacterTheme;
}
export default class HealingIcon extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    isHp: false,
    isTemp: false,
    showTooltip: true,
  };

  render() {
    const { isHp, isTemp, showTooltip, className, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-healing-icon"];
    let tooltips: Array<string> = [];
    if (isHp) {
      classNames.push("ddbc-healing-icon--hp");
      tooltips.push("Healing");
    }
    if (isTemp) {
      classNames.push("ddbc-healing-icon--temp");
      tooltips.push("Temp HP Healing");
    }

    let SvgIcon: React.ComponentType<SvgInjectedProps> = theme?.isDarkMode
      ? GrayHealingSvg
      : DarkHealingSvg;

    return (
      <span className={classNames.join(" ")} aria-label="healing">
        <Tooltip
          title={tooltips.join(", ")}
          enabled={showTooltip}
          isDarkMode={theme?.isDarkMode}
        >
          <SvgIcon className="ddbc-healing-icon__icon" />
        </Tooltip>
      </span>
    );
  }
}
