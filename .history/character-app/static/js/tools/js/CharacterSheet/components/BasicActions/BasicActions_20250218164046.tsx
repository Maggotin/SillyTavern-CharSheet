import { orderBy } from "lodash";
import React from "react";

import {
  BasicActionContract,
  CharacterTheme,
} from "../../rules-engine/es";

interface Props {
  basicActions: Array<BasicActionContract>;
  onActionClick?: (basicAction: BasicActionContract) => void;
  theme: CharacterTheme;
}
export default class BasicActions extends React.PureComponent<Props> {
  handleActionClick = (
    basicAction: BasicActionContract,
    evt: React.MouseEvent
  ): void => {
    const { onActionClick } = this.props;

    if (onActionClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onActionClick(basicAction);
    }
  };

  render() {
    const { basicActions, theme } = this.props;

    if (!basicActions.length) {
      return null;
    }

    let orderedActions = orderBy(
      basicActions,
      [(basicAction) => basicAction.name],
      ["asc"]
    );

    return (
      <div
        className={`ct-basic-actions ${
          theme.isDarkMode ? "ct-basic-actions--dark-mode" : ""
        }`}
      >
        {orderedActions.map((basicAction, idx) => (
          <span
            className="ct-basic-actions__action"
            key={basicAction.id}
            onClick={this.handleActionClick.bind(this, basicAction)}
          >
            {basicAction.name}
            {idx + 1 < orderedActions.length && (
              <span className="ct-basic-actions__action-sep">,</span>
            )}
          </span>
        ))}
      </div>
    );
  }
}
