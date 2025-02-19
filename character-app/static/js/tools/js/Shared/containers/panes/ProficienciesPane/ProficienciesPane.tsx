import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Select } from "@dndbeyond/character-components/es";
import {
  characterActions,
  CharacterValuesContract,
  Constants,
  CustomProficiencyContract,
  EntityRestrictionData,
  HelperUtils,
  HtmlSelectOption,
  HtmlSelectOptionGroup,
  ProficiencyGroup,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  TypeValueLookup,
  ValueUtils,
} from "@dndbeyond/character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import ProficiencyGroups from "../../../../CharacterSheet/components/ProficiencyGroups";
import { SharedAppState } from "../../../stores/typings";
import ProficienciesPaneCustomProficiency from "./ProficienciesPaneCustomProficiency";
import ProficienciesPaneExistingProficiency from "./ProficienciesPaneExistingProficiency";

export const PROFICIENCY_TYPE = {
  ARMOR: 1,
  WEAPON: 2,
  TOOL: 3,
  LANGUAGE: 4,
  TOOL_OTHER: 5,
  LANGUAGE_OTHER: 6,
};

interface Props extends DispatchProp {
  customProficiencies: Array<CustomProficiencyContract>;
  proficiencyGroups: Array<ProficiencyGroup>;
  typeValueLookup: TypeValueLookup;
  ruleData: RuleData;
  entityRestrictionData: EntityRestrictionData;
}
interface State {
  type: number | null;
  subtype: number | null;
}
class ProficienciesPane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      type: null,
      subtype: null,
    };
  }

  getSubtypeOptions = (): Array<HtmlSelectOption | HtmlSelectOptionGroup> => {
    const { type } = this.state;
    const { ruleData, typeValueLookup, entityRestrictionData } = this.props;

    let valueType: number | null = null;
    switch (type) {
      case PROFICIENCY_TYPE.ARMOR:
        valueType = Constants.AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL;
        break;
      case PROFICIENCY_TYPE.WEAPON:
        valueType = Constants.AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL;
        break;
      case PROFICIENCY_TYPE.LANGUAGE:
        valueType = Constants.AdjustmentTypeEnum.LANGUAGE_PROFICIENCY_LEVEL;
        break;
      case PROFICIENCY_TYPE.TOOL:
        valueType = Constants.AdjustmentTypeEnum.TOOL_PROFICIENCY_LEVEL;
        break;
      default:
      // not implemented
    }

    let options: Array<HtmlSelectOption | HtmlSelectOptionGroup> = [];
    if (valueType !== null) {
      let excludeIds = ValueUtils.getTypeValueIntIds(
        typeValueLookup,
        valueType
      );
      switch (type) {
        case PROFICIENCY_TYPE.ARMOR:
          options = RuleDataUtils.getArmorOptions(ruleData, excludeIds);
          break;
        case PROFICIENCY_TYPE.WEAPON:
          options = RuleDataUtils.getWeaponOptions(ruleData, excludeIds);
          break;
        case PROFICIENCY_TYPE.LANGUAGE:
          options = RuleDataUtils.getLanguageOptions(
            ruleData,
            excludeIds,
            entityRestrictionData
          );
          break;
        case PROFICIENCY_TYPE.TOOL:
          options = RuleDataUtils.getToolOptions(ruleData, excludeIds);
          break;
        default:
        // not implemented
      }
    }

    return options;
  };

  getSubtypeNameLookup = (type: number): Record<number, string> => {
    const { ruleData } = this.props;

    let names: Record<number, string> = {};
    switch (type) {
      case Constants.AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL:
        names = RuleDataUtils.getArmorNameLookup(ruleData);
        break;
      case Constants.AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL:
        names = RuleDataUtils.getWeaponNameLookup(ruleData);
        break;
      case Constants.AdjustmentTypeEnum.LANGUAGE_PROFICIENCY_LEVEL:
        names = RuleDataUtils.getLanguageNameLookup(ruleData);
        break;
      case Constants.AdjustmentTypeEnum.TOOL_PROFICIENCY_LEVEL:
        names = RuleDataUtils.getToolNameLookup(ruleData);
        break;
      default:
      // not implemented
    }
    return names;
  };

  handleDataUpdate = (proficiency: CharacterValuesContract): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.valueSet(
        ValueUtils.getTypeId(proficiency),
        ValueUtils.getValue(proficiency),
        ValueUtils.getNotes(proficiency),
        ValueUtils.getValueId(proficiency),
        ValueUtils.getValueTypeId(proficiency)
      )
    );
  };

  handleProficiencyRemove = (proficiency: CharacterValuesContract): void => {
    const { dispatch } = this.props;
    dispatch(
      characterActions.valueSet(
        ValueUtils.getTypeId(proficiency),
        null,
        null,
        ValueUtils.getValueId(proficiency),
        ValueUtils.getValueTypeId(proficiency)
      )
    );
  };

  handleCustomDataUpdate = (
    id: number,
    properties: Partial<CustomProficiencyContract>
  ): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.customProficiencySet(id, properties));
  };

  handleCustomRemove = (proficiency: CustomProficiencyContract): void => {
    const { dispatch } = this.props;
    dispatch(characterActions.customProficiencyRemove(proficiency.id));
  };

  handleCustomProficiencyAdd = (type: number): void => {
    const { dispatch, customProficiencies } = this.props;

    let label: string = "Proficiency";
    let customType: number | null = null;
    switch (type) {
      case PROFICIENCY_TYPE.LANGUAGE_OTHER:
        label = "Language";
        customType = Constants.CustomProficiencyTypeEnum.LANGUAGE;
        break;
      case PROFICIENCY_TYPE.TOOL_OTHER:
        label = "Tool";
        customType = Constants.CustomProficiencyTypeEnum.TOOL;
        break;
      default:
      // not implemented
    }

    if (customType !== null) {
      dispatch(
        characterActions.customProficiencyCreate(
          `Custom ${label} ${customProficiencies.length + 1}`,
          customType
        )
      );
    }
  };

  handleTypeChange = (type: string): void => {
    let typeValue = HelperUtils.parseInputInt(type);
    switch (typeValue) {
      case PROFICIENCY_TYPE.LANGUAGE_OTHER:
      case PROFICIENCY_TYPE.TOOL_OTHER:
        this.handleCustomProficiencyAdd(typeValue);
        this.setState({
          type: null,
        });
        break;
      case PROFICIENCY_TYPE.ARMOR:
      case PROFICIENCY_TYPE.WEAPON:
      case PROFICIENCY_TYPE.LANGUAGE:
      case PROFICIENCY_TYPE.TOOL:
      default:
        this.setState({
          type: typeValue,
        });
    }
  };

  handleSubtypeChange = (subtype: string): void => {
    const { type } = this.state;
    const { dispatch, ruleData } = this.props;

    let subtypeValue = HelperUtils.parseInputInt(subtype);

    let valueType: number | null = null;
    let valueId: number | null = null;
    let valueTypeId: number | null = null;
    switch (type) {
      case PROFICIENCY_TYPE.ARMOR:
        valueType = Constants.AdjustmentTypeEnum.ARMOR_PROFICIENCY_LEVEL;
        valueId = subtypeValue;
        valueTypeId = Constants.ItemBaseTypeIdEnum.ARMOR;
        break;
      case PROFICIENCY_TYPE.WEAPON:
        valueType = Constants.AdjustmentTypeEnum.WEAPON_PROFICIENCY_LEVEL;
        valueId = subtypeValue;
        valueTypeId = Constants.ItemBaseTypeIdEnum.WEAPON;
        break;
      case PROFICIENCY_TYPE.LANGUAGE:
        valueType = Constants.AdjustmentTypeEnum.LANGUAGE_PROFICIENCY_LEVEL;
        valueId = subtypeValue;
        valueTypeId = RuleDataUtils.getLanguageTypeId(ruleData);
        break;
      case PROFICIENCY_TYPE.TOOL:
        valueType = Constants.AdjustmentTypeEnum.TOOL_PROFICIENCY_LEVEL;
        valueId = subtypeValue;
        valueTypeId = RuleDataUtils.getToolTypeId(ruleData);
        break;
    }

    if (type !== null && valueType !== null) {
      dispatch(
        characterActions.valueSet(
          valueType,
          Constants.ProficiencyLevelEnum.FULL,
          null,
          ValueUtils.hack__toString(valueId),
          ValueUtils.hack__toString(valueTypeId)
        )
      );
    }
  };

  renderCustomProficiencies = (): React.ReactNode => {
    const { typeValueLookup, customProficiencies, ruleData } = this.props;

    const proficiencyGroupData = RuleDataUtils.getProficiencyGroups(ruleData);

    return (
      <div className="ct-proficiencies-pane__customs">
        {proficiencyGroupData.map((group) => {
          let proficiencies: Array<CharacterValuesContract> = [];
          let custom: Array<CustomProficiencyContract> = [];

          if (group.customAdjustments !== null) {
            group.customAdjustments.forEach((typeId) => {
              let charValues = ValueUtils.getTypeData(typeValueLookup, typeId);
              proficiencies.push(...charValues);
            });
          }

          // TODO get real data
          switch (group.label) {
            case "Tools":
              custom = customProficiencies.filter(
                (customProficiency) =>
                  customProficiency.type ===
                  Constants.CustomProficiencyTypeEnum.TOOL
              );
              break;
            case "Languages":
              custom = customProficiencies.filter(
                (customProficiency) =>
                  customProficiency.type ===
                  Constants.CustomProficiencyTypeEnum.LANGUAGE
              );
              break;
            default:
            // not implemented
          }

          if (!proficiencies.length && !custom.length) {
            return null;
          }

          return (
            <div
              className="ct-proficiencies-pane__custom"
              key={group.label ? group.label : ""}
            >
              <div className="ct-proficiencies-pane__custom-label">
                <Heading>{group.label}</Heading>
              </div>
              <div className="ct-proficiencies-pane__proficiencies">
                {proficiencies.map((proficiency) => {
                  return (
                    <ProficienciesPaneExistingProficiency
                      key={ValueUtils.getUniqueKey(proficiency)}
                      proficiency={proficiency}
                      nameLookup={this.getSubtypeNameLookup(
                        ValueUtils.getTypeId(proficiency)
                      )}
                      onRemove={this.handleProficiencyRemove}
                      onDataUpdate={this.handleDataUpdate}
                    />
                  );
                })}
                {custom.map((proficiency) => (
                  <ProficienciesPaneCustomProficiency
                    key={proficiency.id}
                    proficiency={proficiency}
                    onRemove={this.handleCustomRemove}
                    onDataUpdate={this.handleCustomDataUpdate}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderAdd = (): React.ReactNode => {
    const { type, subtype } = this.state;

    let typeOptions: Array<HtmlSelectOptionGroup> = [
      {
        optGroupLabel: "Existing",
        options: [
          { label: "Armor", value: PROFICIENCY_TYPE.ARMOR },
          { label: "Weapon", value: PROFICIENCY_TYPE.WEAPON },
          { label: "Tool", value: PROFICIENCY_TYPE.TOOL },
          { label: "Language", value: PROFICIENCY_TYPE.LANGUAGE },
        ],
      },
      {
        optGroupLabel: "Custom",
        resetAfterChoice: true,
        options: [
          { label: "Tool", value: PROFICIENCY_TYPE.TOOL_OTHER },
          { label: "Language", value: PROFICIENCY_TYPE.LANGUAGE_OTHER },
        ],
      },
    ];

    let subtypeOptions = this.getSubtypeOptions();

    return (
      <React.Fragment>
        <Heading>Add New Proficiencies</Heading>
        <div className="ct-proficiencies-pane__add">
          <div className="ct-proficiencies-pane__add-fieldstcs-proficiencies-pane__add-field--type">
            <Select
              options={typeOptions}
              onChange={this.handleTypeChange}
              value={type}
            />
          </div>
          {subtypeOptions.length > 0 && (
            <div className="ct-proficiencies-pane__add-fieldstcs-proficiencies-pane__add-field--subtype">
              <Select
                options={subtypeOptions}
                onChange={this.handleSubtypeChange}
                value={subtype}
                initialOptionRemoved={true}
                resetAfterChoice={true}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  renderProficiencyGroups = (): React.ReactNode => {
    const { proficiencyGroups } = this.props;

    return (
      <div className="ct-proficiencies-pane__groups">
        <ProficiencyGroups proficiencyGroups={proficiencyGroups} />
      </div>
    );
  };

  render() {
    return (
      <div className="ct-proficiencies-pane">
        <Header>Proficiencies & Training</Header>
        {this.renderCustomProficiencies()}
        {this.renderAdd()}
        {this.renderProficiencyGroups()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    customProficiencies: rulesEngineSelectors.getCustomProficiencies(state),
    typeValueLookup: rulesEngineSelectors.getCharacterValueLookupByType(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    proficiencyGroups: rulesEngineSelectors.getProficiencyGroups(state),
    entityRestrictionData: rulesEngineSelectors.getEntityRestrictionData(state),
  };
}

export default connect(mapStateToProps)(ProficienciesPane);
