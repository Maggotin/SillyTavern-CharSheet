import axios, { Canceler } from "axios";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Checkbox,
  HitDieDice,
  HealingIcon,
} from "@dndbeyond/character-components/es";
import {
  ApiRequests,
  ApiAdapterUtils,
  rulesEngineSelectors,
  characterActions,
  CharClass,
  CharacterUtils,
  ClassUtils,
  DiceContract,
  DiceUtils,
  HitPointInfo,
  RuleData,
  ShortModelInfoContract,
  CharacterTheme,
} from "@dndbeyond/character-rules-engine/es";
import { RollRequest } from "@dndbeyond/dice";
import { IRollContext, RollType } from "@dndbeyond/dice";
import { GameLogContext } from "@dndbeyond/game-log-components";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { RestoreLifeManager } from "~/subApps/sheet/components/Sidebar/panes/HitPointsManagePane/RestoreLifeManager/RestoreLifeManager";

import { toastMessageActions } from "../../../actions/toastMessage";
import SlotManager from "../../../components/SlotManager";
import { ThemeButton } from "../../../components/common/Button";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../../selectors";
import { SharedAppState } from "../../../stores/typings";
import { AppLoggerUtils } from "../../../utils";

interface Props extends DispatchProp {
  classes: Array<CharClass>;
  conModifier: number | null;
  ruleData: RuleData;
  isDead: boolean;
  theme: CharacterTheme;
  diceEnabled: boolean;
  characterRollContext: IRollContext;
  hitPointInfo: HitPointInfo;
}
interface State {
  restMessage: string | null;
  hitDiceUsed: Record<number, number>;
  originalHitDiceUsed: Record<number, number>;
  resetMaxHpModifier: boolean;
  currentHitDiceCount: Record<number, number>;
  healCharacterOnHitDieRoll: boolean;
  hitDiceSlotsEnabled: boolean;
}

class ShortRestPane extends React.PureComponent<Props, State> {
  loadMessageCanceler: null | Canceler = null;
  clickReferences: Record<number, HTMLDivElement> = {};
  constructor(props: Props) {
    super(props);

    this.state = {
      restMessage: null,
      hitDiceUsed: this.getHitDiceUsedLookup(props),
      originalHitDiceUsed: this.getHitDiceUsedLookup(props),
      resetMaxHpModifier: false,
      healCharacterOnHitDieRoll: true,
      currentHitDiceCount: this.getNewHitDiceLookup(props),
      hitDiceSlotsEnabled: true,
    };
  }

  componentDidMount() {
    this.loadShortRestMessage();
  }

  componentWillUnmount(): void {
    if (this.loadMessageCanceler !== null) {
      this.loadMessageCanceler();
    }
    Object.keys(this.clickReferences).forEach((reference) => {
      this.clickReferences[reference]?.children[0]?.removeEventListener(
        "click",
        this.setHitDiceSlotsEnabledFalse.bind(this)
      );
    });
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    const { classes } = this.props;

    if (classes !== prevProps.classes) {
      this.setState({
        hitDiceUsed: this.getHitDiceUsedLookup(this.props),
      });

      this.loadShortRestMessage();
    }
  }

