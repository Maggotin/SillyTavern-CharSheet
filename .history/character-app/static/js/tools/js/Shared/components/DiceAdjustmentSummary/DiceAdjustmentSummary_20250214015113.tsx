import React from "react";

import {
  AdvantageIcon,
  DarkModeNegativeBonusNegativeSvg,
  DarkModePositiveBonusPositiveSvg,
  DataOriginName,
  DisadvantageIcon,
  NegativeBonusNegativeSvg,
  PositiveBonusPositiveSvg,
} from "@dndbeyond/character-components/es";
import {
  DiceAdjustment,
  DataOrigin,
  Constants,
  FormatUtils,
  RuleData,
  RuleDataUtils,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

interface Props {
  diceAdjustment: DiceAdjustment;
  ruleData: RuleData;
  showDataOrigin: boolean;
  onDataOriginClick?: (dataOrigin: DataOrigin) => void;
  theme: CharacterTheme;
}
export default class DiceAdjustmentSummary extends React.PureComponent<
  Props,
  {}
> {
  static defaultProps = {
    showDataOrigin: true,
  };

  render() {
    const {
      diceAdjustment,
      ruleData,
      showDataOrigin,
      onDataOriginClick,
      theme,
    } = this.props;
    const { statId, restriction, type, rollType, amount, dataOrigin } =
      diceAdjustment;

    let abilityNode: React.ReactNode;
    if (statId) {
      abilityNode = (
        <React.Fragment>
          on{" "}
          <span
            className={`ct-dice-adjustment-summary__description--ability ${
              theme?.isDarkMode
                ? "ct-dice-adjustment-summary__description--ability--dark-mode"
                : ""
            }`}
          >
            {RuleDataUtils.getStatNameById(statId, ruleData)}
          </span>
        </React.Fragment>
      );
    } else if (rollType === Constants.DiceAdjustmentRollTypeEnum.DEATH_SAVE) {
      abilityNode = <React.Fragment>on Death Saves</React.Fragment>;
    } else {
      if (
        !restriction &&
        rollType === Constants.DiceAdjustmentRollTypeEnum.SAVE
      ) {
        abilityNode = <React.Fragment>on saves</React.Fragment>;
      }
    }

    let saveAmount: number | null = null;
    let IconComponent: React.ComponentType<any> | null = null;
    switch (type) {
      case Constants.DiceAdjustmentTypeEnum.BONUS:
        if (amount) {
          saveAmount = amount;
          if (amount >= 0) {
            IconComponent = theme?.isDarkMode
              ? DarkModePositiveBonusPositiveSvg
              : PositiveBonusPositiveSvg;
          } else {
            IconComponent = theme?.isDarkMode
              ? DarkModeNegativeBonusNegativeSvg
              : NegativeBonusNegativeSvg;
          }
        }
        break;
      case Constants.DiceAdjustmentTypeEnum.ADVANTAGE:
        IconComponent = AdvantageIcon;
        break;
      case Constants.DiceAdjustmentTypeEnum.DISADVANTAGE:
        IconComponent = DisadvantageIcon;
        break;
      default:
      // not implemented
    }

    let dataOriginNode: React.ReactNode;
    if (showDataOrigin) {
      dataOriginNode = (
        <DataOriginName
          dataOrigin={dataOrigin}
          onClick={onDataOriginClick}
          theme={theme}
        />
      );
    }

    return (
      <div className="ct-dice-adjustment-summary">
        {IconComponent && (
          <IconComponent
            theme={theme}
            className="ct-dice-adjustment-summary__icon"
          />
        )}
        {typeof saveAmount === "number" && (
          <span className="ct-dice-adjustment-summary__value">
            {saveAmount}
          </span>
        )}
        {abilityNode && (
          <span className="ct-dice-adjustment-summary__description">
            {abilityNode}
          </span>
        )}
        {restriction !== null && restriction.length > 0 && (
          <span className="ct-dice-adjustment-summary__restriction">
            {FormatUtils.lowerCaseLetters(restriction.trim(), 0)}
          </span>
        )}
        {showDataOrigin && dataOriginNode && (
          <span className="ct-dice-adjustment-summary__data-origin">
            ({dataOriginNode})
          </span>
        )}
      </div>
    );
  }
}
