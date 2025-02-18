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
import MobileDivider from "../../../components/MobileDivider";
import SubsectionMobile from "../../../components/SubsectionMobile";
import { SheetAppState } from "../../../typings";
import { Equipment } from "../../Equipment";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class EquipmentMobile extends React.PureComponent<Props> {
  handleManageClick = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.EQUIPMENT_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionMobile>
        <MobileDivider
          label="Inventory"
          onClick={this.handleManageClick}
          isReadonly={isReadonly}
          theme={theme}
        />
        <section className="ct-equipment-mobile">
          <h2 style={visuallyHidden}>Inventory</h2>
          <Equipment showNotes={false} />
        </section>
        <MobileDivider isEnd={true} theme={theme} />
      </SubsectionMobile>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    isReadonly: appEnvSelectors.getIsReadonly(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

const EquipmentMobileContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <EquipmentMobile paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(EquipmentMobileContainer);
