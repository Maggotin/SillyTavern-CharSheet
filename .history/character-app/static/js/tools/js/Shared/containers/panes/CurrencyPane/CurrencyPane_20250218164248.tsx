import React, { useContext } from "react";
import { connect, DispatchProp } from "react-redux";

import { FeatureFlagContext } from "@dndbeyond/character-components/es";
import {
  characterActions,
  CharacterCurrencyContract,
  CharacterLifestyleContract,
  CoinManager,
  Container,
  ContainerUtils,
  FormatUtils,
  RuleData,
  rulesEngineSelectors,
  serviceDataSelectors,
} from "../../character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneIdentifiersCurrencyContext } from "~/subApps/sheet/components/Sidebar/types";

import CurrencyCollapsible from "../../../../CharacterSheet/components/CurrencyCollapsible";
import Lifestyle from "../../../../CharacterSheet/components/Lifestyle";
import SettingsButton from "../../../../CharacterSheet/components/SettingsButton";
import * as toastActions from "../../../actions/toastMessage/actions";
import { CURRENCY_VALUE } from "../../../constants/App";
import { CoinManagerContext } from "../../../managers/CoinManagerContext";
import * as appEnvSelectors from "../../../selectors/appEnv";
import { SharedAppState } from "../../../stores/typings";
import { SettingsContextsEnum } from "../SettingsPane/typings";
import { CurrencyErrorTypeEnum } from "./CurrencyPaneConstants";

interface Props extends DispatchProp {
  lifestyle: CharacterLifestyleContract | null;
  coin: CharacterCurrencyContract;
  ruleData: RuleData;
  isReadonly: boolean;
  identifiers: PaneIdentifiersCurrencyContext | null;
  coinManager: CoinManager;
  characterContainers: Array<Container>;
  partyContainers: Array<Container>;
}
class CurrencyPane extends React.PureComponent<Props> {
  hasCurrencyValueChanged = (
    value: number,
    currencyKey: keyof CharacterCurrencyContract,
    coin: CharacterCurrencyContract
  ): boolean => {
    return value !== coin[currencyKey];
  };

  handleCurrencyChangeError = (
    currencyName: string,
    errorType: CurrencyErrorTypeEnum
  ): void => {
    const { dispatch } = this.props;

    let message: string = "";
    if (errorType === CurrencyErrorTypeEnum.MIN) {
      message =
        "Cannot set currency to a negative value, the previous amount has been set instead.";
    }

    if (errorType === CurrencyErrorTypeEnum.MAX) {
      message = `The max amount allowed for each currency type is ${FormatUtils.renderLocaleNumber(
        CURRENCY_VALUE.MAX
      )}, the previous value has been set instead.`;
    }

    if (errorType !== null) {
      dispatch(
        toastActions.toastError(
          `Unable to Set Currency: ${currencyName}`,
          message
        )
      );
    }
  };

  handleCurrencyAdjust = (
    coin: Partial<CharacterCurrencyContract>,
    multiplier: 1 | -1,
    containerDefinitionKey: string
  ): void => {
    const { coinManager, dispatch } = this.props;

    let actionLabel: string = "";
    if (multiplier === 1) {
      actionLabel = "Add";
    } else if (multiplier === -1) {
      actionLabel = "Delete";
    }

    coinManager.handleTransaction(
      { coin, containerDefinitionKey, multiplier },
      () => {
        // dispatch(toastActions.toastSuccess(
        //     `A ${containerDefinitionKey === coinManager.getPartyEquipmentContainerDefinitionKey() ? 'Party' : ''}Coin transaction was completed!`,
        //     'could list the updates?'
        // ));
      },
      () => {
        dispatch(
          toastActions.toastError(
            `Unable to make transaction: ${actionLabel} Coin`,
            "Cannot set currency to a negative value, the previous amount has been set instead."
          )
        );
      }
    );
  };

  handleAmountSet = (
    containerDefinitionKey: string,
    key: keyof CharacterCurrencyContract,
    amount: number
  ): void => {
    const { coinManager } = this.props;
    const coin = coinManager.getContainerCoin(containerDefinitionKey);

    if (coin && this.hasCurrencyValueChanged(amount, key, coin)) {
      coinManager.handleAmountSet({
        key,
        amount,
        containerDefinitionKey,
      });
    }
  };

