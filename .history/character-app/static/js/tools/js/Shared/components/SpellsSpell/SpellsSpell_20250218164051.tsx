import React, { useCallback, useContext, useEffect, useMemo } from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  DiceComponentUtils,
  NoteComponents,
  SpellDamageEffect,
} from "@dndbeyond/character-components/es";
import {
  AbilityLookup,
  ActivationUtils,
  BaseInventoryContract,
  CharacterTheme,
  Constants,
  DataOriginRefData,
  EntityUtils,
  FormatUtils,
  RuleData,
  ScaledSpell,
  Spell,
  LeveledSpellManager,
} from "../../rules-engine/es";
import {
  Dice,
  DiceEvent,
  DiceTools,
  IRollContext,
  RollRequest,
  RollType,
} from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { ItemName } from "~/components/ItemName";
import { NumberDisplay } from "~/components/NumberDisplay";
import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";
import { SpellName } from "~/components/SpellName";

import { TypeScriptUtils } from "../../utils";
import SpellSlotChooser from "../SpellSlotChooser";
import { ThemeButton } from "../common/Button";

interface Props {
  className?: string;
  spell: ScaledSpell;
  castLevel: number;
  characterLevel: number;
  isSpellSlotAvailable: boolean;
  isPactSlotAvailable: boolean;
  doesSpellSlotExist: boolean;
  doesPactSlotExist: boolean;
  ruleData: RuleData;
  abilityLookup: AbilityLookup;
  dataOriginRefData: DataOriginRefData;
  onClick?: (spell: Spell, castLevel: number) => void;
  onUse?: (
    useSpellSlot: boolean,
    usePactMagicSlot: boolean,
    dataOriginType: Constants.DataOriginTypeEnum,
    uses: number | null,
    mappingId: number | null,
    mappingTypeId: number | null
  ) => void;
  showNotes: boolean;
  isInteractive: boolean;
  diceEnabled: boolean;
  theme: CharacterTheme;
  proficiencyBonus: number;
  rollContext: IRollContext;
}

