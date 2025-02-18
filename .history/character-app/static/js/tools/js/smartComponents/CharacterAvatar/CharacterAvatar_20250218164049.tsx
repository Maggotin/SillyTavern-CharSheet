import * as React from "react";

import { AvatarInfo } from "../../rules-engine/es";

import CharacterAvatarPortrait from "./CharacterAvatarPortrait";

interface Props {
  avatarInfo: AvatarInfo;
  className: string;
}
export default class CharacterAvatar extends React.PureComponent<Props, {}> {
  static defaultProps = {
    className: "",
  };

  render() {
    const { avatarInfo, className } = this.props;

    const classNames: Array<string> = ["ddbc-character-avatar", className];
    if (avatarInfo.frameId) {
      classNames.push(`ddbc-character-avatar--${avatarInfo.frameId}`);
    }
    let animatedStyles: React.CSSProperties = {};
    if (avatarInfo.frameAvatarDecorationKey) {
      const [name, style, animationUrl] =
        avatarInfo.frameAvatarDecorationKey.split("|");
      name && classNames.push(`ddbc-character-avatar--${name}`);
      style && classNames.push(`ddbc-character-avatar--${style}`);
      if (animationUrl) {
        classNames.push(`ddbc-character-avatar--animated`);
        // NOTE: using the backround key for all of these did not work well so they are separated
        animatedStyles = {
          backgroundImage: `url(https://www.dndbeyond.com/attachments/${animationUrl}.png)`,
          backgroundPositionX: "0px",
          backgroundPositionY: "0px",
          backgroundRepeat: "no-repeat",
          backgroundSize: `1240px 1240px`,
        };
      }
    }

    let frameStyles: React.CSSProperties = {};
    if (avatarInfo.frameUrl) {
      frameStyles = {
        backgroundImage: `url(${avatarInfo.frameUrl})`,
      };
    }

    return (
      <div className={classNames.join(" ")}>
        <CharacterAvatarPortrait avatarUrl={avatarInfo.avatarUrl} />
        {avatarInfo.frameId && (
          <div className={"ddbc-character-avatar__frame"} style={frameStyles} />
        )}
        {avatarInfo.frameId && (
          <div className={"ddbc-character-avatar__frame-extra1"}>
            <div
              className="ddbc-character-avatar__frame-extra-content ddbc-character-avatar__frame-extra1-content"
              style={animatedStyles}
            />
          </div>
        )}
        {avatarInfo.frameId && (
          <div className={"ddbc-character-avatar__frame-extra2"}>
            <div className="ddbc-character-avatar__frame-extra-content ddbc-character-avatar__frame-extra2-content" />
          </div>
        )}
        {avatarInfo.frameId && (
          <div className={"ddbc-character-avatar__frame-extra3"}>
            <div className="ddbc-character-avatar__frame-extra-content ddbc-character-avatar__frame-extra3-content" />
          </div>
        )}
      </div>
    );
  }
}
