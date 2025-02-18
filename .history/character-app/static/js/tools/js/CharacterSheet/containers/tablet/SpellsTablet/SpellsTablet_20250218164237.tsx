import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect } from "react-redux";

import {
  CharacterTheme,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../../Shared/selectors";
import SubsectionTablet from "../../../components/SubsectionTablet";
import TabletBox from "../../../components/TabletBox";
import { SheetAppState } from "../../../typings";
import Spells from "../../Spells";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class SpellsTablet extends React.PureComponent<Props> {
  handleManageSpellsOpen = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.SPELL_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionTablet>
        <TabletBox
          header="Spells"
          onHeaderClick={this.handleManageSpellsOpen}
          className="ct-spells-tablet"
          isReadonly={isReadonly}
          theme={theme}
        >
          <section>
            <h2 style={visuallyHidden}>Spells</h2>
            <Spells />
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

const SpellsTabletContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <SpellsTablet {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SpellsTabletContainer);
