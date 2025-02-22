import { orderBy } from "lodash";
import React from "react";

import {
  AbilityLookup,
  Action,
  CharacterFeaturesManager,
  CharacterTheme,
  CharClass,
  ClassFeature,
  ClassUtils,
  DataOriginRefData,
  Feat,
  FeatManager,
  InfusionChoice,
  RuleData,
  SnippetData,
  Spell,
} from "@dndbeyond/character-rules-engine/es";

import ClassDetail from "../ClassDetail";

interface Props {
  classes: Array<CharClass>;
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
const ClassesDetail: React.FC<Props> = ({
  classes,
  isReadonly,
  snippetData,
  ruleData,
  abilityLookup,
  dataOriginRefData,
  proficiencyBonus,
  theme,
  onFeatureClick,
  feats,
  onActionClick,
  onSpellClick,
  onSpellUseSet,
  onActionUseSet,
  onInfusionChoiceClick,
  onFeatClick,
  featuresManager
}) => {
  let orderedClasses = orderBy(classes, (charClass) =>
    ClassUtils.getName(charClass)
  );

  return (
    <div className="ct-classes-detail">
      {orderedClasses.map((charClass) => (
        <ClassDetail
          key={ClassUtils.getId(charClass)}
          charClass={charClass}
          onFeatureClick={onFeatureClick}
          onSpellUseSet={onSpellUseSet}
          ruleData={ruleData}
          abilityLookup={abilityLookup}
          dataOriginRefData={dataOriginRefData}
          proficiencyBonus={proficiencyBonus}
          theme={theme}
          onSpellClick={onSpellClick}
          onActionClick={onActionClick}
          feats={feats}
          snippetData={snippetData}
          onInfusionChoiceClick={onInfusionChoiceClick}
          isReadonly={isReadonly}
          onActionUseSet={onActionUseSet}
          onFeatClick={onFeatClick}
          featuresManager={featuresManager}
        />
      ))}
    </div>
  );
};

export default ClassesDetail;
