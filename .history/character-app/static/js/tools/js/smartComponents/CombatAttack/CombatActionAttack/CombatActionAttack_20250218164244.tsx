import * as React from "react";

import {
  AbilityLookup,
  Action,
  ActionUtils,
  Attack,
  CharacterTheme,
  Constants,
  DiceUtils,
  EntityUtils,
  FormatUtils,
  RuleData,
  RuleDataUtils,
  ActionDiePossibility,
} from "../../character-rules-engine/es";
import {
  Dice,
  RollType,
  DiceEvent,
  RollKind,
  IRollContext,
} from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { NumberDisplay } from "~/components/NumberDisplay";

import ActionName from "../../ActionName";
import DamageDice from "../../Dice/DamageDice/DamageDice";
import { AttackTypeIcon } from "../../Icons";
import NoteComponents from "../../NoteComponents";
import { DiceComponentUtils } from "../../utils";
import CombatAttack from "../CombatAttack";
import { CombatActionAttackComponentRangeInfo } from "./CombatActionAttackTypings";

interface Props {
  attack: Attack;
  action: Action;
  onClick?: (attack: Attack) => void;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  showNotes: boolean;
  className: string;
  diceEnabled: boolean;
  theme: CharacterTheme;
  rollContext: IRollContext;
  proficiencyBonus: number;
}

interface State {
  isCriticalHit: boolean;
}
class CombatActionAttack extends React.PureComponent<Props, State> {
  diceEventHandler: (eventData: any) => void;