  handleLifestyleUpdate = (propertyKey: string, value: number | null): void => {
    const { dispatch } = this.props;

    dispatch(characterActions.lifestyleSet(value));
  };

  renderCharacterCoin = (characterContainer: Container) => {
    const { isReadonly, ruleData, lifestyle } = this.props;

    return (
      <React.Fragment>
        <div
          role="heading"
          aria-level={2}
          className="ct-currency-pane__subheader"
        >
          My Coin
        </div>
        <CurrencyCollapsible
          heading="Total (in gp)"
          initiallyCollapsed={false}
          isReadonly={isReadonly}
          container={characterContainer}
          handleCurrencyChangeError={this.handleCurrencyChangeError.bind(this)}
          handleCurrencyAdjust={this.handleCurrencyAdjust.bind(this)}
          handleAmountSet={this.handleAmountSet.bind(this)}
        />
        <Lifestyle
          isReadonly={isReadonly}
          handleLifestyleUpdate={this.handleLifestyleUpdate.bind(this)}
          lifestyle={lifestyle}
          ruleData={ruleData}
        />
      </React.Fragment>
    );
  };

  renderWithoutCointainers() {
    const {
      identifiers,
      coinManager,
      characterContainers,
      partyContainers,
      isReadonly,
      lifestyle,
      ruleData,
    } = this.props;

    const containerDefinitionKeyContext =
      identifiers?.containerDefinitionKeyContext;
    const partyDefinitionKey =
      coinManager.getPartyEquipmentContainerDefinitionKey();

    const characterContainer = characterContainers.find(
      (container) =>
        ContainerUtils.getDefinitionKey(container) ===
        coinManager.getCharacterContainerDefinitionKey()
    );
    const partyContainer = partyContainers.find(
      (container) =>
        ContainerUtils.getDefinitionKey(container) === partyDefinitionKey
    );

    return (
      <FeatureFlagContext.Consumer>
        {({ imsFlag }) => (
          <div className="ct-currency-pane">
            <Header
              callout={
                <SettingsButton
                  context={SettingsContextsEnum.COIN}
                  isReadonly={isReadonly}
                />
              }
            >
              Manage Coin
            </Header>
            {imsFlag &&
            coinManager.isSharingTurnedOnOrDeleteOnly() &&
            partyDefinitionKey ? (
              <React.Fragment>
                <div
                  role="heading"
                  aria-level={2}
                  className="ct-currency-pane__subheader"
                >
                  My Coin
                </div>
                {characterContainer && (
                  <CurrencyCollapsible
                    heading={this.deriveCoinLabel(
                      ContainerUtils.getName(characterContainer)
                    )}
                    initiallyCollapsed={
                      containerDefinitionKeyContext !==
                      ContainerUtils.getDefinitionKey(characterContainer)
                    }
                    isReadonly={isReadonly}
                    container={characterContainer}
                    handleCurrencyChangeError={this.handleCurrencyChangeError.bind(
                      this
                    )}
                    handleCurrencyAdjust={this.handleCurrencyAdjust.bind(this)}
                    handleAmountSet={this.handleAmountSet.bind(this)}
                  />
                )}
                <Lifestyle
                  isReadonly={isReadonly}
                  handleLifestyleUpdate={this.handleLifestyleUpdate.bind(this)}
                  lifestyle={lifestyle}
                  ruleData={ruleData}
                />
                <div
                  role="heading"
                  aria-level={2}
                  className="ct-currency-pane__subheader"
                >
                  Party Coin
                </div>
                {partyContainer && (
                  <CurrencyCollapsible
                    heading={this.deriveCoinLabel(
                      ContainerUtils.getName(partyContainer)
                    )}
                    initiallyCollapsed={
                      containerDefinitionKeyContext !==
                      ContainerUtils.getDefinitionKey(partyContainer)
                    }
                    isReadonly={isReadonly}
                    container={partyContainer}
                    handleCurrencyChangeError={this.handleCurrencyChangeError.bind(
                      this
                    )}
                    handleCurrencyAdjust={this.handleCurrencyAdjust.bind(this)}
                    handleAmountSet={this.handleAmountSet.bind(this)}
                  />
                )}
              </React.Fragment>
            ) : (
              characterContainer && this.renderCharacterCoin(characterContainer)
            )}
          </div>
        )}
      </FeatureFlagContext.Consumer>
    );
  }

