import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement | HTMLImageElement> {
  className?: string;
  avatarUrl: string | null;
}

const CharacterAvatarPortrait: React.FC<Props> = ({
  className = "",
  avatarUrl,
  ...props
}) => {
  let portraitClasses: Array<string> = [
    "ddbc-character-avatar__portrait",
    className,
  ];
  let portraitStyles: React.CSSProperties = {};
  if (avatarUrl) {
    portraitStyles = {
      backgroundImage: `url(${avatarUrl})`,
    };
  } else {
    portraitClasses.push("ddbc-character-avatar__portrait--none");
  }

  return avatarUrl ? (
    <img
      className={portraitClasses.join(" ")}
      src={avatarUrl}
      alt="Character portrait"
      {...props}
    />
  ) : (
    <div
      className={portraitClasses.join(" ")}
      style={portraitStyles}
      {...props}
    />
  );
};

export default CharacterAvatarPortrait;
