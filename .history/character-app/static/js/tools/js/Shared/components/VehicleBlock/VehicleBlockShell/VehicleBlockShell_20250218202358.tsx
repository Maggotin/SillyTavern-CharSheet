import React from "react";

import { Constants } from "@dndbeyond/character-rules-engine/es";

import { GD_VehicleBlockShellProps } from "../../../utils/Component";
import VehicleBlockShellCap from "../VehicleBlockShellCap";

interface Props extends GD_VehicleBlockShellProps {}

export default class VehicleBlockShell extends React.PureComponent<Props> {
  render() {
    const { children, displayType } = this.props;

    let type: string | null = null;

    switch (displayType) {
      case Constants.VehicleConfigurationDisplayTypeEnum.INFERNAL_WAR_MACHINE:
        type = "infernal";
        break;
      case Constants.VehicleConfigurationDisplayTypeEnum.SHIP:
      default:
        type = "ship";
        break;
    }

    return (
      <div className="ct-vehicle-block">
        <VehicleBlockShellCap displayType={displayType} />
        <div
          className={`ct-vehicle-block__blockstcs-vehicle-block__block--${type}`}
        >
          {children}
        </div>
        <VehicleBlockShellCap displayType={displayType} invertY={true} />
      </div>
    );
  }
}
