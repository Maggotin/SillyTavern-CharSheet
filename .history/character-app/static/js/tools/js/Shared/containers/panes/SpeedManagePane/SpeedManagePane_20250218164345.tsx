import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Collapsible, Select } from "../../character-components/es";
import {
  characterActions,
  CharacterPreferences,
  Constants,
  CustomSpeedContract,
  CustomSpeedLookup,
  HelperUtils,
  HtmlSelectOption,
  SpeedInfo,
  RuleData,
  RuleDataUtils,
  rulesEngineSelectors,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";
import { NumberDisplay } from "~/components/NumberDisplay";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import { MOVEMENT_TYPE_LIST } from "../../../constants/App";
import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import SpeedManagePaneCustomizeItem from "./SpeedManagePaneCustomizeItem";

interface Props extends DispatchProp {
  movements: SpeedInfo;
  customSpeedLookup: CustomSpeedLookup;
  customSpeeds: Array<CustomSpeedContract>;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  isReadonly: boolean;
  theme: CharacterTheme;
}
class SpeedManagePane extends React.PureComponent<Props> {
  handleMovementDisplayChange = (value: string): void => {
    const { dispatch } = this.props;

    dispatch(
      characterActions.preferenceChoose(
        "primaryMovement",
        HelperUtils.parseInputInt(value)
      )
    );
  };

  handleOverrideUpdate = (
    id: number,
    distance: number | null,
    source: string | null
  ): void => {
    const { dispatch, customSpeeds } = this.props;

    if (distance !== null || source !== null) {
      let foundSpeed: CustomSpeedContract | undefined = customSpeeds.find(
        (speed) => speed.movementId === id
      );

      if (foundSpeed) {
        dispatch(
          characterActions.movementSet({
            ...foundSpeed,
            distance,
            source,
          })
        );
      } else {
        let newSpeed: CustomSpeedContract = {
          movementId: id,
          distance,
          source,
        };
        dispatch(characterActions.movementAdd(newSpeed));
      }
    } else {
      dispatch(characterActions.movementRemove(id));
    }
  };

  renderCustomize = (): React.ReactNode => {
    const { customSpeedLookup, preferences, isReadonly, ruleData } = this.props;

    if (isReadonly) {
      return;
    }

    let movementOptions: Array<HtmlSelectOption> = MOVEMENT_TYPE_LIST.map(
      (key) => ({
        label: RuleDataUtils.getMovementDescription(key, ruleData),
        value: key,
      })
    );

    return (
      <Collapsible
        layoutType={"minimal"}
        header="Customize"
        className="ct-speed-manage-pane__customize"
      >
        <Heading>Override Speeds</Heading>
        <div className="ct-speed-manage-pane__customize-header">
          <div className="ct-speed-manage-pane__customize-header-label" />
          <div className="ct-speed-manage-pane__customize-header-input">
            Speed (ft.)
          </div>
          <div className="ct-speed-manage-pane__customize-header-source">
            Source/Notes
          </div>
        </div>
        {movementOptions.map((option: HtmlSelectOption) => {
          const override = customSpeedLookup[option.value];
          return (
            <SpeedManagePaneCustomizeItem
              key={option.value as number}
              id={option.value as number}
              label={option.label}
              initialValue={override ? override.distance : null}
              initialSource={override ? override.source : null}
              minimumValue={0}
              onUpdate={this.handleOverrideUpdate}
            />
          );
        })}
        <Heading>Set Movement Display</Heading>
        <Select
          options={movementOptions}
          onChange={this.handleMovementDisplayChange}
          initialOptionRemoved={true}
          value={preferences.primaryMovement}
        />
      </Collapsible>
    );
  };

  renderDescription = (): React.ReactNode => {
    const { ruleData } = this.props;

    let rule = RuleDataUtils.getRule(Constants.RuleKeyEnum.SPEED, ruleData);
    if (rule === null || rule.description === null) {
      return null;
    }

    return (
      <HtmlContent
        className="ct-speed-manage-pane__description"
        html={rule.description}
        withoutTooltips
      />
    );
  };

  render() {
    const { movements, customSpeedLookup, ruleData, theme } = this.props;

    return (
      <div className="ct-speed-manage-pane">
        <Header>Speed</Header>
        <div className="ct-speed-manage-pane__speeds">
          {Object.keys(movements).map(
            (movementKey: Constants.SpeedMovementKeyEnum) => {
              const movementAmount = movements[movementKey];
              if (movementAmount === null || movementAmount === 0) {
                return null;
              }

              let movementType =
                RuleDataUtils.getMovementTypeBySpeedMovementKey(movementKey);
              let customSpeed: CustomSpeedContract | null | undefined =
                movementType === null ? null : customSpeedLookup[movementType];
              let source: string =
                customSpeed && customSpeed.source ? customSpeed.source : "";

              return (
                <div className="ct-speed-manage-pane__speed" key={movementKey}>
                  <span className="ct-speed-manage-pane__speed-label">
                    {RuleDataUtils.getSpeedMovementKeyLabel(
                      movementKey,
                      ruleData
                    )}
                  </span>
                  <span className="ct-speed-manage-pane__speed-amount">
                    <NumberDisplay
                      type="distanceInFt"
                      number={movementAmount}
                    />
                  </span>
                  {source && (
                    <span className="ct-speed-manage-pane__speed-source">
                      ({source})
                    </span>
                  )}
                </div>
              );
            }
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
    movements: rulesEngineSelectors.getCurrentCarriedWeightSpeed(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    customSpeedLookup: rulesEngineSelectors.getCustomSpeedLookup(state),
    customSpeeds: rulesEngineSelectors.getCustomSpeeds(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(SpeedManagePane);
