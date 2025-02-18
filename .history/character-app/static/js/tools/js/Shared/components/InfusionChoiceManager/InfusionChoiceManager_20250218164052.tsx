import axios, { Canceler } from "axios";
import { keyBy, orderBy } from "lodash";
import * as React from "react";

import { LoadingPlaceholder, Select } from "@dndbeyond/character-components/es";
import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  BaseItemDefinitionContract,
  Constants,
  DefinitionPool,
  DefinitionPoolUtils,
  DefinitionUtils,
  EntitledEntity,
  HelperUtils,
  HtmlSelectOption,
  HtmlSelectOptionGroup,
  InfusionChoice,
  InfusionChoiceUtils,
  InfusionDefinitionContract,
  InfusionUtils,
  Item,
  ItemUtils,
  KnownInfusionUtils,
  Modifier,
  RuleData,
  RuleDataUtils,
  TypeValueLookup,
} from "../../rules-engine/es";

import { HtmlContent } from "~/components/HtmlContent";

import DataLoadingStatusEnum from "../../constants/DataLoadingStatusEnum";
import { AppLoggerUtils, TypeScriptUtils } from "../../utils";

type OnInfusionChangeFunc = (
  choiceKey: string,
  infusionId: string | null,
  oldInfusionId: string | null,
  accept: () => void,
  reject: () => void
) => void;

interface Props {
  infusionChoices: Array<InfusionChoice>;
  contextLevel: number | null;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  ruleData: RuleData;
  definitionPool: DefinitionPool;
  knownInfusionLookup: Record<string, InfusionChoice>;
  knownReplicatedItems: Array<string>;
  onInfusionChoiceItemChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    itemDefinitionKey: string,
    itemName: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceItemDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceChangePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceDestroyPromise?: (
    infusionChoiceKey: string,
    accept: () => void,
    reject: () => void
  ) => void;
  onInfusionChoiceCreatePromise?: (
    infusionChoiceKey: string,
    infusionId: string,
    accept: () => void,
    reject: () => void
  ) => void;
  loadAvailableEquipment: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  loadAvailableInfusions: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<
    ApiResponse<EntitledEntity<InfusionDefinitionContract>>
  >;
  onDefinitionsLoaded?: (
    definitions: Array<InfusionDefinitionContract>,
    accessTypes: Record<string, number>
  ) => void;
}
interface State {
  equipment: Array<Item>;
  loadingStatus: DataLoadingStatusEnum;
}
class InfusionChoiceManager extends React.PureComponent<Props, State> {
  static defaultProps = {
    loadAvailableEquipment: null,
    loadAvailableInfusions: null,
  };

