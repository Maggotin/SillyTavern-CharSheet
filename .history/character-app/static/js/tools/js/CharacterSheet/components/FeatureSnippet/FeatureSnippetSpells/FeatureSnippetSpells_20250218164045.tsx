import { orderBy } from "lodash";
import React from "react";

import {
  AbilityLookup,
  BaseSpell,
  CharacterTheme,
  DataOriginRefData,
  RuleData,
  SpellUtils,
} from "../../rules-engine/es";

import { SpellName } from "~/components/SpellName";

import { FeatureSnippetLimitedUse } from "../FeatureSnippetLimitedUse";

interface Props {
  spells?: Array<BaseSpell>;
  layoutType: "list" | "compact";

  onSpellUseSet?: (spell: BaseSpell, uses: number) => void;
  onSpellClick?: (spell: BaseSpell) => void;

  dataOriginRefData: DataOriginRefData;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  isInteractive: boolean;
  proficiencyBonus: number;
  theme: CharacterTheme;
}
export default class FeatureSnippetSpells extends React.PureComponent<Props> {
  static defaultProps = {
    layoutType: "list",
  };

  handleSpellUseSet = (spell: BaseSpell, uses: number): void => {
    const { onSpellUseSet } = this.props;

    if (onSpellUseSet) {
      onSpellUseSet(spell, uses);
    }
  };

  handleSpellClick = (spell: BaseSpell, evt: React.MouseEvent): void => {
    const { onSpellClick } = this.props;

    if (onSpellClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onSpellClick(spell);
    }
  };

  render() {
    const {
      spells,
      ruleData,
      abilityLookup,
      layoutType,
      isInteractive,
      dataOriginRefData,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!spells || !spells.length) {
      return null;
    }

    let orderedSpells = orderBy(
      spells,
      [
        (spell) => SpellUtils.getLevel(spell),
        (spell) => SpellUtils.getName(spell),
      ],
      ["asc", "asc"]
    );

    let classNames: Array<string> = [
      "ct-feature-snippet__spells",
      `ct-feature-snippet__spells--layout-${layoutType}`,
    ];
    if (theme?.isDarkMode) {
      classNames.push(`ct-feature-snippet__spells--dark-mode`);
    }

    return (
      <div className={classNames.join(" ")}>
        {orderedSpells.map((spell, idx) => (
          <div
            className="ct-feature-snippet__spell"
            key={SpellUtils.getUniqueKey(spell)}
          >
            <div
              className="ct-feature-snippet__spell-summary"
              onClick={this.handleSpellClick.bind(this, spell)}
            >
              <SpellName
                spell={spell}
                showLegacy={true}
                dataOriginRefData={dataOriginRefData}
              />
            </div>
            {layoutType !== "compact" && !SpellUtils.isCantrip(spell) && (
              <FeatureSnippetLimitedUse
                component={spell}
                theme={theme}
                limitedUse={SpellUtils.getLimitedUse(spell)}
                onUseSet={this.handleSpellUseSet}
                abilityLookup={abilityLookup}
                ruleData={ruleData}
                isInteractive={isInteractive}
                proficiencyBonus={proficiencyBonus}
              />
            )}
            {layoutType === "compact" && idx + 1 < orderedSpells.length && (
              <span className="ct-feature-snippet__spell-sep">,</span>
            )}
          </div>
        ))}
      </div>
    );
  }
}
