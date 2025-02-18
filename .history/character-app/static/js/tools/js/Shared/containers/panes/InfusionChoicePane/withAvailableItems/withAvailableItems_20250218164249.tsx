import axios, { Canceler } from "axios";
import * as React from "react";

import {
  ApiAdapterPromise,
  ApiAdapterRequestConfig,
  ApiAdapterUtils,
  ApiResponse,
  BaseItemDefinitionContract,
  CharacterTheme,
  InfusionChoice,
  Item,
  ItemUtils,
  Modifier,
  RuleData,
  TypeValueLookup,
} from "../../character-rules-engine/es";

import DataLoadingStatusEnum from "../../../../constants/DataLoadingStatusEnum";
import { AppLoggerUtils } from "../../../../utils";

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export interface RequiredWithAvailableItemsProps {
  ruleData: RuleData;
  globalModifiers: Array<Modifier>;
  typeValueLookup: TypeValueLookup;
  loadAvailableItems: (
    additionalConfig?: Partial<ApiAdapterRequestConfig>
  ) => ApiAdapterPromise<ApiResponse<Array<BaseItemDefinitionContract>>>;
  theme?: CharacterTheme;
  infusionChoice: InfusionChoice;
  onItemSelected: (item: Item) => void;
  proficiencyBonus: number;
}
interface State {
  loadingStatus: DataLoadingStatusEnum;
  availableItems: Array<Item>;
}
export function withAvailableItems<
  C extends React.ComponentType<React.ComponentProps<C>>,
  ResolvedProps = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>
>(WrappedComponent) {
  return class withAvailableItems extends React.PureComponent<
    ResolvedProps & RequiredWithAvailableItemsProps,
    State
  > {
    static displayName = `withAvailableItems(${getDisplayName(
      WrappedComponent
    )})`;

    loadAvailableItemsCanceler: null | Canceler = null;

    constructor(props) {
      super(props);

      this.state = {
        loadingStatus: DataLoadingStatusEnum.NOT_LOADED,
        availableItems: [],
      };
    }

    componentDidMount() {
      const { loadingStatus } = this.state;
      const { loadAvailableItems, globalModifiers, typeValueLookup, ruleData } =
        this.props;

      if (loadingStatus === DataLoadingStatusEnum.NOT_LOADED) {
        this.setState({
          loadingStatus: DataLoadingStatusEnum.LOADING,
        });

        loadAvailableItems({
          cancelToken: new axios.CancelToken((c) => {
            this.loadAvailableItemsCanceler = c;
          }),
        })
          .then((itemResponse) => {
            let availableItems: Array<Item> = [];
            const itemData = ApiAdapterUtils.getResponseData(itemResponse);
            if (itemData) {
              availableItems = itemData.map((itemDefinition) => {
                return ItemUtils.simulateItem(
                  itemDefinition,
                  globalModifiers,
                  typeValueLookup,
                  ruleData
                );
              });
            }

            this.setState({
              availableItems,
              loadingStatus: DataLoadingStatusEnum.LOADED,
            });
            this.loadAvailableItemsCanceler = null;
          })
          .catch(AppLoggerUtils.handleAdhocApiError);
      }
    }

    componentWillUnmount(): void {
      if (this.loadAvailableItemsCanceler !== null) {
        this.loadAvailableItemsCanceler();
      }
    }

    render() {
      const { loadingStatus, availableItems } = this.state;

      let itemCanBeAddedLookup: Record<number, boolean> = availableItems.reduce(
        (acc, item) => {
          acc[ItemUtils.getId(item)] = ItemUtils.canBeAddedToInventory(item);
          return acc;
        },
        {}
      );

      return (
        <WrappedComponent
          items={availableItems}
          itemCanBeAddedLookup={itemCanBeAddedLookup}
          itemLoadingStatus={loadingStatus}
          {...(this.props as JSX.LibraryManagedAttributes<
            C,
            React.ComponentProps<C>
          >)}
        />
      );
    }
  };
}

export default withAvailableItems;
