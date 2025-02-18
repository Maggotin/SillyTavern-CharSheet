import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { Snippet } from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  CharacterTheme,
  DataOriginBaseAction,
  DataOriginRefData,
  Option,
  OptionUtils,
  RuleData,
  SnippetData,
  SourceData,
  Spell,
} from "../../rules-engine/es";

import { FeatureSnippetActions } from "../FeatureSnippetActions";
import { FeatureSnippetSpells } from "../FeatureSnippetSpells";

interface Props {
  option: Option;

  onActionClick?: (action: DataOriginBaseAction) => void;
  onActionUseSet?: (action: DataOriginBaseAction, uses: number) => void;
  onSpellClick?: (spell: Spell) => void;
  onSpellUseSet?: (spell: Spell, uses: number) => void;
  onOptionClick?: () => void;

  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  sourceDataLookup: Record<number, SourceData>;
  dataOriginRefData: DataOriginRefData;

  snippetData: SnippetData;
  classLevel?: number;

  showDescription: boolean;
  isInteractive: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class FeatureSnippetOption extends React.PureComponent<Props> {
  static defaultProps = {
    showDescription: false,
  };

  handleOptionClick = (evt: React.MouseEvent): void => {
    const { onOptionClick } = this.props;

    if (onOptionClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onOptionClick();
    }
  };

  render() {
    const {
      option,
      snippetData,
      classLevel,
      abilityLookup,
      ruleData,
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

    let sourceId = OptionUtils.getSourceId(option);
    let sourcePage = OptionUtils.getSourcePage(option);
    let name = OptionUtils.getName(option);
    let content: string | null = showDescription
      ? OptionUtils.getDescription(option)
      : OptionUtils.getSnippet(option);

    const actions = OptionUtils.getActions(option);
    const spells = OptionUtils.getSpells(option);

    let metaItems: Array<React.ReactNode> = [];
    let sourceNode: React.ReactNode;
    if (sourceId && sourcePage) {
      let source = sourceDataLookup[sourceId];
      // TODO should use GameRulesSourceAbbr
      sourceNode = (
        <span className="ct-feature-snippet__source">
          <Tooltip
            isDarkMode={theme.isDarkMode}
            title={source.description ? source.description : ""}
          >
            <span className="ct-feature-snippet__heading-source-abbr">
              {source.name}
            </span>
            {sourcePage && (
              <span className="ct-feature-snippet__heading-source-page">
                {sourcePage}
              </span>
            )}
          </Tooltip>
        </span>
      );
      metaItems.push(sourceNode);
    }

    return (
      <div
        className="ct-feature-snippet__option"
        onClick={this.handleOptionClick}
      >
        <div className="ct-feature-snippet__heading">
          {name}
          <span className="ct-feature-snippet__meta">
            {metaItems.map((metaItem, idx) => (
              <span className="ct-feature-snippet__meta-item" key={idx}>
                {metaItem}
              </span>
            ))}
          </span>
        </div>
        {content && (
          <div className="ct-feature-snippet__option-content">
            <Snippet
              snippetData={snippetData}
              classLevel={classLevel}
              parseSnippet={!showDescription}
              proficiencyBonus={proficiencyBonus}
              theme={theme}
            >
              {content}
            </Snippet>
          </div>
        )}
        {(actions.length > 0 || spells.length > 0) && (
          <div className="ct-feature-snippet__extra">
            <FeatureSnippetActions
              actions={actions}
              abilityLookup={abilityLookup}
              ruleData={ruleData}
              onActionUseSet={onActionUseSet}
              onActionClick={onActionClick}
              isInteractive={isInteractive}
              proficiencyBonus={proficiencyBonus}
              theme={theme}
            />
            <FeatureSnippetSpells
              spells={spells}
              abilityLookup={abilityLookup}
              ruleData={ruleData}
              onSpellUseSet={onSpellUseSet}
              onSpellClick={onSpellClick}
              isInteractive={isInteractive}
              dataOriginRefData={dataOriginRefData}
              proficiencyBonus={proficiencyBonus}
              theme={theme}
            />
          </div>
        )}
      </div>
    );
  }
}
