import axios, { Canceler } from "axios";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Checkbox } from "@dndbeyond/character-components/es";
import {
  ApiAdapterUtils,
  ApiRequests,
  rulesEngineSelectors,
  characterActions,
  Condition,
  RuleData,
  ShortModelInfoContract,
  CharacterTheme,
} from "../../character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { RestoreLifeManager } from "~/subApps/sheet/components/Sidebar/panes/HitPointsManagePane/RestoreLifeManager/RestoreLifeManager";

import { toastMessageActions } from "../../../actions/toastMessage";
import { ThemeButton } from "../../../components/common/Button";
import { SharedAppState } from "../../../stores/typings";
import { AppLoggerUtils } from "../../../utils";

interface Props extends DispatchProp {
  activeConditions: Array<Condition>;
  ruleData: RuleData;
  isDead: boolean;
  theme: CharacterTheme;
}
interface State {
  resetMaxHpModifier: boolean;
  adjustConditionLevel: boolean;
  restMessage: string | null;
}
class LongRestPane extends React.PureComponent<Props, State> {
  loadMessageCanceler: null | Canceler = null;

  constructor(props) {
    super(props);

    this.state = {
      resetMaxHpModifier: true,
      adjustConditionLevel: false,
      restMessage: null,
    };
  }

  componentDidMount() {
    this.loadMessage();
  }

  componentWillUnmount(): void {
    if (this.loadMessageCanceler !== null) {
      this.loadMessageCanceler();
    }
  }

  loadMessage = (): void => {
    if (this.loadMessageCanceler !== null) {
      this.loadMessageCanceler();
    }

    ApiRequests.getCharacterRestLong({
      cancelToken: new axios.CancelToken((c) => {
        this.loadMessageCanceler = c;
      }),
    })
      .then((response) => {
        let message = ApiAdapterUtils.getResponseData(response);
        if (message !== null) {
          this.setState({
            restMessage: message,
          });
        }
        this.loadMessageCanceler = null;
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  };

  reset = (): void => {
    this.setState({
      resetMaxHpModifier: true,
    });
  };

  handleReset = (): void => {
    this.setState({
      resetMaxHpModifier: true,
      adjustConditionLevel: false,
    });
  };

  handleSave = (): void => {
    const { resetMaxHpModifier, adjustConditionLevel } = this.state;
    const { dispatch } = this.props;

    dispatch(
      characterActions.longRest(resetMaxHpModifier, adjustConditionLevel)
    );
    dispatch(
      toastMessageActions.toastSuccess(
        "Long Rest Taken",
        "You have completed a long rest. Relevant abilities have been reset."
      )
    );
  };

  handleResetMaxHpChange = (enabled: boolean): void => {
    this.setState({
      resetMaxHpModifier: enabled,
    });
  };

  handleAdjustExhaustionLevel = (enabled: boolean): void => {
    this.setState({
      adjustConditionLevel: enabled,
    });
  };

  handleRestoreToLife = (restoreType: ShortModelInfoContract): void => {
    const { dispatch } = this.props;
    const restoreChoice = restoreType.name === "Full" ? "full" : "1";

    dispatch(characterActions.restoreLife(restoreType.id));
    dispatch(
      toastMessageActions.toastSuccess(
        "Character Restored to Life",
        `You have been restored to life with ${restoreChoice} HP.`
      )
    );
  };

  renderRecover = (): React.ReactNode => {
    const { resetMaxHpModifier, adjustConditionLevel, restMessage } =
      this.state;

    const { isDead, activeConditions } = this.props;

    if (isDead) {
      return (
        <div className="ct-reset-pane__recover-sources">
          Your character is dead
        </div>
      );
    }
    const exhaustionIsActive = activeConditions.find(
      (condition) => condition.level !== null
    );

    return (
      <React.Fragment>
        <div className="ct-reset-pane__recover-sources">
          {restMessage === null
            ? "Asking the server what will be reset..."
            : restMessage}
        </div>
        <div className="ct-reset-pane__recover-max-hp">
          <Checkbox
            label="Reset Maximum HP changes during this rest"
            initiallyEnabled={resetMaxHpModifier}
            onChange={this.handleResetMaxHpChange}
          />
        </div>
        {exhaustionIsActive && (
          <div className="ct-reset-pane__reset-exhaustion-level">
            <Checkbox
              label="Recover 1 Level of Exhaustion during this rest (requires food and drink)"
              initiallyEnabled={adjustConditionLevel}
              onChange={this.handleAdjustExhaustionLevel}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  renderActions = (): React.ReactNode => {
    const { isDead, ruleData, theme } = this.props;

    if (isDead) {
      return (
        <React.Fragment>
          <RestoreLifeManager onSave={this.handleRestoreToLife} />
        </React.Fragment>
      );
    }

    return (
      <div className="ct-reset-pane__actions">
        <div className="ct-reset-pane__action">
          <ThemeButton onClick={this.handleSave} enableConfirm={true}>
            Take Long Rest
          </ThemeButton>
        </div>
        <div className="ct-reset-pane__action">
          <ThemeButton onClick={this.handleReset} style="outline">
            Reset
          </ThemeButton>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="ct-reset-pane">
        <Header>Long Rest</Header>

        <div className="ct-reset-pane__intro">
          <p>
            A long rest is a period of extended downtime, at least 8 hours long,
            during which a character sleeps for at least 6 hours and performs no
            more than 2 hours of light activity, such as reading, talking,
            eating, or standing watch.
          </p>
          <p>
            If the rest is interrupted by a period of strenuous activity — at
            least 1 hour of walking, fighting, casting spells, or similar
            adventuring activity — the characters must begin the rest again to
            gain any benefit from it.
          </p>
        </div>
        <div className="ct-reset-pane__recover">
          <div className="ct-reset-pane__recover-heading">Recover</div>
          {this.renderRecover()}
        </div>
        {this.renderActions()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    activeConditions: rulesEngineSelectors.getActiveConditions(state),
    isDead: rulesEngineSelectors.isDead(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
  };
}

export default connect(mapStateToProps)(LongRestPane);
