import { orderBy } from "lodash";
import React from "react";

import {
  Constants,
  FormatUtils,
  VehicleComponentSpeedModeInfo,
} from "../../rules-engine/es";

import { GD_VehicleBlockPrimaryComponentProps } from "../../../utils/Component";
import InlineSeparatedNodes from "../../common/InlineSeparatedNodes";
import { VehicleBlockAttribute } from "../VehicleBlockAttribute";

interface Props extends GD_VehicleBlockPrimaryComponentProps {
  shouldCoalesce: boolean;
  coverType: string | null;
  requiredCrew?: number | null;
  count: number;
}
export default class VehicleBlockPrimaryAttributes extends React.PureComponent<Props> {
  //this class renders on VehicleBlock and VehicleComponent and VehicleActionStation
  static defaultProps = {
    shouldCoalesce: true,
    coverType: null,
    requiredCrew: null,
    count: 1,
  };

  renderHitPointInfo = (): React.ReactNode => {
    const { hitPointInfo, count, shouldCoalesce } = this.props;

    if (hitPointInfo === null) {
      return null;
    }

    if (hitPointInfo.totalHp === null) {
      return "--";
    }

    let currentHpNode: React.ReactNode = null;
    if (shouldCoalesce) {
      currentHpNode = hitPointInfo.totalHp;
      if (count > 1) {
        currentHpNode = `${hitPointInfo.totalHp} each`;
      }
    } else {
      let classNames: Array<string> = ["ct-vehicle-block-component__hp-value"];

      const remainingHp: number =
        hitPointInfo.remainingHp !== null
          ? hitPointInfo.remainingHp
          : hitPointInfo.totalHp;
      if (remainingHp < hitPointInfo.totalHp) {
        classNames.push("ct-vehicle-block-component__hp-value--is-damaged");
      }

      let showFullHitPointInfo: boolean = !shouldCoalesce;

      currentHpNode = (
        <React.Fragment>
          {showFullHitPointInfo && (
            <React.Fragment>
              <span className={classNames.join(" ")}>{remainingHp}</span>
              <span className="ct-vehicle-block-component__hp-sep">/</span>
            </React.Fragment>
          )}
          <span className={classNames.join(" ")}>{hitPointInfo.totalHp}</span>
        </React.Fragment>
      );
    }

    let displayNodes: Array<React.ReactNode> = [currentHpNode];

    if (hitPointInfo.hitPointSpeedAdjustments.length > 0) {
      hitPointInfo.hitPointSpeedAdjustments.forEach((adjustment) => {
        let speed: string = FormatUtils.renderDistance(
          adjustment.perDamageValue
        );
        displayNodes.push(
          `${speed} speed per ${adjustment.perDamageTaken} damage taken`
        );
      });
    }

    return <InlineSeparatedNodes nodes={displayNodes} sep={"; "} />;
  };

  renderHitPointThresholdInfo = (): React.ReactNode => {
    const { hitPointInfo } = this.props;

    if (hitPointInfo === null) {
      return null;
    }

    let displayStrings: Array<string> = [];

    if (hitPointInfo.damageThreshold) {
      displayStrings.push(`damage threshold ${hitPointInfo.damageThreshold}`);
    }

    if (hitPointInfo.mishapThreshold) {
      displayStrings.push(`mishap threshold ${hitPointInfo.mishapThreshold}`);
    }

    if (displayStrings.length === 0) {
      return null;
    }

    return `(${displayStrings.join(", ")})`;
  };

  renderSpeedInfo = (
    modes: Array<VehicleComponentSpeedModeInfo>
  ): React.ReactNode => {
    let speedDisplayStrings: Array<string> = modes.map((mode) => {
      const { value, description, restrictionsText, movementInfo } = mode;

      let stringParts: Array<string> = [];
      if (movementInfo) {
        stringParts.push(`${movementInfo.description} speed`);
      }
      stringParts.push(FormatUtils.renderDistance(value));
      if (description) {
        stringParts.push(description);
      }
      if (restrictionsText) {
        stringParts.push(`(${restrictionsText})`);
      }

      return stringParts.join(" ");
    });

    return <InlineSeparatedNodes nodes={speedDisplayStrings} sep={"; "} />;
  };

