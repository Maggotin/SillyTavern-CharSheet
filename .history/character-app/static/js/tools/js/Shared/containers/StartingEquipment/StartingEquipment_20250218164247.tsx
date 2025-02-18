import axios, { Canceler } from "axios";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  Button,
  LoadingPlaceholder,
  Select,
} from "@dndbeyond/character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  Background,
  BackgroundUtils,
  BaseItemDefinitionContract,
  characterActions,
  CharClass,
  ClassUtils,
  Constants,
  ContainerUtils,
  DiceContract,
  DiceUtils,
  HelperUtils,
  Modifier,
  RuleData,
  rulesEngineSelectors,
  StartingEquipmentContract,
  StartingEquipmentSlotContract,
  TypeValueLookup,
  DefinitionUtils,
} from "../../character-rules-engine/es";

import { Link } from "~/components/Link";

// TODO need to remove this builder reference and replace with better heading
import PageSubHeader from "../../../CharacterBuilder/components/PageSubHeader";
import { ThemeButton } from "../../components/common/Button";
import DataLoadingStatusEnum from "../../constants/DataLoadingStatusEnum";
import * as apiCreatorSelectors from "../../selectors/composite/apiCreator";
import { SharedAppState } from "../../stores/typings";
import { AppLoggerUtils, AppNotificationUtils } from "../../utils";
import StartingEquipmentSlots from "./StartingEquipmentSlots";
import { StartingEquipmentRuleSlotSelection } from "./typings";

//duplicated from characterActions typingParts to avoid import issues
interface StartingEquipmentAddRequestPayloadItem {
  containerEntityId: number | null;
  containerEntityTypeId: number | null;
  entityId: number;
  entityTypeId: number;
  quantity: number;
}
//duplicated from characterActions typingParts to avoid import issues
interface StartingEquipmentAddRequestPayload {
  items: Array<StartingEquipmentAddRequestPayloadItem>;
  gold: number;
  custom: Array<string>;
}

type StartingEquipmentChoice = "equipment" | "gold";
type RuleSlotChoiceKey = "startingClass" | "background";

interface RuleChoiceGroupSelectionPayload {
  groupKey: RuleSlotChoiceKey;
  slotIdx: number;
  ruleSlotIdx: number;
  ruleIdx: number;
  dataId: number | null;
  activeRuleSlotIdx: number | null;
}

interface RuleChoiceGroupClearPayload {
  groupKey: RuleSlotChoiceKey;
}

interface Props extends DispatchProp {
  isInitialView: boolean;
  onStartingEquipmentChoose?: () => void;
  startingClass: CharClass | null;
  background: Background | null;
  loadClassStartingEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<StartingEquipmentContract>>;
  loadBackgroundStartingEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<StartingEquipmentContract>>;
  globalModifiers: Array<Modifier>;
  valueLookupByType: TypeValueLookup;
  ruleData: RuleData;
  characterId: number;
}

interface SlotChoiceInfoState {
  activeRuleSlots: Array<number | null>;
  dataValues: Record<string, number | null>;
}
type RuleSlotChoicesState = Record<RuleSlotChoiceKey, SlotChoiceInfoState>;
interface State {
  activeChoice: StartingEquipmentChoice | null;
  startingRules: Record<RuleSlotChoiceKey, StartingEquipmentContract>;
  loadingStatus: DataLoadingStatusEnum;
  loadingRuleTypes: Array<RuleSlotChoiceKey>;
  ruleSlotChoices: RuleSlotChoicesState;
  rolledGoldTotal: number | null;
}
class StartingEquipment extends React.PureComponent<Props, State> {
  static defaultProps = {
    isInitialView: false,
  };

  loadRuleCancelers: Array<Canceler> = [];
  defaultStartingRules: Record<RuleSlotChoiceKey, StartingEquipmentContract> = {
    startingClass: {
      slots: [],
    },
    background: {
      slots: [],
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      activeChoice: null,
      startingRules: this.defaultStartingRules,
      loadingStatus: DataLoadingStatusEnum.NOT_INITIALIZED,
      loadingRuleTypes: [],
      ruleSlotChoices: {
        startingClass: {
          activeRuleSlots: [],
          dataValues: {},
        },
        background: {
          activeRuleSlots: [],
          dataValues: {},
        },
      },
      rolledGoldTotal: null,
    };
  }

