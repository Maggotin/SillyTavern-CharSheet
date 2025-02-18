import React from "react";
import { connect } from "react-redux";

import { ManageIcon } from "@dndbeyond/character-components/es";
import {
  CharacterTheme,
  ProficiencyGroup,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import {
  Subsection,
  SubsectionFooter,
} from "../../../Shared/components/Subsection";
import { appEnvSelectors } from "../../../Shared/selectors";
import { AppEnvDimensionsState } from "../../../Shared/stores/typings";
import ProficiencyGroupsBox from "../../components/ProficiencyGroupsBox";
import { SheetAppState } from "../../typings";

interface Props {
  dimensions: AppEnvDimensionsState;
  theme: CharacterTheme;
  proficiencyGroups: Array<ProficiencyGroup>;
  isReadonly: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class ProficiencyGroupsDesktop extends React.PureComponent<Props> {
  handleManageShow = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.PROFICIENCIES);
    }
  };

  render() {
    const { dimensions, theme, proficiencyGroups, isReadonly } = this.props;

    return (
      <Subsection name="Proficiency Groups">
        <ProficiencyGroupsBox
          dimensions={dimensions}
          theme={theme}
          proficiencyGroups={proficiencyGroups}
          onClick={this.handleManageShow}
        />
        <SubsectionFooter>
          <ManageIcon
            onClick={this.handleManageShow}
            showIcon={!isReadonly}
            enableTooltip={!isReadonly}
            theme={theme}
          >
            Proficiencies & Training
          </ManageIcon>
        </SubsectionFooter>
      </Subsection>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    dimensions: appEnvSelectors.getDimensions(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    proficiencyGroups: rulesEngineSelectors.getProficiencyGroups(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const ProficiencyGroupsDesktopContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <ProficiencyGroupsDesktop {...props} paneHistoryStart={paneHistoryStart} />
  );
};

export default connect(mapStateToProps)(ProficiencyGroupsDesktopContainer);
