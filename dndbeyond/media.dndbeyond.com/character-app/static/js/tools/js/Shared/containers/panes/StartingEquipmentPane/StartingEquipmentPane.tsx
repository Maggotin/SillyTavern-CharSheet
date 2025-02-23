import React from "react";
import { connect } from "react-redux";

import { SharedAppState } from "../../../stores/typings";
import StartingEquipment from "../../StartingEquipment";

class StartingEquipmentPane extends React.PureComponent {
  render() {
    return (
      <div className="ct-starting-equipment-pane">
        <StartingEquipment />
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {};
}

export default connect(mapStateToProps)(StartingEquipmentPane);