  loadShortRestMessage = (): void => {
    if (this.loadMessageCanceler !== null) {
      this.loadMessageCanceler();
    }

    ApiRequests.getCharacterRestShort({
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

  getHitDiceUsedLookup = (props: Props): Record<number, number> => {
    return props.classes.reduce((acc: Record<number, number>, charClass) => {
      acc[ClassUtils.getMappingId(charClass)] = charClass.hitDiceUsed;
      return acc;
    }, {});
  };

  getNewHitDiceLookup = (props: Props): Record<number, number> => {
    return props.classes.reduce((acc: Record<number, number>, charClass) => {
      acc[ClassUtils.getMappingId(charClass)] = 0;
      return acc;
    }, {});
  };

  handleReset = (): void => {
    this.setState({
      hitDiceUsed: this.getHitDiceUsedLookup(this.props),
      resetMaxHpModifier: false,
      originalHitDiceUsed: this.getHitDiceUsedLookup(this.props),
      currentHitDiceCount: this.getNewHitDiceLookup(this.props),
    });
  };

  handleSave = (): void => {
    const { hitDiceUsed, resetMaxHpModifier } = this.state;
    const { dispatch } = this.props;

    this.setState({
      originalHitDiceUsed: hitDiceUsed,
      currentHitDiceCount: this.getNewHitDiceLookup(this.props),
    });

    dispatch(characterActions.shortRest(hitDiceUsed, resetMaxHpModifier));
    dispatch(
      toastMessageActions.toastSuccess(
        "Short Rest Taken",
        "You have completed a short rest. Relevant abilities have been reset."
      )
    );
  };

  handleSlotSet = (classMappingId: number, uses: number): void => {
    this.setState((prevState: State) => ({
      hitDiceUsed: {
        ...prevState.hitDiceUsed,
        [classMappingId]: uses,
      },
      currentHitDiceCount: {
        ...prevState.currentHitDiceCount,
        [classMappingId]: uses - prevState.originalHitDiceUsed[classMappingId],
      },
    }));
  };

  handleResetMaxHpChange = (isEnabled: boolean): void => {
    this.setState({
      resetMaxHpModifier: isEnabled,
    });
  };

  handleHealCharacterOnHitDieRoll = (isEnabled: boolean): void => {
    this.setState({
      healCharacterOnHitDieRoll: isEnabled,
    });
  };

  handleRestoreToLife = (restoreType: ShortModelInfoContract): void => {
    const { dispatch } = this.props;

    const restoreChoice: string = restoreType.name === "Full" ? "full" : "1";

    dispatch(characterActions.restoreLife(restoreType.id));
    dispatch(
      toastMessageActions.toastSuccess(
        "Character Restored to Life",
        `You have been restored to life with ${restoreChoice} HP.`
      )
    );
  };

  renderRecover = (): React.ReactNode => {
    const { resetMaxHpModifier, restMessage, healCharacterOnHitDieRoll } =
      this.state;
    const { isDead, diceEnabled } = this.props;

    if (isDead) {
      return (
        <div className="ct-reset-pane__recover-sources">
          Your character is dead
        </div>
      );
    }

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
          {diceEnabled && (
            <Checkbox
              label="Automatically apply healing with dice result"
              initiallyEnabled={healCharacterOnHitDieRoll}
              onChange={this.handleHealCharacterOnHitDieRoll}
            />
          )}
        </div>
      </React.Fragment>
    );
  };

  setHitDiceSlotsEnabledFalse = (): void => {
    this.setState({ hitDiceSlotsEnabled: false });
  };

  renderHitDice = (): React.ReactNode => {
    const {
      hitDiceUsed,
      currentHitDiceCount,
      healCharacterOnHitDieRoll,
      hitDiceSlotsEnabled,
    } = this.state;
    const {
      classes,
      conModifier,
      isDead,
      diceEnabled,
      characterRollContext,
      theme,
      dispatch,
      hitPointInfo,
    } = this.props;

    const [{ messageTargetOptions, defaultMessageTargetOption, userId }] =
      this.context;

    if (isDead) {
      return null;
    }

    return (
      <div className="ct-reset-pane__hitdice">
        {classes.map((charClass) => {
          let hitDice: DiceContract = {
            diceCount: 1,
            diceValue: ClassUtils.getHitDiceType(charClass),
            fixedValue: conModifier,
            diceMultiplier: null,
            diceString: null,
          };

          return (
            <div key={charClass.id} className="ct-reset-pane__hitdie">
              <div className="ct-reset-pane__hitdie-heading">
                <span className="ct-reset-pane__hitdie-heading-class">
                  {ClassUtils.getName(charClass)}
                </span>
                (Hit Die: {DiceUtils.renderDice(hitDice)} &bull; Total:{" "}
                {ClassUtils.getLevel(charClass)})
              </div>
              <div className="ct-reset-pane__hitdie-manager">
                <SlotManager
                  available={ClassUtils.getLevel(charClass)}
                  used={hitDiceUsed[ClassUtils.getMappingId(charClass)]}
                  onSet={
                    hitDiceSlotsEnabled
                      ? this.handleSlotSet.bind(
                          this,
                          ClassUtils.getMappingId(charClass)
                        )
                      : () => {}
                  }
                  size="small"
                  isInteractive={hitDiceSlotsEnabled}
                />
                {diceEnabled &&
                  currentHitDiceCount[ClassUtils.getMappingId(charClass)] > 0 &&
                  conModifier !== null && (
                    <div
                      ref={(ref) => {
                        if (ref) {
                          ref.children[0]?.addEventListener(
                            "click",
                            this.setHitDiceSlotsEnabledFalse.bind(this)
                          );

                          this.clickReferences[
                            ClassUtils.getMappingId(charClass)
                          ] = ref;
                        }

                        return ref;
                      }}
                      className="ct-reset-pane__hitdie-manager-dice"
                    >
                      <HitDieDice
                        diceNotation={DiceUtils.renderDice({
                          ...hitDice,
                          diceCount:
                            currentHitDiceCount[
                              ClassUtils.getMappingId(charClass)
                            ],
                          fixedValue:
                            currentHitDiceCount[
                              ClassUtils.getMappingId(charClass)
                            ] * conModifier,
                        })}
                        onRollResults={(rollRequest: RollRequest) => {
                          if (
                            healCharacterOnHitDieRoll &&
                            rollRequest.rolls[0]?.result?.total
                          ) {
                            const { newTemp, newRemovedHp, startHp, newHp } =
                              CharacterUtils.calculateHitPoints(
                                hitPointInfo,
                                rollRequest.rolls[0].result.total
                              );
                            if (newHp >= startHp) {
                              dispatch(
                                characterActions.hitPointsSet(
                                  newRemovedHp,
                                  newTemp
                                )
                              );
                            }
                          }
                          this.setState((state) => {
                            return {
                              originalHitDiceUsed: state.hitDiceUsed,
                              currentHitDiceCount: {
                                ...state.currentHitDiceCount,
                                [ClassUtils.getMappingId(charClass)]: 0,
                              },
                              hitDiceSlotsEnabled: true,
                            };
                          });
                        }}
                        rollType={RollType.Heal}
                        rollAction={"Hit Dice"}
                        diceEnabled={diceEnabled}
                        rollContext={characterRollContext}
                        rollTargetOptions={
                          messageTargetOptions
                            ? Object.values(messageTargetOptions?.entities)
                            : undefined
                        }
                        rollTargetDefault={defaultMessageTargetOption}
                        userId={userId}
                      >
                        {DiceUtils.renderDice({
                          ...hitDice,
                          diceCount:
                            currentHitDiceCount[
                              ClassUtils.getMappingId(charClass)
                            ],
                          fixedValue:
                            currentHitDiceCount[
                              ClassUtils.getMappingId(charClass)
                            ] * conModifier,
                        })}{" "}
                        <HealingIcon theme={theme} isHp={true} />
                      </HitDieDice>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
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
            Take Short Rest
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
        <Header>Short Rest</Header>

        <div className="ct-reset-pane__intro">
          A short rest is a period of downtime, at least 1 hour long, during
          which a character does nothing more strenuous than eating, drinking,
          reading, and tending to wounds.
        </div>

        <div className="ct-reset-pane__recover">
          <div className="ct-reset-pane__recover-heading">Recover</div>
          {this.renderRecover()}
        </div>
        {this.renderHitDice()}
        {this.renderActions()}
      </div>
    );
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    classes: rulesEngineSelectors.getClasses(state),
    conModifier: rulesEngineSelectors.getConModifier(state),
    isDead: rulesEngineSelectors.isDead(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    characterRollContext:
      characterRollContextSelectors.getCharacterRollContext(state),
    hitPointInfo: rulesEngineSelectors.getHitPointInfo(state),
  };
}

ShortRestPane.contextType = GameLogContext;

export default connect(mapStateToProps)(ShortRestPane);
