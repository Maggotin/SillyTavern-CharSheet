import React from "react";

import {
  AbilityLookup,
  ActionUtils,
  ActivationUtils,
  Constants,
  DataOriginBaseAction,
  LimitedUseUtils,
  RuleData,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { FeatureSnippetLimitedUse } from "../FeatureSnippetLimitedUse";

interface Props {
  action: DataOriginBaseAction;

  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onActionClick?: (action: DataOriginBaseAction) => void;

  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  isInteractive: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class FeatureSnippetAction extends React.PureComponent<Props> {
  handleActionUseSet = (action: DataOriginBaseAction, uses: number): void => {
    const { onActionUseSet } = this.props;

    if (onActionUseSet) {
      onActionUseSet(action, uses);
    }
  };

  handleActionClick = (evt: React.MouseEvent): void => {
    const { action, onActionClick } = this.props;

    if (onActionClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onActionClick(action);
    }
  };

  render() {
    const {
      action,
      ruleData,
      abilityLookup,
      isInteractive,
      proficiencyBonus,
      theme,
    } = this.props;

    let limitedUse = ActionUtils.getLimitedUse(action);
    let name = ActionUtils.getName(action);
    let activation = ActionUtils.getActivation(action);
    let limitedUseLabel: string | null = null;
    if (limitedUse) {
      let maxUses = LimitedUseUtils.deriveMaxUses(
        limitedUse,
        abilityLookup,
        ruleData,
        proficiencyBonus
      );
      limitedUseLabel = maxUses > 1 ? "Uses:" : "";
    }
    let activationDisplay: string = "(No Action)";
    if (activation) {
      switch (activation.activationType) {
        case Constants.ActivationTypeEnum.ACTION:
        case Constants.ActivationTypeEnum.REACTION:
        case Constants.ActivationTypeEnum.BONUS_ACTION:
          activationDisplay = ActivationUtils.renderActivation(
            activation,
            ruleData
          );
          break;
        default:
        // not implemented
      }
    }

    return (
      <div
        className="ct-feature-snippet__action"
        onClick={this.handleActionClick}
      >
        <div
          className={`ct-feature-snippet__action-summary ${
            theme?.isDarkMode
              ? "ct-feature-snippet__action-summary--dark-mode"
              : ""
          }`}
        >
          {name}: {activationDisplay}
        </div>
        {limitedUse && (
          <div className="ct-feature-snippet__action-limited">
            {limitedUseLabel && (
              <div
                className={`ct-feature-snippet__action-limited-label ${
                  theme?.isDarkMode
                    ? "ct-feature-snippet__action-limited-label--dark-mode"
                    : ""
                }`}
              >
                {limitedUseLabel}
              </div>
            )}
            <FeatureSnippetLimitedUse
              component={action}
              limitedUse={limitedUse}
              onUseSet={this.handleActionUseSet}
              abilityLookup={abilityLookup}
              ruleData={ruleData}
              isInteractive={isInteractive}
              proficiencyBonus={proficiencyBonus}
              theme={theme}
            />
          </div>
        )}
      </div>
    );
  }
}
