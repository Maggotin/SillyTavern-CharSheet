import { sortBy } from "lodash";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Collapsible,
  DamageTypeIcon,
  DataOriginName,
  Select,
  ComponentConstants,
} from "@dndbeyond/character-components/es";
import {
  characterActions,
  CharacterDefenseAdjustmentContract,
  ConditionContract,
  ConditionDefinitionContract,
  ConditionUtils,
  Constants,
  DamageAdjustmentContract,
  DataOrigin,
  DefenseAdjustment,
  DefenseAdjustmentContract,
  HelperUtils,
  HtmlSelectOption,
  HtmlSelectOptionGroup,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  CharacterTheme,
} from "../../rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { getDataOriginComponentInfo } from "~/subApps/sheet/components/Sidebar/helpers/paneUtils";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import DefenseManagePaneCustomItem from "./DefenseManagePaneCustomItem";

const DEFENSE_ADJUSTMENT_TYPE_OPTION = {
  RESISTANCE: 1,
  IMMUNITY: 2,
  VULNERABILITY: 3,
};

interface AdjustmentGroupEntry extends DefenseAdjustmentContract {
  idx: number;
  definition: DamageAdjustmentContract | ConditionDefinitionContract;
}
interface AdjustmentGroupInfo {
  label: string;
  adjustments: Array<AdjustmentGroupEntry>;
}

