import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  characterActions,
  rulesEngineSelectors,
  ClassSpellListSpellsLookup,
} from "@dndbeyond/character-rules-engine/es";

import { Button } from "~/components/Button";
import { useSidebar } from "~/contexts/Sidebar";
import { PaneInfo } from "~/contexts/Sidebar/Sidebar";
import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import {
  PaneComponentEnum,
  PaneIdentifiersPreferenceOptionalClassFeaturesConfirm,
} from "~/subApps/sheet/components/Sidebar/types";

import { SimpleClassSpellList } from "../../../components/SimpleClassSpellList";
import { SharedAppState } from "../../../stores/typings";

interface Props extends DispatchProp {
  identifiers: PaneIdentifiersPreferenceOptionalClassFeaturesConfirm | null;
  classSpellListSpellsLookup: ClassSpellListSpellsLookup;
  paneHistoryStart: PaneInfo["paneHistoryStart"];
}
interface State {
  spellListIds: Array<number>;
  newIsEnabled: boolean;
}
class PreferencesOptionalClassFeaturesConfirmPane extends React.PureComponent<
  Props,
  State
> {
  constructor(props) {
    super(props);

    this.state = this.generateStateData(props);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>
  ): void {
    const { identifiers } = this.props;

    if (identifiers !== prevProps.identifiers) {
      this.setState(this.generateStateData(this.props));
    }
  }

  generateStateData = (props: Props): State => {
    const { identifiers } = props;

    return {
      spellListIds: identifiers?.spellListIds ?? [],
      newIsEnabled: identifiers?.newIsEnabled ?? false,
    };
  };

  handleConfirm = (): void => {
    const { newIsEnabled } = this.state;
    const { dispatch, paneHistoryStart } = this.props;

    dispatch(
      characterActions.preferenceChoose(
        "enableOptionalClassFeatures",
        newIsEnabled
      )
    );
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  handleCancel = (): void => {
    const { paneHistoryStart } = this.props;
    paneHistoryStart(PaneComponentEnum.PREFERENCES);
  };

  renderContent = (): React.ReactNode => {
    const { spellListIds, newIsEnabled } = this.state;
    const { classSpellListSpellsLookup } = this.props;

    return (
      <React.Fragment>
        <Header>
          {newIsEnabled ? "Enable" : "Disable"} Optional Class Features
        </Header>
        <div className="change-preference-content">
          <p>
            Are you sure you want to {newIsEnabled ? "enable" : "disable"}{" "}
            <strong>Optional Class Features</strong> for this character?
          </p>
          <p>
            After doing so, the following spells provided by these features will
            be removed from your character:
          </p>
          <SimpleClassSpellList
            spellListIds={spellListIds}
            classSpellListSpellsLookup={classSpellListSpellsLookup}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="ct-preferences-pane">
        {this.renderContent()}
        <div className="ct-preferences-pane__actions">
          <div className="ct-preferences-pane__action">
            <Button
              sizes="solid"
              size="x-small"
              themed
              onClick={this.handleConfirm}
            >
              Accept
            </Button>
          </div>
          <div className="ct-preferences-pane__action">
            <Button
              variant="outline"
              size="x-small"
              themed
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    classSpellListSpellsLookup:
      rulesEngineSelectors.getClassSpellListSpellsLookup(state),
  };
}

const PreferencesOptionalClassFeaturesConfirmPaneContainer = (props) => {
  const {
    pane: { paneHistoryStart },
  } = useSidebar();

  return (
    <PreferencesOptionalClassFeaturesConfirmPane
      {...props}
      paneHistoryStart={paneHistoryStart}
    />
  );
};

export default connect(mapStateToProps)(
  PreferencesOptionalClassFeaturesConfirmPaneContainer
);