  componentDidMount() {
    const {
      background,
      startingClass,
      loadClassStartingEquipment,
      loadBackgroundStartingEquipment,
    } = this.props;

    let requests: Array<
      ApiAdapterPromise<ApiResponse<StartingEquipmentContract>>
    > = [];
    let loadingRuleTypes: Array<RuleSlotChoiceKey> = [];
    if (
      background !== null &&
      !BackgroundUtils.getHasCustomBackground(background)
    ) {
      requests.push(
        loadBackgroundStartingEquipment({
          cancelToken: new axios.CancelToken((c) => {
            this.loadRuleCancelers.push(c);
          }),
        })
      );
      loadingRuleTypes.push("background");
    }
    if (startingClass !== null) {
      requests.push(
        loadClassStartingEquipment({
          cancelToken: new axios.CancelToken((c) => {
            this.loadRuleCancelers.push(c);
          }),
        })
      );
      loadingRuleTypes.push("startingClass");
    }

    this.setState({
      loadingStatus: DataLoadingStatusEnum.LOADING,
      loadingRuleTypes,
    });

    axios
      .all(requests)
      .then((responses) => {
        this.setState((prevState: State) => {
          let startingRules: Record<
            RuleSlotChoiceKey,
            StartingEquipmentContract
          > = prevState.startingRules;

          for (var i = 0; i < responses.length; i++) {
            let response = responses[i];
            let loadingRuleType = prevState.loadingRuleTypes[i];
            let rules = ApiAdapterUtils.getResponseData(response);

            startingRules = {
              ...startingRules,
              [loadingRuleType]: rules,
            };
          }

          return {
            startingRules,
            loadingStatus: DataLoadingStatusEnum.LOADED,
          };
        });
        this.loadRuleCancelers = [];
      })
      .catch(AppLoggerUtils.handleAdhocApiError);
  }

  componentWillUnmount(): void {
    if (this.loadRuleCancelers.length > 0) {
      this.loadRuleCancelers.forEach((cancel) => {
        cancel();
      });
    }
  }

  handleChoiceClick = (choiceKey: StartingEquipmentChoice): void => {
    this.setState((prevState: State) => ({
      activeChoice: choiceKey,
      ruleSlotChoices:
        prevState.activeChoice !== choiceKey
          ? this.getRuleSlotChoicesDefaultState(prevState.startingRules)
          : prevState.ruleSlotChoices,
    }));
  };

  handleRuleSelection = (
    groupKey: RuleSlotChoiceKey,
    slotIdx: number,
    ruleSlotIdx: number,
    ruleIdx: number,
    dataId: number | null
  ): void => {
    this.setState((prevState: State) => {
      return this.reduceSelectionForRuleChoiceGroup(prevState, {
        groupKey,
        slotIdx,
        ruleSlotIdx,
        ruleIdx,
        dataId,
        activeRuleSlotIdx:
          prevState.ruleSlotChoices[groupKey].activeRuleSlots[slotIdx],
      });
    });
  };

  handleRuleSlotSelection = (
    groupKey: RuleSlotChoiceKey,
    slotIdx: number,
    selectedRuleData: Array<StartingEquipmentRuleSlotSelection>
  ): void => {
    if (!selectedRuleData.length) {
      return;
    }

    this.setState((prevState: State) => {
      let modifiedState = prevState;

      selectedRuleData.forEach((ruleData) => {
        const { ruleSlotIdx, ruleIdx, dataId } = ruleData;
        let activeRuleSlotIdx =
          prevState.ruleSlotChoices[groupKey].activeRuleSlots[slotIdx] ===
          ruleSlotIdx
            ? null
            : ruleSlotIdx;
        modifiedState = this.reduceSelectionForRuleChoiceGroup(modifiedState, {
          groupKey,
          slotIdx,
          ruleSlotIdx,
          ruleIdx,
          dataId,
          activeRuleSlotIdx,
        });
      });

      return modifiedState;
    });
  };

  handleStartingEquipmentAdd = (): void => {
    const { dispatch, onStartingEquipmentChoose } = this.props;

    const startingEquipment = this.getCurrentStartingEquipmentSelected();
    dispatch(
      characterActions.startingEquipmentAddRequest(
        startingEquipment,
        AppNotificationUtils.handleStartingEquipmentAccepted,
        AppNotificationUtils.handleStartingEquipmentRejected
      )
    );

    if (onStartingEquipmentChoose) {
      onStartingEquipmentChoose();
    }
  };

