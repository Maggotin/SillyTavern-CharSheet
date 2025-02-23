import React from "react";

import {
  AbilityLookup,
  BaseFeat,
  CharacterTheme,
  Choice,
  ClassDefinitionContract,
  Constants,
  DataOriginBaseAction,
  DataOriginRefData,
  FeatUtils,
  Option,
  OptionUtils,
  RuleData,
  SnippetData,
  SourceData,
  Spell,
} from "@dndbeyond/character-rules-engine/es";

import FeatureSnippetOption from "../FeatureSnippetOption";

interface Props {
  choices?: Array<Choice>;
  options?: Array<Option>;

  onActionClick?: (action: DataOriginBaseAction) => void;
  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onSpellUseSet?: (spell: Spell, uses: number) => void;
  onSpellClick?: (spell: Spell) => void;

  feats?: Array<BaseFeat>;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  sourceDataLookup: Record<number, SourceData>;
  dataOriginRefData: DataOriginRefData;

  classLevel?: number;
  subclass?: ClassDefinitionContract | null;

  showDescription: boolean;
  isInteractive: boolean;
  proficiencyBonus: number;

  theme: CharacterTheme;
}
export default class FeatureSnippetChoices extends React.PureComponent<Props> {
  static defaultProps = {
    showDescription: false,
    isInteractive: true,
  };

  render() {
    const {
      options,
      choices,
      subclass,
      feats,
      snippetData,
      classLevel,
      ruleData,
      abilityLookup,
      sourceDataLookup,
      dataOriginRefData,
      onActionUseSet,
      onActionClick,
      onSpellClick,
      onSpellUseSet,
      showDescription,
      isInteractive,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!choices || !choices.length) {
      return null;
    }

    return (
      <div className="ct-feature-snippet__choices">
        {choices.map((choice, idx) => {
          const {
            id,
            type,
            optionValue,
            subType,
            options: choiceOptions,
          } = choice;

          let displayType: React.ReactNode;
          let selectedValue: React.ReactNode;
          switch (type) {
            case Constants.BuilderChoiceTypeEnum.RACIAL_TRAIT_OPTION:
            case Constants.BuilderChoiceTypeEnum.FEAT_OPTION:
            case Constants.BuilderChoiceTypeEnum.FEATURE_OPTION:
              displayType = "Feature Option";
              let selectedFeatureOption = options
                ? options.find((opt) => OptionUtils.getId(opt) === optionValue)
                : undefined;
              if (selectedFeatureOption) {
                selectedValue = (
                  <FeatureSnippetOption
                    option={selectedFeatureOption}
                    onSpellClick={onSpellClick}
                    onSpellUseSet={onSpellUseSet}
                    onActionClick={onActionClick}
                    onActionUseSet={onActionUseSet}
                    snippetData={snippetData}
                    classLevel={classLevel}
                    ruleData={ruleData}
                    abilityLookup={abilityLookup}
                    dataOriginRefData={dataOriginRefData}
                    sourceDataLookup={sourceDataLookup}
                    showDescription={showDescription}
                    isInteractive={isInteractive}
                    proficiencyBonus={proficiencyBonus}
                    theme={theme}
                  />
                );
              } else {
                selectedValue = "Could not find selected feature option";
              }
              break;

            case Constants.BuilderChoiceTypeEnum.FEAT_CHOICE_OPTION:
              displayType = "Feat";
              let selectedFeat = feats
                ? feats.find((feat) => FeatUtils.getId(feat) === optionValue)
                : undefined;
              selectedValue = selectedFeat
                ? FeatUtils.getName(selectedFeat)
                : "Could not find selected feat";
              break;

            case Constants.BuilderChoiceTypeEnum.ENTITY_SPELL_OPTION:
              //The actual rendering spells scenario is being handled in FeatureSnippetSpells only IF the choice is not null
              //This is a fix to show "No Choice Made" when FeatureSnippetSpells is not rendering anything
              displayType = "Spell";
              if (optionValue === null) selectedValue = "No Choice Made";
              else return null;

              break;

            case Constants.BuilderChoiceTypeEnum.SUB_CLASS_OPTION:
              displayType = "Subclass";
              selectedValue =
                subclass && subclass.name
                  ? subclass.name
                  : "Could not find selected subclass";
              break;

            case Constants.BuilderChoiceTypeEnum.ONE_MODIFIER_TYPE_CHOICE:
              displayType = "One Modifier Type Choice";
              let selectedOneModifier = choiceOptions
                ? choiceOptions.find((opt) => opt.id === optionValue)
                : undefined;
              selectedValue = selectedOneModifier
                ? selectedOneModifier.label
                : "Could not find selected one modifier type choice";
              break;

            case Constants.BuilderChoiceTypeEnum.MODIFIER_SUB_CHOICE:
              let selectedOption = choiceOptions
                ? choiceOptions.find((opt) => opt.id === optionValue)
                : undefined;
              selectedValue = selectedOption
                ? selectedOption.label
                : "could not find selected choice";
              switch (subType) {
                case Constants.BuilderChoiceSubtypeEnum.PROFICIENCY:
                  displayType = "Proficiency";
                  break;
                case Constants.BuilderChoiceSubtypeEnum.LANGUAGE:
                  displayType = "Language";
                  break;
                case Constants.BuilderChoiceSubtypeEnum.KENSEI:
                  displayType = "Kensei Option";
                  break;
                case Constants.BuilderChoiceSubtypeEnum.EXPERTISE:
                  displayType = "Expertise";
                  break;
                case Constants.BuilderChoiceSubtypeEnum
                  .EXPERTISE_NO_REQUIREMENT:
                  displayType = "Expertise";
                  break;
                case Constants.BuilderChoiceSubtypeEnum.ABILITY_SCORE: {
                  displayType = "Ability Score";
                  break;
                }
              }
              break;

            default:
              throw new Error(`Unknown BUILDER_CHOICE_TYPE: ${type}`);
          }

          return (
            <div
              className={`ct-feature-snippet__choice ${
                theme?.isDarkMode ? "ct-feature-snippet__choice--dark-mode" : ""
              }`}
              key={`${id}-${idx}`}
            >
              {optionValue === null
                ? "No Choice Made"
                : selectedValue
                ? selectedValue
                : "could not find selected value"}
            </div>
          );
          //`
        })}
      </div>
    );
  }
}
