import { visuallyHidden } from "@mui/utils";
import React from "react";
import { connect } from "react-redux";

import {
  CharacterNotes,
  Constants,
  rulesEngineSelectors,
} from "../../character-rules-engine/es";

import { TabFilter } from "~/components/TabFilter";
import { PaneInfo, useSidebar } from "~/contexts/Sidebar/Sidebar";
import { PaneComponentEnum } from "~/subApps/sheet/components/Sidebar/types";

import { appEnvSelectors } from "../../../Shared/selectors";
import { PaneIdentifierUtils } from "../../../Shared/utils";
import ContentGroup from "../../components/ContentGroup";
import { SheetAppState } from "../../typings";

interface NotesProps {
  notes: CharacterNotes;
  isReadonly: boolean;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
class Notes extends React.PureComponent<NotesProps> {
  handleNotesManage = (
    noteType: Constants.NoteKeyEnum,
    evt: React.MouseEvent
  ): void => {
    const { paneHistoryStart, isReadonly } = this.props;

    if (!isReadonly) {
      evt.stopPropagation();
      evt.nativeEvent.stopImmediatePropagation();

      paneHistoryStart(
        PaneComponentEnum.NOTE_MANAGE,
        PaneIdentifierUtils.generateNote(noteType)
      );
    }
  };

  renderNoteGroup(
    label: string,
    key: Constants.NoteKeyEnum,
    fallback: string = ""
  ) {
    const { notes } = this.props;

    let noteData = notes[key];
    let hasContent: boolean = !!noteData;
    let content: string = !!noteData ? noteData : fallback;

    let classNames: Array<string> = ["ct-notes__note"];
    if (!hasContent) {
      classNames.push("ct-notes__note--no-content");
    }

    return (
      <ContentGroup header={label}>
        <div
          className={classNames.join(" ")}
          onClick={this.handleNotesManage.bind(this, key)}
        >
          {content}
        </div>
      </ContentGroup>
    );
  }

  render() {
    return (
      <section className="ct-notes">
        <h2 style={visuallyHidden}>Notes</h2>
        <TabFilter
          filters={[
            {
              label: "Orgs",
              content: this.renderNoteGroup(
                "Organizations",
                Constants.NoteKeyEnum.ORGANIZATIONS,
                "+ Add Organizations"
              ),
            },
            {
              label: "Allies",
              content: this.renderNoteGroup(
                "Allies",
                Constants.NoteKeyEnum.ALLIES,
                "+ Add Allies"
              ),
            },
            {
              label: "Enemies",
              content: this.renderNoteGroup(
                "Enemies",
                Constants.NoteKeyEnum.ENEMIES,
                "+ Add Enemies"
              ),
            },
            {
              label: "Backstory",
              content: this.renderNoteGroup(
                "Backstory",
                Constants.NoteKeyEnum.BACKSTORY,
                "+ Add Backstory"
              ),
            },
            {
              label: "Other",
              content: this.renderNoteGroup(
                "Other",
                Constants.NoteKeyEnum.OTHER,
                "+ Add Other"
              ),
            },
          ]}
        />
      </section>
    );
  }
}

function mapStateToProps(state: SheetAppState) {
  return {
    notes: rulesEngineSelectors.getCharacterNotes(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
  };
}

const NotesContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();
  return <Notes {...props} paneHistoryStart={paneHistoryStart} />;
};

export default connect(mapStateToProps)(NotesContainer);
