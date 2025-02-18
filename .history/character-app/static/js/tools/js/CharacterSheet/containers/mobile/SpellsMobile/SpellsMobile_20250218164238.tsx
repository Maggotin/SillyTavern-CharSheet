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
import MobileDivider from "../../../components/MobileDivider";
import SubsectionMobile from "../../../components/SubsectionMobile";
import { SheetAppState } from "../../../typings";
import Spells from "../../Spells";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class SpellsMobile extends React.PureComponent<Props> {
  handleManageSpellsOpen = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.SPELL_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionMobile>
        <MobileDivider
          label="Spells"
          onClick={this.handleManageSpellsOpen}
          isReadonly={isReadonly}
          theme={theme}
        />
        <section className="ct-spells-mobile">
          <h2 style={visuallyHidden}>Spells</h2>
          <Spells showNotes={false} />
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

const SpellsMobileContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <SpellsMobile {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SpellsMobileContainer);
