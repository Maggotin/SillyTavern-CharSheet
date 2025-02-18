import React from "react";

import { ConditionName } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  Condition,
  ConditionUtils,
} from "../../character-rules-engine/es";

interface Props {
  conditions: Array<Condition>;
  onClick: () => void;
  theme: CharacterTheme;
}
export default class ConditionsSummary extends React.PureComponent<Props> {
  handleClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  renderConditions = (): React.ReactNode => {
    const { conditions, theme } = this.props;

    return (
      <React.Fragment>
        {conditions.map((condition) => (
          <ConditionName
            theme={theme}
            key={ConditionUtils.getUniqueKey(condition)}
            condition={condition}
          />
        ))}
      </React.Fragment>
    );
  };

  renderDefault = (): React.ReactNode => {
    const { theme } = this.props;
    return (
      <div
        className={`ct-conditions-summary__default ${
          theme.isDarkMode ? "ct-conditions-summary__default--dark-mode" : ""
        }`}
      >
        Add Active Conditions
      </div>
    );
  };

  render() {
    const { conditions } = this.props;

    let contentNode: React.ReactNode;
    if (conditions.length) {
      contentNode = this.renderConditions();
    } else {
      contentNode = this.renderDefault();
    }

    return (
      <div className="ct-conditions-summary" onClick={this.handleClick}>
        {contentNode}
      </div>
    );
  }
}
