import { useContext } from "react";

import {
  AbilityManager,
  CharacterPreferences,
  CharacterTheme,
  Constants,
} from "@dndbeyond/character-rules-engine/es";
import { DiceTools, IRollContext, RollType } from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { NumberDisplay } from "~/components/NumberDisplay";
import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";

import BoxBackground from "../BoxBackground";
import { DigitalDiceWrapper } from "../Dice";
import AbilityScoreBoxSvg from "../Svg/boxes/AbilityScoreBoxSvg";
import { isNotNullOrUndefined } from "../utils/TypeScriptUtils";

interface Props {
  className?: string;
  ability: AbilityManager | { name: string; score: number; modifier: number };
  preferences: CharacterPreferences;
  theme: CharacterTheme;
  onClick?: (ability: AbilityManager) => void;
  diceEnabled?: boolean;
  rollContext: IRollContext;
}
export default function AbilitySummary({
  className = "",
  ability,
  preferences,
  theme,
  onClick,
  diceEnabled = false,
  rollContext,
}: Props) {
  const isManager = "getStatKey" in ability;

  const handleClick = (evt: React.MouseEvent): void => {
    if (onClick && isManager) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(ability);
    }
  };

  const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
    useContext(GameLogContext);

  let classNames: Array<string> = [className, "ddbc-ability-summary"];

  let primaryNode: React.ReactNode;
  let secondaryNode: React.ReactNode;
  if (!ability) return null;
  const abilityStatKey = isManager ? ability.getStatKey() : 0;
  const abilityLabel = isManager ? ability.getLabel() : ability.name;
  const abilityName = isManager ? ability.getName() : ability.name;
  const abilityModifier = isManager ? ability.getModifier() : ability.modifier;
  const abilityTotalScore = isManager ? ability.getTotalScore() : ability.score;

  if (
    preferences.abilityScoreDisplayType ===
    Constants.PreferenceAbilityScoreDisplayTypeEnum.SCORES_TOP
  ) {
    primaryNode = (
      <DigitalDiceWrapper
        diceNotation={DiceTools.CustomD20(
          abilityModifier === null ? 0 : abilityModifier
        )}
        rollType={RollType.Check}
        rollAction={abilityName}
        diceEnabled={diceEnabled}
        advMenu={true}
        themeColor={theme.themeColor}
        rollContext={rollContext}
        rollTargetOptions={
          messageTargetOptions?.entities
            ? Object.values(messageTargetOptions.entities).filter(
                isNotNullOrUndefined
              )
            : undefined
        }
        rollTargetDefault={defaultMessageTargetOption}
        userId={Number(userId)}
      >
        {abilityTotalScore}
      </DigitalDiceWrapper>
    );

    if (abilityModifier === null) {
      secondaryNode = "--";
    } else {
      secondaryNode = <NumberDisplay type="signed" number={abilityModifier} />;
    }
  } else {
    if (abilityModifier === null) {
      primaryNode = "--";
    } else {
      primaryNode = (
        <RollableNumberDisplay
          number={abilityModifier}
          type="signed"
          size={"large"}
          diceNotation={DiceTools.CustomD20(abilityModifier)}
          rollType={RollType.Check}
          rollAction={abilityName}
          diceEnabled={diceEnabled}
          advMenu={true}
          themeColor={theme.themeColor}
          rollContext={rollContext}
          rollTargetOptions={
            messageTargetOptions?.entities
              ? Object.values(messageTargetOptions.entities).filter(
                  isNotNullOrUndefined
                )
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          userId={Number(userId)}
        />
      );
    }
    secondaryNode = abilityTotalScore;
  }

  return (
    <div className={classNames.join(" ")} onClick={handleClick}>
      <BoxBackground StyleComponent={AbilityScoreBoxSvg} theme={theme} />
      <div className="ddbc-ability-summary__heading">
        <span
          className={`ddbc-ability-summary__label ${
            theme.isDarkMode ? "ddbc-ability-summary__label--dark-mode" : ""
          }`}
        >
          {abilityLabel}
        </span>
        <span className="ddbc-ability-summary__abbr">{abilityStatKey}</span>
      </div>
      <div
        className={`ddbc-ability-summary__primary ${
          theme.isDarkMode ? "ddbc-ability-summary__primary--dark-mode" : ""
        }`}
      >
        {primaryNode}
      </div>
      <div
        className={`ddbc-ability-summary__secondary ${
          theme.isDarkMode ? "ddbc-ability-summary__secondary--dark-mode" : ""
        }`}
      >
        {secondaryNode}
      </div>
    </div>
  );
}
