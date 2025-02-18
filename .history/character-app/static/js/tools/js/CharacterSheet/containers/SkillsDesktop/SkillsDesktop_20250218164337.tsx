import React from "react";
import { connect } from "react-redux";

import { ManageIcon } from "../../character-components/es";
import {
  rulesEngineSelectors,
  Skill,
  SkillUtils,
  ValueLookup,
  CharacterTheme,
  RuleData,
} from "../../character-rules-engine/es";
import { IRollContext } from "../../dice";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import Subsection, {
  SubsectionFooter,
} from "../../../Shared/components/Subsection";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import SkillsBox from "../../components/SkillsBox";
import { SheetAppState } from "../../typings";

interface Props {
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  skills: Array<Skill>;
  customSkills: Array<Skill>;
  valueLookup: ValueLookup;
  isReadonly: boolean;
  diceEnabled: boolean;
  ruleData: RuleData;
  characterRollContext: IRollContext;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class SkillsDesktop extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleManageShow = (): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(PaneComponentEnum.SKILLS);
  };

  handleCustomSkillClick = (skill: Skill): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(
      PaneComponentEnum.CUSTOM_SKILL,
      PaneIdentifierUtils.generateCustomSkill(SkillUtils.getId(skill))
    );
  };

  handleEmptyClick = (): void => {
    this.handleManageShow();
  };

  handleSkillClick = (skill: Skill): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(
      PaneComponentEnum.SKILL,
      PaneIdentifierUtils.generateSkill(SkillUtils.getId(skill))
    );
  };

  render() {
    const {
      dimensions,
      theme,
      skills,
      valueLookup,
      customSkills,
      isReadonly,
      diceEnabled,
      ruleData,
      characterRollContext,
    } = this.props;

    return (
      <Subsection name="Skills">
        <SkillsBox
          skills={skills}
          customSkills={customSkills}
          valueLookup={valueLookup}
          onCustomSkillClick={this.handleCustomSkillClick}
          onSkillClick={this.handleSkillClick}
          onEmptyClick={this.handleEmptyClick}
          dimensions={dimensions}
          theme={theme}
          diceEnabled={diceEnabled}
          ruleData={ruleData}
          rollContext={characterRollContext}
        />
        <SubsectionFooter>
          <ManageIcon
            onClick={this.handleManageShow}
            tooltip={isReadonly ? "View" : "Manage"}
            theme={theme}
          >
            Skills
          </ManageIcon>
        </SubsectionFooter>
      </Subsection>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    skills: rulesEngineSelectors.getSkills(state),
    valueLookup: rulesEngineSelectors.getCharacterValueLookup(state),
    customSkills: rulesEngineSelectors.getCustomSkills(state),
    dimensions: appEnvSelectors.getDimensions(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    characterRollContext:
      characterRollContextSelectors.getCharacterRollContext(state),
  };
}

const SkillsDesktopContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <SkillsDesktop {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SkillsDesktopContainer);
