import React from "react";

import { GD_VehicleBlockActionsProps } from "../../../utils/Component";
import VehicleBlockAction from "../VehicleBlockAction";
import VehicleBlockSectionHeader from "../VehicleBlockSectionHeader";

interface Props extends GD_VehicleBlockActionsProps {}
export default class VehicleBlockActions extends React.PureComponent<Props> {
  static defaultProps = {
    reactions: [],
    bonusActions: [],
    special: [],
  };

  render() {
    const { reactions, bonusActions, special } = this.props;

    if (
      reactions.length === 0 &&
      bonusActions.length === 0 &&
      special.length === 0
    ) {
      return null;
    }

    return (
      <React.Fragment>
        {reactions.length > 0 && (
          <React.Fragment>
            <VehicleBlockSectionHeader label="Reactions" />
            {reactions.map((action) => (
              <VehicleBlockAction action={action} key={action.key} />
            ))}
          </React.Fragment>
        )}
        {bonusActions.length > 0 && (
          <React.Fragment>
            <VehicleBlockSectionHeader label="Bonus Actions" />
            {bonusActions.map((action) => (
              <VehicleBlockAction action={action} key={action.key} />
            ))}
          </React.Fragment>
        )}
        {special.length > 0 && (
          <React.Fragment>
            <VehicleBlockSectionHeader label="Special Actions" />
            {special.map((action) => (
              <VehicleBlockAction action={action} key={action.key} />
            ))}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
