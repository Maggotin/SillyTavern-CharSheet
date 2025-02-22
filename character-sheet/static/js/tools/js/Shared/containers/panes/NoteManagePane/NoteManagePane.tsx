import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  characterActions,
  Constants,
  RuleDataUtils,
  rulesEngineSelectors,
  CharacterNotes,
} from "@dndbeyond/character-rules-engine/es";

import { Textarea } from "~/components/Textarea";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneIdentifiersNote } from "~/subApps/sheet/components/Sidebar/types";

import { PaneInitFailureContent } from "../../../../../../subApps/sheet/components/Sidebar/components/PaneInitFailureContent";
import { ThemeButton } from "../../../components/common/Button";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  notes: CharacterNotes;
  placeholder: string;
  autoSaveDelay: number;
  identifiers: PaneIdentifiersNote | null;
}
interface StateData {
  noteType: string | null;
}
interface State extends StateData {
  hasBeenEdited: boolean;
  isSaveDirty: boolean;
}
class NoteManagePane extends React.PureComponent<Props, State> {
  static defaultProps = {
    placeholder: "Enter any notes here!",
    autoSaveDelay: 5000,
  };

  autoSaveTimeoutId: number | null = null;
  textareaInput = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.state = {
      ...this.generateStateData(props),
      hasBeenEdited: false,
      isSaveDirty: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { identifiers } = this.props;

    if (identifiers !== prevProps.identifiers) {
      this.setState({
        ...this.generateStateData(this.props),
        hasBeenEdited: false,
        isSaveDirty: false,
      });
    }
  }

  generateStateData = (props: Props): StateData => {
    const { identifiers } = props;

    return {
      noteType: identifiers !== null ? identifiers.noteType : null,
    };
  };

  componentDidMount() {
    if (this.textareaInput.current) {
      this.textareaInput.current.focus();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    const { isSaveDirty, noteType } = this.state;

    this.handleStopAutoSaveTimer();

    if (noteType !== null && isSaveDirty && this.textareaInput.current) {
      dispatch(
        characterActions.noteSet(
          noteType,
          this.textareaInput.current?.dataset.value || ""
        )
      );
    }
  }

  startAutoSaveTimer = (): void => {
    const { autoSaveDelay } = this.props;

    if (this.autoSaveTimeoutId === null) {
      this.autoSaveTimeoutId = window.setTimeout(() => {
        this.handleSave();
      }, autoSaveDelay);
    }
  };

  handleStopAutoSaveTimer = (): void => {
    if (this.autoSaveTimeoutId !== null) {
      clearTimeout(this.autoSaveTimeoutId);
      this.autoSaveTimeoutId = null;
    }
  };

  handleSave = (): void => {
    const { dispatch } = this.props;
    const { noteType } = this.state;

    if (noteType !== null && this.textareaInput.current) {
      dispatch(
        characterActions.noteSet(
          noteType,
          this.textareaInput.current?.dataset.value || ""
        )
      );
    }

    this.handleStopAutoSaveTimer();
    this.setState({
      isSaveDirty: false,
    });
  };

  handleInputKeyUp = (): void => {
    const { isSaveDirty } = this.state;

    if (!isSaveDirty) {
      this.setState(
        {
          isSaveDirty: true,
          hasBeenEdited: true,
        },
        this.startAutoSaveTimer
      );
    }
  };

  handleInputBlur = (text: string): void => {
    this.handleSave();
  };

  getNoteHelpText = (): string => {
    const { noteType } = this.state;

    let text = "";
    switch (noteType) {
      case Constants.NoteKeyEnum.ORGANIZATIONS:
        text =
          "Are there any important organizations your character belongs to? Any societies, orders, cults, or agencies?";
        break;
      case Constants.NoteKeyEnum.ALLIES:
        text =
          "With whom does your character associate? When in need of aid, do they seek out their kinfolk, followers of their deity, or other members of their order? What groups or individuals are they aligned with?";
        break;
      case Constants.NoteKeyEnum.ENEMIES:
        text =
          "Who does your character fear or fight? Have they sworn a vow to rid the world of undead? Is there an order or organization they are opposed to? Are there any specific foes from their past?";
        break;
      case Constants.NoteKeyEnum.BACKSTORY:
        text =
          "Talk about your character's origins. Where are they from? How did they end up adventuring? How did they choose their class?";
        break;
      case Constants.NoteKeyEnum.OTHER:
        text = "Anything at all you'd like to mention about your character.";
        break;
      default:
    }

    return text;
  };

  render() {
    const { isSaveDirty, hasBeenEdited, noteType } = this.state;
    const { notes, placeholder } = this.props;

    if (noteType === null) {
      return <PaneInitFailureContent />;
    }

    let content: string | null = notes[noteType] ? notes[noteType] : "";

    let calloutNode: React.ReactNode;
    if (hasBeenEdited) {
      if (isSaveDirty) {
        calloutNode = (
          <React.Fragment>
            <div className="ct-note-manage-pane__status ct-note-manage-pane__status--dirty">
              <div className="ct-note-manage-pane__status-text">
                Unsaved changes
              </div>
            </div>
            <ThemeButton size="small" onClick={this.handleSave}>
              Save
            </ThemeButton>
          </React.Fragment>
        );
      } else {
        calloutNode = (
          <div className="ct-note-manage-pane__status ct-note-manage-pane__status--clean">
            <div className="ct-note-manage-pane__status-icon" />
            <div className="ct-note-manage-pane__status-text">Saved</div>
          </div>
        );
      }
    }

    return (
      <div className="ct-note-manage-pane">
        <Header callout={calloutNode}>
          {RuleDataUtils.getNoteKeyName(noteType as Constants.NoteKeyEnum)}
        </Header>
        <Textarea
          ref={this.textareaInput}
          placeholder={placeholder}
          value={content === null ? "" : content}
          onInputKeyUp={this.handleInputKeyUp}
          onInputBlur={this.handleInputBlur}
        />
        <p className="ct-note-manage-pane__text">{this.getNoteHelpText()}</p>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    notes: rulesEngineSelectors.getCharacterNotes(state),
  };
}

export default connect(mapStateToProps)(NoteManagePane);