  handleStartingGoldAdd = (): void => {
    const { dispatch, onStartingEquipmentChoose } = this.props;

    dispatch(
      characterActions.startingGoldAddRequest(
        this.getStartingGoldTotal(),
        AppNotificationUtils.handleStartingGoldAccepted
      )
    );

    if (onStartingEquipmentChoose) {
      onStartingEquipmentChoose();
    }
  };

  handleClearStartingEquipment = (): void => {
    this.setState((prevState: State) => {
      let modifiedState = prevState;

      Object.keys(prevState.ruleSlotChoices).forEach(
        (groupKey: RuleSlotChoiceKey) => {
          modifiedState = this.reduceClearForRuleChoiceGroup(modifiedState, {
            groupKey,
          });
        }
      );

      return modifiedState;
    });
  };

  handleRandomizeGold = (): void => {
    const { startingClass } = this.props;

    if (startingClass) {
      const wealthDice = this.getStartingClassWealthDice();
      if (wealthDice) {
        this.setState({
          rolledGoldTotal: DiceUtils.getDiceRandomValue(wealthDice),
        });
      }
    }
  };

  handleGoldRolledNumberChange = (value: string): void => {
    this.setState({
      rolledGoldTotal: HelperUtils.parseInputInt(value),
    });
  };

  getRuleSlotChoicesDefaultState = (
    startingRules: Record<RuleSlotChoiceKey, StartingEquipmentContract>
  ): RuleSlotChoicesState => {
    let background = this.getSlotDefaultState(
      startingRules.background && startingRules.background.slots
        ? startingRules.background.slots
        : []
    );
    let startingClass = this.getSlotDefaultState(
      startingRules.startingClass && startingRules.startingClass.slots
        ? startingRules.startingClass.slots
        : []
    );

    return {
      background,
      startingClass,
    };
  };

  getDataKey(slotIdx: number, ruleSlotIdx: number, ruleIdx: number): string {
    return `${slotIdx}-${ruleSlotIdx}-${ruleIdx}`;
  }

  getSlotDefaultState(
    slots: Array<StartingEquipmentSlotContract>
  ): SlotChoiceInfoState {
    return slots.reduce(
      (slotAcc, slot, slotIdx): SlotChoiceInfoState => {
        let slotDataValues: Record<string, null> = {};
        if (slot.ruleSlots !== null) {
          slot.ruleSlots.reduce(
            (acc, ruleSlot, ruleSlotIdx): Record<string, null> => {
              if (ruleSlot.rules !== null) {
                ruleSlot.rules.forEach((rule, ruleIdx) => {
                  if (rule.definitions !== null) {
                    rule.definitions.forEach((dataItem, dataId) => {
                      acc = {
                        ...acc,
                        [this.getDataKey(slotIdx, ruleSlotIdx, ruleIdx)]: null,
                      };
                    });
                  }
                });
              }
              return acc;
            },
            {}
          );
        }

        return {
          activeRuleSlots: [...slotAcc.activeRuleSlots, null],
          dataValues: {
            ...slotAcc.dataValues,
            ...slotDataValues,
          },
        };
      },
      { activeRuleSlots: [], dataValues: {} }
    );
  }

  reduceSelectionForRuleChoiceGroup = (
    state: State,
    payload: RuleChoiceGroupSelectionPayload
  ): State => {
    const {
      groupKey,
      slotIdx,
      ruleSlotIdx,
      ruleIdx,
      dataId,
      activeRuleSlotIdx,
    } = payload;

    return {
      ...state,
      ruleSlotChoices: {
        ...state.ruleSlotChoices,
        [groupKey]: {
          activeRuleSlots: [
            ...state.ruleSlotChoices[groupKey].activeRuleSlots.slice(
              0,
              slotIdx
            ),
            activeRuleSlotIdx,
            ...state.ruleSlotChoices[groupKey].activeRuleSlots.slice(
              slotIdx + 1
            ),
          ],
          dataValues: {
            ...state.ruleSlotChoices[groupKey].dataValues,
            [this.getDataKey(slotIdx, ruleSlotIdx, ruleIdx)]: dataId,
          },
        },
      },
    };
  };

