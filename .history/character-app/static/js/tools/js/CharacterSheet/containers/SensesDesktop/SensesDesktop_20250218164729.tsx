import React from "react";
import { connect } from "react-redux";

import { ManageIcon } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  rulesEngineSelectors,
  SenseInfo,
} from "../../character-rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import {
  Subsection,
  SubsectionFooter,
} from "../../../Shared/components/Subsection";
import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import SensesBox from "../../components/SensesBox";
import { SheetAppState } from "../../typings";

interface Props {
  passivePerception: number;
  passiveInvestigation: number;
  passiveInsight: number;
  senses: SenseInfo;
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  isReadonly: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class SensesDesktop extends React.PureComponent<Props> {
  handleManageShow = (): void => {
    const { paneHistoryStart } = this.props;

    paneHistoryStart(PaneComponentEnum.SENSE_MANAGE);
  };

  render() {
    const {
      passiveInsight,
      passiveInvestigation,
      passivePerception,
      senses,
      isReadonly,
      dimensions,
      theme,
    } = this.props;

    return (
      <Subsection name="Senses" className="ct-senses-desktop">
        <SensesBox
          senses={senses}
          passiveInsight={passiveInsight}
          passiveInvestigation={passiveInvestigation}
          passivePerception={passivePerception}
          onClick={this.handleManageShow}
          dimensions={dimensions}
          theme={theme}
        />
        <SubsectionFooter>
          <ManageIcon
            onClick={this.handleManageShow}
            tooltip={isReadonly ? "View" : "Manage"}
            theme={theme}
          >
            Senses
          </ManageIcon>
        </SubsectionFooter>
      </Subsection>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    passivePerception: rulesEngineSelectors.getPassivePerception(state),
    passiveInvestigation: rulesEngineSelectors.getPassiveInvestigation(state),
    passiveInsight: rulesEngineSelectors.getPassiveInsight(state),
    senses: rulesEngineSelectors.getSenseInfo(state),
    dimensions: appEnvSelectors.getDimensions(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const SensesDesktopContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <SensesDesktop {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(SensesDesktopContainer);