  renderArmorClassAttribute = (): React.ReactNode => {
    const { armorClassInfo } = this.props;

    if (armorClassInfo === null) {
      return null;
    }

    const { moving, base, description } = armorClassInfo;

    let armorClassValue: number | null = base;
    let motionlessArmorClassValue: string | null = null;

    if (moving !== null) {
      armorClassValue = moving;

      if (moving !== base) {
        motionlessArmorClassValue = `(${base} while motionless)`;
      }
    }

    return (
      <VehicleBlockAttribute
        label="Armor Class"
        value={
          description
            ? `${armorClassValue} (${description})`
            : armorClassValue === 0
            ? "--"
            : armorClassValue
        }
        extraValue={motionlessArmorClassValue}
      />
    );
  };

  render() {
    const {
      armorClassInfo,
      hitPointInfo,
      speedInfos,
      coverType,
      requiredCrew,
      costInfos,
      displayType,
      isPrimaryComponent,
      width,
      length,
    } = this.props;

    //sort cost infos by type component then ammunition
    // const costInfos: Array<VehicleComponentCostContract> = [
    //     {
    //         description: 'cannon',
    //         type: 'component',
    //         value: null,
    //     },
    //     {
    //         description: 'giant iron ball',
    //         type: 'ammunition',
    //         value: 1000,
    //     },
    // ];

    const sortedCosts = orderBy(
      costInfos,
      [
        (cost) => cost.type === Constants.ComponentCostTypeEnum.COMPONENT,
        (cost) => cost.type === Constants.ComponentCostTypeEnum.AMMUNITION,
      ],
      "desc"
    );

    const costValues: Array<string> = sortedCosts.map((cost) => {
      const value: string = cost.value ? `${cost.value} gp` : "--";
      const description: string = cost.description
        ? `(${cost.description})`
        : "";

      return [value, description].join(" ");
    });

    const isSpelljammer =
      displayType === Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER;

    return (
      <React.Fragment>
        {armorClassInfo !== null && this.renderArmorClassAttribute()}
        {hitPointInfo !== null && (
          <VehicleBlockAttribute
            label="Hit Points"
            value={this.renderHitPointInfo()}
            extraValue={
              !isSpelljammer ? this.renderHitPointThresholdInfo() : undefined
            }
          />
        )}
        {isSpelljammer && !!hitPointInfo?.damageThreshold && (
          <VehicleBlockAttribute
            label="Damage Threshold"
            value={hitPointInfo?.damageThreshold}
          />
        )}
        {speedInfos.map((speedInfo, idx) => {
          let speedAttributeLabel: string = "Speed";
          if (speedInfo.type !== null && !isSpelljammer) {
            speedAttributeLabel = `Speed (${speedInfo.type})`;
          }

          let modes: Array<VehicleComponentSpeedModeInfo> =
            speedInfo.modes !== null ? speedInfo.modes : [];

          return (
            <VehicleBlockAttribute
              key={`${speedInfo.type}-${idx}`}
              label={speedAttributeLabel}
              value={this.renderSpeedInfo(modes)}
            />
          );
        })}
        {coverType !== null && (
          <VehicleBlockAttribute
            label="Cover"
            value={`Grants ${coverType} Cover`}
          />
        )}
        {requiredCrew !== null && !isSpelljammer && (
          <VehicleBlockAttribute label="Required Crew" value={requiredCrew} />
        )}
        {isPrimaryComponent &&
          isSpelljammer &&
          length !== null &&
          width !== null && (
            <VehicleBlockAttribute
              label="Keel/Beam"
              value={`${FormatUtils.renderDistance(
                length
              )} / ${FormatUtils.renderDistance(width)}`}
            />
          )}
        {costValues.length > 0 && (
          <VehicleBlockAttribute label="Cost" value={costValues.join(", ")} />
        )}
      </React.Fragment>
    );
  }
}
