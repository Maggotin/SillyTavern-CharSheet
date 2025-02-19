import { visuallyHidden } from "@mui/utils";
import { orderBy } from "lodash";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import {
  BoxBackground,
  FancyBoxSvg230x200,
  FancyBoxSvg281x200,
  SavingThrowsSummary,
} from "@dndbeyond/character-components/es";
import {
  AbilityManager,
  CharacterTheme,
  CharacterUtils,
  Constants,
  DeathSaveInfo,
  DiceAdjustment,
  RuleData,
  SituationalSavingThrowInfoLookup,
} from "@dndbeyond/character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import DiceAdjustmentSummary from "../../../Shared/components/DiceAdjustmentSummary";
import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";

interface Props {
  abilities: Array<AbilityManager>;
  ruleData: RuleData;
  savingThrowDiceAdjustments: Array<DiceAdjustment>;
  situationalBonusSavingThrowsLookup: SituationalSavingThrowInfoLookup;
  deathSaveInfo: DeathSaveInfo;
  maxSummariesShown?: number;
  onAbilityClick?: (ability: AbilityManager) => void;
  onInfoClick?: () => void;
  onClick?: () => void;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  diceEnabled?: boolean;
  rollContext: IRollContext;
}

const sortDiceAdjustments = (
  diceAdjustments: Array<DiceAdjustment>
): Array<DiceAdjustment> => {
  let sortOrderLookup: Record<string, number> = {
    [Constants.DiceAdjustmentTypeEnum.ADVANTAGE]: 1,
    [Constants.DiceAdjustmentTypeEnum.DISADVANTAGE]: 2,
    [Constants.DiceAdjustmentTypeEnum.BONUS]: 3,
  };
  return orderBy(diceAdjustments, [
    (diceAdjustment) => sortOrderLookup[diceAdjustment.type],
  ]);
};

