import React from "react";

import {
  AbilityLookup,
  BaseFeat,
  CharClass,
  ClassFeature,
  ClassFeatureUtils,
  ClassUtils,
  DataOriginBaseAction,
  DataOriginRefData,
  DataOriginSpell,
  InfusionChoice,
  RuleData,
  SnippetData,
  AccessUtils,
  CharacterTheme,
  CharacterFeaturesManager,
  FeatManager,
} from "../../character-rules-engine/es";

import { DataOriginTypeEnum } from "~/constants";
import { FeatureSnippet } from "~/subApps/sheet/components/FeatureSnippet";

import FeatFeatureSnippet from "../FeatFeatureSnippet";

interface Props {
  feature: ClassFeature;
  charClass: CharClass;
  extraMeta: Array<string>;
  onActionClick: (action: DataOriginBaseAction) => void;
  onActionUseSet: (action: DataOriginBaseAction, uses: number) => void;
  onSpellClick: (spell: DataOriginSpell) => void;
  onSpellUseSet: (spell: DataOriginSpell, uses: number) => void;
  onFeatureClick: (feat: ClassFeature, charClass: CharClass) => void;
  onInfusionChoiceClick: (infusionChoice: InfusionChoice) => void;

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
export default class ClassFeatureSnippet extends React.PureComponent<Props> {
  static defaultProps = {
    extraMeta: [],
    showDescription: false,
  };

  handleFeatureClick = (): void => {
    const { feature, charClass, onFeatureClick } = this.props;

    if (onFeatureClick) {
      onFeatureClick(feature, charClass);
    }
  };

  renderDescription = (): React.ReactNode => {
    const { feature, showDescription } = this.props;

    const description: string | null = AccessUtils.isAccessible(
      ClassFeatureUtils.getAccessType(feature)
    )
      ? ClassFeatureUtils.getDescription(feature)
      : "Check out the Marketplace to unlock this Class Feature.";

    return showDescription
      ? description
      : ClassFeatureUtils.getSnippet(feature);
  };

  render() {
    const {
      feature,
      charClass,
      onFeatureClick,
      showDescription,
      featuresManager,
      onFeatClick,
      ...restProps
    } = this.props;

    const feats = [
      // Both primary and parent. Feats from the Granted Feat system have the class feature as a parent.
      ...featuresManager.getDataOriginOnlyFeatsByPrimary(
        DataOriginTypeEnum.CLASS_FEATURE,
        `${ClassFeatureUtils.getId(feature)}`
      ),
      ...featuresManager.getDataOriginOnlyFeatsByParent(
        DataOriginTypeEnum.CLASS_FEATURE,
        `${ClassFeatureUtils.getId(feature)}`
      ),
    ];

    // When the class feature grants feats, show those rather than the class feature.
    return feats.length ? (
      feats.map((feat) => (
        <FeatFeatureSnippet
          {...restProps}
          key={feat.getId()}
          feat={feat}
          onFeatureClick={onFeatClick}
        />
      ))
    ) : (
      <FeatureSnippet
        {...restProps}
        heading={ClassFeatureUtils.getName(feature)}
        className="ct-feature-snippet--class"
        levelScale={ClassFeatureUtils.getLevelScale(feature)}
        actions={ClassFeatureUtils.getActions(feature)}
        options={ClassFeatureUtils.getOptions(feature)}
        choices={ClassFeatureUtils.getChoices(feature)}
        infusionChoices={ClassFeatureUtils.getInfusionChoices(feature)}
        classLevel={ClassUtils.getLevel(charClass)}
        subclass={ClassUtils.getSubclass(charClass)}
        spells={ClassFeatureUtils.getSpells(feature)}
        sourceId={ClassFeatureUtils.getSourceId(feature)}
        sourcePage={ClassFeatureUtils.getSourcePage(feature)}
        onFeatureClick={this.handleFeatureClick}
        showDescription={showDescription}
      >
        {this.renderDescription()}
      </FeatureSnippet>
    );
  }
}
