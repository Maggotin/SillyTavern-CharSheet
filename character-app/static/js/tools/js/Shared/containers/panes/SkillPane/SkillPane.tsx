import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Collapsible,
  ProficiencyLevelIcon,
} from "@dndbeyond/character-components/es";
import {
  characterActions,
  CharacterTheme,
  Constants,
  DataOrigin,
  DiceAdjustment,
  EntityValueLookup,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  Skill,
  SkillUtils,
  ValueUtils,
} from "@dndbeyond/character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { getDataOriginComponentInfo } from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import {
  PaneComponentEnum,
  PaneIdentifiersSkill,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import DiceAdjustmentSummary from "../../../components/DiceAdjustmentSummary";
import EditorBox from "../../../components/EditorBox";
import ValueEditor from "../../../components/ValueEditor";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  skills: Array<Skill>;
  ruleData: RuleData;
  entityValueLookup: EntityValueLookup;
  identifiers: PaneIdentifiersSkill | null;
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  skill: Skill | null;
}
class SkillPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { skills, identifiers } = this.props;

    if (skills !== prevProps.skills || identifiers !== prevProps.identifiers) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { skills, identifiers } = props;

    let foundSkill: Skill | null | undefined = null;
    if (identifiers !== null) {
      foundSkill = skills.find(
        (skill) => identifiers.id === SkillUtils.getId(skill)
      );
    }
    return {
      skill: foundSkill ? foundSkill : null,
    };
  };

  handleSkillsManageShow = (): void => {
    const { paneHistoryPush } = this.props;

    paneHistoryPush(PaneComponentEnum.SKILLS);
  };

  handleCustomDataUpdate = (
    key: number,
    value: any,
    source: string | null
  ): void => {
    const { skill } = this.state;
    const { dispatch } = this.props;

    if (skill) {
      dispatch(
        characterActions.valueSet(
          key,
          value,
          source,
          ValueUtils.hack__toString(SkillUtils.getId(skill)),
          ValueUtils.hack__toString(SkillUtils.getEntityTypeId(skill))
        )
      );
    }
  };

  handleDataOriginClick = (dataOrigin: DataOrigin): void => {
    const { paneHistoryPush } = this.props;

    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  renderCustomize = (): React.ReactNode => {
    const { skill } = this.state;
    const { entityValueLookup, ruleData, isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    if (skill === null) {
      return null;
    }

    return (
      <Collapsible
        layoutType={"minimal"}
        className="ct-skill-pane__customize"
        header="Customize"
      >
        <EditorBox>
          <ValueEditor
            dataLookup={ValueUtils.getEntityData(
              entityValueLookup,
              ValueUtils.hack__toString(SkillUtils.getId(skill)),
              ValueUtils.hack__toString(SkillUtils.getEntityTypeId(skill))
            )}
            onDataUpdate={this.handleCustomDataUpdate}
            valueEditors={[
              Constants.AdjustmentTypeEnum.SKILL_OVERRIDE,
              Constants.AdjustmentTypeEnum.SKILL_MAGIC_BONUS,
              Constants.AdjustmentTypeEnum.SKILL_MISC_BONUS,
              Constants.AdjustmentTypeEnum.SKILL_PROFICIENCY_LEVEL,
              Constants.AdjustmentTypeEnum.SKILL_STAT_OVERRIDE,
            ]}
            ruleData={ruleData}
          />
        </EditorBox>
      </Collapsible>
    );
  };

  renderDiceAdjustmentList = (
    diceAdjustments: Array<DiceAdjustment>
  ): React.ReactNode => {
    const { ruleData, theme } = this.props;

    if (!diceAdjustments.length) {
      return null;
    }

    return (
      <React.Fragment>
        {diceAdjustments.map((diceAdjustment, idx) => {
          return (
            <DiceAdjustmentSummary
              key={diceAdjustment.uniqueKey}
              diceAdjustment={diceAdjustment}
              ruleData={ruleData}
              theme={theme}
              onDataOriginClick={this.handleDataOriginClick}
            />
          );
        })}
      </React.Fragment>
    );
  };

  renderDiceAdjustments = (): React.ReactNode => {
    const { skill } = this.state;

    if (skill === null) {
      return null;
    }

    const advantageAdjustments = SkillUtils.getAdvantageAdjustments(skill);
    const disadvantageAdjustments =
      SkillUtils.getDisadvantageAdjustments(skill);
    if (!advantageAdjustments.length && !disadvantageAdjustments.length) {
      return null;
    }

    return (
      <div className="ct-skill-pane__dice-adjustments">
        {this.renderDiceAdjustmentList(advantageAdjustments)}
        {this.renderDiceAdjustmentList(disadvantageAdjustments)}
      </div>
    );
  };

  render() {
    const { skill } = this.state;
    const { ruleData, theme } = this.props;

    if (skill === null) {
      return <PaneInitFailureContent />;
    }

    const modifier = SkillUtils.getModifier(skill);

    return (
      <div className="ct-skill-pane" key={SkillUtils.getId(skill)}>
        <Header parent="Skills" onClick={this.handleSkillsManageShow}>
          <div className="ct-skill-pane__header">
            <div className="ct-skill-pane__header-icon">
              <ProficiencyLevelIcon
                theme={theme}
                proficiencyLevel={SkillUtils.getProficiencyLevel(skill)}
              />
            </div>
            <div className="ct-skill-pane__header-ability">
              {RuleDataUtils.getAbilityShortName(
                SkillUtils.getStat(skill),
                ruleData
              )}
            </div>
            <div className="ct-skill-pane__header-name">
              {SkillUtils.getName(skill)}
            </div>
            <div className="ct-skill-pane__header-modifier">
              <NumberDisplay type="signed" number={modifier} />
            </div>
          </div>
        </Header>
        {this.renderCustomize()}
        {this.renderDiceAdjustments()}
        <HtmlContent
          className="ct-skill-pane__description"
          html={SkillUtils.getDescription(skill) ?? ""}
          withoutTooltips
        />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    skills: rulesEngineSelectors.getSkills(state),
    entityValueLookup:
      rulesEngineSelectors.getCharacterValueLookupByEntity(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const SkillPaneContainer = (props) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();

  return <SkillPane {...props} paneHistoryPush={paneHistoryPush} />;
};

export default connect(mapStateToProps)(SkillPaneContainer);
