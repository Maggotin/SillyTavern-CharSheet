import * as React from "react";

import {
  Action,
  ActionUtils,
  Attack,
  CharacterTheme,
  Item,
  ItemUtils,
  Spell,
  SpellUtils,
} from "../../rules-engine/es";
import { AttackSourceTypeEnum } from "@dndbeyond/character-rules-engine/es/engine/Character";
import {
  DiceTools,
  RollType,
  RollRequest,
  IRollContext,
} from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";

import { DiceComponentUtils } from "../utils";

interface Props {
  attack: Attack;
  className: string;
  icon: React.ReactNode;
  name: React.ReactNode;
  metaItems: Array<string>;
  rangeValue: React.ReactNode;
  rangeLabel: React.ReactNode;
  isProficient: boolean;
  toHit: number | null;
  attackSaveValue?: number | null;
  attackSaveLabel?: React.ReactNode;
  damage: React.ReactNode;
  notes?: React.ReactNode;
  theme: CharacterTheme;
  rollContext: IRollContext;
  onClick?: (attack: Attack) => void;

  showNotes: boolean;
  diceEnabled: boolean;
  onRoll?: (wasCrit: boolean) => void;
}

class CombatAttack extends React.PureComponent<Props, {}> {
  static defaultProps = {
    rangeLabel: "Reach",
    damage: "--",
    className: "",
    showNotes: true,
    isProficient: false,
    diceEnabled: false,
  };

  handleClick = (evt: React.MouseEvent): void => {
    const { onClick, attack } = this.props;

    if (onClick) {
      evt.nativeEvent.stopImmediatePropagation();
      evt.stopPropagation();

      onClick(attack);
    }
  };

  handleRollResults = (result: RollRequest) => {
    const { onRoll } = this.props;

    let wasCrit = DiceComponentUtils.isCriticalRoll(result);
    if (onRoll) {
      onRoll(wasCrit);
    }
  };

  render() {
    const {
      icon,
      name,
      metaItems,
      rangeLabel,
      rangeValue,
      toHit,
      attackSaveValue,
      attackSaveLabel,
      damage,
      notes,
      className,
      showNotes,
      diceEnabled,
      attack,
      theme,
      rollContext,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    let actionNode: React.ReactNode = null;
    if (toHit !== null) {
      let rollAction: string;
      switch (attack.type) {
        case AttackSourceTypeEnum.ACTION:
        case AttackSourceTypeEnum.CUSTOM:
          rollAction = ActionUtils.getName(attack.data as Action);
          break;
        case AttackSourceTypeEnum.ITEM:
          rollAction = ItemUtils.getName(attack.data as Item);
          break;
        case AttackSourceTypeEnum.SPELL:
          rollAction = SpellUtils.getName(attack.data as Spell);
          break;
      }

      actionNode = (
        <div className="ddbc-combat-attack__tohit">
          <RollableNumberDisplay
            number={toHit}
            type="signed"
            isModified={false}
            diceNotation={DiceTools.CustomD20(toHit)}
            rollType={RollType.ToHit}
            rollAction={rollAction}
            diceEnabled={diceEnabled}
            onRollResults={this.handleRollResults}
            advMenu={true}
            themeColor={theme.themeColor}
            rollContext={rollContext}
            rollTargetOptions={
              messageTargetOptions
                ? Object.values(messageTargetOptions?.entities)
                : undefined
            }
            rollTargetDefault={defaultMessageTargetOption}
            userId={userId}
          />
        </div>
      );
    } else if (attackSaveValue !== null) {
      actionNode = (
        <div className="ddbc-combat-attack__save">
          <span
            className={`ddbc-combat-attack__save-value ${
              theme.isDarkMode
                ? "ddbc-combat-attack__save-value--dark-mode"
                : ""
            }`}
          >
            {attackSaveValue}
          </span>
          <span
            className={`ddbc-combat-attack__save-label ${
              theme.isDarkMode
                ? "ddbc-combat-attack__save-label--dark-mode"
                : ""
            }`}
          >
            {attackSaveLabel}
          </span>
        </div>
      );
    }

    let classNames: Array<string> = [className, "ddbc-combat-attack"];

    return (
      <div
        className={classNames.join(" ")}
        style={
          theme?.isDarkMode
            ? { borderColor: `${theme.themeColor}66` }
            : undefined
        }
        onClick={this.handleClick}
      >
        <div className="ddbc-combat-attack__icon">{icon}</div>
        <div className="ddbc-combat-attack__name">
          <div
            className={`ddbc-combat-attack__label ${
              theme.isDarkMode ? "ddbc-combat-attack__label--dark-mode" : ""
            }`}
          >
            {name}
          </div>
          {metaItems.length > 0 && (
            <div
              className={`ddbc-combat-attack__meta ${
                theme.isDarkMode ? "ddbc-combat-attack__meta--dark-mode" : ""
              }`}
            >
              {metaItems.map((metaItem, idx) => (
                <span className="ddbc-combat-attack__meta-item" key={idx}>
                  {metaItem}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="ddbc-combat-attack__range">
          <div
            className={`ddbc-combat-attack__range-value ${
              theme.isDarkMode
                ? "ddbc-combat-attack__range-value--dark-mode"
                : ""
            }`}
          >
            {rangeValue ? (
              rangeValue
            ) : (
              <span className="ddbc-combat-attack__empty">--</span>
            )}
          </div>
          <div
            className={`ddbc-combat-attack__range-label ${
              theme.isDarkMode
                ? "ddbc-combat-attack__range-label--dark-mode"
                : ""
            }`}
          >
            {rangeLabel}
          </div>
        </div>
        <div className="ddbc-combat-attack__action">
          {actionNode ? (
            actionNode
          ) : (
            <span className="ddbc-combat-attack__empty">--</span>
          )}
        </div>
        <div className="ddbc-combat-attack__damage">{damage}</div>
        {showNotes && (
          <div
            className={`ddbc-combat-attack__notes ${
              theme.isDarkMode ? "ddbc-combat-attack__notes--dark-mode" : ""
            }`}
          >
            {notes}
          </div>
        )}
      </div>
    );
  }
}

CombatAttack.contextType = GameLogContext;

export default CombatAttack;
