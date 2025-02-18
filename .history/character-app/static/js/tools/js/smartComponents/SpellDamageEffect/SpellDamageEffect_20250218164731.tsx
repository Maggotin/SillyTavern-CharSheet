import * as React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  ConditionUtils,
  DiceUtils,
  HigherLevelContract,
  HigherLevelEntryContract,
  ModifierUtils,
  RuleData,
  RuleDataUtils,
  Spell,
  SpellConditionContract,
  SpellModifierContract,
  SpellUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";
import { RollType, RollKind, IRollContext } from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import DamageDice from "../Dice/DamageDice/DamageDice";
import HealingDice from "../Dice/HealingDice/HealingDice";
import { HealingIcon } from "../Icons";
import { DiceComponentUtils } from "../utils";

interface Props {
  spell: Spell;
  castLevel: number;
  characterLevel: number;
  ruleData: RuleData;
  diceEnabled: boolean;
  theme: CharacterTheme;
  isCriticalHit?: boolean;
  rollContext: IRollContext;
}
class SpellDamageEffect extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  getPoints = (
    atHigherLevels: HigherLevelContract | null
  ): Array<HigherLevelEntryContract> => {
    let points: Array<HigherLevelEntryContract> = [];
    if (atHigherLevels && atHigherLevels.points !== null) {
      points = atHigherLevels.points;
    }
    return points;
  };

  render() {
    const {
      spell,
      castLevel,
      characterLevel,
      ruleData,
      diceEnabled,
      theme,
      isCriticalHit,
      rollContext,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    let isScaled: boolean = false;
    const modifiers = SpellUtils.getModifiers(spell);
    const tags = SpellUtils.getTags(spell);
    const conditions = SpellUtils.getConditions(spell);

    let displayNode: React.ReactNode;
    let damageModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellDamageModifier(modifier)
    );
    if (damageModifiers.length) {
      let modifier: SpellModifierContract = damageModifiers[0];
      const friendlySubtypeName =
        ModifierUtils.getFriendlySubtypeName(modifier);
      const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
      let scaleType = SpellUtils.getScaleType(spell);
      let points = this.getPoints(atHigherLevels);
      let atHigherDamage = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        points,
        characterLevel,
        castLevel
      );
      let scaledDamageDie = SpellUtils.getSpellFinalScaledDie(
        spell,
        modifier,
        atHigherDamage
      );
      isScaled =
        isScaled ||
        SpellUtils.isSpellScaledByCastLevel(
          spell,
          scaleType,
          points,
          castLevel
        );

      displayNode = (
        <span className="ddbc-spell-damage-effect__damages">
          <DamageDice
            damage={DiceComponentUtils.getDamageDiceNotation(
              scaledDamageDie,
              isCriticalHit
            )}
            type={friendlySubtypeName ? friendlySubtypeName : ""}
            showInfoTooltip={false}
            diceNotation={DiceUtils.renderDice(scaledDamageDie)}
            rollType={RollType.Damage}
            rollAction={SpellUtils.getName(spell)}
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
        </span>
      );
    }

    let hitPointHealingModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellHealingHitPointsModifier(modifier)
    );
    if (!displayNode && hitPointHealingModifiers.length) {
      let modifier: SpellModifierContract = hitPointHealingModifiers[0];
      const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
      let scaleType = SpellUtils.getScaleType(spell);
      let points = this.getPoints(atHigherLevels);
      let atHigherHealing = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        points,
        characterLevel,
        castLevel
      );
      let scaledHealingDie = SpellUtils.getSpellFinalScaledDie(
        spell,
        modifier,
        atHigherHealing,
        castLevel
      );
      isScaled =
        isScaled ||
        SpellUtils.isSpellScaledByCastLevel(
          spell,
          scaleType,
          points,
          castLevel
        );

      displayNode = (
        <span className="ddbc-spell-damage-effect__healing ddbc-spell-damage-effect__healing--hp">
          <HealingDice
            diceNotation={DiceUtils.renderDice(scaledHealingDie)}
            rollType={RollType.Heal}
            rollAction={SpellUtils.getName(spell)}
            diceEnabled={diceEnabled}
            rollContext={rollContext}
            rollTargetOptions={
              messageTargetOptions
                ? Object.values(messageTargetOptions?.entities)
                : undefined
            }
            rollTargetDefault={defaultMessageTargetOption}
            userId={userId}
          >
            {DiceUtils.renderDice(scaledHealingDie)}{" "}
            <HealingIcon theme={theme} isHp={true} />
          </HealingDice>
        </span>
      );
    }

    const tempHitPointHealingModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellHealingTempHitPointsModifier(modifier)
    );
    if (!displayNode && tempHitPointHealingModifiers.length) {
      let modifier = tempHitPointHealingModifiers[0];
      const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
      let scaleType = SpellUtils.getScaleType(spell);
      let points = this.getPoints(atHigherLevels);
      let atHigherHealing = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        points,
        characterLevel,
        castLevel
      );
      let scaledHealingDie = SpellUtils.getSpellFinalScaledDie(
        spell,
        modifier,
        atHigherHealing,
        castLevel
      );
      isScaled =
        isScaled ||
        SpellUtils.isSpellScaledByCastLevel(
          spell,
          scaleType,
          points,
          castLevel
        );

      displayNode = (
        <span className="ddbc-spell-damage-effect__healing ddbc-spell-damage-effect__healing--temp">
          <HealingDice
            diceNotation={DiceUtils.renderDice(scaledHealingDie)}
            rollType={RollType.Heal}
            rollAction={SpellUtils.getName(spell)}
            diceEnabled={diceEnabled}
            rollContext={rollContext}
            rollTargetOptions={
              messageTargetOptions
                ? Object.values(messageTargetOptions?.entities)
                : undefined
            }
            rollTargetDefault={defaultMessageTargetOption}
            userId={userId}
          >
            {DiceUtils.renderDice(scaledHealingDie)}{" "}
            <HealingIcon theme={theme} isTemp={true} />
          </HealingDice>
        </span>
      );
    }

    if (!displayNode && conditions.length) {
      let spellCondition: SpellConditionContract = conditions[0];
      let condition = RuleDataUtils.getCondition(
        spellCondition.conditionId,
        ruleData
      );
      let name: string =
        condition === null ? "" : ConditionUtils.getName(condition);
      displayNode = (
        <span
          className={`ddbc-spell-damage-effect__conditions ${
            theme.isDarkMode
              ? "ddbc-spell-damage-effect__conditions--dark-mode"
              : ""
          }`}
        >
          <Tooltip
            isDarkMode={theme.isDarkMode}
            title={`${name}${
              spellCondition.exception ? `, ${spellCondition.exception}` : ""
            }`}
          >
            {name}
          </Tooltip>
        </span>
      );
    }

    if (!displayNode && tags.length) {
      displayNode = (
        <span
          className={`ddbc-spell-damage-effect__tags ${
            theme.isDarkMode ? "ddbc-spell-damage-effect__tags--dark-mode" : ""
          }`}
        >
          {tags[0]}
        </span>
      );
    }

    let hasMore: boolean = damageModifiers.length > 1;
    hasMore = hasMore || hitPointHealingModifiers.length > 1;
    hasMore = hasMore || tempHitPointHealingModifiers.length > 1;
    hasMore = hasMore || conditions.length > 1;
    hasMore = hasMore || tags.length > 1;

    return (
      <div
        className={`ddbc-spell-damage-effect  ${
          isScaled ? "ddbc-spell-damage-effect--scaled" : ""
        } ${theme.isDarkMode ? "ddbc-spell-damage-effect--dark-mode" : ""}`}
      >
        {displayNode}
        {hasMore ? "*" : ""}
      </div>
    );
  }
}

SpellDamageEffect.contextType = GameLogContext;

export default SpellDamageEffect;
