import { visuallyHidden } from "@mui/utils";
import { orderBy } from "lodash";
import React from "react";

import {
  AdvantageIcon,
  AdvantageDisadvantageIcon,
  DisadvantageIcon,
  ProficiencyLevelIcon,
} from "../../character-components/es";
import {
  CharacterTheme,
  Constants,
  RuleData,
  RuleDataUtils,
  Skill,
  SkillUtils,
  ValueLookup,
  ValueUtils,
} from "../../character-rules-engine/es";
import { RollType, DiceTools, IRollContext } from "../../dice";
import { GameLogContext } from "../../game-log-components";

import { RollableNumberDisplay } from "~/components/RollableNumberDisplay/RollableNumberDisplay";

interface Props {
  skills: Array<Skill>;
  customSkills: Array<Skill>;
  onCustomSkillClick?: (skill: Skill) => void;
  onSkillClick?: (skill: Skill) => void;
  onEmptyClick?: () => void;
  valueLookup: ValueLookup;
  diceEnabled: boolean;
  theme: CharacterTheme;
  ruleData: RuleData;
  rollContext: IRollContext;
}
class Skills extends React.PureComponent<Props> {
  static defaultProps = {
    diceEnabled: false,
  };

  handleCustomSkillClick = (skill: Skill, evt: React.MouseEvent): void => {
    const { onCustomSkillClick } = this.props;

    if (onCustomSkillClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onCustomSkillClick(skill);
    }
  };

  handleEmptyClick = (evt: React.MouseEvent): void => {
    const { onEmptyClick } = this.props;

    if (onEmptyClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onEmptyClick();
    }
  };

  handleSkillClick = (skill: Skill, evt: React.MouseEvent): void => {
    const { onSkillClick } = this.props;

    if (onSkillClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onSkillClick(skill);
    }
  };

  renderEmptyCustomSkills = (): React.ReactNode => {
    return (
      <div
        className={`ct-skills__additional ct-skills__additional--empty ${
          this.props.theme.isDarkMode ? "ct-skills__additional--dark-mode" : ""
        }`}
        onClick={this.handleEmptyClick}
      >
        Additional Skills
      </div>
    );
  };

  renderCustomSkills = (): React.ReactNode => {
    const { customSkills, ruleData, diceEnabled, theme, rollContext } =
      this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    return customSkills.map((skill) => {
      const modifier = SkillUtils.getModifier(skill);
      const statName = RuleDataUtils.getAbilityShortName(
        SkillUtils.getStat(skill),
        ruleData
      );
      const proficiencyLevel = SkillUtils.getProficiencyLevel(skill);
      const name = SkillUtils.getName(skill);

      return (
        <div
          key={skill.id}
          className="ct-skills__item"
          onClick={this.handleCustomSkillClick.bind(this, skill)}
          role="row"
        >
          <div className="ct-skills__col--proficiency" role="cell">
            <ProficiencyLevelIcon
              theme={theme}
              proficiencyLevel={proficiencyLevel}
            />
          </div>
          <div
            className={`ct-skills__col--stat ${
              theme.isDarkMode ? "ct-skills__col--stat--dark-mode" : ""
            }`}
            role="cell"
          >
            {statName === null ? "--" : statName}
          </div>
          <div
            className={`ct-skills__col--skill ${
              theme.isDarkMode ? "ct-skills__col--skill--dark-mode" : ""
            }`}
            style={
              theme
                ? {
                    borderBottomColor: `${theme.themeColor}66`,
                  }
                : undefined
            }
            role="cell"
          >
            {name}
          </div>
          <div
            className={"ct-skills__col--modifier"}
            style={
              theme
                ? {
                    borderBottomColor: `${theme.themeColor}66`,
                  }
                : undefined
            }
            role="cell"
          >
            {modifier === null ? (
              "--"
            ) : (
              <RollableNumberDisplay
                number={modifier}
                type="signed"
                diceNotation={DiceTools.CustomD20(
                  SkillUtils.getModifier(skill)!
                )}
                rollType={RollType.Check}
                rollAction={name ?? "UNKNOWN"}
                diceEnabled={diceEnabled}
                advMenu={true}
                themeColor={theme.themeColor}
                rollContext={rollContext}
                rollTargetOptions={
                  messageTargetOptions
                    ? Object.values(messageTargetOptions?.entities)
                    : undefined
                }
                rollTargetDefault={defaultMessageTargetOption}
                userId={userId}
              />
            )}
          </div>
        </div>
      );
    });
  };