  processSlotGroups = (
    groupData: StartingEquipmentContract | null,
    groupChoices: SlotChoiceInfoState
  ): StartingEquipmentAddRequestPayload => {
    const { characterId } = this.props;
    let items: Array<StartingEquipmentAddRequestPayloadItem> = [];
    let gold: number = 0;
    let custom: Array<string> = [];
    let slotGroups: StartingEquipmentAddRequestPayload = {
      items,
      gold,
      custom,
    };

    if (!groupData || groupData.slots === null) {
      return slotGroups;
    }

    groupData.slots.forEach((slot, slotIdx) => {
      let activeRuleSlotIdx = groupChoices.activeRuleSlots[slotIdx];
      if (activeRuleSlotIdx === null) {
        return;
      }

      if (slot.ruleSlots === null) {
        return;
      }

      slot.ruleSlots.forEach((ruleSlot, ruleSlotIdx) => {
        if (activeRuleSlotIdx !== ruleSlotIdx) {
          return;
        }

        if (ruleSlot.rules === null) {
          return;
        }

        ruleSlot.rules.forEach((rule, ruleIdx) => {
          let dataKey = this.getDataKey(slotIdx, ruleSlotIdx, ruleIdx);

          if (groupChoices.activeRuleSlots[slotIdx] === null) {
            return;
          }

          const characterContainerDefinitionKey =
            ContainerUtils.getCharacterContainerDefinitionKey(characterId);

          switch (rule.ruleType) {
            case Constants.StartingEquipmentRuleTypeEnum.ARMOR:
            case Constants.StartingEquipmentRuleTypeEnum.ARMOR_TYPE:
            case Constants.StartingEquipmentRuleTypeEnum.GEAR:
            case Constants.StartingEquipmentRuleTypeEnum.GEAR_TYPE:
            case Constants.StartingEquipmentRuleTypeEnum.WEAPON:
            case Constants.StartingEquipmentRuleTypeEnum.WEAPON_TYPE:
              let activeDataId = groupChoices.dataValues[dataKey];
              if (activeDataId === null) {
                return;
              }

              let item: BaseItemDefinitionContract | null | undefined =
                rule.definitions &&
                rule.definitions.find(
                  (dataItem) => dataItem.id === activeDataId
                );
              if (item) {
                items.push({
                  containerEntityId: DefinitionUtils.hack__getDefinitionKeyId(
                    characterContainerDefinitionKey
                  ),
                  containerEntityTypeId:
                    DefinitionUtils.hack__getDefinitionKeyType(
                      characterContainerDefinitionKey
                    ),
                  entityId: item.id,
                  entityTypeId: item.entityTypeId,
                  quantity: rule.quantity ? rule.quantity : 1,
                });
              }
              break;
            case Constants.StartingEquipmentRuleTypeEnum.GOLD_VALUE:
              let ruleGold = rule.gold;
              if (ruleGold !== null) {
                gold += ruleGold;
              }
              break;
            case Constants.StartingEquipmentRuleTypeEnum.CUSTOM:
              if (rule.custom !== null) {
                custom.push(rule.custom);
              }
              break;

            default:
            // not implemented
          }
        });
      });
    });

    return {
      ...slotGroups,
      gold,
    };
  };

  getCurrentStartingEquipmentSelected =
    (): StartingEquipmentAddRequestPayload => {
      const { startingRules, ruleSlotChoices } = this.state;
      const {
        startingClass: classStartingEquipment,
        background: backgroundStartingEquipment,
      } = startingRules;

      let startingClassAdds = this.processSlotGroups(
        classStartingEquipment,
        ruleSlotChoices.startingClass
      );
      let backgroundAdds = this.processSlotGroups(
        backgroundStartingEquipment,
        ruleSlotChoices.background
      );

      let items: Array<StartingEquipmentAddRequestPayloadItem> = [
        ...startingClassAdds.items,
        ...backgroundAdds.items,
      ];

      let gold: number = startingClassAdds.gold + backgroundAdds.gold;

      let custom: Array<string> = [
        ...startingClassAdds.custom,
        ...backgroundAdds.custom,
      ];

      return {
        items,
        gold,
        custom,
      };
    };

  isStartingEquipmentEmpty = (): boolean => {
    const startingEquipment = this.getCurrentStartingEquipmentSelected();
    return (
      !startingEquipment.items.length &&
      !startingEquipment.gold &&
      !startingEquipment.custom.length
    );
  };

