import React, { useContext } from "react";
import { DispatchProp } from "react-redux";

import {
  ComponentConstants,
  DamageTypeIcon,
} from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  BaseInventoryContract,
  Constants,
  DiceUtils,
  EntityUtils,
  FormatUtils,
  ItemUtils,
  LimitedUseUtils,
  ModifierUtils,
  Spell,
  SpellCasterInfo,
  SpellSlotContract,
  SpellUtils,
  characterActions,
  ApiRequestHelpers,
  RuleData,
  RuleDataUtils,
  CharacterTheme,
  InventoryManager,
  ItemManager,
} from "@dndbeyond/character-rules-engine/es";

import { toastMessageActions } from "../../actions/toastMessage";
import { InventoryManagerContext } from "../../managers/InventoryManagerContext";
import { ThemeButton } from "../common/Button";

function canCastAtLevel(level, available) {
  return available.indexOf(level) > -1;
}

function isCastAvailableAtLevel(level, available) {
  return available.indexOf(level) > -1;
}

// TODO dispatch needs to be factored out
interface Props extends DispatchProp {
  characterLevel: number;
  spell: Spell;
  spellSlots: Array<SpellSlotContract>;
  pactMagicSlots: Array<SpellSlotContract>;
  castableSpellLevels: Array<number>;
  castablePactMagicLevels: Array<number>;
  availableSpellLevels: Array<number>;
  availablePactMagicLevels: Array<number>;
  initialCastLevel: number | null;
  spellCasterInfo: SpellCasterInfo;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  isReadonly: boolean;
  proficiencyBonus: number;
  theme?: CharacterTheme;
  inventoryManager: InventoryManager;
}
interface State {
  castLevel: number;
  castableLevelsIdx: number;
  castableLevels: Array<number>;
  minLevel: number;
  maxLevel: number;
}
export class SpellCaster extends React.PureComponent<Props, State> {
  static defaultProps = {
    initialCastLevel: null,
  };

