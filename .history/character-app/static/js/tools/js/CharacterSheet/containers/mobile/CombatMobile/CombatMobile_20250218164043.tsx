import clsx from "clsx";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  CharacterPreferences,
  SpeedInfo,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  CharacterTheme,
  characterSelectors,
  CharacterStatusSlug,
} from "../../rules-engine/es";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { NumberDisplay } from "~/components/NumberDisplay";
import { PremadeCharacterEditStatus } from "~/components/PremadeCharacterEditStatus";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { InitiativeBox } from "~/subApps/sheet/components/InitiativeBox";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../../Shared/selectors";
import { SheetAppState } from "../../../typings";
import styles from "./styles.module.css";

interface Props extends DispatchProp {
  armorClass: number;
  speeds: SpeedInfo;
  proficiencyBonus: number;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  diceEnabled: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
  isReadonly: boolean;
  characterStatus: CharacterStatusSlug | null;
}
class CombatMobile extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleProficiencyBonusClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.PROFICIENCY_BONUS);
  };

  handleSpeedsClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
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

  handleArmorClassClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.ARMOR_MANAGE);
  };

  handleInitiativeClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    paneHistoryStart(PaneComponentEnum.INITIATIVE);
  };

  renderProficiency = (): React.ReactNode => {
    const { proficiencyBonus } = this.props;

    return (
      <div
        className="ct-combat-mobile__extra ct-combat-mobile__extra--proficiency"
        onClick={this.handleProficiencyBonusClick}
      >
        <div className="ct-combat-mobile__extra-heading">
          <div className="ct-combat-mobile__extra-label">Proficiency</div>
        </div>
        <div className="ct-combat-mobile__extra-value">
          <NumberDisplay
            type="signed"
            number={proficiencyBonus}
            size={"large"}
            className={clsx([
              !this.props.theme.isDarkMode && styles.numberColorOverride,
            ])}
          />
        </div>
        <div className="ct-combat-mobile__extra-footer">
          <div className="ct-combat-mobile__extra-label">Bonus</div>
        </div>
      </div>
    );
  };

  renderSpeed = (): React.ReactNode => {
    const { preferences, speeds, ruleData, theme } = this.props;

    const displaySpeedValue: number =
      speeds[
        RuleDataUtils.getSpeedMovementKeyById(preferences.primaryMovement)
      ];
    const displaySpeedLabel = RuleDataUtils.getMovementDescription(
      preferences.primaryMovement,
      ruleData
    );

    return (
      <div
        className="ct-combat-mobile__extra  ct-combat-mobile__extra--speed"
        onClick={this.handleSpeedsClick}
      >
        <div className="ct-combat-mobile__extra-heading">
          <div className="ct-combat-mobile__extra-subheading">
            {displaySpeedLabel}
          </div>
        </div>
        <div className="ct-combat-mobile__extra-value">
          <NumberDisplay
            type="distanceInFt"
            number={displaySpeedValue}
            size={"large"}
            className={clsx([
              !this.props.theme.isDarkMode && styles.numberColorOverride,
            ])}
          />
        </div>
        <div className="ct-combat-mobile__extra-footer">
          <div className="ct-combat-mobile__extra-label">Speed</div>
        </div>
      </div>
    );
  };

  renderArmorClass = (): React.ReactNode => {
    const { armorClass } = this.props;

    return (
      <div
        className="ct-combat-mobile__extra  ct-combat-mobile__extra--ac"
        onClick={this.handleArmorClassClick}
      >
        <div className="ct-combat-mobile__extra-heading">
          <div className="ct-combat-mobile__extra-label">Armor</div>
        </div>
        <div
          className="ct-combat-mobile__extra-value"
          data-testid="armor-class-value"
        >
          {armorClass}
        </div>
        <div className="ct-combat-mobile__extra-footer">
          <div className="ct-combat-mobile__extra-label">Class</div>
        </div>
      </div>
    );
  };

  render() {
    const { theme, isReadonly, characterStatus } = this.props;
    return (
      <div
        className={`ct-combat-mobile ${
          theme.isDarkMode ? "ct-combat-mobile--dark-mode" : ""
        }`}
      >
        <div className="ct-combat-mobile__extras">
          {this.renderProficiency()}
          {this.renderSpeed()}
          <InitiativeBox isMobile={true} />
          {this.renderArmorClass()}
          <div className="ct-combat-mobile__extra ct-combat-mobile__extra--statuses">
            <div className="ct-combat-mobile__ctas">
              <div className="ct-combat-mobile__cta">
                <div
                  className="ct-combat-mobile__cta-button"
                  onClick={this.handleDefensesSummaryClick}
                >
                  Defenses
                </div>
              </div>
              <div className="ct-combat-mobile__cta">
                <div
                  className="ct-combat-mobile__cta-button"
                  onClick={this.handleConditionSummaryClick}
                >
                  Conditions
                </div>
              </div>
            </div>
          </div>
        </div>
        <PremadeCharacterEditStatus
          characterStatus={characterStatus}
          isReadonly={isReadonly}
        />
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
    ruleData: rulesEngineSelectors.getRuleData(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    characterStatus: characterSelectors.getStatusSlug(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const CombatMobileContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <CombatMobile {...props} paneHistoryStart={paneHistoryStart} />;
};

CombatMobileContainer.contextType = GameLogContext;

export default connect(mapStateToProps)(CombatMobileContainer);
