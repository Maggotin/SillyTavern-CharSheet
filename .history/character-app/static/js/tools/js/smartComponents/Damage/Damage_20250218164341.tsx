import * as React from "react";

import { Tooltip } from "../../character-common-components/es";
import {
  CharacterTheme,
  DiceContract,
  DiceUtils,
  FormatUtils,
} from "../../character-rules-engine/es";

import { DamageTypeIcon } from "../Icons";
import { DamageTypePropType } from "../Icons/IconConstants";

export interface Props {
  className: string;
  damage: DiceContract | string | number | null;
  type: string | null;
  info?: string;
  isVersatile: boolean;
  showInfoTooltip: boolean;
  showInfoInline: boolean;
  theme?: CharacterTheme;
}
export default class Damage extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
    type: null,
    isVersatile: false,
    showInfoTooltip: true,
    showInfoInline: false,
  };

  render() {
    const {
      className,
      damage,
      type,
      isVersatile,
      info,
      showInfoInline,
      showInfoTooltip,
      theme,
    } = this.props;

    let displayDamage: React.ReactNode;
    if (damage !== null) {
      if (typeof damage === "string" || typeof damage === "number") {
        displayDamage = damage;
      } else {
        displayDamage = DiceUtils.renderDice(damage);
      }
    }

    let classNames: Array<string> = [className, "ddbc-damage"];
    if (isVersatile) {
      classNames.push("ddbc-damage--versatile");
    }
    if (theme?.isDarkMode) {
      classNames.push("ddbc-damage--dark-mode");
    }

    let tooltipContent: string | null = null;
    if (showInfoTooltip && (info || type)) {
      tooltipContent = info ? info : type;
    }

    return (
      <Tooltip
        isDarkMode={theme?.isDarkMode}
        className={classNames.join(" ")}
        title={tooltipContent === null ? "" : tooltipContent}
        enabled={showInfoTooltip && tooltipContent !== null}
      >
        <span
          className={`ddbc-damage__value ${
            theme?.isDarkMode ? "ddbc-damage__value--dark-mode" : ""
          }`}
        >
          {displayDamage}
        </span>
        {!isVersatile && !!type && (
          <span className="ddbc-damage__icon">
            <DamageTypeIcon
              theme={theme}
              type={FormatUtils.slugify(type) as DamageTypePropType}
              showTooltip={!showInfoTooltip}
            />
          </span>
        )}
        {showInfoInline && <span className="ddbc-damage__info">{info}</span>}
      </Tooltip>
    );
  }
}