export default function SavingThrowsBox({
  abilities,
  ruleData,
  savingThrowDiceAdjustments,
  situationalBonusSavingThrowsLookup,
  deathSaveInfo,
  maxSummariesShown = 3,
  onAbilityClick,
  onInfoClick,
  onClick,
  dimensions,
  theme,
  diceEnabled = false,
  rollContext,
}: Props) {
  const filterDiceAdjustments = (): Array<DiceAdjustment> => {
    const advantageSavingThrowAdjustments: Array<DiceAdjustment> = [];
    const disadvantageSavingThrowAdjustments: Array<DiceAdjustment> = [];
    const bonusSavingThrowAdjustments: Array<DiceAdjustment> = [];

    savingThrowDiceAdjustments.forEach((adjustment) => {
      if (adjustment.type === Constants.DiceAdjustmentTypeEnum.ADVANTAGE) {
        advantageSavingThrowAdjustments.push(adjustment);
      }
      if (adjustment.type === Constants.DiceAdjustmentTypeEnum.DISADVANTAGE) {
        disadvantageSavingThrowAdjustments.push(adjustment);
      }
      if (adjustment.type === Constants.DiceAdjustmentTypeEnum.BONUS) {
        bonusSavingThrowAdjustments.push(adjustment);
      }
    });

    // TODO: this logic "seems" more related to game logic and less like view logic it should be moved.

    //get highest dice adjustment count from all saving throws
    let highestSavingThrowAdjustmentCount: number = Math.max(
      advantageSavingThrowAdjustments.length,
      disadvantageSavingThrowAdjustments.length,
      bonusSavingThrowAdjustments.length
    );

    //get highest dice adjustment count from all dice adjustments
    let highestDiceAdjustmentCount: number = Math.max(
      highestSavingThrowAdjustmentCount,
      deathSaveInfo.advantageAdjustments.length,
      deathSaveInfo.disadvantageAdjustments.length
    );

    let diceAdjustments: Array<DiceAdjustment> = [];
    if (highestDiceAdjustmentCount) {
      let saveAdjustmentMaxLoopCount: number = Math.min(
        maxSummariesShown,
        highestSavingThrowAdjustmentCount
      );

      //Does a round robin of all saving throw adjustments
      for (let i = 0; i < saveAdjustmentMaxLoopCount; i++) {
        if (diceAdjustments.length >= maxSummariesShown) {
          continue;
        }
        if (advantageSavingThrowAdjustments.length > i) {
          diceAdjustments.push(advantageSavingThrowAdjustments[i]);
        }
        if (
          diceAdjustments.length < maxSummariesShown &&
          disadvantageSavingThrowAdjustments.length > i
        ) {
          diceAdjustments.push(disadvantageSavingThrowAdjustments[i]);
        }
        if (
          diceAdjustments.length < maxSummariesShown &&
          bonusSavingThrowAdjustments.length > i
        ) {
          diceAdjustments.push(bonusSavingThrowAdjustments[i]);
        }
      }

      //Does a round robin of any death save adjustments if there is room in the diceAdjustments array
      let deathSaveMaxLoopCount: number = Math.max(
        0,
        maxSummariesShown - diceAdjustments.length
      );
      for (let i = 0; i < deathSaveMaxLoopCount; i++) {
        if (diceAdjustments.length >= maxSummariesShown) {
          continue;
        }
        if (deathSaveInfo.advantageAdjustments.length > i) {
          diceAdjustments.push(deathSaveInfo.advantageAdjustments[i]);
        }

        if (
          diceAdjustments.length < maxSummariesShown &&
          deathSaveInfo.disadvantageAdjustments.length > i
        ) {
          diceAdjustments.push(deathSaveInfo.disadvantageAdjustments[i]);
        }
      }

      if (diceAdjustments.length > 1) {
        return sortDiceAdjustments(diceAdjustments);
      }
    }

    return diceAdjustments;
  };

  const handleAbilityClick = (ability: AbilityManager): void => {
    if (onAbilityClick) {
      onAbilityClick(ability);
    }
  };

  const handleClick = (evt: React.MouseEvent): void => {
    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  const handleInfoClick = (evt: React.MouseEvent): void => {
    if (onInfoClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onInfoClick();
    }
  };

  const renderSummary = (
    diceAdjustment: DiceAdjustment,
    includeTooltip: boolean = true
  ): React.ReactNode => {
    const tooltip = CharacterUtils.generateSavingThrowAdjustmentSummary(
      diceAdjustment,
      ruleData
    );

    // White space is very intentional
    return (
      <Tooltip
        title={tooltip}
        enabled={includeTooltip}
        className="ct-saving-throws-box__modifier"
        key={diceAdjustment.uniqueKey}
        isDarkMode={theme.isDarkMode}
      >
        <DiceAdjustmentSummary
          diceAdjustment={diceAdjustment}
          ruleData={ruleData}
          showDataOrigin={false}
          theme={theme}
        />
      </Tooltip>
    );
    //`
  };

  const renderSingleSummary = (
    diceAdjustment: DiceAdjustment
  ): React.ReactNode => {
    return (
      <div
        className={`ct-saving-throws-box__modifiersstcs-saving-throws-box__modifiers--single ${
          theme.isDarkMode ? "ct-saving-throws-box__modifiers--dark-mode" : ""
        }`}
      >
        {renderSummary(diceAdjustment, false)}
      </div>
    );
  };

  const renderMultiSummary = (
    diceAdjustments: Array<DiceAdjustment>
  ): React.ReactNode => {
    return (
      <div
        className={`ct-saving-throws-box__modifiersstcs-saving-throws-box__modifiers--multi ${
          theme.isDarkMode ? "ct-saving-throws-box__modifiers--dark-mode" : ""
        }`}
      >
        {diceAdjustments.map((diceAdjustment) => renderSummary(diceAdjustment))}
      </div>
    );
  };

  const renderEmpty = (): React.ReactNode => {
    return (
      <div
        className={`ct-saving-throws-box__modifiersstcs-saving-throws-box__modifiers--empty ${
          theme.isDarkMode ? "ct-saving-throws-box__modifiers--dark-mode" : ""
        }`}
      >
        Saving Throw Modifiers
      </div>
    );
  };

  const renderSaveInfo = (): React.ReactNode => {
    const diceAdjustments = filterDiceAdjustments();

    if (diceAdjustments.length === 0) {
      return renderEmpty();
    }
    if (diceAdjustments.length === 1) {
      return renderSingleSummary(diceAdjustments[0]);
    }

    return renderMultiSummary(diceAdjustments);
  };

  let BoxBackgroundComponent: React.ComponentType = FancyBoxSvg230x200;
  let useSmallRowStyle: boolean = true;
  if (
    dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP ||
    dimensions.styleSizeType <= StyleSizeTypeEnum.TABLET
  ) {
    BoxBackgroundComponent = FancyBoxSvg281x200;
    useSmallRowStyle = false;
  }

  return (
    <section className="ct-saving-throws-box" onClick={handleClick}>
      <BoxBackground StyleComponent={BoxBackgroundComponent} theme={theme} />
      <h2 style={visuallyHidden}>Saving Throws</h2>
      <div className="ct-saving-throws-box__abilities">
        <SavingThrowsSummary
          abilities={abilities}
          situationalBonusSavingThrowsLookup={
            situationalBonusSavingThrowsLookup
          }
          onClick={handleAbilityClick}
          diceEnabled={diceEnabled}
          theme={theme}
          rowStyle={useSmallRowStyle ? "small" : "normal"}
          rollContext={rollContext}
        />
      </div>
      <div className="ct-saving-throws-box__info" onClick={handleInfoClick}>
        {renderSaveInfo()}
      </div>
    </section>
  );
}