  deriveCoinLabel = (containerName): string => {
    switch (containerName) {
      case "Equipment":
        return "My Equipment";
      default:
        return containerName;
    }
  };

  renderWithCointainers() {
    const {
      coinManager,
      partyContainers,
      identifiers,
      characterContainers,
      isReadonly,
      lifestyle,
      ruleData,
    } = this.props;
    const partyDefinitionKey =
      coinManager.getPartyEquipmentContainerDefinitionKey();
    const containerDefinitionKeyContext =
      identifiers?.containerDefinitionKeyContext;
    return (
      <FeatureFlagContext.Consumer>
        {({ imsFlag }) => (
          <div className="ct-currency-pane">
            <Header
              callout={
                <SettingsButton
                  context={SettingsContextsEnum.COIN}
                  isReadonly={isReadonly}
                />
              }
            >
              Manage Coin
            </Header>
            <div
              role="heading"
              aria-level={2}
              className="ct-currency-pane__subheader"
            >
              My Coin
            </div>
            {characterContainers.map((characterContainer) =>
              ContainerUtils.getCoin(characterContainer) ? (
                <CurrencyCollapsible
                  heading={this.deriveCoinLabel(
                    ContainerUtils.getName(characterContainer)
                  )}
                  key={ContainerUtils.getDefinitionKey(characterContainer)}
                  initiallyCollapsed={
                    containerDefinitionKeyContext !==
                    ContainerUtils.getDefinitionKey(characterContainer)
                  }
                  isReadonly={isReadonly}
                  container={characterContainer}
                  handleCurrencyChangeError={this.handleCurrencyChangeError.bind(
                    this
                  )}
                  handleCurrencyAdjust={this.handleCurrencyAdjust.bind(this)}
                  handleAmountSet={this.handleAmountSet.bind(this)}
                />
              ) : null
            )}
            <Lifestyle
              isReadonly={isReadonly}
              handleLifestyleUpdate={this.handleLifestyleUpdate.bind(this)}
              lifestyle={lifestyle}
              ruleData={ruleData}
            />
            {imsFlag &&
              coinManager.isSharingTurnedOnOrDeleteOnly() &&
              partyDefinitionKey && (
                <>
                  <div
                    role="heading"
                    aria-level={2}
                    className="ct-currency-pane__subheader"
                  >
                    Party Coin
                  </div>
                  {partyContainers.map((partyContainer) =>
                    ContainerUtils.getCoin(partyContainer) ? (
                      <CurrencyCollapsible
                        heading={this.deriveCoinLabel(
                          ContainerUtils.getName(partyContainer)
                        )}
                        key={ContainerUtils.getDefinitionKey(partyContainer)}
                        initiallyCollapsed={
                          containerDefinitionKeyContext !==
                          ContainerUtils.getDefinitionKey(partyContainer)
                        }
                        isReadonly={isReadonly}
                        container={partyContainer}
                        handleCurrencyChangeError={this.handleCurrencyChangeError.bind(
                          this
                        )}
                        handleCurrencyAdjust={this.handleCurrencyAdjust.bind(
                          this
                        )}
                        handleAmountSet={this.handleAmountSet.bind(this)}
                      />
                    ) : null
                  )}
                </>
              )}
          </div>
        )}
      </FeatureFlagContext.Consumer>
    );
  }

  render() {
    const { coinManager } = this.props;
    return coinManager.canUseCointainers()
      ? this.renderWithCointainers()
      : this.renderWithoutCointainers();
  }
}

function mapStateToProps(state: SharedAppState) {
  return {
    coin: rulesEngineSelectors.getCurrencies(state),
    partyInfo: serviceDataSelectors.getPartyInfo(state),
    ruleData: rulesEngineSelectors.getRuleData(state),
    lifestyle: rulesEngineSelectors.getLifestyle(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    characterContainers:
      rulesEngineSelectors.getCharacterInventoryContainers(state),
    partyContainers: rulesEngineSelectors.getPartyInventoryContainers(state),
  };
}

const CurrencyPaneContainer = (props) => {
  const { coinManager } = useContext(CoinManagerContext);
  return <CurrencyPane coinManager={coinManager} {...props} />;
};

export default connect(mapStateToProps)(CurrencyPaneContainer);
