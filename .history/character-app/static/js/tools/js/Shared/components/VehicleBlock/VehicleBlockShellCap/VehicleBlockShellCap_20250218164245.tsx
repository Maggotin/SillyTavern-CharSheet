import React from "react";

import { Constants } from "../../character-rules-engine/es";

import { VehicleDisplayTypeComponentLookup } from "../../../utils/Component";
import VehicleBlockShellCapInfernal from "../VehicleBlockShellCapInfernal";
import VehicleBlockShellCapShip from "../VehicleBlockShellCapShip";

interface Props {
  displayType: Constants.VehicleConfigurationDisplayTypeEnum;
  invertY: boolean;
  invertX: boolean;
}
export default class VehicleBlockShellCap extends React.PureComponent<Props> {
  static defaultProps = {
    invertX: false,
    invertY: false,
  };

  render() {
    const { displayType, ...restProps } = this.props;

    let lookup: VehicleDisplayTypeComponentLookup = {
      [Constants.VehicleConfigurationDisplayTypeEnum.SHIP]:
        VehicleBlockShellCapShip,
      [Constants.VehicleConfigurationDisplayTypeEnum.INFERNAL_WAR_MACHINE]:
        VehicleBlockShellCapInfernal,
      [Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER]:
        VehicleBlockShellCapShip,
    };

    //sets Ship style as default
    let CapComponent: React.ComponentType<any> = VehicleBlockShellCapShip;

    if (lookup.hasOwnProperty(displayType)) {
      CapComponent = lookup[displayType];
    }

    return (
      <CapComponent className="ct-vehicle-block__shell-cap" {...restProps} />
    );
  }
}