  reduceClearForRuleChoiceGroup = (
    state: State,
    payload: RuleChoiceGroupClearPayload
  ): State => {
    const { groupKey } = payload;
    return {
      ...state,
      ruleSlotChoices: {
        ...state.ruleSlotChoices,
        [groupKey]: {
          ...state.ruleSlotChoices[groupKey],
          activeRuleSlots: state.ruleSlotChoices[groupKey].activeRuleSlots.map(
            (ruleSlot) => null
          ),
        },
      },
    };
  };

  getStartingGoldTotal = (): number => {
    const { rolledGoldTotal } = this.state;

    if (!rolledGoldTotal) {
      return 0;
    }

    const wealthDice = this.getStartingClassWealthDice();
    let diceMultiplier: number = 1;
    if (wealthDice && wealthDice.diceMultiplier) {
      diceMultiplier = wealthDice.diceMultiplier;
    }

    return rolledGoldTotal * diceMultiplier;
  };

  getStartingClassName = (): string | null => {
    const { startingClass } = this.props;

    if (!startingClass) {
      return null;
    }

    return ClassUtils.getName(startingClass);
  };

  getStartingClassWealthDice = (): DiceContract | null => {
    const { startingClass } = this.props;

    if (!startingClass) {
      return null;
    }

    return ClassUtils.getWealthDice(startingClass);
  };

