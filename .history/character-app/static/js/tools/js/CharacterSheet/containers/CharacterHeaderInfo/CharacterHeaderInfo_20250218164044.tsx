import React from "react";
import { connect } from "react-redux";

import { CharacterTidbits } from "@dndbeyond/character-components/es";
import {
  rulesEngineSelectors,
  CharacterPreferences,
  CharClass,
  Constants,
  ExperienceInfo,
  Race,
  RuleData,
  DecorationInfo,
} from "../../rules-engine/es";

import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { ThemeButton } from "../../../Shared/components/common/Button";
import { appEnvSelectors } from "../../../Shared/selectors";
import { SheetAppState } from "../../typings";

interface Props {
  classes: Array<CharClass>;
  name: string;
  gender: string | null;
  species: Race | null;
  deathCause: Constants.DeathCauseEnum;
  ruleData: RuleData;
  xpInfo: ExperienceInfo;
  preferences: CharacterPreferences;
  decorationInfo: DecorationInfo;
  isReadonly: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class CharacterHeaderInfo extends React.PureComponent<Props, {}> {
  handleInfoClick = (evt: React.MouseEvent): void => {
    const { paneHistoryStart } = this.props;

    evt.nativeEvent.stopImmediatePropagation();

    paneHistoryStart(PaneComponentEnum.CHARACTER_MANAGE);
  };

  render() {
    const {
      deathCause,
      name,
      classes,
      gender,
      xpInfo,
      species,
      preferences,
      ruleData,
      decorationInfo,
      isReadonly,
    } = this.props;

    return (
      <div className="ct-character-header-info">
        <div
          className="ct-character-header-info__content"
          onClick={this.handleInfoClick}
        >
          <CharacterTidbits
            classes={classes}
            decorationInfo={decorationInfo}
            name={name}
            gender={gender}
            species={species}
            deathCause={deathCause}
            preferences={preferences}
            ruleData={ruleData}
            xpInfo={xpInfo}
            isInteractive={!isReadonly}
            calloutNode={
              <ThemeButton size="small" style="outline">
                Manage
              </ThemeButton>
            }
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    name: rulesEngineSelectors.getName(state),
    gender: rulesEngineSelectors.getGender(state),
    species: rulesEngineSelectors.getRace(state),
    classes: rulesEngineSelectors.getClasses(state),
    xpInfo: rulesEngineSelectors.getExperienceInfo(state),
    deathCause: rulesEngineSelectors.getDeathCause(state),
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    decorationInfo: rulesEngineSelectors.getDecorationInfo(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const CharacterHeaderInfoContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <CharacterHeaderInfo paneHistoryStart={paneHistoryStart} {...props} />;
};

export default connect(mapStateToProps)(CharacterHeaderInfoContainer);
