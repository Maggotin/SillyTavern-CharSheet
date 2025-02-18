import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  ConditionUtils,
  Condition,
  CharacterTheme,
} from "../../rules-engine/es";

interface Props {
  className: string;
  condition: Condition;
  tooltipText: string;
  theme?: CharacterTheme;
}

export default class ConditionName extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
    tooltipText: "",
  };

  renderConditionLevel = (condition: Condition): React.ReactNode => {
    const levels = ConditionUtils.getLevels(condition);

    if (!levels.length) {
      return null;
    }

    return (
      <span className="ddbc-condition__level">
        {" "}
        (Level {ConditionUtils.getActiveLevel(condition)})
      </span>
    );
  };

  render() {
    const { className, condition, tooltipText, theme } = this.props;

    let classNames: Array<string> = [className, "ddbc-condition"];

    return (
      <span className={classNames.join(" ")}>
        <Tooltip
          title={tooltipText}
          enabled={!!tooltipText}
          isDarkMode={theme?.isDarkMode}
        >
          <span
            className={`ddbc-condition__name ${
              theme?.isDarkMode ? "ddbc-condition__name--dark-mode" : ""
            }`}
          >
            {ConditionUtils.getName(condition)}
            {this.renderConditionLevel(condition)}
          </span>
        </Tooltip>
      </span>
    );
  }
}
