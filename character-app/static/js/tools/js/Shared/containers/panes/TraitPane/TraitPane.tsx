import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Background,
  BackgroundCharacteristicContract,
  characterActions,
  CharacterTraits,
  Constants,
  RuleDataUtils,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { Textarea } from "~/components/Textarea";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { Heading } from "~/subApps/sheet/components/Sidebar/components/Heading";
import { PaneIdentifiersTrait } from "~/subApps/sheet/components/Sidebar/types";

import { toastMessageActions } from "../../../actions/toastMessage";
import SuggestionTable from "../../../components/SuggestionTable";
import { ThemeButton } from "../../../components/common/Button";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  identifiers: PaneIdentifiersTrait;
  background: Background | null;
  traits: CharacterTraits;
  placeholder: string;
  autoSaveDelay: number;
}
interface State {
  type: string | null;
  hasBeenEdited: boolean;
  isSaveDirty: boolean;
}
class TraitPane extends React.PureComponent<Props, State> {
  static defaultProps = {
    placeholder: "Enter any traits here!",
    autoSaveDelay: 5000,
  };

  autoSaveTimeoutId: number | null = null;
  textareaInput = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);

    this.state = {
      type: props.identifiers.type,
      hasBeenEdited: false,
      isSaveDirty: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { identifiers } = this.props;

    if (identifiers.type !== prevProps.identifiers.type) {
      this.setState({
        type: identifiers.type,
        hasBeenEdited: false,
        isSaveDirty: false,
      });
    }
  }

  componentDidMount() {
    if (this.textareaInput.current) {
      this.textareaInput.current.focus();
    }
  }

  componentWillUnmount() {
    const { dispatch, identifiers } = this.props;
    const { isSaveDirty } = this.state;

    this.handleStopAutoSaveTimer();

    if (isSaveDirty && this.textareaInput.current) {
      dispatch(
        characterActions.traitSet(
          identifiers.type,
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

  getContent = (): string => {
    const { identifiers, traits } = this.props;

    let content = traits[identifiers.type];

    return content || "";
  };

  handleStopAutoSaveTimer = (): void => {
    if (this.autoSaveTimeoutId !== null) {
      window.clearTimeout(this.autoSaveTimeoutId);
      this.autoSaveTimeoutId = null;
    }
  };

  handleSave = (): void => {
    const { dispatch, identifiers } = this.props;

    if (this.textareaInput.current) {
      dispatch(
        characterActions.traitSet(
          identifiers.type,
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

  handleSuggestionUse = (
    idx: number,
    diceRoll: number,
    description: string
  ): void => {
    const { identifiers, dispatch } = this.props;

    let newTraitContent = this.getContent();
    if (newTraitContent.length) {
      newTraitContent += "\n";
    }
    newTraitContent += description;

    dispatch(characterActions.traitSet(identifiers.type, newTraitContent));
    dispatch(
      toastMessageActions.toastSuccess(
        `${RuleDataUtils.getTraitTypeName(
          identifiers.type
        )} added to Personal Characteristics section`,
        `${diceRoll} - ${
          description.length > 70
            ? description.substr(0, 70) + "..."
            : description
        }`
      )
    );
  };

  getSuggestionsHelpText = (traitKey: Constants.TraitTypeEnum): string => {
    let text = `Describe your character's ${RuleDataUtils.getTraitTypeName(
      traitKey
    )}`;
    switch (traitKey) {
      case "personalityTraits":
        text =
          "What is your character like? How do their Ability Scores, like Wisdom or Charisma, contribute to their personality?";
        break;
      case "ideals":
        text =
          "What drives and motivates your character? What values do they hold most important? What are they fighting for?";
        break;
      case "bonds":
        text =
          "Whom does your character care most about? To what place do they feel a special connection? What is their most treasured possession?";
        break;
      case "flaws":
        text =
          "What are your character's vices or weaknesses? What do other people not like about them? What traits do they not like about themself? You can also consider their Ability Scores here.";
        break;
      default:
    }
    return text;
  };

  renderSuggestionList = (): React.ReactNode => {
    const { identifiers, background } = this.props;

    if (identifiers.type === Constants.TraitTypeEnum.APPEARANCE) {
      return null;
    }

    let suggestionNode: React.ReactNode;
    if (
      background &&
      background.definition &&
      background.definition[identifiers.type]
    ) {
      let suggestionData: Array<BackgroundCharacteristicContract> | null =
        background.definition[identifiers.type];
      if (suggestionData && suggestionData.length) {
        suggestionNode = (
          <SuggestionTable
            tableLabel={RuleDataUtils.getTraitTypeName(identifiers.type)}
            dieLabel={`d${suggestionData.length}`}
            suggestions={suggestionData}
            onSuggestionUse={this.handleSuggestionUse}
          />
        );
      }
    } else {
      suggestionNode = (
        <div className="ct-trait-pane__suggestions-missing">
          <p>Choose a background to get suggestions.</p>
        </div>
      );
    }

    return (
      <div className="ct-trait-pane__suggestions">
        <Heading>Suggestions</Heading>
        <p>{this.getSuggestionsHelpText(identifiers.type)}</p>
        {suggestionNode}
      </div>
    );
    //`
  };

  render() {
    const { isSaveDirty, hasBeenEdited } = this.state;
    const { identifiers, placeholder } = this.props;

    let calloutNode: React.ReactNode;
    if (hasBeenEdited) {
      if (isSaveDirty) {
        calloutNode = (
          <React.Fragment>
            <div className="ct-trait-pane__status ct-trait-pane__status--dirty">
              <div className="ct-trait-pane__status-text">Unsaved changes</div>
            </div>
            <ThemeButton size="small" onClick={this.handleSave}>
              Save
            </ThemeButton>
          </React.Fragment>
        );
      } else {
        calloutNode = (
          <div className="ct-trait-pane__status ct-trait-pane__status--clean">
            <div className="ct-trait-pane__status-icon" />
            <div className="ct-trait-pane__status-text">Saved</div>
          </div>
        );
      }
    }

    return (
      <div className="ct-trait-pane">
        <Header callout={calloutNode}>
          {RuleDataUtils.getTraitTypeName(identifiers.type)}
        </Header>
        <Textarea
          ref={this.textareaInput}
          placeholder={placeholder}
          value={this.getContent()}
          onInputKeyUp={this.handleInputKeyUp}
          onInputBlur={this.handleInputBlur}
        />
        {this.renderSuggestionList()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    background: rulesEngineSelectors.getBackgroundInfo(state),
    traits: rulesEngineSelectors.getCharacterTraits(state),
  };
}

export default connect(mapStateToProps)(TraitPane);
