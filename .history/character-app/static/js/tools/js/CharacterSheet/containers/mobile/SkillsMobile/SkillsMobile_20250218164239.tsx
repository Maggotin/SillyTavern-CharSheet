import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect } from "react-redux";

import {
  rulesEngineSelectors,
  Skill,
  SkillUtils,
  ValueLookup,
  CharacterTheme,
  RuleData,
} from "../../character-rules-engine/es";
import { IRollContext } from "@dndbeyond/dice";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../../Shared/utils";
import MobileDivider from "../../../components/MobileDivider";
import Skills from "../../../components/Skills";
import SubsectionMobile from "../../../components/SubsectionMobile";
import { SheetAppState } from "../../../typings";

interface Props {
  skills: Array<Skill>;
  customSkills: Array<Skill>;
  valueLookup: ValueLookup;
  theme: CharacterTheme;
  diceEnabled: boolean;
  ruleData: RuleData;
  characterRollContext: IRollContext;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class SkillsBox extends React.PureComponent<Props> {
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
      skills,
      valueLookup,
      customSkills,
      theme,
      diceEnabled,
      ruleData,
      characterRollContext,
    } = this.props;

    return (
      <SubsectionMobile name="Skills">
        <section
          className={`ct-skills-mobile ${
            theme.isDarkMode ? "ct-skills-mobile--dark-mode" : ""
          }`}
        >
          <MobileDivider
            label="Skills"
            onClick={this.handleManageShow}
            theme={theme}
          />
          <h2 style={visuallyHidden}>Skills</h2>
          <Skills
            skills={skills}
            customSkills={customSkills}
            valueLookup={valueLookup}
            onCustomSkillClick={this.handleCustomSkillClick}
            onSkillClick={this.handleSkillClick}
            onEmptyClick={this.handleEmptyClick}
            diceEnabled={diceEnabled}
            ruleData={ruleData}
            theme={theme}
            rollContext={characterRollContext}
          />
          <MobileDivider isEnd={true} theme={theme} />
        </section>
      </SubsectionMobile>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    skills: rulesEngineSelectors.getSkills(state),
    valueLookup: rulesEngineSelectors.getCharacterValueLookup(state),
    customSkills: rulesEngineSelectors.getCustomSkills(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    characterRollContext:
      characterRollContextSelectors.getCharacterRollContext(state),
  };
}

const SkillsBoxContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <SkillsBox {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SkillsBoxContainer);
