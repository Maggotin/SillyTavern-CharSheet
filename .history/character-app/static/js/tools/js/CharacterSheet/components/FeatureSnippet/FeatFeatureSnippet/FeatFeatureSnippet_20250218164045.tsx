import React, { useContext } from "react";

import {
  AbilityLookup,
  Action,
  CharacterTheme,
  CharacterUtils,
  DataOriginRefData,
  FeatManager,
  RuleData,
  SnippetData,
  SourceMappingContract,
  Spell,
} from "../../rules-engine/es";

import { useCharacterEngine } from "~/hooks/useCharacterEngine";
import { FeatureSnippet } from "~/subApps/sheet/components/FeatureSnippet";

import { CharacterFeaturesManagerContext } from "../../../../Shared/managers/CharacterFeaturesManagerContext";

interface Props {
  feat: FeatManager;
  extraMeta?: Array<string>;
  onActionClick?: (action: Action) => void;
  onActionUseSet?: (action: Action, uses: number) => void;
  onSpellClick?: (spell: Spell) => void;
  onSpellUseSet?: (spell: Spell, uses: number) => void;
  onFeatureClick?: (feat: FeatManager) => void;

  showHeader?: boolean;
  showDescription?: boolean;

  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export const FeatFeatureSnippet: React.FC<Props> = ({
  feat,
  onFeatureClick,
  snippetData,
  ruleData,
  abilityLookup,
  dataOriginRefData,
  proficiencyBonus,
  theme,
  isReadonly,
  onActionClick,
  onSpellClick,
  onSpellUseSet,
  onActionUseSet,
  showHeader,
  extraMeta = [],
  showDescription = false,
}) => {
  const { characterFeaturesManager } = useContext(
    CharacterFeaturesManagerContext
  );
  const currentFeats = characterFeaturesManager.getFeats();
  const { entityUtils } = useCharacterEngine();

  let sourceId: number | null = null;
  let sourcePage: number | null = null;
  let filteredSources = feat
    .getSources()
    .filter(CharacterUtils.isPrimarySource);
  let dataOrigin = feat.getDataOrigin();
  const dataOriginExtra = entityUtils.getDataOriginName(
    dataOrigin,
    "Unknown",
    true
  );

  if (filteredSources.length) {
    let primarySource: SourceMappingContract = filteredSources[0];
    sourceId = primarySource.sourceId;
    sourcePage = primarySource.pageNumber;
  }

  return (
    <FeatureSnippet
      snippetData={snippetData}
      ruleData={ruleData}
      abilityLookup={abilityLookup}
      dataOriginRefData={dataOriginRefData}
      proficiencyBonus={proficiencyBonus}
      theme={theme}
      isReadonly={isReadonly}
      extraMeta={extraMeta}
      onActionClick={onActionClick}
      onActionUseSet={onActionUseSet}
      onSpellClick={onSpellClick}
      onSpellUseSet={onSpellUseSet}
      showHeader={showHeader}
      feats={currentFeats.map((feat) => feat.feat)}
      dataOriginExtra={dataOriginExtra}
      heading={feat.getName()}
      className="ct-feature-snippet--feat"
      actions={feat.getActions()}
      options={feat.getOptions()}
      choices={feat.getChoices()}
      spells={feat.getSpells()}
      sourceId={sourceId}
      sourcePage={sourcePage}
      onFeatureClick={() => {
        if (onFeatureClick) {
          onFeatureClick(feat);
        }
      }}
      showDescription={showDescription}
    >
      {showDescription ? feat.getDescription() : feat.getSnippet()}
    </FeatureSnippet>
  );
};

export default FeatFeatureSnippet;
