import * as React from "react";

import {
  AbilityLookup,
  Attack,
  Constants,
  DataOriginRefData,
  EntityUtils,
  FormatUtils,
  Spell,
  SpellCasterInfo,
  SpellUtils,
  RuleData,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";
import { Dice, DiceEvent, IRollContext } from "@dndbeyond/dice";

import { NumberDisplay } from "~/components/NumberDisplay";
import { SpellName } from "~/components/SpellName";

import { SpellSchoolIcon } from "../../Icons";
import NoteComponents from "../../NoteComponents";
import SpellDamageEffect from "../../SpellDamageEffect";
import { SpellSchoolPropType } from "../../componentConstants";
import { DiceComponentUtils } from "../../utils";
import CombatAttack from "../CombatAttack";

interface Props {
  attack: Attack;
  spell: Spell;
  onClick?: (attack: Attack) => void;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  spellCasterInfo: SpellCasterInfo;
  showNotes: boolean;
  className: string;
  diceEnabled: boolean;
  theme: CharacterTheme;
  rollContext: IRollContext;
  dataOriginRefData: DataOriginRefData;
  proficiencyBonus: number;
}

interface State {
  isCriticalHit: boolean;
}

export default class CombatSpellAttack extends React.PureComponent<
  Props,
  State
> {
  diceEventHandler: (eventData: any) => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      isCriticalHit: false,
    };
  }

  static defaultProps = {
    showNotes: true,
    className: "",
    diceEnabled: false,
  };

  componentDidMount = () => {
    this.diceEventHandler = DiceComponentUtils.setupResetCritStateOnRoll(
      SpellUtils.getName(this.props.spell),
      this
    );
  };

  componentWillUnmount = () => {
    Dice.removeEventListener(DiceEvent.ROLL, this.diceEventHandler);
  };

  handleClick = (): void => {
    const { onClick, attack } = this.props;

    if (onClick) {
      onClick(attack);
    }
  };

  renderNotes = (): React.ReactNode => {
    const {
      spell,
      abilityLookup,
      ruleData,
      showNotes,
      spellCasterInfo,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!showNotes) {
      return null;
    }

    const castLevel = SpellUtils.getMinCastLevel(
      spell,
      spellCasterInfo,
      ruleData
    );
    const characterLevel = SpellUtils.getCharacterLevel(spell);
    let scaledAmount: number = 0;

    return (
      <div className="ddbc-combat-spell-attack__notes">
        <NoteComponents
          notes={SpellUtils.getNoteComponents(
            spell,
            castLevel,
            characterLevel,
            abilityLookup,
            ruleData,
            scaledAmount,
            proficiencyBonus
          )}
          theme={theme}
        />
      </div>
    );
  };

  handleRoll = (wasCrit: boolean) => {
    this.setState({ isCriticalHit: wasCrit });
  };

  render() {
    const {
      attack,
      spell,
      ruleData,
      spellCasterInfo,
      showNotes,
      diceEnabled,
      theme,
      dataOriginRefData,
      rollContext,
      className,
    } = this.props;

    const { isCriticalHit } = this.state;

    const characterLevel = SpellUtils.getCharacterLevel(spell);
    const attackSaveValue = SpellUtils.getAttackSaveValue(spell);
    const toHit = SpellUtils.getToHit(spell);
    const isCustomized = SpellUtils.isCustomized(spell);
    const range = SpellUtils.getRange(spell);
    const level = SpellUtils.getLevel(spell);
    const school = SpellUtils.getSchool(spell);
    const concentration = SpellUtils.getConcentration(spell);
    const requiresAttackRoll = SpellUtils.getRequiresAttackRoll(spell);
    const requiresSavingThrow = SpellUtils.getRequiresSavingThrow(spell);
    const castLevel = SpellUtils.getMinCastLevel(
      spell,
      spellCasterInfo,
      ruleData
    );

    let metaItems: Array<string> = [];
    if (SpellUtils.isLegacy(spell)) {
      metaItems.push("Legacy");
    }

    metaItems.push(FormatUtils.renderSpellLevelName(level));

    const spellDataOrigin = SpellUtils.getDataOrigin(spell);
    if (spellDataOrigin) {
      const dataOriginName = EntityUtils.getDataOriginName(spellDataOrigin);
      metaItems.push(dataOriginName);
    }
    let expandedDataOrigin = SpellUtils.getExpandedDataOriginRef(spell);
    if (expandedDataOrigin) {
      metaItems.push(
        EntityUtils.getDataOriginRefName(expandedDataOrigin, dataOriginRefData)
      );
    }
    if (concentration) {
      metaItems.push("Concentration");
    }
    if (isCustomized) {
      metaItems.push("Customized");
    }

    let rangeAreaNode: React.ReactNode;
    if (range !== null) {
      rangeAreaNode = (
        <span className="ddbc-combat-attack__spell-range">
          {!!range.origin &&
            range.origin !== Constants.SpellRangeTypeNameEnum.RANGED && (
              <span
                className={`ddbc-combat-attack__spell-range-origin ${
                  theme.isDarkMode
                    ? "ddbc-combat-attack__spell-range-origin--dark-mode"
                    : ""
                }`}
              >
                {range.origin}
              </span>
            )}
          {!!range.rangeValue && (
            <span className="ddbc-combat-attack__spell-range-value">
              <NumberDisplay type="distanceInFt" number={range.rangeValue} />
            </span>
          )}
        </span>
      );
    }

    let toHitDisplay: number | null = null;
    let saveDcValue: number | null = null;
    let saveDcLabel: React.ReactNode;
    if (requiresAttackRoll) {
      toHitDisplay = toHit;
    } else if (requiresSavingThrow) {
      saveDcValue = attackSaveValue;
      saveDcLabel = SpellUtils.getSaveDcAbilityShortName(spell, ruleData);
    }
    let attackClassNames: Array<string> = ["ddbc-combat-attack--spell", className];

    if (isCriticalHit) {
      attackClassNames.push("ddbc-combat-attack--crit");
    }

    return (
      <CombatAttack
        attack={attack}
        className={attackClassNames.join(" ")}
        icon={
          <SpellSchoolIcon
            school={FormatUtils.slugify(school) as SpellSchoolPropType}
            themeMode={theme.isDarkMode ? "gray" : "dark"}
            className={`ddbc-combat-attack__icon-img--spell-school-${FormatUtils.slugify(
              school
            )}`}
          />
        }
        name={
          <SpellName
            spell={spell}
            showSpellLevel={false}
            dataOriginRefData={dataOriginRefData}
          />
        }
        metaItems={metaItems}
        rangeValue={rangeAreaNode}
        rangeLabel={""}
        toHit={toHitDisplay}
        attackSaveValue={saveDcValue}
        attackSaveLabel={saveDcLabel}
        rollContext={rollContext}
        damage={
          <SpellDamageEffect
            spell={spell}
            characterLevel={characterLevel}
            castLevel={castLevel}
            ruleData={ruleData}
            diceEnabled={diceEnabled}
            theme={theme}
            isCriticalHit={isCriticalHit}
            rollContext={rollContext}
          />
        }
        onClick={this.handleClick}
        notes={this.renderNotes()}
        showNotes={showNotes}
        diceEnabled={diceEnabled}
        onRoll={this.handleRoll}
        theme={theme}
      />
    );
  }
}
