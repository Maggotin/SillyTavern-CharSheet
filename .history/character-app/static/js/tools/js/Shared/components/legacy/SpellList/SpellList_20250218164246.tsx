import React from "react";

import {
  CharacterTheme,
  Constants,
  DataOriginRefData,
  EntityUtils,
  FormatUtils,
  RuleData,
  Spell,
  SpellUtils,
} from "../../character-rules-engine/es";

import { LegacyBadge } from "~/components/LegacyBadge";
import { SpellName } from "~/components/SpellName";

import SpellDetail from "../../SpellDetail";
import Collapsible, {
  CollapsibleHeader,
  CollapsibleHeaderCallout,
  CollapsibleHeading,
} from "../common/Collapsible";

export class SpellListItem extends React.PureComponent<
  {
    spell: Spell;
    castAsRitual: boolean;
    footerNode?: any;
    spellCasterInfo: any;
    ruleData: RuleData;
    dataOriginRefData: DataOriginRefData;
    proficiencyBonus: number;
    theme: CharacterTheme;
  },
  {
    customizeCollapsed: boolean;
  }
> {
  static defaultProps = {
    castAsRitual: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      customizeCollapsed: true,
    };
  }

  renderHeader() {
    const { spell, ruleData, dataOriginRefData } = this.props;
    const { toHit, attackSaveValue, isCustomized } = spell;
    const level = SpellUtils.getLevel(spell);
    const concentration = SpellUtils.getConcentration(spell);
    const rangeArea = SpellUtils.getDefinitionRangeArea(spell);
    const attackType = SpellUtils.getAttackType(spell);
    const school = SpellUtils.getSchool(spell);
    const requiresAttackRoll = SpellUtils.getRequiresAttackRoll(spell);
    const requiresSavingThrow = SpellUtils.getRequiresSavingThrow(spell);
    const isLegacy = SpellUtils.isLegacy(spell);

    let heading = (
      <CollapsibleHeading>
        <div className="spell-list-heading">
          <SpellName spell={spell} showSpellLevel={false} showLegacy={false} />
          {isLegacy && <LegacyBadge variant="margin-left" />}
        </div>
      </CollapsibleHeading>
    );

    let metaItems: Array<string> = [];
    metaItems.push(FormatUtils.renderSpellLevelName(level));
    let expandedDataOriginRef = SpellUtils.getExpandedDataOriginRef(spell);
    if (expandedDataOriginRef !== null) {
      metaItems.push(
        EntityUtils.getDataOriginRefName(
          expandedDataOriginRef,
          dataOriginRefData
        )
      );
    }
    if (concentration) {
      metaItems.push("Concentration");
    }
    if (rangeArea) {
      metaItems.push(
        attackType && attackType === Constants.AttackTypeRangeEnum.RANGED
          ? `Range ${rangeArea}`
          : rangeArea
      );
    }
    if (isCustomized) {
      metaItems.push("Customized");
    }

    let callout;
    if (requiresAttackRoll && toHit !== null) {
      callout = (
        <CollapsibleHeaderCallout
          extra="To Hit"
          value={FormatUtils.renderSignedNumber(toHit)}
        />
      );
    } else if (requiresSavingThrow) {
      callout = (
        <CollapsibleHeaderCallout
          extra={SpellUtils.getSaveDcAbilityKey(spell, ruleData)}
          value={attackSaveValue}
        />
      );
    }

    let iconClsNames = [
      "spell-header-icon-school",
      `spell-header-icon-school-${FormatUtils.slugify(school)}`,
    ];

    return (
      <CollapsibleHeader
        iconClsNames={iconClsNames}
        clsIdent="spell-list-item"
        heading={heading}
        metaItems={metaItems}
        callout={callout}
      />
    );
  }

  render() {
    const { customizeCollapsed } = this.state;
    const {
      spell,
      castAsRitual,
      footerNode,
      spellCasterInfo,
      ruleData,
      proficiencyBonus,
      theme,
    } = this.props;

    let clsNames = ["attack-list-customize-header"];
    if (customizeCollapsed) {
      clsNames.push("attack-list-customize-header-closed");
    } else {
      clsNames.push("attack-list-customize-header-opened");
    }

    return (
      <Collapsible trigger={this.renderHeader()} clsNames={["spell-list-item"]}>
        <SpellDetail
          theme={theme}
          spell={spell}
          castAsRitual={castAsRitual}
          spellCasterInfo={spellCasterInfo}
          enableCaster={false}
          ruleData={ruleData}
          showCustomize={false}
          showActions={false}
          proficiencyBonus={proficiencyBonus}
        />
        {footerNode}
      </Collapsible>
    );
  }
}

export default class SpellList extends React.PureComponent<{
  spells: Array<Spell>;
  hideRemaining: boolean;
  castAsRitual: boolean;
  spellCasterInfo: any;
  ruleData: RuleData;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  theme: CharacterTheme;
}> {
  static defaultProps = {
    hideRemaining: false,
    castAsRitual: false,
  };

  render() {
    const {
      spells,
      castAsRitual,
      spellCasterInfo,
      ruleData,
      dataOriginRefData,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!spells.length) {
      return null;
    }

    return (
      <div className="spell-list">
        <div className="spell-list-items">
          {spells.map((spell) => (
            <SpellListItem
              theme={theme}
              spell={spell}
              key={`${spell.id}-${SpellUtils.getId(spell)}`}
              castAsRitual={castAsRitual}
              spellCasterInfo={spellCasterInfo}
              ruleData={ruleData}
              dataOriginRefData={dataOriginRefData}
              proficiencyBonus={proficiencyBonus}
            />
          ))}
        </div>
      </div>
    );
  }
}
