import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  CharacterTheme,
  DamageAdjustmentContract,
} from "../../rules-engine/es";

interface Props {
  className: string;
  damageAdjustment: DamageAdjustmentContract;
  tooltipText: string;
  theme?: CharacterTheme;
}
export default class DamageAdjustment extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { className, damageAdjustment, tooltipText, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-damage-adjustment"];

    return (
      <span className={classNames.join(" ")}>
        <Tooltip
          title={tooltipText}
          enabled={!!tooltipText}
          isDarkMode={theme?.isDarkMode}
        >
          <span className="ddbc-damage-adjustment__preview">
            <i
              className={`ddbc-damage-adjustment__icon i-damage-adjustment-${damageAdjustment.slug}`}
            />
          </span>
          <span className="ddbc-damage-adjustment__name">
            {damageAdjustment.name}
          </span>
        </Tooltip>
      </span>
    );
  }
}