  constructor(props: Props) {
    super(props);

    this.state = this.getStartingCastState(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { spell } = this.props;

    if (
      SpellUtils.getUniqueKey(spell) !==
      SpellUtils.getUniqueKey(prevProps.spell)
    ) {
      this.setState({
        ...this.getStartingCastState(this.props),
      });
    }
  }

  getStartingCastState = (props: Props): State => {
    const { spell, initialCastLevel, spellCasterInfo, ruleData } = props;

    let { startLevel, endLevel } = SpellUtils.getCastLevelRange(
      spell,
      spellCasterInfo,
      ruleData
    );

    const castableLevels = SpellUtils.getCastableLevels(
      spell,
      spellCasterInfo,
      ruleData,
      initialCastLevel
    );
    const castLevel = SpellUtils.getMinCastLevel(
      spell,
      spellCasterInfo,
      ruleData,
      initialCastLevel
    );
    const castableLevelsIdx = castableLevels.findIndex(
      (level) => level === castLevel
    );

    return {
      castLevel,
      castableLevelsIdx,
      castableLevels,
      minLevel: startLevel,
      maxLevel: endLevel,
    };
  };

  getSpellLevelUses = (
    spellSlots: Array<SpellSlotContract>,
    level: number
  ): number => {
    const spellSlot = spellSlots.find((slot) => slot.level === level);

    if (spellSlot) {
      return spellSlot.used;
    }

    return 0;
  };

  handleIncreaseCastLevel = (): void => {
    this.setState((prevState, props) => ({
      castableLevelsIdx: prevState.castableLevelsIdx + 1,
      castLevel: prevState.castableLevels[prevState.castableLevelsIdx + 1],
    }));
  };

  handleDecreaseCastLevel = (): void => {
    this.setState((prevState, props) => ({
      castableLevelsIdx: prevState.castableLevelsIdx - 1,
      castLevel: prevState.castableLevels[prevState.castableLevelsIdx - 1],
    }));
  };

  handleCastSpellSlot = (): void => {
    this.handleSpellUse(true, false);
  };

  handleCastPactMagicSlot = (): void => {
    this.handleSpellUse(false, true);
  };

  // TODO dispatch needs to be factored out
  handleSpellUse = (useSpellSlot: boolean, usePactMagicSlot: boolean): void => {
    const { castLevel, minLevel } = this.state;
    const {
      dispatch,
      spell,
      spellSlots,
      pactMagicSlots,
      isReadonly,
      inventoryManager,
    } = this.props;

    if (isReadonly) {
      return;
    }

    const dataOrigin = SpellUtils.getDataOrigin(spell);
    const dataOriginType = SpellUtils.getDataOriginType(spell);

    let limitedUse = SpellUtils.getLimitedUse(spell);
    let mappingId: number | null = null;
    let mappingTypeId: number | null = null;
    if (limitedUse) {
      let numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
      let uses = SpellUtils.getConsumedLimitedUse(spell, castLevel - minLevel);

      switch (dataOriginType) {
        case Constants.DataOriginTypeEnum.ITEM:
          //TODO itemManager: make a way to get the item with just he mapping id and lookups?

          mappingId = ItemUtils.getMappingId(
            dataOrigin.primary as BaseInventoryContract
          );
          mappingTypeId = ItemUtils.getMappingEntityTypeId(
            dataOrigin.primary as BaseInventoryContract
          );
          const itemData = dataOrigin.primary as BaseInventoryContract;
          const item = ItemManager.getItem(ItemUtils.getMappingId(itemData));
          item.handleItemLimitedUseSet(numberUsed + uses);
          dispatch(
            toastMessageActions.toastSuccess(
              "Item Spell Cast",
              `Cast ${SpellUtils.getName(
                spell
              )} from ${EntityUtils.getDataOriginName(dataOrigin)}`
            )
          );
          break;
        default:
          mappingId = SpellUtils.getMappingId(spell);
          mappingTypeId = SpellUtils.getMappingEntityTypeId(spell);
          if (mappingId !== null && mappingTypeId !== null) {
            dispatch(
              characterActions.spellUseSet(
                mappingId,
                mappingTypeId,
                numberUsed + uses,
                dataOriginType
              )
            );
            dispatch(
              toastMessageActions.toastSuccess(
                "Limited Use Spell Cast",
                `Cast ${SpellUtils.getName(spell)} with limited use`
              )
            );
          }
      }
    }

    if (useSpellSlot) {
      let castLevelKey =
        ApiRequestHelpers.getSpellLevelSpellSlotRequestsDataKey(castLevel);
      if (castLevelKey !== null) {
        dispatch(
          characterActions.spellLevelSpellSlotsSet({
            [castLevelKey]: this.getSpellLevelUses(spellSlots, castLevel) + 1,
          })
        );
        dispatch(
          toastMessageActions.toastSuccess(
            "Spell Cast",
            `Cast ${SpellUtils.getName(spell)} in spell slot level ${castLevel}`
          )
        );
      }
    }

    if (usePactMagicSlot) {
      let castLevelKey =
        ApiRequestHelpers.getSpellLevelPactMagicRequestsDataKey(castLevel);
      if (castLevelKey !== null) {
        dispatch(
          characterActions.spellLevelPactMagicSlotsSet({
            [castLevelKey]:
              this.getSpellLevelUses(pactMagicSlots, castLevel) + 1,
          })
        );
        dispatch(
          toastMessageActions.toastSuccess(
            "Spell Cast",
            `Cast ${SpellUtils.getName(spell)} in a pact magic slot`
          )
        );
      }
    }
  };

  handleCast = (): void => {
    const { castLevel } = this.state;
    const { spell, spellCasterInfo } = this.props;

    let usesSpellSlot = SpellUtils.getUsesSpellSlot(spell);
    let limitedUse = SpellUtils.getLimitedUse(spell);

    const isSpellSlotAvailable = canCastAtLevel(
      castLevel,
      spellCasterInfo.castableSpellLevels
    );
    const isPactSlotAvailable = canCastAtLevel(
      castLevel,
      spellCasterInfo.castablePactMagicLevels
    );

    if (usesSpellSlot) {
      if (limitedUse) {
        if (SpellUtils.isValidToUsePactSlots(spell)) {
          if (isPactSlotAvailable) {
            this.handleSpellUse(false, true);
          }
        } else {
          if (isSpellSlotAvailable) {
            this.handleSpellUse(true, false);
          }
        }
      } else {
        if (isSpellSlotAvailable) {
          this.handleSpellUse(true, false);
        } else if (isPactSlotAvailable) {
          this.handleSpellUse(false, true);
        }
      }
    } else {
      this.handleSpellUse(false, false);
    }
  };

  renderLimitedUseDetails = (): React.ReactNode => {
    const { spell, ruleData, abilityLookup, proficiencyBonus } = this.props;
    const limitedUse = SpellUtils.getLimitedUse(spell);

    if (!limitedUse) {
      return null;
    }

    const maxUses = LimitedUseUtils.deriveMaxUses(
      limitedUse,
      abilityLookup,
      ruleData,
      proficiencyBonus
    );
    const resetType = LimitedUseUtils.getResetType(limitedUse);

    if (resetType === null) {
      return null;
    }

    let limitedUseType: string = "Use";
    if (
      SpellUtils.getDataOriginType(spell) === Constants.DataOriginTypeEnum.ITEM
    ) {
      limitedUseType = "Charge";
    }

    let resetDisplay: string = "";
    switch (resetType) {
      case Constants.LimitedUseResetTypeEnum.SHORT_REST:
      case Constants.LimitedUseResetTypeEnum.LONG_REST:
        resetDisplay = `${
          maxUses === 1 ? "Once" : maxUses
        } per ${RuleDataUtils.getLimitedUseResetTypeName(resetType, ruleData)}`;
        break;
      default:
        resetDisplay = `${maxUses} ${limitedUseType}${
          maxUses !== 1 ? "s" : ""
        }, Reset: ${RuleDataUtils.getLimitedUseResetTypeName(
          resetType,
          ruleData
        )}`;
        break;
    }

    return <div className="ct-spell-caster__limited">{resetDisplay}</div>;
  };

  renderCasting = (): React.ReactNode => {
    const { castLevel, minLevel, maxLevel, castableLevelsIdx, castableLevels } =
      this.state;
    const {
      spell,
      castableSpellLevels,
      castablePactMagicLevels,
      spellSlots,
      pactMagicSlots,
      availableSpellLevels,
      availablePactMagicLevels,
      ruleData,
      abilityLookup,
      spellCasterInfo,
      isReadonly,
      proficiencyBonus,
    } = this.props;

    const limitedUse = SpellUtils.getLimitedUse(spell);
    const isAtWill = SpellUtils.validateIsAtWill(spell, castLevel);
    const castAsRitual = SpellUtils.isCastAsRitual(spell);

    let castLevelNode: React.ReactNode;
    let castActionsNode: React.ReactNode;

    if (castAsRitual) {
      castActionsNode = "As Ritual";
    } else if (isAtWill) {
      castActionsNode = "At Will";
    } else {
      if (limitedUse) {
        const maxUses = LimitedUseUtils.deriveMaxUses(
          limitedUse,
          abilityLookup,
          ruleData,
          proficiencyBonus
        );
        const numberUsed = LimitedUseUtils.getNumberUsed(limitedUse);
        const consumedAmount = SpellUtils.getConsumedLimitedUse(
          spell,
          castLevel - minLevel
        );
        const numberRemaining: number = maxUses - numberUsed;
        let limitedUseButtonText: React.ReactNode;
        let showRemainingCount: boolean = true;

        const dataOriginType = SpellUtils.getDataOriginType(spell);

        if (maxUses === 1) {
          if (dataOriginType === Constants.DataOriginTypeEnum.ITEM) {
            limitedUseButtonText = "1 Charge";
          } else {
            limitedUseButtonText = "Use";
            showRemainingCount = false;
          }
        } else {
          limitedUseButtonText = `${consumedAmount} ${
            dataOriginType === Constants.DataOriginTypeEnum.ITEM
              ? "Charge"
              : "Use"
          }${consumedAmount !== 1 ? "s" : ""}`;
        }

        const isLimitedUseAvailable =
          SpellUtils.validateIsLimitedUseAvailableAtScaledAmount(
            spell,
            castLevel,
            castLevel - minLevel,
            abilityLookup,
            ruleData,
            spellCasterInfo,
            proficiencyBonus
          );
        const usesSpellSlots = SpellUtils.getUsesSpellSlot(spell);

        let spellSlotsAvailable: number | null = null;
        let spellSlotName: string = "";
        if (usesSpellSlots) {
          if (SpellUtils.isValidToUsePactSlots(spell)) {
            spellSlotsAvailable = SpellUtils.getCastLevelAvailableCount(
              castLevel,
              pactMagicSlots
            );
            spellSlotName = "Pact Slot";
          } else {
            spellSlotsAvailable = SpellUtils.getCastLevelAvailableCount(
              castLevel,
              spellSlots
            );
            spellSlotName = "Spell Slot";
          }
        }

        castActionsNode = (
          <React.Fragment>
            <div className="ct-spell-caster__casting-action">
              <ThemeButton
                disabled={!isLimitedUseAvailable}
                isInteractive={!isReadonly}
                onClick={this.handleCast}
                className="ct-spell-caster__casting-action-button--limited"
              >
                {usesSpellSlots ? `${spellSlotName}, ` : ""}
                {limitedUseButtonText}
                {usesSpellSlots && (
                  <span className="ct-spell-caster__casting-action-countstcs-spell-caster__casting-action-count--spellcasting">
                    {spellSlotsAvailable}
                  </span>
                )}
                {showRemainingCount && (
                  <span className="ct-spell-caster__casting-action-countstcs-spell-caster__casting-action-count--limited-use">
                    {numberRemaining}
                  </span>
                )}
              </ThemeButton>
            </div>
          </React.Fragment>
        );
      } else {
        const canSpellCastAtLevel = canCastAtLevel(
          castLevel,
          castableSpellLevels
        );
        const canPactMagicCastAtLevel = canCastAtLevel(
          castLevel,
          castablePactMagicLevels
        );
        const isSpellCastAvailableAtLevel = isCastAvailableAtLevel(
          castLevel,
          availableSpellLevels
        );
        const isPactMagicCastAvailableAtLevel = isCastAvailableAtLevel(
          castLevel,
          availablePactMagicLevels
        );
        const spellCastLevelAvailableCount =
          SpellUtils.getCastLevelAvailableCount(castLevel, spellSlots);
        const pactMagicCastLevelAvailableCount =
          SpellUtils.getCastLevelAvailableCount(castLevel, pactMagicSlots);

        castActionsNode = (
          <React.Fragment>
            {isSpellCastAvailableAtLevel && (
              <div className="ct-spell-caster__casting-action">
                <ThemeButton
                  disabled={!canSpellCastAtLevel}
                  isInteractive={!isReadonly}
                  onClick={this.handleCastSpellSlot}
                >
                  Spell Slot
                  <span className="ct-spell-caster__casting-action-countstcs-spell-caster__casting-action-count--spellcasting">
                    {spellCastLevelAvailableCount}
                  </span>
                </ThemeButton>
              </div>
            )}
            {isPactMagicCastAvailableAtLevel && (
              <div className="ct-spell-caster__casting-action">
                <ThemeButton
                  disabled={!canPactMagicCastAtLevel}
                  onClick={this.handleCastPactMagicSlot}
                >
                  Pact Slot
                  <span className="ct-spell-caster__casting-action-countstcs-spell-caster__casting-action-count--spellcasting">
                    {pactMagicCastLevelAvailableCount}
                  </span>
                </ThemeButton>
              </div>
            )}
          </React.Fragment>
        );
      }
    }

    if (!SpellUtils.isCantrip(spell)) {
      castLevelNode = (
        <div className="ct-spell-caster__casting-level">
          <span className="ct-spell-caster__casting-level-label">Level</span>
          {minLevel !== maxLevel && (
            <span className="ct-spell-caster__casting-level-action">
              <ThemeButton
                disabled={castableLevelsIdx === 0}
                onClick={this.handleDecreaseCastLevel}
                className="ct-button--decrease"
              />
            </span>
          )}
          <span
            className={`ct-spell-caster__casting-level-currentstcs-spell-caster__casting-level-current--${
              minLevel === maxLevel ? "nocontrols" : "controls"
            }`}
          >
            {FormatUtils.renderSpellLevelAbbreviation(castLevel)}
          </span>
          {minLevel !== maxLevel && (
            <span className="ct-spell-caster__casting-level-action">
              <ThemeButton
                disabled={castableLevelsIdx + 1 === castableLevels.length}
                onClick={this.handleIncreaseCastLevel}
                className="ct-button--increase"
              />
            </span>
          )}
        </div>
      );
    }
    //`

    return (
      <div className="ct-spell-caster__casting">
        <div className="ct-spell-caster__casting-label">Cast</div>
        <div className="ct-spell-caster__casting-actions">
          {castActionsNode}
        </div>
        {castLevelNode}
      </div>
    );
  };

  renderAtHigherLevels = (): React.ReactNode => {
    const { castLevel } = this.state;
    const { spell, characterLevel } = this.props;

    const atHigherLevels = SpellUtils.getAtHigherLevels(spell);
    if (!atHigherLevels) {
      return null;
    }

    const scaleType = SpellUtils.getScaleType(spell);

    const {
      additionalAttacks,
      additionalTargets,
      areaOfEffect,
      duration,
      creatures,
      special,
      range,
    } = atHigherLevels;

    const level = SpellUtils.getLevel(spell);

    let additionalAttacksDisplay: React.ReactNode;
    if (additionalAttacks !== null) {
      const additionalAttackInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        additionalAttacks,
        characterLevel,
        castLevel
      );
      if (additionalAttackInfo) {
        const additionalAttackCount =
          level === 0
            ? additionalAttackInfo.totalCount + 1
            : additionalAttackInfo.totalCount;
        const additionalAttackLabel = level === 0 ? "Total" : "Additional";
        additionalAttacksDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--attacks">
            {additionalAttackLabel} {additionalAttackInfo.description}:{" "}
            {additionalAttackCount}
          </div>
        );
      }
    }

