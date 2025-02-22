import { visuallyHidden } from "@mui/utils";
import { useContext } from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  AbilityManager,
  CharacterTheme,
  FormatUtils,
  SituationalSavingThrowInfo,
  SituationalSavingThrowInfoLookup,
} from "@dndbeyond/character-rules-engine/es";
import { DiceTools, IRollContext, RollType } from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";

import BoxBackground from "../BoxBackground";
import { ProficiencyLevelIcon } from "../Icons";
import {
  ThemedSavingThrowSelectionBoxSvg,
  ThemedSavingThrowSelectionSmallBoxSvg,
  ThemedSavingThrowRowBoxSvg,
  ThemedSavingThrowRowSmallBoxSvg,
  NegativeBonusNegativeSvg,
  PositiveBonusPositiveSvg,
  DarkModePositiveBonusPositiveSvg,
  DarkModeNegativeBonusNegativeSvg,
} from "../Svg";
import { isNotNullOrUndefined } from "../utils/TypeScriptUtils";

interface Props {
  abilities: Array<AbilityManager>;
  situationalBonusSavingThrowsLookup: SituationalSavingThrowInfoLookup;
  onClick?: (ability: AbilityManager) => void;
  rowStyle?: "small" | "normal";
  className?: string;
  diceEnabled?: boolean;
  theme: CharacterTheme;
  rollContext: IRollContext;
}
export default function SavingThrowsSummary({
  abilities,
  situationalBonusSavingThrowsLookup,
  onClick = (ability: AbilityManager) => {},
  theme,
  rollContext,
  className = "",
  diceEnabled = false,
  rowStyle = "normal",
}: Props) {
  const handleClick = (
    ability: AbilityManager,
    evt: React.MouseEvent
  ): void => {
    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick(ability);
    }
  };

  const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
    useContext(GameLogContext);

  return (
    <div className="ddbc-saving-throws-summary">
      {abilities.map((ability) => {
        let situationalBonusSavingThrows: Array<SituationalSavingThrowInfo> =
          [];
        let maxOptBonus: number = 0;

        if (situationalBonusSavingThrowsLookup) {
          situationalBonusSavingThrows =
            situationalBonusSavingThrowsLookup[ability.getId()];
          if (
            situationalBonusSavingThrows &&
            situationalBonusSavingThrows.length
          ) {
            let situationalBonusSavingThrowsValues: Array<number> =
              situationalBonusSavingThrows.map((optBonus) => optBonus.value);
            maxOptBonus = Math.max(...situationalBonusSavingThrowsValues);
          }
        }

        let situationalBonusClasses: Array<string> = [
          "ddbc-saving-throws-summary__ability-situational",
        ];
        let IconComponent: React.ComponentType<any> | null = null;
        if (maxOptBonus < 0) {
          situationalBonusClasses.push(
            "ddbc-saving-throws-summary__ability-situational--bonus-neg"
          );
          IconComponent = theme?.isDarkMode
            ? DarkModeNegativeBonusNegativeSvg
            : NegativeBonusNegativeSvg;
        } else {
          situationalBonusClasses.push(
            "ddbc-saving-throws-summary__ability-situational--bonus-pos"
          );
          IconComponent = theme?.isDarkMode
            ? DarkModePositiveBonusPositiveSvg
            : PositiveBonusPositiveSvg;
        }

        let StyleComponent: React.ComponentType<any> =
          ThemedSavingThrowRowBoxSvg;
        let SelectionBox = ThemedSavingThrowSelectionBoxSvg;
        if (rowStyle === "small") {
          StyleComponent = ThemedSavingThrowRowSmallBoxSvg;
          SelectionBox = ThemedSavingThrowSelectionSmallBoxSvg;
        }

        return (
          <div
            key={ability.getStatKey()}
            className={`ddbc-saving-throws-summary__ability ddbc-saving-throws-summary__ability--${FormatUtils.slugify(
              ability.getStatKey()
            )}`}
            onClick={(event) => handleClick(ability, event)}
          >
            <BoxBackground
              StyleComponent={StyleComponent}
              theme={{
                ...theme,
                themeColor: `${theme.themeColor}80`,
              }}
            />
            <h3 style={visuallyHidden}>{ability.getLabel()} Saving Throw</h3>
            <div className="ddbc-saving-throws-summary__ability-proficiency">
              <ProficiencyLevelIcon
                proficiencyLevel={ability.getProficiencyLevel()}
                isModified={ability.getIsSaveProficiencyModified()}
                theme={theme}
              />
            </div>
            <div
              className={`ddbc-saving-throws-summary__ability-name ${
                theme.isDarkMode
                  ? "ddbc-saving-throws-summary__ability-name--dark-mode"
                  : ""
              }`}
            >
              <abbr
                title={ability.getLabel() ?? "Unknown Saving Throw"}
                aria-hidden={true}
              >
                {ability.getName()}
              </abbr>
            </div>
            <div className="ddbc-saving-throws-summary__ability-modifier">
              <RollableNumberDisplay
                number={ability.getSave()}
                type="signed"
                isModified={ability.getIsSaveModifierModified()}
                diceNotation={DiceTools.CustomD20(ability.getSave())}
                rollType={RollType.Save}
                rollAction={ability.getName()}
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
              <SelectionBox
                theme={theme}
                className={`ddbc-saving-throws-summary__ability-modifier-background`}
              />
            </div>
            {situationalBonusSavingThrows &&
              situationalBonusSavingThrows.length > 0 && (
                <Tooltip
                  className={situationalBonusClasses.join(" ")}
                  isDarkMode={theme.isDarkMode}
                  title={`Situational Bonus${
                    situationalBonusSavingThrows.length !== 1 ? "es" : ""
                  }`}
                >
                  <IconComponent className="ddbc-saving-throws-summary__ability-situational-icon" />
                </Tooltip>
              )}
          </div>
        );
      })}
    </div>
  );
}
