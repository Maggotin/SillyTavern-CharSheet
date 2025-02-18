import {
  CharacterTheme,
  Constants,
  DataOrigin,
  DeathSaveInfo,
  DiceAdjustment,
  RuleData,
} from "../../character-rules-engine/es";

import DiceAdjustmentSummary from "../../../Shared/components/DiceAdjustmentSummary";

interface Props {
  savingThrowDiceAdjustments: Array<DiceAdjustment>;
  onDataOriginClick?: (dataOrigin: DataOrigin) => void;
  deathSaveInfo: DeathSaveInfo;
  ruleData: RuleData;
  theme: CharacterTheme;
}
export default function SavingThrowsDetails({
  savingThrowDiceAdjustments,
  onDataOriginClick,
  deathSaveInfo,
  ruleData,
  theme,
}: Props) {
  const renderDiceAdjustmentList = (
    diceAdjustments: Array<DiceAdjustment>,
    showDataOrigin: boolean = false
  ): React.ReactNode => {
    if (!diceAdjustments.length) {
      return null;
    }

    return (
      <>
        {diceAdjustments.map((diceAdjustment, idx) => {
          return (
            <DiceAdjustmentSummary
              theme={theme}
              diceAdjustment={diceAdjustment}
              key={diceAdjustment.uniqueKey}
              ruleData={ruleData}
              showDataOrigin={showDataOrigin}
              onDataOriginClick={onDataOriginClick}
            />
          );
        })}
      </>
    );
  };

  if (
    !savingThrowDiceAdjustments.length &&
    !deathSaveInfo.disadvantageAdjustments.length &&
    !deathSaveInfo.advantageAdjustments.length
  ) {
    return (
      <div className="ct-saving-throws-details__empty">
        You have no saving throw modifiers
      </div>
    );
  }

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

  return (
    <div className="ct-saving-throws-details">
      {renderDiceAdjustmentList(advantageSavingThrowAdjustments)}
      {renderDiceAdjustmentList(deathSaveInfo.advantageAdjustments)}
      {renderDiceAdjustmentList(disadvantageSavingThrowAdjustments)}
      {renderDiceAdjustmentList(deathSaveInfo.disadvantageAdjustments)}
      {renderDiceAdjustmentList(bonusSavingThrowAdjustments, true)}
    </div>
  );
}