function SpellsSpell({
  className = "",
  spell: spellData,
  castLevel,
  characterLevel,
  isSpellSlotAvailable,
  isPactSlotAvailable,
  doesSpellSlotExist,
  doesPactSlotExist,
  ruleData,
  abilityLookup,
  dataOriginRefData,
  onClick,
  onUse,
  showNotes = true,
  isInteractive,
  diceEnabled,
  theme,
  proficiencyBonus,
  rollContext,
}: Props) {
  const spell = useMemo(
    () => new LeveledSpellManager({ spell: spellData }),
    [spellData]
  );
  const [isSlotChooserOpen, setIsSlotChooserOpen] = React.useState(false);
  const [isCriticalHit, setIsCriticalHit] = React.useState(false);
  const spellsSpellNode = React.useRef<HTMLDivElement>(null);

  const handleSpellClick = (evt: React.MouseEvent): void => {
    evt.nativeEvent.stopImmediatePropagation();
    evt.stopPropagation();

    if (onClick) {
      onClick(spell.spell, castLevel);
    }
  };

  const handleDisabledCastClick = (): void => {
    if (onClick) {
      onClick(spell.spell, castLevel);
    }
  };

  const handleSpellSlotChooserOpen = (): void => {
    setIsSlotChooserOpen(true);
    document.addEventListener("click", handleDocumentClick);
  };

  const handleSpellSlotChooserClose = (): void => {
    setIsSlotChooserOpen(false);
  };

  const handleSpellSlotChosen = (): void => {
    spell.handleSpellUse(true, false);
    setIsSlotChooserOpen(false);
  };

  const handlePactSlotChosen = (): void => {
    spell.handleSpellUse(false, true);
    setIsSlotChooserOpen(false);
  };

  const handleRollResults = (result: RollRequest): void => {
    let wasCrit = DiceComponentUtils.isCriticalRoll(result);
    setIsCriticalHit(wasCrit);
  };

  const diceEventHandler = useMemo(() => {
    if (!spellsSpellNode.current) {
      return () => {
        /* NOOP */
      };
    }
    return DiceComponentUtils.setupResetCritStateOnRoll(
      spell.getName(),
      spellsSpellNode.current
    );
  }, [spell]);
  // TODO: use mui click away listener
  const handleDocumentClick = useCallback((): void => {
    handleSpellSlotChooserClose();
    document.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(
    () => () => {
      if (isSlotChooserOpen) {
        document.removeEventListener("click", handleDocumentClick);
      }

      Dice.removeEventListener(DiceEvent.ROLL, diceEventHandler);
    },
    [isSlotChooserOpen, handleDocumentClick, diceEventHandler]
  );

  // Todo: consider making a separate component for this
  const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
    useContext(GameLogContext);
  const renderAttackInfo = (): React.ReactNode => {
    let toHit: number | null = null;
    let saveDcValue: number | null = null;
    let saveDcLabel: string | null = null;
    let asPartOfWeaponAttack = spell.asPartOfWeaponAttack();
    let requiresAttackRoll = spell.getRequiresAttackRoll();
    let requiresSavingThrow = spell.getRequiresSavingThrow();
    if (requiresAttackRoll) {
      toHit = spell.getToHit();
    } else if (requiresSavingThrow) {
      saveDcValue = spell.getAttackSaveValue();
      saveDcLabel = spell.getSaveDcAbilityKey();
    }

    if (!asPartOfWeaponAttack) {
      if (requiresAttackRoll && toHit !== null) {
        return (
          <div className="ct-spells-spell__tohit">
            <RollableNumberDisplay
              number={toHit}
              type="signed"
              diceNotation={DiceTools.CustomD20(toHit)}
              rollType={RollType.ToHit}
              rollAction={spell.getName()}
              diceEnabled={diceEnabled}
              advMenu={true}
              themeColor={theme.themeColor}
              onRollResults={handleRollResults}
              rollContext={rollContext}
              rollTargetOptions={
                messageTargetOptions
                  ? Object.values(messageTargetOptions.entities).filter(
                      TypeScriptUtils.isNotNullOrUndefined
                    )
                  : undefined
              }
              rollTargetDefault={defaultMessageTargetOption}
              userId={Number(userId) || 0}
            />
          </div>
        );
      } else if (requiresSavingThrow) {
        return (
          <div className="ct-spells-spell__save">
            <span
              className={`ct-spells-spell__save-label ${
                theme?.isDarkMode ? "ct-spells-spell--dark-mode" : ""
              }`}
            >
              {saveDcLabel}
            </span>
            <span
              className={`ct-spells-spell__save-value ${
                theme?.isDarkMode ? "ct-spells-spell--dark-mode" : ""
              }`}
            >
              {saveDcValue}
            </span>
          </div>
        );
      }
    }

    return <div className="ct-spells-spell__empty-value">--</div>;
  };

  let range = spell.getRange();
  let limitedUse = spell.getLimitedUse();
  let activation = spell.getActivation();
  let isScaled = spell.getCastLevel() !== spell.getLevel();
  let isAtWill = spell.isAtWill();
  const spellDataOriginType = spell.getDataOriginType();
  const spellDataOrigin = spell.getDataOrigin();

  let limitedUseButtonText: React.ReactNode;
  if (limitedUse) {
    let maxUses = spell.getMaxUses();
    let consumedAmount = spell.getConsumedUses();
    if (
      maxUses === 1 &&
      spellDataOriginType !== Constants.DataOriginTypeEnum.ITEM
    ) {
      limitedUseButtonText = "Use";
    } else {
      limitedUseButtonText = `${consumedAmount} ${
        spellDataOriginType === Constants.DataOriginTypeEnum.ITEM ? "C" : "U"
      }`;
    }
  }

  let usesSpellSlot = spell.getUsesSpellSlot();

  let canCastSpell: boolean = true;
  if (limitedUse) {
    canCastSpell = spell.isLimitedUseAvailableAtScaledAmount();
  } else if (usesSpellSlot) {
    canCastSpell = isSpellSlotAvailable || isPactSlotAvailable;
  }

  let scaledInfoNode: React.ReactNode;
  if (isScaled) {
    scaledInfoNode = (
      <span className="ct-spells-spell__scaled">
        <span className="ct-spells-spell__scaled-level">
          <span className="ct-spells-spell__scaled-level-number">
            {spell.getLevel()}
          </span>
          <span className="ct-spells-spell__scaled-level-ordinal">
            {FormatUtils.getOrdinalSuffix(spell.getLevel())}
          </span>
        </span>
      </span>
    );
  }

  let combinedMetaItems: Array<React.ReactNode> = [];

  if (spell.isLegacy()) {
    combinedMetaItems.push("Legacy");
  }

  switch (spellDataOriginType) {
    case Constants.DataOriginTypeEnum.ITEM:
      combinedMetaItems.push(
        <ItemName item={spellDataOrigin.primary} showAttunement={false} />
      );
      break;
    default:
      combinedMetaItems.push(EntityUtils.getDataOriginName(spellDataOrigin));
  }

  let expandedDataOriginRef = spell.getExpandedDataOriginRef();
  if (expandedDataOriginRef !== null) {
    combinedMetaItems.push(
      EntityUtils.getDataOriginRefName(expandedDataOriginRef, dataOriginRefData)
    );
  }

  let castAsRitual = spell.isCastAsRitual();

  let actionNode: React.ReactNode;
  if (castAsRitual) {
    actionNode = <span className="ct-spells-spell__as-ritual">As Ritual</span>;
  } else if (isAtWill) {
    actionNode = <span className="ct-spells-spell__at-will">At Will</span>;
  } else {
    actionNode = (
      <React.Fragment>
        <ThemeButton
          size={"small"}
          onClick={
            canCastSpell
              ? () => spell.handleCastClick(handleSpellSlotChooserOpen)
              : handleDisabledCastClick
          }
          disabled={!canCastSpell}
          block={true}
          isInteractive={isInteractive}
        >
          {scaledInfoNode}
          {limitedUse ? limitedUseButtonText : "Cast"}
        </ThemeButton>
        {isSlotChooserOpen && canCastSpell && (
          <SpellSlotChooser
            onPactChoose={handlePactSlotChosen}
            onSpellChoose={handleSpellSlotChosen}
            isSpellSlotAvailable={isSpellSlotAvailable}
            isPactSlotAvailable={isPactSlotAvailable}
            doesSpellSlotExist={doesSpellSlotExist}
            doesPactSlotExist={doesPactSlotExist}
          />
        )}
      </React.Fragment>
    );
  }
  let classNames: Array<string> = ["ct-spells-spell", className];
  if (isCriticalHit) {
    classNames.push("ct-spells-spell--crit");
  }

  return (
    <div
      className={classNames.join(" ")}
      onClick={handleSpellClick}
      ref={spellsSpellNode}
    >
      <div className="ct-spells-spell__action">{actionNode}</div>
      <div className="ct-spells-spell__name">
        <div
          className={`ct-spells-spell__label ${
            isScaled ? "ct-spells-spell__label--scaled" : ""
          }`}
        >
          <SpellName
            spell={spell.spell}
            showSpellLevel={false}
            dataOriginRefData={dataOriginRefData}
          />
        </div>
        {combinedMetaItems.length > 0 && (
          <div
            className={`ct-spells-spell__meta ${
              theme.isDarkMode ? "ct-spells-spell__meta--dark-mode" : ""
            }`}
          >
            {combinedMetaItems.map((metaItem, idx) => (
              <span className="ct-spells-spell__meta-item" key={idx}>
                {metaItem}
              </span>
            ))}
          </div>
        )}
      </div>

      {activation !== null && (
        <div
          className={`ct-spells-spell__activation ${
            theme.isDarkMode ? "ct-spells-spell__activation--dark-mode" : ""
          }`}
        >
          <Tooltip
            isDarkMode={theme.isDarkMode}
            title={ActivationUtils.renderCastingTime(
              activation,
              castAsRitual ? 10 : 0,
              ruleData
            )}
            tippyOpts={{ dynamicTitle: true }}
          >
            {ActivationUtils.renderCastingTimeAbbreviation(activation)}
            {castAsRitual && (
              <span className="ct-spells-spell__activation-extra">+10m</span>
            )}
          </Tooltip>
        </div>
      )}
      {range !== null && (
        <div
          className={`ct-spells-spell__range ${
            theme?.isDarkMode ? "ct-spells-spell--dark-mode" : ""
          }`}
        >
          {!!range.origin &&
            range.origin !== Constants.SpellRangeTypeNameEnum.RANGED && (
              <span className="ct-spells-spell__range-origin">
                {range.origin}
              </span>
            )}
          {!!range.rangeValue && (
            <span className="ct-spells-spell__range-value">
              <NumberDisplay type="distanceInFt" number={range.rangeValue} />
            </span>
          )}
        </div>
      )}
      <div className="ct-spells-spell__attacking">{renderAttackInfo()}</div>
      <div className="ct-spells-spell__damage">
        <SpellDamageEffect
          spell={spell.spell}
          characterLevel={characterLevel}
          castLevel={castLevel}
          ruleData={ruleData}
          diceEnabled={diceEnabled}
          theme={theme}
          isCriticalHit={isCriticalHit}
          rollContext={rollContext}
        />
      </div>
      {showNotes && (
        <div className="ct-spells-spell__notes">
          <NoteComponents theme={theme} notes={spell.getNoteComponents()} />
        </div>
      )}
    </div>
  );
}

export default SpellsSpell;
