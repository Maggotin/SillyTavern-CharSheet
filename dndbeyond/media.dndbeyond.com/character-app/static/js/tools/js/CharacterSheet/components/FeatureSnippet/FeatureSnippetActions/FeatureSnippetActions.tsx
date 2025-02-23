import React from "react";

import {
  AbilityLookup,
  ActionUtils,
  DataOriginBaseAction,
  RuleData,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import FeatureSnippetAction from "../FeatureSnippetAction";

interface Props {
  actions: Array<DataOriginBaseAction>;

  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onActionClick?: (action: DataOriginBaseAction) => void;

  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  isInteractive: boolean;
  proficiencyBonus: number;

  theme: CharacterTheme;
}
export default class FeatureSnippetActions extends React.PureComponent<Props> {
  render() {
    const {
      actions,
      onActionUseSet,
      onActionClick,
      ruleData,
      abilityLookup,
      isInteractive,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!actions.length) {
      return null;
    }

    return (
      <div className="ct-feature-snippet__actions">
        {actions.map((action) => (
          <FeatureSnippetAction
            key={ActionUtils.getUniqueKey(action)}
            action={action}
            onActionUseSet={onActionUseSet}
            onActionClick={onActionClick}
            ruleData={ruleData}
            abilityLookup={abilityLookup}
            isInteractive={isInteractive}
            proficiencyBonus={proficiencyBonus}
            theme={theme}
          />
        ))}
      </div>
    );
  }
}
