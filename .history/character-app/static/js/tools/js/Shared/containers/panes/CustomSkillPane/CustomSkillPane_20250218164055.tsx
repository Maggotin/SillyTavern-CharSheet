import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Collapsible,
  ProficiencyLevelIcon,
} from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  characterActions,
  RuleData,
  RuleDataUtils,
  Skill,
  SkillUtils,
  CharacterTheme,
} from "../../rules-engine/es";

import { InfoItem } from "~/components/InfoItem";
import { NumberDisplay } from "~/components/NumberDisplay";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import {
  PaneComponentEnum,
  PaneIdentifiersCustomSkill,
} from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import CustomizeDataEditor from "../../../components/CustomizeDataEditor";
import EditorBox from "../../../components/EditorBox";
import { RemoveButton } from "../../../components/common/Button";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  customSkills: Array<Skill>;
  ruleData: RuleData;
  identifiers: PaneIdentifiersCustomSkill | null;
  isReadonly: boolean;
  theme: CharacterTheme;
  paneContext: PaneInfo;
}
interface State {
  skill: Skill | null;
}
class CustomSkillPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { customSkills, identifiers } = this.props;

    if (
      customSkills !== prevProps.customSkills ||
      identifiers !== prevProps.identifiers
    ) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { customSkills, identifiers } = props;

    let foundSkill: Skill | null | undefined = null;
    if (identifiers !== null) {
      foundSkill = customSkills.find((skill) => identifiers.id === skill.id);
    }

    return {
      skill: foundSkill ? foundSkill : null,
    };
  };

  handleSkillsManageShow = (): void => {
    const {
      paneContext: { paneHistoryPush },
    } = this.props;

    paneHistoryPush(PaneComponentEnum.SKILLS);
  };

  handleSkillRemove = (): void => {
    const { skill } = this.state;
    const {
      dispatch,
      paneContext: { paneHistoryStart },
    } = this.props;

    paneHistoryStart(PaneComponentEnum.SKILLS);
    if (skill) {
      dispatch(characterActions.customProficiencyRemove(skill.id));
    }
  };

  getData = (): Record<string, any> => {
    const { skill } = this.state;

    if (skill === null) {
      return {};
    }

    const originalContract = SkillUtils.getOriginalContract(skill);

    if (originalContract === null) {
      return {};
    }

    const {
      name,
      notes,
      proficiencyLevel,
      statId,
      type,
      override,
      miscBonus,
      magicBonus,
      description,
    } = originalContract;

    return {
      name,
      notes,
      proficiencyLevel,
      statId,
      type,
      override,
      miscBonus,
      magicBonus,
      description,
    };
  };

  handleDataUpdate = (data: Record<string, any>): void => {
    const { skill } = this.state;
    const { dispatch } = this.props;

    if (skill) {
      dispatch(characterActions.customProficiencySet(skill.id, data));
    }
  };

  renderCustomize = (): React.ReactNode => {
    const { ruleData, isReadonly } = this.props;

    if (isReadonly) {
      return null;
    }

    return (
      <Collapsible
        layoutType={"minimal"}
        header="Edit"
        className="ct-custom-skill-pane__edit"
      >
        <EditorBox>
          <CustomizeDataEditor
            data={this.getData()}
            enableName={true}
            enableNotes={true}
            enableDescription={true}
            enableStat={true}
            enableProficiencyLevel={true}
            enableMagicBonus={true}
            enableMiscBonus={true}
            enableOverride={true}
            maxNameLength={1024}
            onDataUpdate={this.handleDataUpdate}
            statOptions={RuleDataUtils.getStatOptions(ruleData)}
            proficiencyLevelOptions={RuleDataUtils.getProficiencyLevelOptions(
              ruleData
            )}
          />
        </EditorBox>
      </Collapsible>
    );
  };

  render() {
    const { skill } = this.state;
    const { isReadonly, ruleData, theme } = this.props;

    if (skill === null) {
      return <PaneInitFailureContent />;
    }
    const notes = SkillUtils.getNotes(skill);
    const description = SkillUtils.getDescription(skill);
    const modifier = SkillUtils.getModifier(skill);
    const statName = RuleDataUtils.getAbilityShortName(
      SkillUtils.getStat(skill),
      ruleData
    );
    const proficiencyLevel = SkillUtils.getProficiencyLevel(skill);
    const name = SkillUtils.getName(skill);

    const infoItemProps = { role: "listitem", inline: true };

    return (
      <div className="ct-custom-skill-pane" key={skill.id}>
        <Header parent="Skills" onClick={this.handleSkillsManageShow}>
          <div className="ct-custom-skill-pane__header">
            <div className="ct-custom-skill-pane__header-icon">
              <ProficiencyLevelIcon
                theme={theme}
                proficiencyLevel={proficiencyLevel}
              />
            </div>
            <div className="ct-custom-skill-pane__header-ability">
              {statName === null ? "--" : statName}
            </div>
            <div className="ct-custom-skill-pane__header-name">{name}</div>
            <div className="ct-custom-skill-pane__header-modifier">
              <NumberDisplay type="signed" number={modifier} />
            </div>
          </div>
        </Header>
        {this.renderCustomize()}
        {notes && (
          <div className="ct-custom-skill-pane__properties" role="list">
            <InfoItem label="Notes" {...infoItemProps}>
              {notes}
            </InfoItem>
          </div>
        )}
        {description && (
          <div className="ct-custom-skill-pane__description">{description}</div>
        )}
        {!isReadonly && (
          <div className="ct-custom-skill-pane__actions">
            <RemoveButton onClick={this.handleSkillRemove}>Remove</RemoveButton>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    customSkills: rulesEngineSelectors.getCustomSkills(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const CustomSkillPaneContainer = (props) => {
  const { pane } = useSidebar();

  return <CustomSkillPane {...props} paneContext={pane} />;
};

export default connect(mapStateToProps)(CustomSkillPaneContainer);