  static defaultProps = {
    showNotes: true,
    className: "",
    diceEnabled: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isCriticalHit: false,
    };
  }

  componentDidMount = () => {
    this.diceEventHandler = DiceComponentUtils.setupResetCritStateOnRoll(
      ActionUtils.getName(this.props.attack.data as Action),
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

  handleRoll = (wasCrit: boolean) => {
    this.setState({ isCriticalHit: wasCrit });
  };

  getRangeInfo = (): CombatActionAttackComponentRangeInfo => {
    const { action, ruleData, theme } = this.props;

    const attackRange = ActionUtils.getRange(action);
    const attackReach = ActionUtils.getReach(action);
    const attackTypeId = ActionUtils.getAttackRangeId(action);

    let rangeValueNode: React.ReactNode;
    let rangeLabel: string = "Range";

    switch (ActionUtils.getActionTypeId(action)) {
      case Constants.ActionTypeEnum.WEAPON:
        if (
          attackRange !== null &&
          attackTypeId === Constants.AttackTypeRangeEnum.RANGED
        ) {
          let { longRange, range } = attackRange;

          if (longRange) {
            rangeValueNode = (
              <React.Fragment>
                <span
                  className={`ddbc-combat-attack__range-value-close ${
                    theme.isDarkMode
                      ? "ddbc-combat-attack__range-value-close--dark-mode"
                      : ""
                  }`}
                >
                  {range}
                </span>
                <span
                  className={`ddbc-combat-attack__range-value-long ${
                    theme.isDarkMode
                      ? "ddbc-combat-attack__range-value-long--dark-mode"
                      : ""
                  }`}
                >
                  ({longRange})
                </span>
              </React.Fragment>
            );
            rangeLabel = "";
          } else {
            rangeValueNode = (
              <NumberDisplay type="distanceInFt" number={range} />
            );
            rangeLabel = "Range";
          }
        } else if (attackReach !== null) {
          rangeValueNode = (
            <NumberDisplay type="distanceInFt" number={attackReach} />
          );
          rangeLabel = "Reach";
        }
        break;

      case Constants.ActionTypeEnum.SPELL:
        if (attackRange !== null) {
          if (
            attackRange.origin &&
            attackRange.origin !== Constants.SpellRangeTypeEnum.RANGED
          ) {
            let spellRangeType = RuleDataUtils.getSpellRangeType(
              attackRange.origin,
              ruleData
            );
            if (spellRangeType) {
              rangeValueNode = spellRangeType.name;
            }
          }
          if (attackRange.range) {
            rangeValueNode = (
              <NumberDisplay type="distanceInFt" number={attackRange.range} />
            );
          }
        }

        rangeLabel = "";
        if (attackTypeId === Constants.AttackTypeRangeEnum.MELEE) {
          rangeLabel = "Reach";
        }
        break;

      case Constants.ActionTypeEnum.GENERAL:
        if (attackRange !== null && attackRange.range) {
          rangeValueNode = (
            <NumberDisplay type="distanceInFt" number={attackRange.range} />
          );
        }
        if (
          attackReach !== null &&
          attackTypeId === Constants.AttackTypeRangeEnum.MELEE
        ) {
          rangeValueNode = (
            <NumberDisplay type="distanceInFt" number={attackReach} />
          );
          rangeLabel = "Reach";
        }
        break;

      default:
      // not implemented
    }

    return {
      rangeValueNode,
      rangeLabel,
    };
  };

  getClassName = (): string => {
    const { action } = this.props;

    let type: string = "";
    switch (ActionUtils.getActionTypeId(action)) {
      case Constants.ActionTypeEnum.WEAPON:
        type = "weapon";
        break;

      case Constants.ActionTypeEnum.SPELL:
        type = "spell";
        break;

      case Constants.ActionTypeEnum.GENERAL:
        type = "general";
        break;
    }

    return FormatUtils.slugify(`ddbc-combat-action-attack--${type}`);
  };

  getIconKey = (): string => {
    const { action } = this.props;

    const attackTypeId = ActionUtils.getAttackRangeId(action);
    let attackType: string = "";
    if (attackTypeId) {
      attackType = RuleDataUtils.getAttackTypeRangeName(attackTypeId);
    }

    let type: string = "";
    let iconType: string = RuleDataUtils.getAttackTypeRangeName(
      Constants.AttackTypeRangeEnum.MELEE
    );

    switch (ActionUtils.getActionTypeId(action)) {
      case Constants.ActionTypeEnum.WEAPON:
        type = "weapon";
        iconType = attackType;
        break;

      case Constants.ActionTypeEnum.SPELL:
        type = "spell";
        if (attackType) {
          iconType = attackType;
        }
        break;

      case Constants.ActionTypeEnum.GENERAL:
        type = "general";
        if (attackType) {
          iconType = attackType;
        }
        break;

      default:
      //not implemented
    }

    return FormatUtils.slugify(`action-attack-${type}-${iconType}`);
  };

  getIconNode = (): React.ReactNode => {
    const { action, theme } = this.props;

    let rangeType: Constants.AttackTypeRangeEnum =
      ActionUtils.getAttackRangeId(action) ??
      Constants.AttackTypeRangeEnum.MELEE;

    //this sucks, but have to switch these around because of how unarmed strike is currently a weapon type
    //and most others that come thru here are custom actions
    let actionTypeId = ActionUtils.getActionTypeId(action);
    let actionType: Constants.ActionTypeEnum | null = actionTypeId;
    switch (actionTypeId) {
      case Constants.ActionTypeEnum.WEAPON:
        if (rangeType === Constants.AttackTypeRangeEnum.MELEE) {
          actionType = Constants.ActionTypeEnum.GENERAL;
        }
        break;

      case Constants.ActionTypeEnum.GENERAL:
        if (rangeType === Constants.AttackTypeRangeEnum.MELEE) {
          actionType = Constants.ActionTypeEnum.WEAPON;
        }
        break;
      case Constants.ActionTypeEnum.SPELL:
        break;

      default:
      //not implemented
    }

    return (
      <AttackTypeIcon
        actionType={actionType}
        rangeType={rangeType}
        themeMode={theme.isDarkMode ? "gray" : "dark"}
        className={`ddbc-combat-attack__icon-img--${this.getIconKey()}`}
      />
    );
  };

  getMetaItems = (): Array<string> => {
    const { action } = this.props;

    const damage = ActionUtils.getDamage(action);
    const attackTypeId = ActionUtils.getAttackRangeId(action);
    let attackType: string | null = null;
    if (attackTypeId) {
      attackType = RuleDataUtils.getAttackTypeRangeName(attackTypeId);
    }
    const isOffhand = ActionUtils.isOffhand(action);

    let combinedMetaItems: Array<string> = [];
    if (attackType) {
      combinedMetaItems.push(`${attackType} Attack`);
    }
    if (damage.isMartialArts) {
      combinedMetaItems.push("Martial Arts");
    }
    if (damage.value && damage.dataOrigin) {
      combinedMetaItems.push(EntityUtils.getDataOriginName(damage.dataOrigin));
    }

    switch (ActionUtils.getActionTypeId(action)) {
      case Constants.ActionTypeEnum.WEAPON:
        if (isOffhand) {
          combinedMetaItems.push("Dual Wield");
        }
        break;

      default:
      // not implemented
    }

    if (ActionUtils.isCustomized(action)) {
      combinedMetaItems.push("Customized");
    }

    return combinedMetaItems;
  };

  renderNotes = (): React.ReactNode => {
    const {
      action,
      showNotes,
      ruleData,
      abilityLookup,
      proficiencyBonus,
      theme,
    } = this.props;

    if (!showNotes) {
      return null;
    }

    return (
      <div className="ddbc-combat-action-attack__notes">
        <NoteComponents
          notes={ActionUtils.getNoteComponents(
            action,
            ruleData,
            abilityLookup,
            proficiencyBonus
          )}
          theme={theme}
        />
      </div>
    );
  };

  render() {
    const {
      action,
      attack,
      ruleData,
      showNotes,
      className,
      diceEnabled,
      theme,
      rollContext,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    const { isCriticalHit } = this.state;

    const proficiency = ActionUtils.isProficient(action);
    const damage = ActionUtils.getDamage(action);
    let rangeInfo = this.getRangeInfo();

    let toHit: number | null = null;
    let attackSaveValue: number | null = null;
    let attackSaveLabel: React.ReactNode = "";
    if (ActionUtils.requiresAttackRoll(action)) {
      toHit = ActionUtils.getToHit(action);
    } else if (ActionUtils.requiresSavingThrow(action)) {
      let saveStatId = ActionUtils.getSaveStatId(action);
      if (saveStatId) {
        attackSaveLabel = RuleDataUtils.getStatNameById(saveStatId, ruleData);
      }
      attackSaveValue = ActionUtils.getAttackSaveValue(action);
    }

    let damageNode: React.ReactNode;
    if (damage.value !== null) {
      damageNode = (
        <DamageDice
          type={damage.type ? damage.type.name : null}
          damage={DiceComponentUtils.getDamageDiceNotation(
            damage.value,
            isCriticalHit
          )}
          diceNotation={
            typeof damage.value === "number"
              ? damage.value.toString()
              : DiceUtils.renderDice(damage.value)
          }
          rollType={RollType.Damage}
          rollAction={ActionUtils.getName(attack.data as Action)}
          rollKind={isCriticalHit ? RollKind.CriticalHit : RollKind.None}
          diceEnabled={diceEnabled}
          advMenu={true}
          themeColor={theme.themeColor}
          theme={theme}
          rollContext={rollContext}
          rollTargetOptions={
            messageTargetOptions
              ? Object.values(messageTargetOptions?.entities)
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          userId={userId}
        />
      );
    }

    let classNames: Array<string> = [className, this.getClassName()];

    if (isCriticalHit) {
      classNames.push("ddbc-combat-attack--crit");
    }
    return (
      <CombatAttack
        attack={attack}
        className={classNames.join(" ")}
        icon={this.getIconNode()}
        name={<ActionName theme={theme} action={action} />}
        metaItems={this.getMetaItems()}
        rangeValue={rangeInfo.rangeValueNode}
        rangeLabel={rangeInfo.rangeLabel}
        isProficient={proficiency}
        toHit={toHit}
        attackSaveLabel={attackSaveLabel}
        attackSaveValue={attackSaveValue}
        damage={damageNode}
        onClick={this.handleClick}
        notes={this.renderNotes()}
        showNotes={showNotes}
        diceEnabled={diceEnabled}
        onRoll={this.handleRoll}
        theme={theme}
        rollContext={rollContext}
      />
    );
  }
}

CombatActionAttack.contextType = GameLogContext;

export default CombatActionAttack;