interface Props extends DispatchProp {
  resistances: Array<DefenseAdjustment>;
  immunities: Array<DefenseAdjustment>;
  vulnerabilities: Array<DefenseAdjustment>;
  resistanceData: Array<DamageAdjustmentContract>;
  vulnerabilityData: Array<DamageAdjustmentContract>;
  conditionImmunityData: Array<ConditionContract>;
  damageImmunityData: Array<DamageAdjustmentContract>;
  customDefenseAdjustments: Array<CharacterDefenseAdjustmentContract>;
  ruleData: RuleData;
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryPush: PaneInfo["paneHistoryPush"];
}
interface State {
  adjustmentType: number | null;
  adjustmentSubType: string | null;
}
class DefenseManagePane extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      adjustmentType: null,
      adjustmentSubType: null,
    };
  }

  getNewDamageAdjustments = (): Array<CharacterDefenseAdjustmentContract> => {
    return this.props.customDefenseAdjustments.filter(
      (newData) =>
        newData.type === Constants.DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT
    );
  };

  getNewConditionAdjustments =
    (): Array<CharacterDefenseAdjustmentContract> => {
      return this.props.customDefenseAdjustments.filter(
        (newData) =>
          newData.type ===
          Constants.DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT
      );
    };

  getAvailableResistances = (): Array<DamageAdjustmentContract> => {
    const { resistanceData } = this.props;

    const newDefenseAdjustments = this.getNewDamageAdjustments();
    return resistanceData
      .filter((data) => !data.isMulti)
      .filter((data) =>
        newDefenseAdjustments.every(
          (newData) => newData.adjustmentId !== data.id
        )
      );
  };

  getAvailableVulnerabilities = (): Array<DamageAdjustmentContract> => {
    const { vulnerabilityData } = this.props;

    const newDefenseAdjustments = this.getNewDamageAdjustments();
    return vulnerabilityData
      .filter((data) => !data.isMulti)
      .filter((data) =>
        newDefenseAdjustments.every(
          (newData) => newData.adjustmentId !== data.id
        )
      );
  };

  getAvailableDamageImmunities = (): Array<DamageAdjustmentContract> => {
    const { damageImmunityData } = this.props;

    const newDefenseAdjustments = this.getNewDamageAdjustments();
    return damageImmunityData
      .filter((data) => !data.isMulti)
      .filter((data) =>
        newDefenseAdjustments.every(
          (newData) => newData.adjustmentId !== data.id
        )
      );
  };

  getAvailableConditionImmunities = (): Array<ConditionContract> => {
    const { conditionImmunityData } = this.props;

    const newDefenseAdjustments = this.getNewConditionAdjustments();
    return conditionImmunityData.filter((data) =>
      newDefenseAdjustments.every(
        (newData) => newData.adjustmentId !== ConditionUtils.getId(data)
      )
    );
  };

  handleAdjustmentRemove = (type: number, id: number): void => {
    const { dispatch } = this.props;

    dispatch(characterActions.customDefenseAdjustmentRemove(type, id));
  };

  handleAdjustmentSourceUpdate = (
    type: number,
    id: number,
    source: string | null
  ) => {
    const { dispatch, customDefenseAdjustments } = this.props;

    let foundAdjustment = customDefenseAdjustments.find(
      (adjustment) => adjustment.type === type && adjustment.adjustmentId === id
    );
    if (foundAdjustment) {
      dispatch(
        characterActions.customDefenseAdjustmentSet({
          ...foundAdjustment,
          source,
        })
      );
    }
  };

  handleChangeAdjustmentType = (value: string): void => {
    this.setState({
      adjustmentType: HelperUtils.parseInputInt(value),
      adjustmentSubType: null,
    });
  };

  handleChangeAdjustmentSubType = (subTypeValue: string): void => {
    const { adjustmentType } = this.state;
    const { dispatch } = this.props;

    let type: number | null = null;
    let adjustmentId: number | null = null;
    switch (adjustmentType) {
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.RESISTANCE:
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.VULNERABILITY:
        type = Constants.DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT;
        adjustmentId = parseInt(subTypeValue);
        break;
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.IMMUNITY:
        let [defenseTypeKey, defenseAdjustmentId] = subTypeValue.split("-");
        type = parseInt(defenseTypeKey);
        adjustmentId = parseInt(defenseAdjustmentId);
        break;
      default:
      // not implemented
    }

    if (type !== null && adjustmentId !== null) {
      let newAdjustment: CharacterDefenseAdjustmentContract = {
        type,
        adjustmentId,
        source: null,
      };
      dispatch(characterActions.customDefenseAdjustmentAdd(newAdjustment));
    }
  };

  handleDataOriginDetailShow = (dataOrigin: DataOrigin): void => {
    const { paneHistoryPush } = this.props;

    let component = getDataOriginComponentInfo(dataOrigin);
    if (component.type !== PaneComponentEnum.ERROR_404) {
      paneHistoryPush(component.type, component.identifiers);
    }
  };

  renderExtraDataOrigin = (dataOrigin: DataOrigin): React.ReactNode => {
    const { theme } = this.props;

    return (
      <span className="ct-defense-manage-pane__item-extra">
        (
        <DataOriginName
          dataOrigin={dataOrigin}
          onClick={this.handleDataOriginDetailShow}
          theme={theme}
        />
        )
      </span>
    );
  };

  getDefenseAdjustmentIcon = (
    type: Constants.DefenseAdjustmentTypeEnum,
    slug: string
  ): React.ReactNode => {
    const { theme } = this.props;

    let iconClassNames: Array<string> = [
      "ct-defense-manage-pane__item-icon",
      `ct-defense-manage-pane__item-icon--${slug}`,
    ];

    switch (type) {
      case Constants.DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT:
        if (theme.isDarkMode) {
          iconClassNames.push(`i-condition-white-${slug}`);
        } else {
          iconClassNames.push(`i-condition-${slug}`);
        }

        return <i className={iconClassNames.join(" ")} />;
      case Constants.DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT:
        return (
          <DamageTypeIcon
            type={slug as ComponentConstants.DamageTypePropType}
            theme={theme}
          />
        );

      default:
        return null;
    }
  };

  renderDamageAdjustmentList = (
    defenseAdjustments: Array<DefenseAdjustment>
  ): React.ReactNode => {
    return defenseAdjustments.map((defenseAdjustment, idx) => {
      const { dataOrigin, name, isCustom, slug, type } = defenseAdjustment;

      return (
        <div className="ct-defense-manage-pane__item" key={idx}>
          <div className="ct-defense-manage-pane__item-value">
            {this.getDefenseAdjustmentIcon(type, slug)}
          </div>
          <div className="ct-defense-manage-pane__item-label">
            <span className="ct-defense-manage-pane__item-label-text">
              {name}
              {isCustom ? "*" : ""}
            </span>
            {this.renderExtraDataOrigin(dataOrigin)}
          </div>
        </div>
      );
    });
    //`
  };

  renderDamageAdjustmentGroup = (
    label: string,
    defenseAdjustments: Array<DefenseAdjustment>
  ): React.ReactNode => {
    if (!defenseAdjustments.length) {
      return null;
    }
    return (
      <div className="ct-defense-manage-pane__group">
        <div className="ct-defense-manage-pane__heading">{label}</div>
        <div className="ct-defense-manage-pane__group-items">
          {this.renderDamageAdjustmentList(defenseAdjustments)}
        </div>
      </div>
    );
  };

  renderCustomDefenseAdjustmentList = (): React.ReactNode => {
    const { customDefenseAdjustments, ruleData } = this.props;

    const damageAdjustmentDataLookup =
      RuleDataUtils.getDamageAdjustmentsLookup(ruleData);
    const conditionDataLookup = RuleDataUtils.getConditionLookup(ruleData);

    let adjustmentGroups: Array<AdjustmentGroupInfo> = [
      { label: "Resistances", adjustments: [] },
      { label: "Immunities", adjustments: [] },
      { label: "Vulnerabilities", adjustments: [] },
    ];
    customDefenseAdjustments.forEach((defenseAdjustment, newDefIdx) => {
      const { type, adjustmentId, source } = defenseAdjustment;

      let groupIdx: number | null = null;
      let definition:
        | ConditionDefinitionContract
        | DamageAdjustmentContract
        | null = null;
      switch (type) {
        case Constants.DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT:
          definition = HelperUtils.lookupDataOrFallback(
            damageAdjustmentDataLookup,
            adjustmentId
          );
          if (definition !== null) {
            switch (definition.type) {
              case Constants.DamageAdjustmentTypeEnum.RESISTANCE:
                groupIdx = 0;
                break;
              case Constants.DamageAdjustmentTypeEnum.IMMUNITY:
                groupIdx = 1;
                break;
              case Constants.DamageAdjustmentTypeEnum.VULNERABILITY:
                groupIdx = 2;
                break;
            }
          }
          break;
        case Constants.DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT:
          let conditionData = HelperUtils.lookupDataOrFallback(
            conditionDataLookup,
            adjustmentId
          );
          if (conditionData !== null) {
            definition = conditionData.definition;
            groupIdx = 1;
          }
          break;
        default:
        // not implemented
      }

      if (groupIdx !== null && definition !== null) {
        adjustmentGroups[groupIdx].adjustments.push({
          id: defenseAdjustment.adjustmentId,
          type: defenseAdjustment.type,
          source: defenseAdjustment.source,
          idx: newDefIdx,
          definition,
        });
      }
    });

    return adjustmentGroups.map((adjustmentGroup, groupIdx) => {
      if (!adjustmentGroup.adjustments.length) {
        return null;
      }

      let sortedAdjustments: Array<AdjustmentGroupEntry> = sortBy(
        adjustmentGroup.adjustments,
        [(adjustment: any) => adjustment.definition.name]
      );

      return (
        <div className="ct-defense-manage-pane__custom-group" key={groupIdx}>
          <div className="ct-defense-manage-pane__heading">
            {adjustmentGroup.label}
          </div>
          {sortedAdjustments.map((defenseAdjustment) => {
            const { type, id, source, definition } = defenseAdjustment;

            return (
              <DefenseManagePaneCustomItem
                key={`${type}-${id}`}
                id={id}
                type={type}
                initialValue={source}
                label={definition.name ? definition.name : ""}
                onRemove={this.handleAdjustmentRemove}
                onSourceUpdate={this.handleAdjustmentSourceUpdate}
              />
            );
          })}
        </div>
      );
    });
    //`
  };

  renderCustomUi = (): React.ReactNode => {
    const { adjustmentType } = this.state;
    const { isReadonly } = this.props;

    if (isReadonly) {
      return;
    }

    const adjustmentTypeOptions: Array<HtmlSelectOption> = [
      { label: "Resistance", value: DEFENSE_ADJUSTMENT_TYPE_OPTION.RESISTANCE },
      { label: "Immunity", value: DEFENSE_ADJUSTMENT_TYPE_OPTION.IMMUNITY },
      {
        label: "Vulnerability",
        value: DEFENSE_ADJUSTMENT_TYPE_OPTION.VULNERABILITY,
      },
    ];

    let adjustmentSubTypeOptions: Array<
      HtmlSelectOptionGroup | HtmlSelectOption
    > = [];
    let subTypePlaceholder: string = "";
    switch (adjustmentType) {
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.RESISTANCE:
        adjustmentSubTypeOptions = this.getAvailableResistances().map(
          (data) => ({
            label: data.name,
            value: data.id,
          })
        );
        subTypePlaceholder = "-- Choose a Resistance --";
        break;
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.VULNERABILITY:
        adjustmentSubTypeOptions = this.getAvailableVulnerabilities().map(
          (data) => ({
            label: data.name,
            value: data.id,
          })
        );
        subTypePlaceholder = "-- Choose a Vulnerability --";
        break;
      case DEFENSE_ADJUSTMENT_TYPE_OPTION.IMMUNITY:
        adjustmentSubTypeOptions = [
          {
            optGroupLabel: "Damage",
            options: this.getAvailableDamageImmunities().map((data) => ({
              label: data.name,
              value: `${Constants.DefenseAdjustmentTypeEnum.DAMAGE_ADJUSTMENT}-${data.id}`,
            })),
          },
          {
            optGroupLabel: "Conditions",
            options: this.getAvailableConditionImmunities().map((data) => ({
              label: ConditionUtils.getName(data),
              value: `${
                Constants.DefenseAdjustmentTypeEnum.CONDITION_ADJUSTMENT
              }-${ConditionUtils.getUniqueKey(data)}`,
            })),
          },
        ];
        subTypePlaceholder = "-- Choose an Immunity --";
        //`
        break;
      default:
      // not implemented
    }

    return (
      <Collapsible
        layoutType={"minimal"}
        header="Customize"
        className="ct-defense-manage-pane__custom"
      >
        <div className="ct-defense-manage-pane__custom-fields">
          <div className="dct-defense-manage-pane__custom-field">
            <Select
              options={adjustmentTypeOptions}
              onChange={this.handleChangeAdjustmentType}
              value={adjustmentType}
            />
          </div>
          <div className="ct-defense-manage-pane__custom-field">
            {adjustmentType !== null && (
              <Select
                options={sortBy(adjustmentSubTypeOptions, "label")}
                onChange={this.handleChangeAdjustmentSubType}
                resetAfterChoice={true}
                placeholder={subTypePlaceholder}
                value={null}
              />
            )}
          </div>
        </div>
        <div className="ct-defense-manage-pane__custom-items">
          {this.renderCustomDefenseAdjustmentList()}
        </div>
      </Collapsible>
    );
  };

  renderDefault = (): React.ReactNode => {
    return (
      <div className="ct-defense-manage-pane__default">
        No Resistances, Immunities, or Vulnerabilities
      </div>
    );
  };

  renderDefenseGroups = (): React.ReactNode => {
    const { resistances, vulnerabilities, immunities } = this.props;

    return (
      <React.Fragment>
        {this.renderDamageAdjustmentGroup("Resistances", resistances)}
        {this.renderDamageAdjustmentGroup("Immunities", immunities)}
        {this.renderDamageAdjustmentGroup("Vulnerabilities", vulnerabilities)}
      </React.Fragment>
    );
  };

  render() {
    const { resistances, vulnerabilities, immunities } = this.props;

    let contentNode: React.ReactNode;
    if (!resistances.length && !vulnerabilities.length && !immunities.length) {
      contentNode = this.renderDefault();
    } else {
      contentNode = this.renderDefenseGroups();
    }

    return (
      <div className="ct-defense-manage-pane">
        <Header>Defenses</Header>
        {contentNode}
        {this.renderCustomUi()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    resistances: rulesEngineSelectors.getActiveResistances(state),
    immunities: rulesEngineSelectors.getActiveImmunities(state),
    vulnerabilities: rulesEngineSelectors.getActiveVulnerabilities(state),

    resistanceData: rulesEngineSelectors.getResistanceData(state),
    vulnerabilityData: rulesEngineSelectors.getVulnerabilityData(state),
    conditionImmunityData: rulesEngineSelectors.getConditionImmunityData(state),
    damageImmunityData: rulesEngineSelectors.getDamageImmunityData(state),

    theme: rulesEngineSelectors.getCharacterTheme(state),
    ruleData: rulesEngineSelectors.getRuleData(state),

    customDefenseAdjustments:
      rulesEngineSelectors.getCustomDefenseAdjustments(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const DefenseManagePaneContainer = (props) => {
  const {
    pane: { paneHistoryPush },
  } = useSidebar();
  return <DefenseManagePane {...props} paneHistoryPush={paneHistoryPush} />;
};

export default connect(mapStateToProps)(DefenseManagePaneContainer);
