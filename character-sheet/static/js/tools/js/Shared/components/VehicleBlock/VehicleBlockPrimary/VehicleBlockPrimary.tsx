import React from "react";

import {
  Constants,
  CoreUtils,
  FormatUtils,
} from "@dndbeyond/character-rules-engine/es";

import { GD_VehicleBlockPrimaryProps } from "../../../utils/Component";
import { VehicleBlockAttribute } from "../VehicleBlockAttribute";
import VehicleBlockPrimaryAttributes from "../VehicleBlockPrimaryAttributes";
import VehicleBlockSeparator from "../VehicleBlockSeparator";

interface Props extends GD_VehicleBlockPrimaryProps {
  shouldCoalesce: boolean;
}

export default class VehicleBlockPrimary extends React.PureComponent<Props> {
  renderDamageImmunities = (): React.ReactNode => {
    const { damageImmunities } = this.props;

    if (damageImmunities.length === 0) {
      return null;
    }

    return (
      <div className="ct-vehicle-block__tidbit">
        <span className="ct-vehicle-block__tidbit-label">
          Damage Immunities
        </span>
        <span className="ct-vehicle-block__tidbit-data">
          {damageImmunities.join(", ")}
        </span>
      </div>
    );
  };

  renderConditionImmunities = (): React.ReactNode => {
    const { conditionImmunities } = this.props;

    if (conditionImmunities.length === 0) {
      return null;
    }

    return (
      <div className="ct-vehicle-block__tidbit">
        <span className="ct-vehicle-block__tidbit-label">
          Condition Immunities
        </span>
        <span className="ct-vehicle-block__tidbit-data">
          {conditionImmunities.join(", ")}
        </span>
      </div>
    );
  };

  renderStats = (): React.ReactNode => {
    const { stats, displayType } = this.props;

    if (stats.length === 0) {
      return null;
    }

    return (
      <>
        <div className="ct-vehicle-block__abilities">
          {stats.map((stat) => {
            let modifier = stat.modifier !== null ? stat.modifier : 0;
            let statKey = stat.statKey !== null ? stat.statKey : "";
            let score = stat.score !== null ? stat.score : 0;

            return (
              <div
                className={`ct-vehicle-block__ability-stat ct-vehicle-block__ability-stat--${statKey.toLowerCase()}`}
                key={statKey}
              >
                <div className="ct-vehicle-block__ability-heading">
                  {statKey}
                </div>
                <div className="ct-vehicle-block__ability-data">
                  <span className="ct-vehicle-block__ability-score">
                    {score}
                  </span>
                  {score !== 0 && (
                    <span className="ct-vehicle-block__ability-modifier">
                      ({FormatUtils.renderSignedNumber(modifier)})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <VehicleBlockSeparator displayType={displayType} />
      </>
    );
  };

  renderEffectiveTravelDistance = (): React.ReactNode => {
    const { travelPaceInfo } = this.props;

    if (travelPaceInfo === null || travelPaceInfo.effectiveHours === null) {
      return null;
    }

    const effectiveDistance: number =
      CoreUtils.convertFeetToMiles(travelPaceInfo.pace) *
      travelPaceInfo.effectiveHours;

    return `(${effectiveDistance} ${
      effectiveDistance === 1 ? "mile" : "miles"
    } per day)`;
  };

  renderAttributes = (): React.ReactNode => {
    const {
      creatureCapacityDescriptions,
      cargoCapacityInfo,
      travelPaceInfo,
      primaryProperties,
      shouldCoalesce,
      displayType,
    } = this.props;

    let cargoCapacity: Array<string> = [];
    if (cargoCapacityInfo.weight !== null) {
      let weight: string =
        cargoCapacityInfo.weight >= Constants.POUNDS_IN_TON
          ? FormatUtils.renderWeightTons(cargoCapacityInfo.weight)
          : `${FormatUtils.renderWeight(cargoCapacityInfo.weight)}.`;

      cargoCapacity.push(weight);
    }

    if (cargoCapacityInfo.description) {
      cargoCapacity.push(cargoCapacityInfo.description);
    }

    const isSpelljammer =
      displayType === Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;

    return (
      <>
        <div className="ct-vehicle-block__attributes">
          {primaryProperties !== null && (
            <VehicleBlockPrimaryAttributes
              armorClassInfo={primaryProperties.armorClassInfo}
              hitPointInfo={primaryProperties.hitPointInfo}
              speedInfos={primaryProperties.speedInfos}
              costInfos={primaryProperties.costInfos}
              shouldCoalesce={shouldCoalesce}
              displayType={primaryProperties.displayType}
              width={primaryProperties.width}
              length={primaryProperties.length}
              isPrimaryComponent={primaryProperties.isPrimaryComponent}
            />
          )}
          {travelPaceInfo !== null && (
            <VehicleBlockAttribute
              label="Travel Pace"
              value={`${FormatUtils.renderDistance(
                travelPaceInfo.pace
              )} per hour`}
              extraValue={this.renderEffectiveTravelDistance()}
            />
          )}
          <VehicleBlockAttribute
            label={isSpelljammer ? "Crew" : "Creature Capacity"}
            value={creatureCapacityDescriptions.join(", ")}
          />
          {cargoCapacity.length > 0 && (
            <VehicleBlockAttribute
              label={isSpelljammer ? "Cargo" : "Cargo Capacity"}
              value={cargoCapacity.join(", ")}
            />
          )}
        </div>
        {!isSpelljammer && <VehicleBlockSeparator displayType={displayType} />}
      </>
    );
  };

  renderConditionsAndImmunities() {
    const { displayType, conditionImmunities, damageImmunities } = this.props;

    return conditionImmunities.length === 0 &&
      damageImmunities.length === 0 ? null : (
      <>
        <div className="ct-vehicle-block__tidbits">
          {this.renderDamageImmunities()}
          {this.renderConditionImmunities()}
        </div>
        <VehicleBlockSeparator displayType={displayType} />
      </>
    );
  }

  render() {
    const { displayType } = this.props;

    return (
      <div className="ct-vehicle-block__primary">
        <VehicleBlockSeparator displayType={displayType} />
        {this.renderAttributes()}
        {this.renderStats()}
        {this.renderConditionsAndImmunities()}
      </div>
    );
  }
}
