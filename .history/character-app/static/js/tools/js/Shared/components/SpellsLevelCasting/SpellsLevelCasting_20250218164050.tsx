import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  ClassUtils,
  SpellCasterCastingEntry,
  SpellCasterInfo,
  SpellSlotContract,
} from "../../rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";

import SlotManager from "../SlotManager";

interface Props {
  level: number;
  spellCasterInfo: SpellCasterInfo;
  onSpellSlotSet?: (level: number, uses: number) => void;
  onPactSlotSet?: (level: number, uses: number) => void;
  showSlots: boolean;
  showCastingInfo: boolean;
  isInteractive: boolean;
  isDarkMode?: boolean;
}
export default class SpellsLevelCasting extends React.PureComponent<Props> {
  static defaultProps = {
    level: 1,
    showSlots: true,
    showCastingInfo: true,
    isInteractive: true,
  };

  handleSpellSlotSet = (uses: number): void => {
    const { onSpellSlotSet, level } = this.props;

    if (onSpellSlotSet) {
      onSpellSlotSet(level, uses);
    }
  };

  handlePactSlotSet = (uses: number): void => {
    const { onPactSlotSet, level } = this.props;

    if (onPactSlotSet) {
      onPactSlotSet(level, uses);
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

  hasLevelSlots = (): boolean => {
    let spellSlotLevel = this.getSpellSlotInfo();
    let pactMagicLevel = this.getPactSlotInfo();

    return !!(spellSlotLevel || pactMagicLevel);
  };

  hasCastingInfo = (): boolean => {
    const { spellCasterInfo } = this.props;
    const { castingInfo } = spellCasterInfo;

    return !!(
      castingInfo.modifiers.length ||
      castingInfo.spellAttacks.length ||
      castingInfo.saveDcs.length
    );
  };

  renderLevelSlots = (): React.ReactNode => {
    const { isInteractive, isDarkMode } = this.props;

    let spellSlotLevel = this.getSpellSlotInfo();
    let pactMagicLevel = this.getPactSlotInfo();

    if (!this.hasLevelSlots()) {
      return null;
    }

    return (
      <div className="ct-spells-level-casting__slot-groups">
        {pactMagicLevel && (
          <div className="ct-spells-level-casting__slot-group ct-spells-level-casting__slot-group--pact">
            <div className="ct-spells-level-casting__slot-group-manager">
              <SlotManager
                onSet={this.handlePactSlotSet}
                available={pactMagicLevel.available}
                used={pactMagicLevel.used}
                size={"small"}
                isInteractive={isInteractive}
              />
            </div>
            <div className="ct-spells-level-casting__slot-group-label">
              Pact
            </div>
          </div>
        )}
        {spellSlotLevel && (
          <div className="ct-spells-level-casting__slot-group ct-spells-level-casting__slot-group--spells">
            <div className="ct-spells-level-casting__slot-group-manager">
              <SlotManager
                onSet={this.handleSpellSlotSet}
                available={spellSlotLevel.available}
                used={spellSlotLevel.used}
                size={"small"}
                isInteractive={isInteractive}
              />
            </div>
            <div
              className={`ct-spells-level-casting__slot-group-label ${
                isDarkMode ? "ct-spells-level-casting--dark-mode" : ""
              }`}
            >
              Slots
            </div>
          </div>
        )}
      </div>
    );
  };

  renderCastingInfoGroup = (
    label: React.ReactNode,
    entries: Array<SpellCasterCastingEntry>,
    isSignedNumber: boolean = true
  ): React.ReactNode => {
    const { isDarkMode } = this.props;

    return (
      <div className="ct-spells-level-casting__info-group">
        <div className="ct-spells-level-casting__info-items">
          {entries.map((entry) => {
            if (entry.value === null) {
              return null;
            }

            let tooltip = entry.sources
              .map((charClass) => ClassUtils.getName(charClass))
              .join(", ");

            return (
              <Tooltip
                title={tooltip}
                className="ct-spells-level-casting__info-item"
                key={entry.value}
                tippyOpts={{ dynamicTitle: true }}
                isDarkMode={isDarkMode}
              >
                {isSignedNumber ? (
                  <NumberDisplay type="signed" number={entry.value} />
                ) : (
                  entry.value
                )}
              </Tooltip>
            );
          })}
        </div>
        <div className="ct-spells-level-casting__info-label">{label}</div>
      </div>
    );
  };

  renderCastingInfo = (): React.ReactNode => {
    const { spellCasterInfo } = this.props;
    const { castingInfo } = spellCasterInfo;

    if (!this.hasCastingInfo()) {
      return null;
    }

    return (
      <div className="ct-spells-level-casting__info">
        {this.renderCastingInfoGroup("Modifier", castingInfo.modifiers)}
        {this.renderCastingInfoGroup("Spell Attack", castingInfo.spellAttacks)}
        {this.renderCastingInfoGroup("Save DC", castingInfo.saveDcs, false)}
      </div>
    );
  };

  render() {
    const { showSlots, showCastingInfo } = this.props;

    if (!this.hasCastingInfo() && !this.hasLevelSlots()) {
      return null;
    }

    return (
      <div className="ct-spells-level-casting">
        {showSlots && this.renderLevelSlots()}
        {showCastingInfo && this.renderCastingInfo()}
      </div>
    );
  }
}
