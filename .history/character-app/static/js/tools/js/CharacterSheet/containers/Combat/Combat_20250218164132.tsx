import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect } from "react-redux";

import {
  ArmorClassBox,
  BoxBackground,
  SquaredBoxSvg344x95,
  SquaredBoxSvg408x95,
} from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  AbilityLookup,
  Condition,
  DefenseAdjustmentGroup,
  SpellCasterInfo,
  RuleData,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { InitiativeBox } from "~/subApps/sheet/components/InitiativeBox";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import Subsection from "../../../Shared/components/Subsection";
import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import ConditionsSummary from "../../components/ConditionsSummary";
import DefensesSummary from "../../components/DefensesSummary";
import { SheetAppState } from "../../typings";

interface Props {
  armorClass: number;
  resistances: Array<DefenseAdjustmentGroup>;
  immunities: Array<DefenseAdjustmentGroup>;
  vulnerabilities: Array<DefenseAdjustmentGroup>;
  conditions: Array<Condition>;
  abilityLookup: AbilityLookup;
  ruleData: RuleData;
  spellCasterInfo: SpellCasterInfo;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  diceEnabled: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class Combat extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleArmorClassClick = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.ARMOR_MANAGE);
  };

  handleDefensesSummaryClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleDefensesSummaryShow();
  };

  handleDefensesSummaryShow = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.DEFENSE_MANAGE);
  };

  handleConditionSummaryClick = (evt: React.MouseEvent): void => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.handleConditionSummaryShow();
  };

  handleConditionSummaryShow = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.CONDITION_MANAGE);
  };

  renderDefault = (): React.ReactNode => {
    return (
      <div className="ct-combat__attacks-default">
        Equip weapons or add spells to see your attacks here.
      </div>
    );
  };

  render() {
    const {
      armorClass,
      resistances,
      vulnerabilities,
      immunities,
      conditions,
      theme,
      dimensions,
    } = this.props;

    let BoxBackgroundComponent: React.ComponentType = SquaredBoxSvg344x95;
    if (dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP) {
      BoxBackgroundComponent = SquaredBoxSvg408x95;
    }

    return (
      <Subsection name="Combat">
        <div className="ct-combat">
          <div className="ct-combat__summary">
            <div className="ct-combat__summary-group ct-combat__summary-group--initiative">
              <InitiativeBox />
            </div>
            <div className="ct-combat__summary-group ct-combat__summary-group--ac">
              <ArmorClassBox
                theme={theme}
                armorClass={armorClass}
                onClick={this.handleArmorClassClick}
              />
            </div>
            <section className="ct-combat__summary-group ct-combat__summary-group--statuses">
              <div className="ct-combat__statuses">
                <BoxBackground
                  StyleComponent={BoxBackgroundComponent}
                  theme={theme}
                />
                <h2 style={visuallyHidden}>Defenses and Conditions</h2>
                <div
                  className="ct-combat__statuses-group ct-combat__statuses-group--defenses"
                  onClick={this.handleDefensesSummaryClick}
                >
                  <div
                    className={`ct-combat__summary-label ${
                      theme.isDarkMode
                        ? "ct-combat__summary-label--dark-mode"
                        : ""
                    }`}
                  >
                    Defenses
                  </div>
                  <DefensesSummary
                    theme={theme}
                    resistances={resistances}
                    vulnerabilities={vulnerabilities}
                    immunities={immunities}
                    onClick={this.handleDefensesSummaryShow}
                  />
                </div>
                <div
                  className="ct-combat__statuses-group ct-combat__statuses-group--conditions"
                  style={
                    theme?.isDarkMode
                      ? {
                          borderColor: `${theme.themeColor}66`,
                        }
                      : undefined
                  }
                  onClick={this.handleConditionSummaryClick}
                >
                  <div
                    className={`ct-combat__summary-label ${
                      theme.isDarkMode
                        ? "ct-combat__summary-label--dark-mode"
                        : ""
                    }`}
                  >
                    Conditions
                  </div>
                  <ConditionsSummary
                    theme={theme}
                    conditions={conditions}
                    onClick={this.handleConditionSummaryShow}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </Subsection>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    spellCasterInfo: rulesEngineSelectors.getSpellCasterInfo(state),
    armorClass: rulesEngineSelectors.getAcTotal(state),
    resistances: rulesEngineSelectors.getActiveGroupedResistances(state),
    immunities: rulesEngineSelectors.getActiveGroupedImmunities(state),
    vulnerabilities:
      rulesEngineSelectors.getActiveGroupedVulnerabilities(state),
    conditions: rulesEngineSelectors.getActiveConditions(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    abilityLookup: rulesEngineSelectors.getAbilityLookup(state),
    dimensions: appEnvSelectors.getDimensions(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
  };
}

const CombatContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <Combat paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(CombatContainer);
