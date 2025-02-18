import React from "react";

import {
  AbilityLookup,
  Action,
  Background,
  BackgroundUtils,
  CharacterFeaturesManager,
  CharacterTheme,
  DataOriginRefData,
  FeatManager,
  RuleData,
  SnippetData,
  Spell,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { DataOriginTypeEnum } from "~/constants";

import { FeatFeatureSnippet } from "../FeatureSnippet";

interface Props {
  background: Background | null;
  onClick: () => void;
  onFeatClick?: (feat: FeatManager) => void;
  featuresManager: CharacterFeaturesManager;
  onActionUseSet: (action: Action, uses: number) => void;
  onActionClick?: (action: Action) => void;
  onSpellClick?: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, uses: number) => void;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class BackgroundDetail extends React.PureComponent<Props> {
  handleBackgroundClick = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  renderDefault = (): React.ReactNode => {
    return (
      <div className="ct-background__default">
        Your character's background feature will display in this section once
        chosen.
      </div>
    );
  };

  render() {
    const { background, featuresManager, onFeatClick, ...restProps } =
      this.props;

    if (!background) {
      return this.renderDefault();
    }

    const name = BackgroundUtils.getName(background);
    const featureName = BackgroundUtils.getFeatureName(background);
    const featureDescription =
      BackgroundUtils.getFeatureDescription(background);

    const feats = featuresManager.getDataOriginOnlyFeatsByParent(
      DataOriginTypeEnum.BACKGROUND,
      `${BackgroundUtils.getId(background)}`
    );

    return (
      <div className="ct-background" onClick={this.handleBackgroundClick}>
        <div className="ct-background__name">{name}</div>
        <>
          {featureDescription && (
            <div className="ct-background__feature">
              <div className="ct-background__feature-name">
                {featureName ? `Feature: ${featureName}` : "Feature"}
              </div>
              <HtmlContent
                className="ct-background__feature-description"
                html={featureDescription}
                withoutTooltips
              />
            </div>
          )}
          {feats.map((feat) => (
            <FeatFeatureSnippet key={feat.getId()} feat={feat} {...restProps} />
          ))}
        </>
      </div>
    );
  }
}
