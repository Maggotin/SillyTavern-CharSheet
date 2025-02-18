import React, { useContext } from "react";

import {
  AbilityLookup,
  Action,
  CharacterTheme,
  DataOriginRefData,
  FeatManager,
  RuleData,
  SnippetData,
  Spell,
} from "../../rules-engine/es";

import { CharacterFeaturesManagerContext } from "../../../Shared/managers/CharacterFeaturesManagerContext";
import { FeatFeatureSnippet } from "../FeatureSnippet";

interface Props {
  onActionUseSet: (action: Action, uses: number) => void;
  onActionClick: (action: Action) => void;
  onSpellClick: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, uses: number) => void;
  onFeatureClick: (feat: FeatManager) => void;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export const FeatsDetail: React.FC<Props> = ({
  dataOriginRefData,
  onActionUseSet,
  onActionClick,
  onSpellClick,
  onSpellUseSet,
  ruleData,
  snippetData,
  isReadonly,
  theme,
  onFeatureClick,
  proficiencyBonus,
  abilityLookup,
}) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );
  const currentFeats = characterFeaturesManager.getStandardFeats();

  return (
    <div className="ct-feats-detail">
      {currentFeats.length ? (
        <React.Fragment>
          {currentFeats.map((feat) => (
            <FeatFeatureSnippet
              key={feat.getId()}
              feat={feat}
              dataOriginRefData={dataOriginRefData}
              onActionUseSet={onActionUseSet}
              onActionClick={onActionClick}
              onSpellClick={onSpellClick}
              onSpellUseSet={onSpellUseSet}
              ruleData={ruleData}
              snippetData={snippetData}
              isReadonly={isReadonly}
              onFeatureClick={() => onFeatureClick(feat)}
              proficiencyBonus={proficiencyBonus}
              abilityLookup={abilityLookup}
              theme={theme}
            />
          ))}
        </React.Fragment>
      ) : (
        <div
          className={`ct-feats-detail__default ${
            theme.isDarkMode ? "ct-feats-detail__default--dark-mode" : ""
          }`}
        >
          <p>
            You have no feats chosen, you can add feats outside of normal
            progression in the manage screen.
          </p>
        </div>
      )}
    </div>
  );
};
export default FeatsDetail;
