import { keyBy } from "lodash";
import React from "react";

import { Snippet } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  BaseSpell,
  BaseFeat,
  Choice,
  ChoiceUtils,
  ClassDefinitionContract,
  Constants,
  DataOriginBaseAction,
  DataOriginRefData,
  InfusionChoice,
  LevelScaleContract,
  Option,
  OptionUtils,
  RuleData,
  RuleDataUtils,
  SnippetData,
  CharacterTheme,
} from "../../rules-engine/es";

import { Reference } from "~/components/Reference";
import FeatureSnippetActions from "~/tools/js/CharacterSheet/components/FeatureSnippet/FeatureSnippetActions";
import FeatureSnippetChoices from "~/tools/js/CharacterSheet/components/FeatureSnippet/FeatureSnippetChoices";
import FeatureSnippetInfusionChoices from "~/tools/js/CharacterSheet/components/FeatureSnippet/FeatureSnippetInfusionChoices";
import FeatureSnippetOption from "~/tools/js/CharacterSheet/components/FeatureSnippet/FeatureSnippetOption";
import FeatureSnippetSpells from "~/tools/js/CharacterSheet/components/FeatureSnippet/FeatureSnippetSpells";

import styles from "./styles.module.css";

//TODO: tools/js/CharacterSheet/components/FeatureSnipper components still need to be gradually migrated to FC
interface Props {
  heading: React.ReactNode;
  dataOriginExtra?: string;
  extraMeta: Array<string>;
  className: string;
  snippetData: SnippetData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  sourceId: number | null;
  sourcePage: number | null;

  spells: Array<BaseSpell>;
  feats: Array<BaseFeat>;
  actions: Array<DataOriginBaseAction>;
  options: Array<Option>;
  choices: Array<Choice>;
  infusionChoices?: Array<InfusionChoice>;
  dataOriginRefData: DataOriginRefData;

  levelScale?: LevelScaleContract | null;
  classLevel?: number;
  subclass?: ClassDefinitionContract | null;

  onActionClick?: (action: DataOriginBaseAction) => void;
  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onSpellClick?: (spell: BaseSpell) => void;
  onSpellUseSet?: (spell: BaseSpell, uses: number) => void;
  onFeatureClick: () => void;
  onInfusionChoiceClick?: (infusionChoice: InfusionChoice) => void;

  showHeader?: boolean;
  showDescription?: boolean;

  isReadonly: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}