  render() {
    const {
      skills,
      valueLookup,
      customSkills,
      diceEnabled,
      ruleData,
      theme,
      rollContext,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    let orderedSkills = orderBy(skills, (skill) => SkillUtils.getName(skill));

    return (
      <div
        className={`ct-skills ${
          theme.isDarkMode ? "ct-skills--dark-mode" : ""
        }`}
        role="table"
      >
        <div className="ct-skills__header" role="row">
          <div className="ct-skills__col--proficiency" role="columnheader">
            <span style={visuallyHidden}>Proficiency</span>
            <abbr
              aria-hidden="true"
              title="Proficiency"
              className={`ct-skills__heading ${
                theme.isDarkMode ? "ct-skills__heading--dark-mode" : ""
              }`}
            >
              Prof
            </abbr>
          </div>
          <div className="ct-skills__col--stat" role="columnheader">
            <span style={visuallyHidden}>Modifier</span>
            <abbr
              aria-hidden="true"
              title="Modifier"
              className={`ct-skills__heading ${
                theme.isDarkMode ? "ct-skills__heading--dark-mode" : ""
              }`}
            >
              Mod
            </abbr>
          </div>
          <div className="ct-skills__col--skill" role="columnheader">
            <span
              className={`ct-skills__heading ${
                theme.isDarkMode ? "ct-skills__heading--dark-mode" : ""
              }`}
            >
              Skill
            </span>
          </div>
          <div className="ct-skills__col--modifier" role="columnheader">
            <span
              className={`ct-skills__heading ${
                theme.isDarkMode ? "ct-skills__heading--dark-mode" : ""
              }`}
            >
              Bonus
            </span>
          </div>
        </div>
        <div className="ct-skills__list" role="rowgroup">
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
              ValueUtils.hack__toString(SkillUtils.getId(skill)),
              ValueUtils.hack__toString(SkillUtils.getEntityTypeId(skill))
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
            if (theme.isDarkMode) {
              statClassNames.push("ct-skills__col--stat--dark-mode");
              modifierClassNames.push("ct-skills__col--modifier--dark-mode");
            }

            let statName = RuleDataUtils.getAbilityShortName(
              SkillUtils.getStat(skill),
              ruleData
            );
            let modifier = SkillUtils.getModifier(skill);
            let name = SkillUtils.getName(skill);

            let usableDiceAdjustmentType =
              SkillUtils.getUsableDiceAdjustmentType(skill);
            let adjustmentsNode: React.ReactNode;

            if (
              usableDiceAdjustmentType !==
              Constants.UsableDiceAdjustmentTypeEnum.NONE
            ) {
              let iconNode: React.ReactNode;
              let iconClassName: string = "ct-skills__adjustment";

              switch (usableDiceAdjustmentType) {
                case Constants.UsableDiceAdjustmentTypeEnum.ADVANTAGE:
                  iconNode = (
                    <AdvantageIcon theme={theme} className={iconClassName} />
                  );
                  break;
                case Constants.UsableDiceAdjustmentTypeEnum.DISADVANTAGE:
                  iconNode = (
                    <DisadvantageIcon theme={theme} className={iconClassName} />
                  );
                  break;
                case Constants.UsableDiceAdjustmentTypeEnum
                  .ADVANTAGE_DISADVANTAGE:
                  iconNode = (
                    <AdvantageDisadvantageIcon
                      title={"Both (See Sidebar)"}
                      theme={theme}
                      className={iconClassName}
                    />
                  );
                  break;
                default:
                // not implemented
              }

              if (iconNode) {
                adjustmentsNode = (
                  <div
                    className="ct-skills__col--adjustments"
                    style={
                      theme
                        ? {
                            borderBottomColor: `${theme.themeColor}66`,
                          }
                        : undefined
                    }
                  >
                    {iconNode}
                  </div>
                );
              }
            }

            return (
              <div
                key={SkillUtils.getId(skill)}
                className="ct-skills__item"
                onClick={this.handleSkillClick.bind(this, skill)}
                role="row"
              >
                <div className="ct-skills__col--proficiency" role="cell">
                  <ProficiencyLevelIcon
                    theme={theme}
                    isModified={hasModifiedLevel}
                    proficiencyLevel={SkillUtils.getProficiencyLevel(skill)}
                  />
                </div>
                <div className={statClassNames.join(" ")} role="cell">
                  {statName === null ? "--" : statName}
                </div>
                <div
                  className={`ct-skills__col--skill ${
                    theme.isDarkMode ? "ct-skills__col--skill--dark-mode" : ""
                  }`}
                  style={
                    theme?.isDarkMode
                      ? {
                          borderColor: `${theme.themeColor}66`,
                        }
                      : undefined
                  }
                  role="cell"
                >
                  {name}
                </div>
                {adjustmentsNode}
                <div
                  className={modifierClassNames.join(" ")}
                  style={
                    theme?.isDarkMode
                      ? {
                          borderColor: `${theme.themeColor}66`,
                        }
                      : undefined
                  }
                  role="cell"
                >
                  {modifier === null ? (
                    "--"
                  ) : (
                    <RollableNumberDisplay
                      number={modifier}
                      type="signed"
                      isModified={hasModifiedValue}
                      diceNotation={DiceTools.CustomD20(
                        SkillUtils.getModifier(skill)!
                      )}
                      rollType={RollType.Check}
                      rollAction={name ? name : "UNKNOWN"}
                      diceEnabled={diceEnabled}
                      advMenu={true}
                      themeColor={theme.themeColor}
                      rollContext={rollContext}
                      rollTargetOptions={
                        messageTargetOptions
                          ? Object.values(messageTargetOptions?.entities)
                          : undefined
                      }
                      rollTargetDefault={defaultMessageTargetOption}
                      userId={userId}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {customSkills.length
            ? this.renderCustomSkills()
            : this.renderEmptyCustomSkills()}
        </div>
      </div>
    );
  }
}

Skills.contextType = GameLogContext;

export default Skills;
