import { orderBy } from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Collapsible,
  ProficiencyLevelIcon,
} from "../../character-components/es";
import {
  rulesEngineSelectors,
  characterActions,
  Constants,
  RuleData,
  RuleDataUtils,
  Skill,
  SkillUtils,
  ValueLookup,
  ValueUtils,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { Link } from "~/components/Link";
import { NumberDisplay } from "~/components/NumberDisplay";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { PaneIdentifierUtils } from "../../../utils";

interface Props extends DispatchProp {
  skills: Array<Skill>;
  customSkills: Array<Skill>;
  ruleData: RuleData;
  valueLookup: ValueLookup;
  proficiencyBonus: number;
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
class SkillsPane extends React.PureComponent<Props> {
  handleCustomSkillClick = (skill: Skill): void => {
    const { paneHistoryPush } = this.props;

    paneHistoryPush(
      PaneComponentEnum.CUSTOM_SKILL,
      PaneIdentifierUtils.generateCustomSkill(SkillUtils.getId(skill))
    );
  };

  handleSkillAdd = (): void => {
    const { dispatch, customSkills } = this.props;

    dispatch(
      characterActions.customProficiencyCreate(
        `Custom Skill ${customSkills.length + 1}`,
        Constants.CustomProficiencyTypeEnum.SKILL
      )
    );
  };

  handleDataUpdate = (id: number, properties: Record<string, any>): void => {
    const { dispatch } = this.props;

    dispatch(characterActions.customProficiencySet(id, properties));
  };

  handleSkillClick = (skill: Skill, evt: React.MouseEvent): void => {
    const { paneHistoryPush } = this.props;

    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryPush(
      PaneComponentEnum.SKILL,
      PaneIdentifierUtils.generateSkill(SkillUtils.getId(skill))
    );
  };

  renderCustomSkills = (): React.ReactNode => {
    const { customSkills, ruleData, isReadonly, theme } = this.props;

    return (
      <Collapsible header="Custom Skills">
        <div className="ct-skills-pane__custom">
          <div className="ct-skills-pane__custom-skills">
            {customSkills.map((skill) => {
              const id = SkillUtils.getId(skill);
              const modifier = SkillUtils.getModifier(skill);
              const statName = RuleDataUtils.getAbilityShortName(
                SkillUtils.getStat(skill),
                ruleData
              );
              const proficiencyLevel = SkillUtils.getProficiencyLevel(skill);
              const name = SkillUtils.getName(skill);

              return (
                <div
                  key={id}
                  className="ct-skills__item"
                  onClick={this.handleCustomSkillClick.bind(this, skill)}
                >
                  <div className="ct-skills__col--proficiency">
                    <ProficiencyLevelIcon
                      theme={theme}
                      proficiencyLevel={proficiencyLevel}
                    />
                  </div>
                  <div className="ct-skills__col--stat">
                    {statName === null ? "--" : statName}
                  </div>
                  <div className="ct-skills__col--skill">{name}</div>
                  <div className={"ct-skills__col--modifier"}>
                    <NumberDisplay type="signed" number={modifier} />
                  </div>
                </div>
              );
            })}
          </div>
          {!isReadonly && (
            <div className="ct-skills-pane__custom-add">
              <Link useTheme={true} onClick={this.handleSkillAdd}>
                + Add Custom Skill
              </Link>
            </div>
          )}
        </div>
      </Collapsible>
    );
  };

  renderSkills = (): React.ReactNode => {
    const { skills, ruleData, valueLookup, theme } = this.props;

    let statsLookup = RuleDataUtils.getStatsLookup(ruleData);
    let orderedSkills = orderBy(skills, (skill) => skill.name);

    return (
      <Collapsible header="Skills" initiallyCollapsed={false}>
        <div className="ct-skills-pane__skills">
          {orderedSkills.map((skill) => {
            let valueTypes: Array<Constants.AdjustmentTypeEnum> = [
              Constants.AdjustmentTypeEnum.SKILL_STAT_OVERRIDE,
              Constants.AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL,
              Constants.AdjustmentTypeEnum.SKILL_MISC_BONUS,
              Constants.AdjustmentTypeEnum.SKILL_MAGIC_BONUS,
              Constants.AdjustmentTypeEnum.SKILL_OVERRIDE,
            ];
            let valueDataLookup = ValueUtils.getDataLookup(
              valueLookup,
              valueTypes,
              ValueUtils.hack__toString(skill.id),
              ValueUtils.hack__toString(skill.entityTypeId)
            );
            let hasModifiedLevel = valueDataLookup.hasOwnProperty(
              Constants.AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL
            );
            let hasModifiedValue =
              valueDataLookup.hasOwnProperty(
                Constants.AdjustmentTypeEnum.SKILL_OVERRIDE
              ) ||
              valueDataLookup.hasOwnProperty(
                Constants.AdjustmentTypeEnum.SKILL_MAGIC_BONUS
              ) ||
              valueDataLookup.hasOwnProperty(
                Constants.AdjustmentTypeEnum.SKILL_MISC_BONUS
              );

            let statClassNames: Array<string> = ["ct-skills__col--stat"];
            if (
              valueDataLookup.hasOwnProperty(
                Constants.AdjustmentTypeEnum.SKILL_STAT_OVERRIDE
              )
            ) {
              statClassNames.push("ct-skills__col--stat-modified");
            }
            let modifierClassNames: Array<string> = [
              "ct-skills__col--modifier",
            ];
            if (hasModifiedValue) {
              modifierClassNames.push("ct-skills__col--modifier-modified");
            }
            const id = SkillUtils.getId(skill);
            const modifier = SkillUtils.getModifier(skill);
            const statName = RuleDataUtils.getAbilityShortName(
              SkillUtils.getStat(skill),
              ruleData
            );
            const proficiencyLevel = SkillUtils.getProficiencyLevel(skill);
            const name = SkillUtils.getName(skill);

            return (
              <div
                key={id}
                className="ct-skills__item"
                onClick={this.handleSkillClick.bind(this, skill)}
              >
                <div className="ct-skills__col--proficiency">
                  <ProficiencyLevelIcon
                    theme={theme}
                    isModified={hasModifiedLevel}
                    proficiencyLevel={proficiencyLevel}
                  />
                </div>
                <div className={statClassNames.join(" ")}>{statName}</div>
                <div className="ct-skills__col--skill">{name}</div>
                <div className={modifierClassNames.join(" ")}>
                  <NumberDisplay type="signed" number={modifier} />
                </div>
              </div>
            );
          })}
        </div>
      </Collapsible>
    );
  };

  render() {
    return (
      <div className="ct-skills-pane">
        <Header>All Skills</Header>
        {this.renderSkills()}
        {this.renderCustomSkills()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    proficiencyBonus: rulesEngineSelectors.getProficiencyBonus(state),
    skills: rulesEngineSelectors.getSkills(state),
    customSkills: rulesEngineSelectors.getCustomSkills(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    valueLookup: rulesEngineSelectors.getCharacterValueLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const SkillsPaneContainer = (props) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return <SkillsPane paneHistoryPush={paneHistoryPush} {...props} />;
};

export default connect(mapStateToProps)(SkillsPaneContainer);
