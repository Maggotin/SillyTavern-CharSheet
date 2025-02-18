import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  Action,
  ActionUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";

interface Props {
  action: Action;
  onClick?: (action: Action) => void;
  className: string;
  theme?: CharacterTheme;
}
export default class ActionName extends React.PureComponent<Props> {
  static defaultProps = {
    className: "",
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, action } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      onClick(action);
    }
  };

  render() {
    const { action, className, theme } = this.props;

    let isCustomized = ActionUtils.isCustomized(action);
    let classNames: Array<string> = [className, "ddbc-action-name"];

    return (
      <span className={classNames.join(" ")} onClick={this.handleClick}>
        {ActionUtils.getName(action)}
        {isCustomized && (
          <Tooltip
            title="Action is Customized"
            className="ddbc-action-name__customized"
            isDarkMode={theme?.isDarkMode}
          >
            *
          </Tooltip>
        )}
      </span>
    );
  }
}
