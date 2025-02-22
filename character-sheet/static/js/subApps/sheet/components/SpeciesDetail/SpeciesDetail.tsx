import { FC } from "react";

import {
  AbilityLookup,
  Action,
  DataOriginRefData,
  Feat,
  RacialTrait,
  RacialTraitUtils,
  RuleData,
  SnippetData,
  Spell,
  CharacterTheme,
  FeatManager,
  CharacterFeaturesManager,
} from "@dndbeyond/character-rules-engine/es";

import { SpeciesTraitFeatureSnippet } from "~/tools/js/CharacterSheet/components/FeatureSnippet";

export interface SpeciesDetailProps {
  onActionUseSet: (action: Action, uses: number) => void;
  onActionClick: (action: Action) => void;
  onSpellClick: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, uses: number) => void;
  onFeatureClick: (feature: RacialTrait) => void;
  feats: Array<Feat>;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  speciesTraits: RacialTrait[];
  onFeatClick: (feat: FeatManager) => void;
  featuresManager: CharacterFeaturesManager
}

export const SpeciesDetail: FC<SpeciesDetailProps> = ({
  speciesTraits,
  onActionUseSet,
  onActionClick,
  onSpellClick,
  onSpellUseSet,
  ruleData,
  abilityLookup,
  dataOriginRefData,
  proficiencyBonus,
  theme,
  onFeatureClick,
  feats,
  isReadonly,
  snippetData,
  onFeatClick,
  featuresManager
}) => {
  if (speciesTraits.length === 0) {
    return null;
  }
  return (
    <div>
      {speciesTraits.map((speciesTrait) => (
        <SpeciesTraitFeatureSnippet
          key={RacialTraitUtils.getId(speciesTrait)}
          speciesTrait={speciesTrait}
          isReadonly={isReadonly}
          snippetData={snippetData}
          ruleData={ruleData}
          abilityLookup={abilityLookup}
          theme={theme}
          feats={feats}
          proficiencyBonus={proficiencyBonus}
          dataOriginRefData={dataOriginRefData}
          onActionUseSet={onActionUseSet}
          onActionClick={onActionClick}
          onSpellClick={onSpellClick}
          onSpellUseSet={onSpellUseSet}
          onFeatureClick={onFeatureClick}
          onFeatClick={onFeatClick}
          featuresManager={featuresManager}
        />
      ))}
    </div>
  );
};
