import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  AlignmentContract,
  characterActions,
  CharacterLifestyleContract,
  HtmlSelectOption,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  SizeContract,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import { SharedAppState } from "../../../stores/typings";
import { TypeScriptUtils } from "../../../utils";
import DescriptionPaneEntry from "./DescriptionPaneEntry";
import DescriptionPaneEntryContent from "./DescriptionPaneEntryContent";
import DescriptionPaneNumberEditor from "./DescriptionPaneNumberEditor";
import DescriptionPaneSelectEditor from "./DescriptionPaneSelectEditor";
import DescriptionPaneTextEditor from "./DescriptionPaneTextEditor";

interface Props extends DispatchProp {
  height: string | null;
  weight: number | null;
  size: SizeContract | null;
  faith: string | null;
  skin: string | null;
  eyes: string | null;
  hair: string | null;
  age: number | null;
  gender: string | null;
  alignment: AlignmentContract | null;
  lifestyle: CharacterLifestyleContract | null;

  ruleData: RuleData;
}
class DescriptionPane extends React.PureComponent<Props> {
  handleAlignmentUpdate = (propertyKey: string, value: number | null): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.alignmentSet(value));
  };

  handleLifestyleUpdate = (propertyKey: string, value: number | null): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.lifestyleSet(value));
  };

  handleFaithChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.faithSet(value));
  };

  handleHairChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.hairSet(value));
  };

  handleSkinChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.skinSet(value));
  };

  handleEyesChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.eyesSet(value));
  };

  handleHeightChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.heightSet(value));
  };

  handleWeightChange = (propertyKey: string, value: number | null): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.weightSet(value));
  };

  handleAgeChange = (propertyKey: string, value: number | null): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.ageSet(value));
  };

  handleGenderChange = (propertyKey: string, value: string): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.genderSet(value));
  };

  renderCharacterDetails = (): React.ReactNode => {
    const { alignment, lifestyle, ruleData, faith } = this.props;

    const alignmentData = RuleDataUtils.getAlignments(ruleData);
    const lifestyleData = RuleDataUtils.getLifestyles(ruleData);
    const alignmentOptions = RuleDataUtils.getAlignmentOptions(ruleData);

    let alignmentDescriptionNode: React.ReactNode;
    if (alignment !== null && alignment.description) {
      alignmentDescriptionNode = (
        <HtmlContent html={alignment.description} withoutTooltips />
      );
    }

    const lifestyleOptions: Array<HtmlSelectOption> = lifestyleData
      .map((lifestyle) => {
        if (lifestyle.id === null) {
          return null;
        }
        return {
          label: `${lifestyle.name} ${
            lifestyle.cost === "-" ? "" : `(${lifestyle.cost})`
          }`,
          value: lifestyle.id,
        };
      })
      .filter(TypeScriptUtils.isNotNullOrUndefined);

    let lifestyleDescriptionNode: React.ReactNode;
    if (lifestyle !== null) {
      lifestyleDescriptionNode = lifestyle.description;
    }

    return (
      <React.Fragment>
        <DescriptionPaneEntry>
          <DescriptionPaneSelectEditor
            label="Alignment"
            options={alignmentOptions}
            defaultValue={alignment === null ? null : alignment.id}
            propertyKey="alignmentId"
            onUpdate={this.handleAlignmentUpdate}
          />
          <DescriptionPaneEntryContent>
            {alignmentDescriptionNode}
          </DescriptionPaneEntryContent>
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Faith"
            defaultValue={faith}
            propertyKey="faith"
            onUpdate={this.handleFaithChange}
            maxLength={512}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneSelectEditor
            label="Lifestyle"
            options={lifestyleOptions}
            defaultValue={lifestyle === null ? null : lifestyle.id}
            propertyKey="lifestyleId"
            onUpdate={this.handleLifestyleUpdate}
          />
          <DescriptionPaneEntryContent>
            {lifestyleDescriptionNode}
          </DescriptionPaneEntryContent>
        </DescriptionPaneEntry>
      </React.Fragment>
    );
  };

  renderPhysicalCharacteristics = (): React.ReactNode => {
    const { height, weight, skin, eyes, hair, age, gender } = this.props;

    return (
      <React.Fragment>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Hair"
            defaultValue={hair}
            propertyKey="hair"
            onUpdate={this.handleHairChange}
            maxLength={50}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Skin"
            defaultValue={skin}
            propertyKey="skin"
            onUpdate={this.handleSkinChange}
            maxLength={50}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Eyes"
            defaultValue={eyes}
            propertyKey="eyes"
            onUpdate={this.handleEyesChange}
            maxLength={50}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Height"
            defaultValue={height}
            propertyKey="height"
            onUpdate={this.handleHeightChange}
            maxLength={50}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneNumberEditor
            label="Weight (lbs)"
            defaultValue={weight}
            propertyKey="weight"
            onUpdate={this.handleWeightChange}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneNumberEditor
            label="Age (Years)"
            defaultValue={age}
            propertyKey="age"
            onUpdate={this.handleAgeChange}
          />
        </DescriptionPaneEntry>
        <DescriptionPaneEntry>
          <DescriptionPaneTextEditor
            label="Gender"
            defaultValue={gender}
            propertyKey="gender"
            onUpdate={this.handleGenderChange}
            maxLength={128}
          />
        </DescriptionPaneEntry>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="ct-description-pane">
        <Header>Characteristics and Details</Header>
        <div className="ct-description-pane__entries">
          {this.renderCharacterDetails()}
          {this.renderPhysicalCharacteristics()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    ruleData: rulesEngineSelectors.getRuleData(state),
    alignment: rulesEngineSelectors.getAlignment(state),
    height: rulesEngineSelectors.getHeight(state),
    weight: rulesEngineSelectors.getWeight(state),
    size: rulesEngineSelectors.getSize(state),
    faith: rulesEngineSelectors.getFaith(state),
    skin: rulesEngineSelectors.getSkin(state),
    eyes: rulesEngineSelectors.getEyes(state),
    hair: rulesEngineSelectors.getHair(state),
    age: rulesEngineSelectors.getAge(state),
    gender: rulesEngineSelectors.getGender(state),
    lifestyle: rulesEngineSelectors.getLifestyle(state),
  };
}

export default connect(mapStateToProps)(DescriptionPane);
