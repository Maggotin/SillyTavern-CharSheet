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
import Extras from "../../Extras";

interface Props {
  isReadonly: boolean;
  theme: CharacterTheme;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class ExtrasMobile extends React.PureComponent<Props> {
  handleManageOpen = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.EXTRA_MANAGE);
    }
  };

  render() {
    const { isReadonly, theme } = this.props;

    return (
      <SubsectionMobile>
        <MobileDivider
          label="Extras"
          onClick={this.handleManageOpen}
          isReadonly={isReadonly}
          theme={theme}
        />
        <section className="ct-extras-mobile">
          <h2 style={visuallyHidden}>Extras</h2>
          <Extras showNotes={false} />
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

const ExtrasMobileContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <ExtrasMobile paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(ExtrasMobileContainer);
