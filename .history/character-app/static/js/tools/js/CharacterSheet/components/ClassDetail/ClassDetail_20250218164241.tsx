import React from "react";

import {
  AbilityLookup,
  Action,
  CharClass,
  CharacterFeaturesManager,
  CharacterTheme,
  ClassFeature,
  ClassFeatureUtils,
  ClassUtils,
  DataOriginRefData,
  Feat,
  FeatManager,
  InfusionChoice,
  RuleData,
  SnippetData,
  Spell,
} from "../../character-rules-engine/es";

import { ClassFeatureSnippet } from "../FeatureSnippet";

interface Props {
  charClass: CharClass;
  onActionUseSet: (action: Action, uses: number) => void;
  onActionClick: (action: Action) => void;
  onSpellClick: (spell: Spell) => void;
  onSpellUseSet: (spell: Spell, uses: number) => void;
  onFeatureClick: (feature: ClassFeature, charClass: CharClass) => void;
  onInfusionChoiceClick: (infusionChoice: InfusionChoice) => void;
  feats: Array<Feat>;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
  onFeatClick: (feat: FeatManager) => void;
  featuresManager: CharacterFeaturesManager
}
export default class ClassDetail extends React.PureComponent<Props> {
  render() {
    const { charClass, ...restProps } = this.props;

    return (
      <div className="ct-class-detail">
        <div className="ct-class-detail__name">
          {ClassUtils.getName(charClass)} Features
        </div>
        <div className="ct-class-detail__features">
          {ClassUtils.getUniqueClassFeatures(charClass).map((feature) => (
            <ClassFeatureSnippet
              {...restProps}
              key={ClassFeatureUtils.getId(feature)}
              feature={feature}
              charClass={charClass}
            />
          ))}
        </div>
      </div>
    );
  }
}
