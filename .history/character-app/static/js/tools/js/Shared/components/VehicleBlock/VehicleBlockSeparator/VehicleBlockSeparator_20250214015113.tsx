import React from "react";

import { Constants } from "@dndbeyond/character-rules-engine/es";

import { VehicleDisplayTypeComponentLookup } from "../../../utils/Component";
import VehicleBlockSeparatorInfernal from "../VehicleBlockSeparatorInfernal";
import VehicleBlockSeparatorShip from "../VehicleBlockSeparatorShip";

interface Props {
  displayType: Constants.VehicleConfigurationDisplayTypeEnum;
}
export default class VehicleBlockSeparator extends React.PureComponent<Props> {
  render() {
    const { displayType } = this.props;

    let lookup: VehicleDisplayTypeComponentLookup = {
      [Constants.VehicleConfigurationDisplayTypeEnum.SHIP]:
        VehicleBlockSeparatorShip,
      [Constants.VehicleConfigurationDisplayTypeEnum.INFERNAL_WAR_MACHINE]:
        VehicleBlockSeparatorInfernal,
      [Constants.VehicleConfigurationDisplayTypeEnum.SPELLJAMMER]:
        VehicleBlockSeparatorShip,
    };

    //sets Ship style as default
    let SeparatorComponent: React.ComponentType<any> =
      VehicleBlockSeparatorShip;

    if (lookup.hasOwnProperty(displayType)) {
      SeparatorComponent = lookup[displayType];
    }

    return <SeparatorComponent className="ct-vehicle-block__separator" />;
  }
}
