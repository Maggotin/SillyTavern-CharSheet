import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Collapsible } from "@dndbeyond/character-components/es";
import {
  characterActions,
  CharacterTheme,
  Constants,
  CustomSenseContract,
  CustomSenseLookup,
  HtmlSelectOption,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  SenseInfo,
  ValueLookup,
  ValueUtils,
} from "@dndbeyond/character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";

import EditorBox from "../../../components/EditorBox";
import ValueEditor from "../../../components/ValueEditor";
import { SENSE_TYPE_LIST } from "../../../constants/App";
import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import { SenseManagePaneCustomizeItem } from "./SenseManagePaneCustomizeItem";

interface Props extends DispatchProp {
  passivePerception: number | null;
  passiveInvestigation: number | null;
  passiveInsight: number | null;
  overridePassivePerception: number | null;
  senses: SenseInfo;
  customSensesLookup: CustomSenseLookup;
  customSenses: Array<CustomSenseContract>;
  ruleData: RuleData;
  valueLookup: ValueLookup;
  isReadonly: boolean;
  theme: CharacterTheme;
}
class SenseManagePane extends React.PureComponent<Props> {
  handleCustomDataUpdate = (key, value, source) => {
    const { dispatch } = this.props;

    dispatch(characterActions.valueSet(key, value, source));
  };

  handleOverrideUpdate = (
    id: number,
    distance: number | null,
    source: string | null
  ): void => {
    const { dispatch, customSenses } = this.props;

    if (distance !== null || source !== null) {
      let foundSense: CustomSenseContract | undefined = customSenses.find(
        (sense) => sense.senseId === id
      );

      if (foundSense) {
        dispatch(
          characterActions.senseSet({
            ...foundSense,
            distance,
            source,
          })
        );
      } else {
        let newSense: CustomSenseContract = {
          senseId: id,
          distance,
          source,
        };
        dispatch(characterActions.senseAdd(newSense));
      }
    } else {
      dispatch(characterActions.senseRemove(id));
    }
  };

  renderSense = (
    typeId: number,
    label: string,
    value: React.ReactNode,
    source: string | null
  ): React.ReactNode => {
    return (
      <div className="ct-sense-manage-pane__sense" key={typeId}>
        <span className="ct-sense-manage-pane__sense-label">{label}:</span>
        <span className="ct-sense-manage-pane__sense-value">{value}</span>
        {source && (
          <span className="ct-sense-manage-pane__sense-source">({source})</span>
        )}
      </div>
    );
  };

  renderPassiveSense = (
    typeId: Constants.AdjustmentTypeEnum,
    label: string,
    value: number | null
  ): React.ReactNode => {
    const { valueLookup } = this.props;

    let source = ValueUtils.getNotes(ValueUtils.getData(valueLookup, typeId));

    return this.renderSense(typeId, label, value, source);
  };

  renderCharacterSense = (senseKey: number): React.ReactNode => {
    const { senses, customSensesLookup, theme } = this.props;

    let senseValue = senses[senseKey];
    if (!senseValue || (senseValue && senseValue === 0)) {
      return null;
    }

    let source: string | null = null;
    if (customSensesLookup[senseKey]) {
      let customSense: CustomSenseContract = customSensesLookup[senseKey];
      source = customSense.source;
    }

    return this.renderSense(
      senseKey,
      RuleDataUtils.getSenseTypeLabel(senseKey),
      <NumberDisplay type="distanceInFt" number={senseValue} />,
      source
    );
  };

  renderCustomize = (): React.ReactNode => {
    const { customSensesLookup, ruleData, valueLookup, isReadonly } =
      this.props;

    if (!isReadonly) {
      let senseOptions: Array<HtmlSelectOption> = SENSE_TYPE_LIST.map(
        (key: number) => ({
          label: RuleDataUtils.getSenseTypeLabel(key),
          value: key,
        })
      );

      let customizationValues: Array<Constants.AdjustmentTypeEnum> = [
        Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_PERCEPTION,
        Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_INVESTIGATION,
        Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_INSIGHT,
      ];

      return (
        <Collapsible
          layoutType={"minimal"}
          header="Customize"
          className="ct-sense-manage-pane__customize"
        >
          <EditorBox>
            <ValueEditor
              dataLookup={ValueUtils.getDataLookup(
                valueLookup,
                customizationValues
              )}
              onDataUpdate={this.handleCustomDataUpdate}
              valueEditors={customizationValues}
              ruleData={ruleData}
            />
          </EditorBox>
          <div className="ct-sense-manage-pane__customize-header">
            <div className="ct-sense-manage-pane__customize-header-label" />
            <div className="ct-sense-manage-pane__customize-header-input">
              Distance (ft.)
            </div>
            <div className="ct-sense-manage-pane__customize-header-source">
              Source/Notes
            </div>
          </div>
          {senseOptions.map((option) => {
            const override: CustomSenseContract =
              customSensesLookup[option.value];
            return (
              <SenseManagePaneCustomizeItem
                key={option.value as number}
                id={option.value as number}
                label={option.label}
                initialValue={override ? override.distance : null}
                initialSource={override ? override.source : null}
                onUpdate={this.handleOverrideUpdate}
              />
            );
          })}
        </Collapsible>
      );
    }
  };

  renderDescription = (): React.ReactNode => {
    const { ruleData } = this.props;

    let rule = RuleDataUtils.getRule(Constants.RuleKeyEnum.SENSES, ruleData);
    if (rule === null || rule.description === null) {
      return null;
    }

    return (
      <HtmlContent
        className="ct-sense-manage-pane__description"
        html={rule.description}
        withoutTooltips
      />
    );
  };

  render() {
    const { passivePerception, passiveInvestigation, passiveInsight } =
      this.props;

    return (
      <div className="ct-sense-manage-pane">
        <Header>Senses</Header>
        <div className="ct-sense-manage-pane__senses">
          {this.renderPassiveSense(
            Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_PERCEPTION,
            "Passive Perception",
            passivePerception
          )}
          {this.renderPassiveSense(
            Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_INVESTIGATION,
            "Passive Investigation",
            passiveInvestigation
          )}
          {this.renderPassiveSense(
            Constants.AdjustmentTypeEnum.OVERRIDE_PASSIVE_INSIGHT,
            "Passive Insight",
            passiveInsight
          )}
          {SENSE_TYPE_LIST.map((senseKey) =>
            this.renderCharacterSense(senseKey)
          )}
        </div>
        {this.renderCustomize()}
        {this.renderDescription()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    senses: rulesEngineSelectors.getSenseInfo(state),
    passivePerception: rulesEngineSelectors.getPassivePerception(state),
    passiveInvestigation: rulesEngineSelectors.getPassiveInvestigation(state),
    passiveInsight: rulesEngineSelectors.getPassiveInsight(state),
    overridePassivePerception:
      rulesEngineSelectors.getOverridePassivePerception(state),
    customSensesLookup: rulesEngineSelectors.getCustomSenseLookup(state),
    customSenses: rulesEngineSelectors.getCustomSenses(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    valueLookup: rulesEngineSelectors.getCharacterValueLookup(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(SenseManagePane);
