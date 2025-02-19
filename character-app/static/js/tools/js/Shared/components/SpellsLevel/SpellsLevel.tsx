import React from "react";

import {
  AbilityLookup,
  CharacterTheme,
  Constants,
  DataOriginRefData,
  ExperienceInfo,
  RuleData,
  ScaledSpell,
  Spell,
  SpellCasterInfo,
  SpellSlotContract,
  SpellUtils,
} from "@dndbeyond/character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import SpellsSpell from "../SpellsSpell";

interface Props {
  spells: Array<ScaledSpell>;
  level: number;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  xpInfo: ExperienceInfo;
  onSpellClick?: (spell: Spell, castLevel: number) => void;
  onSpellSlotChange?: (castLevel: number, changeAmount: number) => void;
  onPactSlotChange?: (castLevel: number, changeAmount: number) => void;
  onSpellLimitedUseSet?: (
    mappingId: number,
    mappingTypeId: number,
    uses: number,
    dataOriginType: Constants.DataOriginTypeEnum
  ) => void;
  onItemLimitedUseSet?: (
    mappingId: number,
    mappingTypeId: number,
    uses: number
  ) => void;
  showNotes: boolean;
  isInteractive: boolean;
  diceEnabled: boolean;
  theme: CharacterTheme;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
  rollContext: IRollContext;
}
export default class SpellsLevel extends React.PureComponent<Props> {
  static defaultProps = {
    showNotes: true,
    diceEnabled: false,
  };

  handleSpellSlotChange = (changeAmount: number): void => {
    const { onSpellSlotChange, level } = this.props;

    if (onSpellSlotChange) {
      onSpellSlotChange(level, changeAmount);
    }
  };

  handlePactSlotChange = (changeAmount: number): void => {
    const { onPactSlotChange, level } = this.props;

    if (onPactSlotChange) {
      onPactSlotChange(level, changeAmount);
    }
  };

  handleSpellClick = (spell: Spell, castLevel: number): void => {
    const { onSpellClick } = this.props;

    if (onSpellClick) {
      onSpellClick(spell, castLevel);
    }
  };

  handleSpellUse = (
    useSpellSlot: boolean,
    usePactMagicSlot: boolean,
    dataOriginType: Constants.DataOriginTypeEnum,
    uses: number | null,
    mappingId: number | null,
    mappingTypeId: number | null
  ): void => {
    const { onSpellLimitedUseSet, onItemLimitedUseSet } = this.props;

    if (useSpellSlot) {
      this.handleSpellSlotChange(1);
    }
    if (usePactMagicSlot) {
      this.handlePactSlotChange(1);
    }
    if (uses !== null && mappingId !== null && mappingTypeId !== null) {
      switch (dataOriginType) {
        case Constants.DataOriginTypeEnum.ITEM:
          if (onItemLimitedUseSet) {
            onItemLimitedUseSet(mappingId, mappingTypeId, uses);
          }
          break;
        default:
          if (onSpellLimitedUseSet) {
            onSpellLimitedUseSet(
              mappingId,
              mappingTypeId,
              uses,
              dataOriginType
            );
          }
      }
    }
  };

  getSpellSlotInfo = (): SpellSlotContract | null => {
    const { spellCasterInfo, level } = this.props;
    const { spellSlots } = spellCasterInfo;

    let spellSlotInfo = spellSlots.find(
      (spellSlotGroup) => spellSlotGroup.level === level
    );
    return spellSlotInfo ? spellSlotInfo : null;
  };

  getPactSlotInfo = (): SpellSlotContract | null => {
    const { spellCasterInfo, level } = this.props;
    const { pactMagicSlots } = spellCasterInfo;

    let spellSlotInfo = pactMagicSlots.find(
      (pactSlotGroup) => pactSlotGroup.level === level
    );
    return spellSlotInfo ? spellSlotInfo : null;
  };

  renderSpell = (spell: ScaledSpell): React.ReactNode => {
    const {
      ruleData,
      abilityLookup,
      xpInfo,
      level,
      showNotes,
      isInteractive,
      diceEnabled,
      theme,
      dataOriginRefData,
      proficiencyBonus,
      rollContext,
    } = this.props;

    let spellSlotLevel = this.getSpellSlotInfo();
    let pactMagicLevel = this.getPactSlotInfo();
    let doesSpellSlotExist: boolean =
      !!spellSlotLevel && spellSlotLevel.available > 0;
    let doesPactSlotExist: boolean =
      !!pactMagicLevel && pactMagicLevel.available > 0;

    let isSpellSlotAvailable: boolean = false;
    if (doesSpellSlotExist && spellSlotLevel) {
      isSpellSlotAvailable = spellSlotLevel.used < spellSlotLevel.available;
    }

    let isPactSlotAvailable: boolean = false;
    if (doesPactSlotExist && pactMagicLevel) {
      isPactSlotAvailable = pactMagicLevel.used < pactMagicLevel.available;
    }

    return (
      <SpellsSpell
        key={SpellUtils.getUniqueKey(spell)}
        spell={spell}
        abilityLookup={abilityLookup}
        ruleData={ruleData}
        castLevel={level}
        characterLevel={xpInfo.currentLevel}
        onClick={this.handleSpellClick}
        onUse={this.handleSpellUse}
        doesSpellSlotExist={doesSpellSlotExist}
        doesPactSlotExist={doesPactSlotExist}
        isSpellSlotAvailable={isSpellSlotAvailable}
        isPactSlotAvailable={isPactSlotAvailable}
        showNotes={showNotes}
        isInteractive={isInteractive}
        diceEnabled={diceEnabled}
        theme={theme}
        dataOriginRefData={dataOriginRefData}
        proficiencyBonus={proficiencyBonus}
        rollContext={rollContext}
      />
    );
  };

  render() {
    const { spells, showNotes, theme } = this.props;

    return (
      <div className="ct-spells-level">
        <div
          className={`ct-spells-level__spells-row-header ${
            theme.isDarkMode
              ? "ct-spells-level__spells-row-header--dark-mode"
              : ""
          }`}
        >
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--action" />
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--name">
            Name
          </div>
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--activation">
            Time
          </div>
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--range">
            Range
          </div>
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--tohit">
            Hit / DC
          </div>
          <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--damage">
            Effect
          </div>
          {showNotes && (
            <div className="ct-spells-level__spells-colstcs-spells-level__spells-col--notes">
              Notes
            </div>
          )}
        </div>
        <div className="ct-spells-level__spells-content">
          {spells.length ? (
            spells.map((spell) => this.renderSpell(spell))
          ) : (
            <div className="ct-spells-level__empty">
              No Spells Match the Current Filter
            </div>
          )}
        </div>
      </div>
    );
  }
}
