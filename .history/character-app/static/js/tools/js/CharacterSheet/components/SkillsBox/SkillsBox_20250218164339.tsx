import { visuallyHidden } from "@mui/utils";
import React from "react";

import {
  BoxBackground,
  FancyBoxSvg230x765,
  FancyBoxSvg281x765,
  FancyBoxSvg361x765,
} from "../../character-components/es";
import {
  CharacterTheme,
  RuleData,
  Skill,
  ValueLookup,
} from "../../character-rules-engine/es";
import { IRollContext } from "../../dice";

import { StyleSizeTypeEnum } from "../../../Shared/reducers/appEnv";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import Skills from "../Skills";

interface Props {
  skills: Array<Skill>;
  customSkills: Array<Skill>;
  onCustomSkillClick?: (skill: Skill) => void;
  onSkillClick?: (skill: Skill) => void;
  onEmptyClick?: () => void;
  valueLookup: ValueLookup;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  diceEnabled: boolean;
  ruleData: RuleData;
  rollContext: IRollContext;
}
export default class SkillsBox extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  render() {
    const {
      skills,
      valueLookup,
      customSkills,
      onCustomSkillClick,
      onSkillClick,
      onEmptyClick,
      dimensions,
      theme,
      diceEnabled,
      ruleData,
      rollContext,
    } = this.props;

    let BoxBackgroundComponent: React.ComponentType = FancyBoxSvg230x765;
    if (dimensions.styleSizeType > StyleSizeTypeEnum.DESKTOP) {
      BoxBackgroundComponent = FancyBoxSvg281x765;
    }
    if (dimensions.styleSizeType <= StyleSizeTypeEnum.TABLET) {
      BoxBackgroundComponent = FancyBoxSvg361x765;
    }

    return (
      <section className="ct-skills-box">
        <BoxBackground StyleComponent={BoxBackgroundComponent} theme={theme} />
        <h2 style={visuallyHidden}>Skills</h2>
        <Skills
          skills={skills}
          customSkills={customSkills}
          valueLookup={valueLookup}
          onCustomSkillClick={onCustomSkillClick}
          onSkillClick={onSkillClick}
          onEmptyClick={onEmptyClick}
          diceEnabled={diceEnabled}
          ruleData={ruleData}
          theme={theme}
          rollContext={rollContext}
        />
      </section>
    );
  }
}