export const FeatureSnippet: React.FC<Props> = ({
  heading,
  dataOriginExtra,
  extraMeta = [],
  choices,
  actions,
  spells,
  infusionChoices = [],
  className,
  snippetData,
  sourceId,
  sourcePage,
  classLevel,
  levelScale,
  children,
  abilityLookup,
  ruleData,
  subclass,
  options,
  feats,
  dataOriginRefData,
  onActionUseSet,
  onActionClick,
  onSpellClick,
  onSpellUseSet,
  onInfusionChoiceClick,
  onFeatureClick,
  showHeader = true,
  showDescription = false,
  isReadonly,
  proficiencyBonus,
  theme,
}) => {
  const handleFeatureClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    if (onFeatureClick) {
      onFeatureClick();
    }
  };

  const getNonChoiceOptions = (): Array<Option> => {
    let optionLookup = keyBy(options, (option) => OptionUtils.getId(option));
    let usedOptionIds: Array<number> = [];

    choices.forEach((choice) => {
      const type = ChoiceUtils.getType(choice);
      const optionValue = ChoiceUtils.getOptionValue(choice);

      switch (type) {
        case Constants.BuilderChoiceTypeEnum.RACIAL_TRAIT_OPTION:
        case Constants.BuilderChoiceTypeEnum.FEAT_OPTION:
        case Constants.BuilderChoiceTypeEnum.FEATURE_OPTION:
          if (optionValue !== null && optionLookup[optionValue]) {
            usedOptionIds.push(optionValue);
          }
          break;
      }
    });

    return options.filter(
      (option) => !usedOptionIds.includes(OptionUtils.getId(option))
    );
  };

  const nonChoiceOptions = getNonChoiceOptions();
  const classNames = [styles.snippet, className];
  const metaItems: Array<React.ReactNode> = [];

  if (levelScale) {
    metaItems.push(
      <span className={styles.levelScale}>{levelScale.description}</span>
    );
  }

  metaItems.push(...extraMeta);

  const sourceDataLookup = RuleDataUtils.getSourceDataLookup(ruleData);

  if (sourceId) {
    metaItems.push(
      <Reference name={sourceDataLookup[sourceId]?.name} page={sourcePage} />
    );
  }

  return (
    <div className={classNames.join(" ")} onClick={handleFeatureClick}>
      {showHeader && (
        <div
          className={`${styles.heading} ${
            theme?.isDarkMode ? styles.headingDarkMode : ""
          }`}
        >
          {heading}
          <span className={styles.meta}>
            {metaItems.map((metaItem, idx) => (
              <span
                className={`${styles.metaItem} ${
                  theme?.isDarkMode ? styles.metaItemDarkMode : ""
                }`}
                key={idx}
              >
                {metaItem}
              </span>
            ))}
          </span>
          {dataOriginExtra && dataOriginExtra !== "Unknown" && (
            <div>
              <span className={styles.origin}>
                <span className={styles.originLabel}>From</span>
                <span className={styles.originName}>{dataOriginExtra}</span>
              </span>
            </div>
          )}
        </div>
      )}
      <div className={styles.content}>
        <Snippet
          snippetData={snippetData}
          levelScale={levelScale}
          classLevel={classLevel}
          parseSnippet={!showDescription}
          proficiencyBonus={proficiencyBonus}
          theme={theme}
        >
          {children}
        </Snippet>
      </div>
      {(choices.length > 0 ||
        actions.length > 0 ||
        spells.length > 0 ||
        nonChoiceOptions.length > 0) && (
        <div
          className={styles.extra}
          style={
            theme?.isDarkMode ? { borderColor: theme.themeColor } : undefined
          }
        >
          <FeatureSnippetChoices
            choices={choices}
            options={options}
            onSpellClick={onSpellClick}
            onSpellUseSet={onSpellUseSet}
            onActionUseSet={onActionUseSet}
            onActionClick={onActionClick}
            ruleData={ruleData}
            abilityLookup={abilityLookup}
            subclass={subclass}
            feats={feats}
            sourceDataLookup={sourceDataLookup}
            classLevel={classLevel}
            snippetData={snippetData}
            dataOriginRefData={dataOriginRefData}
            showDescription={showDescription}
            isInteractive={!isReadonly}
            proficiencyBonus={proficiencyBonus}
            theme={theme}
          />
          <FeatureSnippetActions
            actions={actions}
            abilityLookup={abilityLookup}
            ruleData={ruleData}
            onActionClick={onActionClick}
            onActionUseSet={onActionUseSet}
            isInteractive={!isReadonly}
            proficiencyBonus={proficiencyBonus}
            theme={theme}
          />
          <FeatureSnippetSpells
            spells={spells}
            abilityLookup={abilityLookup}
            ruleData={ruleData}
            onSpellClick={onSpellClick}
            onSpellUseSet={onSpellUseSet}
            isInteractive={!isReadonly}
            dataOriginRefData={dataOriginRefData}
            proficiencyBonus={proficiencyBonus}
            theme={theme}
          />
          {nonChoiceOptions.length > 0 && (
            <div className={styles.options}>
              {nonChoiceOptions.map((option) => (
                <FeatureSnippetOption
                  key={OptionUtils.getId(option)}
                  option={option}
                  onSpellClick={onSpellClick}
                  onSpellUseSet={onSpellUseSet}
                  onActionUseSet={onActionUseSet}
                  onActionClick={onActionClick}
                  abilityLookup={abilityLookup}
                  ruleData={ruleData}
                  sourceDataLookup={sourceDataLookup}
                  classLevel={classLevel}
                  snippetData={snippetData}
                  showDescription={showDescription}
                  isInteractive={!isReadonly}
                  dataOriginRefData={dataOriginRefData}
                  proficiencyBonus={proficiencyBonus}
                  theme={theme}
                />
              ))}
            </div>
          )}
          <FeatureSnippetInfusionChoices
            infusionChoices={infusionChoices}
            onInfusionChoiceClick={onInfusionChoiceClick}
          />
        </div>
      )}
    </div>
  );
};