  loadItemsCanceler: null | Canceler = null;
  loadInfusionsCanceler: null | Canceler = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      equipment: [],
      loadingStatus: DataLoadingStatusEnum.NOT_LOADED,
    };
  }

  componentDidMount() {
    const { loadingStatus } = this.state;
    const {
      infusionChoices,
      loadAvailableEquipment,
      loadAvailableInfusions,
      globalModifiers,
      typeValueLookup,
      ruleData,
      onDefinitionsLoaded,
    } = this.props;

    if (
      infusionChoices.length &&
      loadingStatus === DataLoadingStatusEnum.NOT_LOADED
    ) {
      this.setState({
        loadingStatus: DataLoadingStatusEnum.LOADING,
      });

      // TODO fix typings "any" once axios fixes how all can have multiple return types
      axios
        .all<any>([
          loadAvailableEquipment({
            cancelToken: new axios.CancelToken((c) => {
              this.loadItemsCanceler = c;
            }),
          }),
          loadAvailableInfusions({
            cancelToken: new axios.CancelToken((c) => {
              this.loadInfusionsCanceler = c;
            }),
          }),
        ])
        .then(([equipmentResponse, infusionResponse]) => {
          let equipment: Array<Item> = [];
          let equipmentData =
            ApiAdapterUtils.getResponseData<Array<BaseItemDefinitionContract>>(
              equipmentResponse
            );
          if (equipmentData) {
            equipment = equipmentData.map((itemDefinition) => {
              return ItemUtils.simulateItem(
                itemDefinition,
                globalModifiers,
                typeValueLookup,
                ruleData
              );
            });
          }

          let infusionData =
            ApiAdapterUtils.getResponseData<
              EntitledEntity<InfusionDefinitionContract>
            >(infusionResponse);
          if (
            infusionData &&
            infusionData.definitionData.length > 0 &&
            onDefinitionsLoaded
          ) {
            onDefinitionsLoaded(
              infusionData.definitionData,
              infusionData.accessTypes
            );
          }

          this.setState({
            equipment,
            loadingStatus: DataLoadingStatusEnum.LOADED,
          });
          this.loadItemsCanceler = null;
          this.loadInfusionsCanceler = null;
        })
        .catch(AppLoggerUtils.handleAdhocApiError);
    }
  }

  componentWillUnmount(): void {
    if (this.loadItemsCanceler !== null) {
      this.loadItemsCanceler();
    }
    if (this.loadInfusionsCanceler !== null) {
      this.loadInfusionsCanceler();
    }
  }

  getItemKeyParts = (itemKey: string): Array<string> => {
    return itemKey.split("|");
  };

  getItemKey = (id: number, name: string): string => {
    return [
      DefinitionUtils.hack__generateDefinitionKey(
        Constants.FUTURE_ITEM_DEFINITION_TYPE,
        id
      ),
      name,
    ].join("|");
  };

  handleChoiceItemChangePromise = (
    infusionChoice: InfusionChoice,
    itemKey: string | null,
    oldItemKey: string | null,
    accept: () => void,
    reject: () => void
  ): void => {
    const {
      onInfusionChoiceItemChangePromise,
      onInfusionChoiceItemDestroyPromise,
    } = this.props;

    const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);

    if (choiceKey === null) {
      reject();
      return;
    }

    if (itemKey) {
      if (onInfusionChoiceItemChangePromise) {
        const knownInfusion =
          InfusionChoiceUtils.getKnownInfusion(infusionChoice);
        if (knownInfusion === null) {
          reject();
          return;
        }

        const simulatedInfusion =
          KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
        if (simulatedInfusion === null) {
          reject();
          return;
        }

        const infusionId = InfusionUtils.getId(simulatedInfusion);
        if (infusionId === null) {
          reject();
          return;
        }

        const itemKeyParts = this.getItemKeyParts(itemKey);

        onInfusionChoiceItemChangePromise(
          choiceKey,
          infusionId,
          itemKeyParts[0],
          itemKeyParts[1],
          accept,
          reject
        );
      }
    } else {
      if (onInfusionChoiceItemDestroyPromise) {
        onInfusionChoiceItemDestroyPromise(choiceKey, accept, reject);
      }
    }
  };

  handleChoiceChangePromise = (
    choiceKey: string,
    infusionId: string | null,
    oldInfusionId: string | null,
    accept: () => void,
    reject: () => void
  ): void => {
    const { onInfusionChoiceChangePromise, onInfusionChoiceDestroyPromise } =
      this.props;

    if (infusionId) {
      if (onInfusionChoiceChangePromise) {
        onInfusionChoiceChangePromise(choiceKey, infusionId, accept, reject);
      }
    } else {
      if (onInfusionChoiceDestroyPromise) {
        onInfusionChoiceDestroyPromise(choiceKey, accept, reject);
      }
    }
  };

  handleChoiceCreatePromise = (
    choiceKey: string,
    infusionId: string,
    oldInfusionId: string | null,
    accept: () => void,
    reject: () => void
  ) => {
    const { onInfusionChoiceCreatePromise } = this.props;

    if (onInfusionChoiceCreatePromise) {
      onInfusionChoiceCreatePromise(choiceKey, infusionId, accept, reject);
    }
  };

  renderInfusionReplicateItemChoice = (
    infusionChoice: InfusionChoice
  ): React.ReactNode => {
    const { equipment, loadingStatus } = this.state;
    const { contextLevel, knownReplicatedItems } = this.props;

    let knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);
    if (knownInfusion === null) {
      return null;
    }

    let simulatedInfusion =
      KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
    if (
      simulatedInfusion === null ||
      InfusionUtils.getType(simulatedInfusion) !==
        Constants.InfusionTypeEnum.REPLICATE
    ) {
      return null;
    }

    let contentNode: React.ReactNode;
    const classNames: Array<string> = [
      "ct-infusion-choice-manager__choice",
      "ct-infusion-choice-manager__choice--child",
    ];

    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      contentNode = <LoadingPlaceholder />;
    } else {
      let groups: Array<HtmlSelectOptionGroup> = [];
      let infusableItems: Array<Item> = equipment.filter((item) => {
        const levelInfusionGranted = ItemUtils.getLevelInfusionGranted(item);
        const itemDefinitionKey = ItemUtils.getDefinitionKey(item);
        let chosenItemDefinitionKey: string | null = null;
        if (knownInfusion !== null) {
          chosenItemDefinitionKey =
            KnownInfusionUtils.getItemDefinitionKey(knownInfusion);
        }
        const hasKnownReplicatedItem: boolean =
          knownReplicatedItems.includes(itemDefinitionKey);
        if (
          hasKnownReplicatedItem &&
          chosenItemDefinitionKey === itemDefinitionKey
        ) {
          return true;
        }

        return (
          !hasKnownReplicatedItem &&
          levelInfusionGranted !== null &&
          contextLevel !== null &&
          contextLevel >= levelInfusionGranted
        );
      });

      let orderedInfusableItems = orderBy(infusableItems, (item) =>
        ItemUtils.getName(item)
      );

      orderedInfusableItems.forEach((item) => {
        const levelInfusionGranted = ItemUtils.getLevelInfusionGranted(item);

        if (levelInfusionGranted === null) {
          return;
        }

        if (!groups.hasOwnProperty(levelInfusionGranted)) {
          groups[levelInfusionGranted] = {
            optGroupLabel: `Level ${levelInfusionGranted}`,
            options: [],
          };
        }

        const definitionName = ItemUtils.getDefinitionName(item);
        groups[levelInfusionGranted].options.push({
          label: definitionName,
          value: this.getItemKey(
            ItemUtils.getId(item),
            definitionName === null ? "" : definitionName
          ),
        });
      });

      groups.forEach((group) => {
        group.options = orderBy(
          group.options,
          (option: HtmlSelectOption) => option.label
        );
      });

      let selectedValue: string | null = null;
      let knownItemId = KnownInfusionUtils.getItemId(knownInfusion);
      let knownItemName = KnownInfusionUtils.getItemName(knownInfusion);
      if (knownItemId && knownItemName) {
        selectedValue = this.getItemKey(knownItemId, knownItemName);
      }

      if (selectedValue === null) {
        classNames.push("ct-infusion-choice-manager__choice--todo");
      }

      contentNode = (
        <Select
          options={groups}
          onChangePromise={this.handleChoiceItemChangePromise.bind(
            this,
            infusionChoice
          )}
          value={selectedValue}
        />
      );
    }

    return <div className={classNames.join(" ")}>{contentNode}</div>;
  };

  renderInfusionChoice = (infusionChoice: InfusionChoice): React.ReactNode => {
    const { ruleData, knownInfusionLookup, definitionPool, contextLevel } =
      this.props;

    // TODO check typing once definition pool is updated
    let infusionDefinitions = DefinitionPoolUtils.getTypedDefinitionList(
      Constants.DefinitionTypeEnum.INFUSION,
      definitionPool,
      true
    );
    let infusionOptions: Array<HtmlSelectOption> = infusionDefinitions
      .map((infusionDefinition) =>
        InfusionUtils.simulateInfusion(
          DefinitionUtils.getDefinitionKey(infusionDefinition),
          definitionPool
        )
      )
      .filter(TypeScriptUtils.isNotNullOrUndefined)
      .filter((infusion) => {
        // if the infusion allows duplicates just let it through
        if (InfusionUtils.getAllowDuplicates(infusion)) {
          return true;
        }

        const infusionDefinitionKey = InfusionUtils.getDefinitionKey(infusion);
        let knownInfusion =
          InfusionChoiceUtils.getKnownInfusion(infusionChoice);
        // if choice has the infusion, show it in the list
        if (
          knownInfusion !== null &&
          KnownInfusionUtils.getDefinitionKey(knownInfusion) ===
            infusionDefinitionKey
        ) {
          return true;
        }

        // if its already selected somewhere else and is here, it shouldnt be shown
        if (
          infusionDefinitionKey !== null &&
          HelperUtils.lookupDataOrFallback(
            knownInfusionLookup,
            infusionDefinitionKey
          )
        ) {
          return false;
        }

        if (
          !InfusionUtils.validateIsAvailableByContextLevel(
            infusion,
            contextLevel
          )
        ) {
          return false;
        }

        return true;
      })
      .map((infusion) => {
        let label: string | null = InfusionUtils.getName(infusion);

        const sources = InfusionUtils.getSources(infusion);

        const hasAllToggleableSources: boolean = sources.every(
          (sourceMapping) => {
            const sourceDataInfo = RuleDataUtils.getSourceDataInfo(
              sourceMapping.sourceId,
              ruleData
            );
            return sourceDataInfo?.sourceCategory?.isToggleable;
          }
        );

        if (sources.length && hasAllToggleableSources) {
          const calloutSources: Array<string> = sources
            .map((sourceMapping) => {
              const sourceDataInfo = RuleDataUtils.getSourceDataInfo(
                sourceMapping.sourceId,
                ruleData
              );
              return sourceDataInfo?.name ?? null;
            })
            .filter(TypeScriptUtils.isNotNullOrUndefined);

          label = `${calloutSources.join(", ")} • ${label}`;
        }

        const infusionId = InfusionUtils.getId(infusion);
        return {
          label,
          value: infusionId ?? "",
        };
      });

    let knownInfusion = InfusionChoiceUtils.getKnownInfusion(infusionChoice);

    //TODO this typing is weird because of the binding that will happen further down... may need to split this into more components to remove the bind and make more sense
    let onChangePromise: OnInfusionChangeFunc = this.handleChoiceCreatePromise;
    if (knownInfusion !== null) {
      onChangePromise = this.handleChoiceChangePromise;
    }

    let warningNode: React.ReactNode;
    let descriptionNode: React.ReactNode;
    const classNames: Array<string> = ["ct-infusion-choice-manager__choice"];
    if (knownInfusion === null) {
      classNames.push("ct-infusion-choice-manager__choice--todo");
    } else {
      const simulatedInfusion =
        KnownInfusionUtils.getSimulatedInfusion(knownInfusion);
      if (simulatedInfusion !== null) {
        const description = InfusionUtils.getDescription(simulatedInfusion);
        if (description !== null) {
          descriptionNode = (
            <HtmlContent
              className="ct-infusion-choice-manager__choice-description"
              html={description}
              withoutTooltips
            />
          );
        }

        if (
          !InfusionUtils.validateIsAvailableByContextLevel(
            simulatedInfusion,
            contextLevel
          )
        ) {
          classNames.push("ct-infusion-choice-manager__choice--warning");
          warningNode = (
            <div className="ct-infusion-choice-manager__choice-warning">
              <strong>{InfusionUtils.getName(simulatedInfusion)}</strong> is not
              a valid choice because it requires level{" "}
              <strong>{InfusionUtils.getLevel(simulatedInfusion)}</strong>.
            </div>
          );
        }
      }
    }

    let knownInfusionDefinitionKey: string | null = null;
    if (knownInfusion !== null) {
      knownInfusionDefinitionKey =
        KnownInfusionUtils.getDefinitionKey(knownInfusion);
    }

    const choiceKey = InfusionChoiceUtils.getKey(infusionChoice);
    return (
      <div
        className={classNames.join(" ")}
        key={choiceKey === null ? "" : choiceKey}
      >
        <Select
          options={infusionOptions}
          placeholder={`- Choose a Level ${InfusionChoiceUtils.getLevel(
            infusionChoice
          )} Option -`}
          onChangePromise={onChangePromise.bind(this, choiceKey)}
          value={
            knownInfusionDefinitionKey === null
              ? null
              : DefinitionUtils.getDefinitionKeyId(knownInfusionDefinitionKey)
          }
        />
        {this.renderInfusionReplicateItemChoice(infusionChoice)}
        {warningNode}
        {descriptionNode}
      </div>
    );
    //`
  };

  render() {
    const { loadingStatus } = this.state;
    const { infusionChoices } = this.props;

    if (!infusionChoices.length) {
      return null;
    }

    let contentNode: React.ReactNode;
    if (loadingStatus !== DataLoadingStatusEnum.LOADED) {
      contentNode = <LoadingPlaceholder />;
    } else {
      contentNode = (
        <React.Fragment>
          {infusionChoices.map((infusionChoice) =>
            this.renderInfusionChoice(infusionChoice)
          )}
        </React.Fragment>
      );
    }

    return (
      <div className="ct-infusion-choice-manager">
        <div className="ct-infusion-choice-manager__header">
          Infusion Choices
        </div>
        {contentNode}
      </div>
    );
  }
}

export default InfusionChoiceManager;
