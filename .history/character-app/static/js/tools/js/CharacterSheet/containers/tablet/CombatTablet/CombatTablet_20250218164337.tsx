import React from "react";
import { connect } from "react-redux";

import { ArmorClassBox } from "../../character-components/es";
import {
  CharacterPreferences,
  SpeedInfo,
  RuleData,
  rulesEngineSelectors,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { InitiativeBox } from "~/subApps/sheet/components/InitiativeBox";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../../Shared/selectors";
import ProficiencyBonusBox from "../../../components/ProficiencyBonusBox";
import SpeedBox from "../../../components/SpeedBox";
import { SheetAppState } from "../../../typings";

interface Props {
  armorClass: number;
  speeds: SpeedInfo;
  proficiencyBonus: number;
  preferences: CharacterPreferences;
  theme: CharacterTheme;
  ruleData: RuleData;
  isReadonly: boolean;
  diceEnabled: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class CombatTablet extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleProficiencyBonusClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.PROFICIENCY_BONUS);
  };

  handleSpeedsClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.SPEED_MANAGE);
  };

  handleDefensesSummaryClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.DEFENSE_MANAGE);
  };

  handleConditionSummaryClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.CONDITION_MANAGE);
  };

  handleArmorClassClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.ARMOR_MANAGE);
  };

  render() {
    const {
      preferences,
      proficiencyBonus,
      speeds,
      armorClass,
      theme,
      ruleData,
    } = this.props;

    return (
      <div className="ct-combat-tablet">
        <div className="ct-combat-tablet__extras">
          <div className="ct-combat-tablet__extra ct-combat-tablet__extra--proficiency">
            <ProficiencyBonusBox
              theme={theme}
              proficiencyBonus={proficiencyBonus}
              onClick={this.handleProficiencyBonusClick}
            />
          </div>
          <div className="ct-combat-tablet__extra ct-combat-tablet__extra--speed">
            <SpeedBox
              speeds={speeds}
              preferences={preferences}
              theme={theme}
              ruleData={ruleData}
              onClick={this.handleSpeedsClick}
            />
          </div>
          <div className="ct-combat-tablet__extra ct-combat-tablet__extra--initiative">
            <InitiativeBox isTablet />
          </div>
          <div className="ct-combat-tablet__extra ct-combat-tablet__extra--ac">
            <ArmorClassBox
              theme={theme}
              armorClass={armorClass}
              onClick={this.handleArmorClassClick}
            />
          </div>
          <div className="ct-combat-tablet__extra ct-combat-tablet__extra--statuses">
            <div className="ct-combat-tablet__ctas">
              <div className="ct-combat-tablet__cta">
                <div
                  role="button"
                  className={`ct-combat-tablet__cta-button ${
                    theme.isDarkMode
                      ? "ct-combat-tablet__cta-button--dark-mode"
                      : ""
                  }`}
                  onClick={this.handleDefensesSummaryClick}
                >
                  Defenses
                </div>
              </div>
              <div className="ct-combat-tablet__cta">
                <div
                  role="button"
                  className={`ct-combat-tablet__cta-button ${
                    theme.isDarkMode
                      ? "ct-combat-tablet__cta-button--dark-mode"
                      : ""
                  }`}
                  onClick={this.handleConditionSummaryClick}
                >
                  Conditions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    armorClass: rulesEngineSelectors.getAcTotal(state),
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    speeds: rulesEngineSelectors.getCurrentCarriedWeightSpeed(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
  };
}
const CombatTabletContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <CombatTablet {...props} paneHistoryStart={paneHistoryStart} />;
};
export default connect(mapStateToProps)(CombatTabletContainer);