    let additionalTargetsDisplay: React.ReactNode;
    if (additionalTargets !== null) {
      const additionalTargetInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        additionalTargets,
        characterLevel,
        castLevel
      );
      if (additionalTargetInfo) {
        additionalTargetsDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--targets">
            <div className="ct-spell-caster__higher-targets-info">
              {additionalTargetInfo.targets} Additional Target
              {additionalTargetInfo.targets === 1 ? "" : "s"}
            </div>
            <div className="ct-spell-caster__higher-targets-description">
              {additionalTargetInfo.description}
            </div>
          </div>
        );
      }
    }

    let aoeDisplay: React.ReactNode;
    if (areaOfEffect !== null) {
      const aoeInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        areaOfEffect,
        characterLevel,
        castLevel
      );
      if (aoeInfo && aoeInfo.extendedAoe !== null) {
        aoeDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--aoe">
            Extended Area: {FormatUtils.renderDistance(aoeInfo.extendedAoe)}{" "}
            {aoeInfo.description}
          </div>
        );
      }
    }

    let rangeDisplay: React.ReactNode;
    if (range !== null) {
      const rangeInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        range,
        characterLevel,
        castLevel
      );
      if (rangeInfo && rangeInfo.range) {
        rangeDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--range">
            Extended Range: {FormatUtils.renderDistance(rangeInfo.range)}{" "}
            {rangeInfo.description}
          </div>
        );
      }
    }

    let durationDisplay: React.ReactNode;
    if (duration !== null) {
      const durationInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        duration,
        characterLevel,
        castLevel
      );
      if (durationInfo) {
        durationDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--duration">
            Extended Duration: {durationInfo.description}
          </div>
        );
      }
    }

    let creaturesDisplay: React.ReactNode;
    if (creatures !== null) {
      const creatureInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        creatures,
        characterLevel,
        castLevel
      );
      if (creatureInfo) {
        creaturesDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--creatures">
            Creatures: {creatureInfo.description}
          </div>
        );
      }
    }

    let specialDisplay: React.ReactNode;
    if (special !== null) {
      const specialInfo = SpellUtils.getSpellScaledAtHigher(
        spell,
        scaleType,
        special,
        characterLevel,
        castLevel
      );
      if (specialInfo) {
        specialDisplay = (
          <div className="ct-spell-caster__higherstcs-spell-caster__higher--special">
            Special: {specialInfo.description}
          </div>
        );
      }
    }

    if (
      !additionalAttacksDisplay &&
      !additionalTargetsDisplay &&
      !aoeDisplay &&
      !durationDisplay &&
      !creaturesDisplay &&
      !specialDisplay &&
      !rangeDisplay
    ) {
      return null;
    }

    return (
      <div className="ct-spell-caster__higher-items">
        {additionalAttacksDisplay}
        {additionalTargetsDisplay}
        {rangeDisplay}
        {aoeDisplay}
        {durationDisplay}
        {creaturesDisplay}
        {specialDisplay}
      </div>
    );
  };

  render() {
    const { castLevel } = this.state;
    const { characterLevel, spell, theme } = this.props;

    const modifiers = SpellUtils.getModifiers(spell);

    const damageModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellDamageModifier(modifier)
    );
    let damageNode: React.ReactNode;
    if (damageModifiers.length) {
      damageNode = (
        <div className="ct-spell-caster__modifiersstcs-spell-caster__modifiers--damages">
          {damageModifiers.map((modifier) => {
            const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
            const id = ModifierUtils.getId(modifier);
            const restriction = ModifierUtils.getRestriction(modifier);
            const friendlySubtypeName =
              ModifierUtils.getFriendlySubtypeName(modifier);
            const atHigherDamage = SpellUtils.getSpellScaledAtHigher(
              spell,
              atHigherLevels ? SpellUtils.getScaleType(spell) : null,
              atHigherLevels && atHigherLevels.points
                ? atHigherLevels.points
                : [],
              characterLevel,
              castLevel
            );
            const scaledDamageDie = SpellUtils.getSpellFinalScaledDie(
              spell,
              modifier,
              atHigherDamage
            );

            return (
              <div
                className="ct-spell-caster__modifierstcs-spell-caster__modifier--damage"
                key={id ? id : ""}
              >
                {scaledDamageDie && (
                  <span className="ct-spell-caster__modifier-amount">
                    {DiceUtils.renderDice(scaledDamageDie)}
                  </span>
                )}
                {friendlySubtypeName !== null && (
                  <span className="ct-spell-caster__modifier-effect">
                    <DamageTypeIcon
                      theme={theme}
                      type={
                        FormatUtils.slugify(
                          friendlySubtypeName
                        ) as ComponentConstants.DamageTypePropType
                      }
                    />{" "}
                    Damage
                  </span>
                )}
                {!!restriction && (
                  <span className="ct-spell-caster__modifier-restriction">
                    ({restriction})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    const hitPointHealingModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellHealingHitPointsModifier(modifier)
    );
    const tempHitPointHealingModifiers = modifiers.filter((modifier) =>
      ModifierUtils.isSpellHealingTempHitPointsModifier(modifier)
    );
    let healingNode: React.ReactNode;
    if (
      hitPointHealingModifiers.length ||
      tempHitPointHealingModifiers.length
    ) {
      healingNode = (
        <div className="ct-spell-caster__modifiersstcs-spell-caster__modifiers--healing">
          {hitPointHealingModifiers.map((modifier) => {
            const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
            const id = ModifierUtils.getId(modifier);
            const restriction = ModifierUtils.getRestriction(modifier);
            const atHigherHealing = SpellUtils.getSpellScaledAtHigher(
              spell,
              atHigherLevels ? SpellUtils.getScaleType(spell) : null,
              atHigherLevels && atHigherLevels.points
                ? atHigherLevels.points
                : [],
              characterLevel,
              castLevel
            );
            const scaledHealingDie = SpellUtils.getSpellFinalScaledDie(
              spell,
              modifier,
              atHigherHealing,
              castLevel
            );
            const isHealingDieAdditional =
              SpellUtils.hack__isHealingDieAdditionalBonusFixedValue(
                damageModifiers,
                spell,
                scaledHealingDie
              );
            return (
              <div
                className="ct-spell-caster__modifierstcs-spell-caster__modifier--hp"
                key={id ? id : ""}
              >
                <span className="ct-spell-caster__modifier-amount">
                  Regain {isHealingDieAdditional && "Additional"}{" "}
                  {scaledHealingDie && DiceUtils.renderDice(scaledHealingDie)}{" "}
                  Hit Points
                </span>
                {!!restriction && (
                  <span className="ct-spell-caster__modifier-restriction">
                    ({restriction})
                  </span>
                )}
              </div>
            );
          })}
          {tempHitPointHealingModifiers.map((modifier) => {
            const atHigherLevels = ModifierUtils.getAtHigherLevels(modifier);
            const id = ModifierUtils.getId(modifier);
            const restriction = ModifierUtils.getRestriction(modifier);
            const atHigherHealing = SpellUtils.getSpellScaledAtHigher(
              spell,
              atHigherLevels ? SpellUtils.getScaleType(spell) : null,
              atHigherLevels && atHigherLevels.points
                ? atHigherLevels.points
                : [],
              characterLevel,
              castLevel
            );
            const scaledHealingDie = SpellUtils.getSpellFinalScaledDie(
              spell,
              modifier,
              atHigherHealing,
              castLevel
            );
            return (
              <div
                className="ct-spell-caster__modifierstcs-spell-caster__modifier--temp"
                key={id ? id : ""}
              >
                <span className="ct-spell-caster__modifier-amount">
                  Regain{" "}
                  {scaledHealingDie && DiceUtils.renderDice(scaledHealingDie)}{" "}
                  Temp Hit Points
                </span>
                {!!restriction && (
                  <span className="ct-spell-caster__modifier-restriction">
                    ({restriction})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    const castingNode = this.renderCasting();
    const limitedUseNode = this.renderLimitedUseDetails();
    const atHigherLevelsNode = this.renderAtHigherLevels();

    if (
      !castingNode &&
      !limitedUseNode &&
      !damageNode &&
      !healingNode &&
      !atHigherLevelsNode
    ) {
      return null;
    }

    return (
      <div className="ct-spell-caster">
        {castingNode}
        {limitedUseNode}
        {damageNode}
        {healingNode}
        {atHigherLevelsNode}
      </div>
    );
  }
}

const SpellCasterContainer = (props) => {
  const { inventoryManager } = useContext(InventoryManagerContext);
  return <SpellCaster inventoryManager={inventoryManager} {...props} />;
};

export default SpellCasterContainer;
