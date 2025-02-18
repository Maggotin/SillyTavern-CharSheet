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
import Extras from "../../Extras";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class ExtrasTablet extends React.PureComponent<Props> {
  handleManageOpen = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.EXTRA_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionTablet>
        <TabletBox
          header="Extras"
          onHeaderClick={this.handleManageOpen}
          className="ct-extras-tablet"
          isReadonly={isReadonly}
          theme={theme}
        >
          <section>
            <h2 style={visuallyHidden}>Extras</h2>
            <Extras />
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

const ExtrasTabletContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <ExtrasTablet {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(ExtrasTabletContainer);
