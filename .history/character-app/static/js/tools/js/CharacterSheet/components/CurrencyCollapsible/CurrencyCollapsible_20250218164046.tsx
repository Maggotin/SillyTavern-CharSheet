import React from "react";
import { useContext } from "react";

import {
  CoinIcon,
  Collapsible,
  CollapsibleHeaderContent,
} from "@dndbeyond/character-components/es";
import {
  FormatUtils,
  ContainerUtils,
  Container,
  Constants,
  CharacterCurrencyContract,
} from "../../rules-engine/es";

import CurrencyPaneAdjuster from "../../../Shared/containers/panes/CurrencyPane/CurrencyPaneAdjuster";
import { CurrencyErrorTypeEnum } from "../../../Shared/containers/panes/CurrencyPane/CurrencyPaneConstants";
import CurrencyPaneCurrencyRow from "../../../Shared/containers/panes/CurrencyPane/CurrencyPaneCurrencyRow";
import { CoinManagerContext } from "../../../Shared/managers/CoinManagerContext";

interface Props {
  initiallyCollapsed: boolean;
  isReadonly: boolean;
  container: Container;
  heading: string;
  handleCurrencyChangeError: (
    currencyName: string,
    errorType: CurrencyErrorTypeEnum
  ) => void;
  handleCurrencyAdjust: (
    coin: Partial<CharacterCurrencyContract>,
    multiplier: 1 | -1,
    containerDefinitionKey: string
  ) => void;
  handleAmountSet: (
    containerDefinitionKey: string,
    key: keyof CharacterCurrencyContract,
    amount: number
  ) => void;
}

const CoinContent = ({
  containerDefinitionKey,
  isReadonly,
  handleCurrencyChangeError,
  handleCurrencyAdjust,
  handleAmountSet,
}) => {
  const { coinManager } = useContext(CoinManagerContext);
  if (!coinManager) {
    return null;
  }
  const coin = coinManager.getContainerCoin(containerDefinitionKey);
  if (!coin) {
    return null;
  }
  const { pp, gp, ep, sp, cp } = coin;

  const shouldReadonly =
    isReadonly ||
    (containerDefinitionKey ===
      coinManager.getPartyEquipmentContainerDefinitionKey() &&
      coinManager.isSharingTurnedDeleteOnly());

  return (
    <React.Fragment>
      <div className="ct-currency-pane__currencies">
        <CurrencyPaneCurrencyRow
          name="Platinum (pp)"
          onChange={(value) =>
            handleAmountSet(containerDefinitionKey, "pp", value)
          }
          onError={(errorType) =>
            handleCurrencyChangeError("Platinum", errorType)
          }
          value={pp}
          coinType={Constants.CoinTypeEnum.pp}
          conversion="1 pp = 10 gp"
          isReadonly={shouldReadonly}
        />
        <CurrencyPaneCurrencyRow
          name="Gold (gp)"
          onChange={(value) =>
            handleAmountSet(containerDefinitionKey, "gp", value)
          }
          onError={(errorType) => handleCurrencyChangeError("Gold", errorType)}
          value={gp}
          coinType={Constants.CoinTypeEnum.gp}
          isReadonly={shouldReadonly}
        />
        <CurrencyPaneCurrencyRow
          name="Electrum (ep)"
          onChange={(value) =>
            handleAmountSet(containerDefinitionKey, "ep", value)
          }
          onError={(errorType) =>
            handleCurrencyChangeError("Electrum", errorType)
          }
          value={ep}
          conversion="1 gp = 2 ep"
          coinType={Constants.CoinTypeEnum.ep}
          isReadonly={shouldReadonly}
        />
        <CurrencyPaneCurrencyRow
          name="Silver (sp)"
          onChange={(value) =>
            handleAmountSet(containerDefinitionKey, "sp", value)
          }
          onError={(errorType) =>
            handleCurrencyChangeError("Silver", errorType)
          }
          value={sp}
          conversion="1 gp = 10 sp"
          coinType={Constants.CoinTypeEnum.sp}
          isReadonly={shouldReadonly}
        />
        <CurrencyPaneCurrencyRow
          name="Copper (cp)"
          onChange={(value) =>
            handleAmountSet(containerDefinitionKey, "cp", value)
          }
          onError={(errorType) =>
            handleCurrencyChangeError("Copper", errorType)
          }
          value={cp}
          conversion="1 gp = 100 cp"
          isReadonly={shouldReadonly}
          coinType={Constants.CoinTypeEnum.cp}
        />
      </div>
      {(coinManager.isSharingTurnedOn() ||
        !coinManager.isSharedContainerDefinitionKey(
          containerDefinitionKey
        )) && (
        <CurrencyPaneAdjuster
          onAdjust={handleCurrencyAdjust}
          isReadonly={isReadonly}
          containerDefinitionKey={containerDefinitionKey}
        />
      )}
    </React.Fragment>
  );
};

export const CurrencyCollapsible: React.FC<Props> = ({
  initiallyCollapsed,
  container,
  handleCurrencyChangeError,
  isReadonly,
  handleCurrencyAdjust,
  handleAmountSet,
  heading,
}: Props) => {
  const { coinManager } = useContext(CoinManagerContext);
  const containerDefinitionKey = ContainerUtils.getDefinitionKey(container);
  return (
    <Collapsible
      initiallyCollapsed={initiallyCollapsed}
      overrideCollapsed={initiallyCollapsed}
      header={
        <CollapsibleHeaderContent
          heading={heading}
          callout={
            <span className="ct-currency-pane__collapsible-callout">
              {FormatUtils.renderLocaleNumber(
                coinManager?.getTotalContainerCoinInGold(
                  ContainerUtils.getDefinitionKey(container)
                ) ?? 0
              )}{" "}
              <span className="ct-currency-pane__collapsible-callout-icon">
                <CoinIcon coinType={Constants.CoinTypeEnum.gp} />
              </span>
            </span>
          }
        />
      }
    >
      <CoinContent
        containerDefinitionKey={containerDefinitionKey}
        isReadonly={isReadonly}
        handleCurrencyChangeError={handleCurrencyChangeError}
        handleCurrencyAdjust={handleCurrencyAdjust}
        handleAmountSet={handleAmountSet}
      />
    </Collapsible>
  );
};

export default CurrencyCollapsible;
