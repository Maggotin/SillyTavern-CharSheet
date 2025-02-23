import React from "react";

import {
  Action,
  ActionUtils,
  ActivationUtils,
  Constants,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import { RemoveButton } from "../../../../components/common/Button";

interface Props {
  action: Action;
  ruleData: RuleData;
  onDetailShow?: (action: Action) => void;
  onRemove?: (action: Action) => void;
}
export default class CustomActionsPaneSummary extends React.PureComponent<Props> {
  handleDetailShow = (evt: React.MouseEvent): void => {
    const { onDetailShow, action } = this.props;

    if (onDetailShow) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onDetailShow(action);
    }
  };

  handleRemove = (): void => {
    const { onRemove, action } = this.props;

    if (onRemove) {
      onRemove(action);
    }
  };

  render() {
    const { ruleData, action } = this.props;

    let name = ActionUtils.getName(action);
    let typeId = ActionUtils.getActionTypeId(action);
    let activationInfo = ActionUtils.getActivation(action);

    let typeLabel: string = "";
    switch (typeId) {
      case Constants.ActionTypeEnum.GENERAL:
        typeLabel = "General";
        break;
      case Constants.ActionTypeEnum.SPELL:
        typeLabel = "Spell";
        break;
      case Constants.ActionTypeEnum.WEAPON:
        typeLabel = "Weapon";
        break;
      default:
      // not implemented
    }

    return (
      <div
        className="ct-custom-actions-pane__summary"
        onClick={this.handleDetailShow}
      >
        <div className="ct-custom-actions-pane__summary-content">
          <div className="ct-custom-actions-pane__summary-name">
            {name ? name : "--"}
          </div>
          {activationInfo !== null && (
            <div className="ct-custom-actions-pane__summary-meta">
              {ActivationUtils.renderActivation(activationInfo, ruleData)}
            </div>
          )}
        </div>
        <div className="ct-custom-actions-pane__summary-actions">
          <div className="ct-custom-actions-pane__summary-action ct-custom-actions-pane__summary-action--remove">
            <RemoveButton onClick={this.handleRemove}>
              Remove Action
            </RemoveButton>
          </div>
        </div>
      </div>
    );
  }
}
