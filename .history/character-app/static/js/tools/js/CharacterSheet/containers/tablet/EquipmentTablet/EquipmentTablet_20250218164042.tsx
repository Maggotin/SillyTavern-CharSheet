import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../../Shared/selectors";
import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import { SheetAppState } from "../../../typings";
import Equipment from "../../Equipment";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class EquipmentTablet extends React.PureComponent<Props> {
  handleManageClick = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.EQUIPMENT_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionTablet>
        <TabletBox
          header="Inventory"
          className="ct-equipment-tablet"
          onHeaderClick={this.handleManageClick}
          isReadonly={isReadonly}
          theme={theme}
        >
          <section>
            <h2 style={visuallyHidden}>Inventory</h2>
            <Equipment />
          </section>
        </TabletBox>
      </SubsectionTablet>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const EquipmentTabletContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  return <EquipmentTablet {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(EquipmentTabletContainer);
