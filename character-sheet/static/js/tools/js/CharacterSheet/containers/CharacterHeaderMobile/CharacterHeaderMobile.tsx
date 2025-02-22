import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  rulesEngineSelectors,
  characterActions,
  characterSelectors,
  CharacterStatusSlug,
  Constants,
  HitPointInfo,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import StatusSummaryMobile from "../../components/StatusSummaryMobile";
import WatchTourDialog from "../../components/WatchTourDialog";
import { SheetAppState } from "../../typings";
import CharacterHeaderInfo from "../CharacterHeaderInfo";

interface Props extends DispatchProp {
  hitPointInfo: HitPointInfo;
  fails: number;
  successes: number;
  deathCause: Constants.DeathCauseEnum;
  inspiration: boolean;
  ruleData: RuleData;
  isReadonly: boolean;
  status: CharacterStatusSlug | null;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class CharacterHeaderMobile extends React.PureComponent<Props> {
  handleHealthSummaryClick = (): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      paneHistoryStart(PaneComponentEnum.HEALTH_MANAGE);
    }
  };

  handleInspirationClick = (): void => {
    const { inspiration, dispatch } = this.props;

    dispatch(characterActions.inspirationSet(!inspiration));
  };

  render() {
    const {
      hitPointInfo,
      fails,
      successes,
      deathCause,
      inspiration,
      ruleData,
      isReadonly,
      status,
    } = this.props;

    return (
      <div className="ct-character-header-mobile">
        <div className="ct-character-header-mobile__group ct-character-header-mobile__group-tidbits">
          <CharacterHeaderInfo />
        </div>
        <div className="ct-character-header-mobile__group ct-character-header-mobile__group--gap" />
        {isReadonly && status === CharacterStatusSlug.PREMADE ? (
          <div>
            <WatchTourDialog />
          </div>
        ) : (
          <div className="ct-character-header-mobile__group ct-character-header-mobile__group--summary">
            <StatusSummaryMobile
              hitPointInfo={hitPointInfo}
              fails={fails}
              successes={successes}
              deathCause={deathCause}
              inspiration={inspiration}
              ruleData={ruleData}
              onHealthClick={this.handleHealthSummaryClick}
              onInspirationClick={this.handleInspirationClick}
              isInteractive={!isReadonly}
            />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    hitPointInfo: rulesEngineSelectors.getHitPointInfo(state),
    fails: rulesEngineSelectors.getDeathSavesFailCount(state),
    successes: rulesEngineSelectors.getDeathSavesSuccessCount(state),
    inspiration: rulesEngineSelectors.getInspiration(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    deathCause: rulesEngineSelectors.getDeathCause(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    status: characterSelectors.getStatusSlug(state),
  };
}

const CharacterHeaderMobileContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return (
    <CharacterHeaderMobile paneHistoryStart={paneHistoryStart} {...props} />
  );
};

export default connect(mapStateToProps)(CharacterHeaderMobileContainer);
