import * as React from "react";

import {
  CharacterPreferences,
  CharClass,
  Constants,
  DecorationInfo,
  DecorationUtils,
  ExperienceInfo,
  Race,
  RuleData,
} from "@dndbeyond/character-rules-engine/es";

import { DefaultCharacterName as DefaultName } from "~/constants";

import CharacterAvatar from "../CharacterAvatar";
import CharacterName from "../CharacterName";
import CharacterProgressionSummary from "../CharacterProgressionSummary";
import CharacterSummary from "../CharacterSummary";

interface Props {
  classes: Array<CharClass>;
  name: string;
  gender: string | null;
  species: Race | null;
  decorationInfo: DecorationInfo;
  deathCause: Constants.DeathCauseEnum;
  preferences: CharacterPreferences;
  ruleData: RuleData;
  xpInfo: ExperienceInfo;
  isInteractive: boolean;
  defaultCharacterName: string;
  className: string;
  calloutNode?: React.ReactNode;
}
export default class CharacterTidbits extends React.PureComponent<Props, {}> {
  static defaultProps = {
    deathCause: Constants.DeathCauseEnum.NONE,
    isInteractive: true,
    className: "",
    defaultCharacterName: DefaultName,
  };

  render() {
    const {
      name,
      classes,
      gender,
      species,
      decorationInfo,
      deathCause,
      preferences,
      ruleData,
      xpInfo,
      defaultCharacterName,
      isInteractive,
      className,
      calloutNode,
    } = this.props;

    let classNames: Array<string> = [className, "ddbc-character-tidbits"];

    if (isInteractive) {
      classNames.push("ddbc-character-tidbits--is-interactive");
    }

    return (
      <div className={classNames.join(" ")}>
        <div className="ddbc-character-tidbits__avatar">
          <CharacterAvatar
            avatarInfo={DecorationUtils.getAvatarInfo(decorationInfo)}
          />
        </div>
        <div className="ddbc-character-tidbits__body">
          <div className="ddbc-character-tidbits__heading">
            <CharacterName
              name={name}
              isDead={deathCause !== Constants.DeathCauseEnum.NONE}
              defaultCharacterName={defaultCharacterName}
            />
            {isInteractive && calloutNode && (
              <div className="ddbc-character-tidbits__menu-callout">
                {calloutNode}
              </div>
            )}
          </div>
          <div className="ddbc-character-tidbits__meta">
            <CharacterSummary
              classes={classes}
              species={species}
              gender={gender}
            />
          </div>
          {xpInfo && ruleData && (
            <div className="ddbc-character-tidbits__progression">
              <CharacterProgressionSummary
                ruleData={ruleData}
                progressionType={preferences.progressionType}
                xpInfo={xpInfo}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