  renderGoldChoiceUi = (): React.ReactNode => {
    const { rolledGoldTotal } = this.state;
    const { startingClass } = this.props;

    if (startingClass) {
      const wealthDice = this.getStartingClassWealthDice();

      let diceCount: number | null = null;
      let diceMultiplier: number | null = null;
      let diceValue: number | null = null;
      let diceValues: Array<number> = [];
      if (wealthDice !== null) {
        diceCount = DiceUtils.getCount(wealthDice);
        diceMultiplier = DiceUtils.getMultiplier(wealthDice);
        diceValue = DiceUtils.getValue(wealthDice);
        diceValues = DiceUtils.getDiceValuesRange(wealthDice);
      }

      const diceOptions = diceValues.map((value) => ({
        value,
        label: value,
      }));

      let totalGold = this.getStartingGoldTotal();

      return (
        <div className="starting-equipment-gold">
          <div className="starting-equipment-gold-explanation">
            {this.getStartingClassName()} Starting Gold:
          </div>
          <div className="starting-equipment-gold-entry">
            <div className="starting-equipment-gold-entry-actions">
              <Link onClick={this.handleRandomizeGold}>Randomize</Link>
            </div>
            <div className="starting-equipment-gold-entry-input">
              <Select
                placeholder={`${diceCount}d${diceValue}`}
                options={diceOptions}
                onChange={this.handleGoldRolledNumberChange}
                value={rolledGoldTotal}
              />
            </div>
            <div className="starting-equipment-gold-entry-multiplier">
              {diceMultiplier ? ` x ${diceMultiplier} ` : ""} gp
            </div>
            {totalGold !== null && (
              <div className="starting-equipment-gold-entry-total">
                = {totalGold} gp
              </div>
            )}
          </div>
          <div className="starting-equipment-gold-actions">
            <Button
              onClick={this.handleStartingGoldAdd}
              disabled={rolledGoldTotal === null}
            >
              Add Starting Gold
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="starting-equipment-requirements-missing">
        Choose a class to view starting gold.
      </div>
    );
  };

  renderEquipmentChoiceUi = (): React.ReactNode => {
    const {
      background,
      startingClass,
      globalModifiers,
      ruleData,
      valueLookupByType,
    } = this.props;
    const { startingRules, ruleSlotChoices } = this.state;

    const classStartingEquipment = HelperUtils.lookupDataOrFallback(
      startingRules,
      "startingClass"
    );
    const backgroundStartingEquipment = HelperUtils.lookupDataOrFallback(
      startingRules,
      "background"
    );

    let hasCustomBackground: boolean =
      background !== null && BackgroundUtils.getHasCustomBackground(background);
    let hasValidStartingClass: boolean =
      startingClass !== null && classStartingEquipment !== null;
    let hasValidBackground: boolean =
      background !== null &&
      backgroundStartingEquipment !== null &&
      !hasCustomBackground;

    if (!hasValidStartingClass && !hasValidBackground) {
      return (
        <div className="starting-equipment-requirements-missing">
          Choose a class
          {hasCustomBackground ? " " : " or background "}
          to view starting equipment options.
        </div>
      );
    }

    return (
      <div className="starting-equipment-gear">
        {hasValidStartingClass &&
          classStartingEquipment !== null &&
          classStartingEquipment.slots !== null && (
            <div>
              <PageSubHeader>
                {this.getStartingClassName()} Starting Equipment
              </PageSubHeader>
              <StartingEquipmentSlots
                slots={classStartingEquipment.slots}
                onRuleSelection={this.handleRuleSelection.bind(
                  this,
                  "startingClass"
                )}
                onRuleSlotSelection={this.handleRuleSlotSelection.bind(
                  this,
                  "startingClass"
                )}
                activeRuleSlots={ruleSlotChoices.startingClass.activeRuleSlots}
                globalModifiers={globalModifiers}
                valueLookupByType={valueLookupByType}
                ruleData={ruleData}
              />
            </div>
          )}
        {hasValidBackground &&
          backgroundStartingEquipment !== null &&
          backgroundStartingEquipment.slots !== null && (
            <div>
              <PageSubHeader>
                {background ? BackgroundUtils.getName(background) : ""} Starting
                Equipment
              </PageSubHeader>
              <StartingEquipmentSlots
                slots={backgroundStartingEquipment.slots}
                onRuleSelection={this.handleRuleSelection.bind(
                  this,
                  "background"
                )}
                onRuleSlotSelection={this.handleRuleSlotSelection.bind(
                  this,
                  "background"
                )}
                activeRuleSlots={ruleSlotChoices.background.activeRuleSlots}
                globalModifiers={globalModifiers}
                valueLookupByType={valueLookupByType}
                ruleData={ruleData}
              />
            </div>
          )}
        <div className="starting-equipment-gear-actions">
          <ThemeButton onClick={this.handleStartingEquipmentAdd}>
            {this.isStartingEquipmentEmpty() ? "Skip " : "Add "} Starting
            Equipment
          </ThemeButton>
          <Link onClick={this.handleClearStartingEquipment}>Clear All</Link>
        </div>
      </div>
    );
  };

  renderUi = (): React.ReactNode => {
    const { isInitialView, startingClass } = this.props;
    const { loadingStatus, activeChoice } = this.state;

    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      return null;
    }

    const wealthDice = this.getStartingClassWealthDice();
    if (startingClass && !wealthDice) {
      return this.renderEquipmentChoiceUi();
    }

    return (
      <div className="starting-equipment-ui">
        {isInitialView && (
          <div className="starting-equipment-choices-label">Choose</div>
        )}
        <div className="starting-equipment-choices">
          <div
            className={`starting-equipment-choice ${
              activeChoice === "equipment"
                ? "starting-equipment-info-choice-active"
                : ""
            }`}
            onClick={this.handleChoiceClick.bind(this, "equipment")}
          >
            Equipment
          </div>
          <div className="starting-equipment-choice-sep">or</div>
          <div
            className={`starting-equipment-choice ${
              activeChoice === "gold"
                ? "starting-equipment-info-choice-active"
                : ""
            }`}
            onClick={this.handleChoiceClick.bind(this, "gold")}
          >
            Gold
          </div>
        </div>
        {activeChoice === "equipment" && this.renderEquipmentChoiceUi()}
        {activeChoice === "gold" && this.renderGoldChoiceUi()}
      </div>
    );
  };

  renderLoading = (): React.ReactNode => {
    return <LoadingPlaceholder />;
  };

  render() {
    const { loadingStatus } = this.state;

    let contentNode: React.ReactNode;
    if (loadingStatus === DataLoadingStatusEnum.LOADED) {
      contentNode = this.renderUi();
    } else {
      contentNode = this.renderLoading();
    }

    return <div className="starting-equipment">{contentNode}</div>;
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    startingClass: rulesEngineSelectors.getStartingClass(state),
    background: rulesEngineSelectors.getBackgroundInfo(state),
    loadBackgroundStartingEquipment:
      apiCreatorSelectors.makeLoadBackgroundStartingEquipment(state),
    loadClassStartingEquipment:
      apiCreatorSelectors.makeLoadClassStartingEquipment(state),
    globalModifiers: rulesEngineSelectors.getValidGlobalModifiers(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    valueLookupByType:
      rulesEngineSelectors.getCharacterValueLookupByType(state),
    characterId: rulesEngineSelectors.getId(state),
  };
}
export default connect(mapStateToProps)(StartingEquipment);
