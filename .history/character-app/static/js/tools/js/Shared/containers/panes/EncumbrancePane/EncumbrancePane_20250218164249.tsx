import React from "react";
import { connect } from "react-redux";

import {
  CharacterPreferences,
  CharacterTheme,
  Constants,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { NumberDisplay } from "~/components/NumberDisplay";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";

import SettingsButton from "../../../../CharacterSheet/components/SettingsButton";
import { appEnvSelectors } from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { SettingsContextsEnum } from "../SettingsPane/typings";

interface Props {
  preferences: CharacterPreferences;
  carryCapacity: number;
  pushDragLiftWeight: number;
  encumberedWeight: number;
  heavilyEncumberedWeight: number;
  coinWeight: number;
  itemWeight: number;
  isReadonly: boolean;
  theme?: CharacterTheme;
}
class EncumbrancePane extends React.PureComponent<Props> {
  renderWeight = (label, weight): React.ReactNode => {
    const { theme } = this.props;
    return (
      <div className="ct-encumbrance-pane__weight">
        <span className="ct-encumbrance-pane__weight-label">{label}:</span>
        <span className="ct-encumbrance-pane__weight-value">
          <NumberDisplay type="weightInLb" number={weight} />
        </span>
      </div>
    );
  };

  renderWeightDistributions = (): React.ReactNode => {
    const { preferences, coinWeight, itemWeight } = this.props;
    // When ignoreCoinWeight is off
    // item weight should be the weight of items without coins
    // and coin weight should be the weight of all coins in all equipped containers
    return (
      <React.Fragment>
        <Heading>Current Weight Distribution</Heading>
        <div className="ct-encumbrance-pane__weights">
          {this.renderWeight("Items", itemWeight)}
          {!preferences.ignoreCoinWeight &&
            this.renderWeight("Coins", coinWeight)}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const {
      preferences,
      carryCapacity,
      pushDragLiftWeight,
      encumberedWeight,
      heavilyEncumberedWeight,
      isReadonly,
    } = this.props;

    return (
      <div className="ct-encumbrance-pane">
        <Header
          callout={
            <SettingsButton
              context={SettingsContextsEnum.ENCUMBRANCE}
              isReadonly={isReadonly}
            />
          }
        >
          Encumbrance
        </Header>

        <div className="ct-encumbrance-pane__info">
          {preferences.encumbranceType ===
            Constants.PreferenceEncumbranceTypeEnum.NONE && (
            <React.Fragment>
              <div className="ct-encumbrance-pane__weights">
                {this.renderWeight("Carrying Capacity", carryCapacity)}
                {this.renderWeight("Push, Drag, or Lift", pushDragLiftWeight)}
              </div>
              {this.renderWeightDistributions()}
              <Heading>No Encumbrance</Heading>
              <p>
                Encumbrance rules are not currently applied to this character.
              </p>
            </React.Fragment>
          )}
          {preferences.encumbranceType ===
            Constants.PreferenceEncumbranceTypeEnum.ENCUMBRANCE && (
            <React.Fragment>
              <div className="ct-encumbrance-pane__weights">
                {this.renderWeight("Carrying Capacity", carryCapacity)}
                {this.renderWeight("Push, Drag, or Lift", pushDragLiftWeight)}
              </div>
              {this.renderWeightDistributions()}
              <Heading>Lifting and Carrying</Heading>
              <p>
                Your Strength score determines the amount of weight you can
                bear. The following terms define what you can lift or carry.
              </p>

              <p>
                Carrying Capacity. Your carrying capacity is your Strength score
                multiplied by 15. This is the weight (in pounds) that you can
                carry, which is high enough that most characters don't usually
                have to worry about it.
              </p>

              <p>
                Push, Drag, or Lift. You can push, drag, or lift a weight in
                pounds up to twice your carrying capacity (or 30 times your
                Strength score). While pushing or dragging weight in excess of
                your carrying capacity, your speed drops to 5 feet.
              </p>

              <p>
                Size and Strength. Larger creatures can bear more weight,
                whereas Tiny creatures can carry less. For each size category
                above Medium, double the creature's carrying capacity and the
                amount it can push, drag, or lift. For a Tiny creature, halve
                these weights.
              </p>
            </React.Fragment>
          )}
          {preferences.encumbranceType ===
            Constants.PreferenceEncumbranceTypeEnum.VARIANT && (
            <React.Fragment>
              <div className="ct-encumbrance-pane__weights">
                {this.renderWeight("Carrying Capacity", carryCapacity)}
                {this.renderWeight("Push, Drag, or Lift", pushDragLiftWeight)}
                {this.renderWeight("Encumbered Weight", encumberedWeight)}
                {this.renderWeight(
                  "Heavily Encumbered Weight",
                  heavilyEncumberedWeight
                )}
              </div>
              {this.renderWeightDistributions()}
              <Heading>Variant: Encumbrance</Heading>
              <p>
                The rules for lifting and carrying are intentionally simple.
                Here is a variant if you are looking for more detailed rules for
                determining how a character is hindered by the weight of
                equipment. When you use this variant, ignore the Strength column
                of the Armor table.
              </p>

              <p>
                If you carry weight in excess of 5 times your Strength score,
                you are encumbered, which means your speed drops by 10 feet.
              </p>

              <p>
                If you carry weight in excess of 10 times your Strength score,
                up to your maximum carrying capacity, you are instead heavily
                encumbered, which means your speed drops by 20 feet and you have
                disadvantage on ability checks, attack rolls, and saving throws
                that use Strength, Dexterity, or Constitution.
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    carryCapacity: rulesEngineSelectors.getCarryCapacity(state),
    pushDragLiftWeight: rulesEngineSelectors.getPushDragLiftWeight(state),
    encumberedWeight: rulesEngineSelectors.getEncumberedWeight(state),
    heavilyEncumberedWeight:
      rulesEngineSelectors.getHeavilyEncumberedWeight(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    coinWeight: rulesEngineSelectors.getCointainerCoinWeight(state),
    itemWeight: rulesEngineSelectors.getContainerItemWeight(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

export default connect(mapStateToProps)(EncumbrancePane);
