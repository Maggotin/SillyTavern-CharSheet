import React from "react";

import {
  CharacterNotes,
  Constants,
} from "@dndbeyond/character-rules-engine/es";

interface Props {
  notes: CharacterNotes;
  onClick?: () => void;
}
export default class OtherPossessions extends React.PureComponent<Props> {
  handlePossessionsManage = (evt: React.MouseEvent): void => {
    const { onClick } = this.props;

    if (onClick) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();
      onClick();
    }
  };

  render() {
    const { notes } = this.props;

    let notesData = notes[Constants.NoteKeyEnum.PERSONAL_POSSESSIONS];
    let hasContent: boolean = !!notesData;
    let content: React.ReactNode = hasContent
      ? notesData
      : "+ Add other possessions, treasure, or holdings for your character in this section.";

    let classNames: Array<string> = ["ct-other-possessions"];
    if (!hasContent) {
      classNames.push("ct-other-possessions--no-content");
    }

    return (
      <div
        className={classNames.join(" ")}
        onClick={this.handlePossessionsManage}
      >
        {content}
      </div>
    );
  }
}
