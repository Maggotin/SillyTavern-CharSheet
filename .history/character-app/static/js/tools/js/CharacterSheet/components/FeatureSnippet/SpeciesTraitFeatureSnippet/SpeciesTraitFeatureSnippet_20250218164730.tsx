import React from "react";
import { RacialTraitAccessors } from "@dndbeyond/character-rules-engine/es/engine/RacialTrait";
import {
  AbilityLookup,
  BaseFeat,
  DataOriginBaseAction,
  DataOriginRefData,
  DataOriginSpell,
  RacialTrait,
  RacialTraitUtils,
  RuleData,
  SnippetData,
  AccessUtils,
  CharacterTheme,
  FeatManager,
  CharacterFeaturesManager,
} from "../../character-rules-engine/es";


import { DataOriginTypeEnum } from "~/constants";
import { FeatureSnippet } from "~/subApps/sheet/components/FeatureSnippet";

import FeatFeatureSnippet from "../FeatFeatureSnippet";

interface Props {
  speciesTrait: RacialTrait;
  extraMeta: Array<string>;
  onActionClick?: (action: DataOriginBaseAction) => void;
  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onSpellClick?: (spell: DataOriginSpell) => void;
  onSpellUseSet?: (spell: DataOriginSpell, uses: number) => void;
  onFeatureClick?: (feature: RacialTrait) => void;
  showHeader?: boolean;
  showDescription?: boolean;
  feats: Array<BaseFeat>;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  onFeatClick: (feat: FeatManager) => void;
  featuresManager: CharacterFeaturesManager;
}
export default class SpeciesTraitFeatureSnippet extends React.PureComponent<Props> {
  static defaultProps = {
    extraMeta: [],
    showDescription: false,
  };

  handleFeatureClick = (): void => {
    const { speciesTrait, onFeatureClick } = this.props;

    if (onFeatureClick) {
      onFeatureClick(speciesTrait);
    }
  };

  renderDescription = (): React.ReactNode => {
    const { speciesTrait, showDescription } = this.props;

    const description: string | null = AccessUtils.isAccessible(
      RacialTraitUtils.getAccessType(speciesTrait)
    )
      ? RacialTraitUtils.getDescription(speciesTrait)
      : "Check out the Marketplace to unlock this Species Trait.";

    return showDescription
      ? description
      : RacialTraitUtils.getSnippet(speciesTrait);
  };

  render() {
    const {
      speciesTrait,
      onFeatureClick,
      showDescription,
      featuresManager,
      onFeatClick,
      ...restProps
    } = this.props;

    const feats = featuresManager.getDataOriginOnlyFeatsByPrimary(
      DataOriginTypeEnum.RACE,
      `${RacialTraitAccessors.getId(speciesTrait)}`
    );

    return (
      <>
        <FeatureSnippet
          {...restProps}
          heading={RacialTraitUtils.getName(speciesTrait)}
          className="ct-feature-snippet--racial-trait"
          actions={RacialTraitUtils.getActions(speciesTrait)}
          options={RacialTraitUtils.getOptions(speciesTrait)}
          choices={RacialTraitUtils.getChoices(speciesTrait)}
          spells={RacialTraitUtils.getSpells(speciesTrait)}
          sourceId={RacialTraitUtils.getSourceId(speciesTrait)}
          sourcePage={RacialTraitUtils.getSourcePage(speciesTrait)}
          onFeatureClick={this.handleFeatureClick}
          showDescription={showDescription}
        >
          {this.renderDescription()}
        </FeatureSnippet>
        {feats.map((feat) => (
          <FeatFeatureSnippet
            {...restProps}
            key={feat.getId()}
            feat={feat}
            onFeatureClick={onFeatClick}
          />
        ))}
      </>
    );
  }
}
