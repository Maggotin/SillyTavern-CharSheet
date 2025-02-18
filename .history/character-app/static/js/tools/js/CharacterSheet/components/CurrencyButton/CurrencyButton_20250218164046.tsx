import React from "react";

import { Tooltip } from "@dndbeyond/character-common-components/es";
import { CoinIcon } from "@dndbeyond/character-components/es";
import {
  CharacterCurrencyContract,
  Constants,
  FormatUtils,
} from "../../rules-engine/es";

const generateCoinString = (coin: CharacterCurrencyContract | null): string => {
  if (!coin) {
    return "";
  }
  const pp = coin.pp ? `${coin.pp} ${Constants.CoinNamesEnum.PLATINUM}` : "";
  const gp = coin.gp ? `${coin.gp} ${Constants.CoinNamesEnum.GOLD}` : "";
  const ep = coin.ep ? `${coin.ep} ${Constants.CoinNamesEnum.ELECTRUM}` : "";
  const sp = coin.sp ? `${coin.sp} ${Constants.CoinNamesEnum.SILVER}` : "";
  const cp = coin.cp ? `${coin.cp} ${Constants.CoinNamesEnum.COPPER}` : "";

  return `${pp} ${gp} ${ep} ${sp} ${cp}`;
};

interface CurrencyRowProps {
  amount: number;
  coinType: Constants.CoinTypeEnum;
  label: string;
  isDarkMode: boolean;
}

const CurrencyRow: React.FC<CurrencyRowProps> = ({
  amount,
  coinType,
  label,
  isDarkMode,
}) => {
  return (
    <div
      className="ct-currency-button__currency-item-count"
      role="listitem"
      aria-label={`${amount} ${label}`}
    >
      <Tooltip
        isDarkMode={isDarkMode}
        className={`ct-currency-button__currency-item`}
        title={label}
        isInteractive={true}
      >
        <span className="ct-currency-button__currency-item-count">
          {FormatUtils.renderLocaleNumber(amount)}
        </span>
        <span
          aria-label={label}
          className="ct-currency-button__currency-item-preview"
        >
          <CoinIcon coinType={coinType} />
        </span>
      </Tooltip>
    </div>
  );
};

interface CoinProps {
  coin: CharacterCurrencyContract;
  isDarkMode: boolean;
}

const Coins: React.FC<CoinProps> = ({ coin, isDarkMode }) => {
  let renderEmptyGold: boolean = false;
  if (!coin.pp && !coin.gp && !coin.ep && !coin.sp && !coin.cp) {
    renderEmptyGold = true;
  }
  return (
    <div className="ct-currency-button__currency-items">
      {!!coin.pp && (
        <CurrencyRow
          amount={coin.pp}
          coinType={Constants.CoinTypeEnum.pp}
          label={Constants.CoinNamesEnum.PLATINUM}
          isDarkMode={isDarkMode}
        />
      )}

      {(!!coin.gp || renderEmptyGold) && (
        <CurrencyRow
          amount={coin.gp}
          coinType={Constants.CoinTypeEnum.gp}
          label={Constants.CoinNamesEnum.GOLD}
          isDarkMode={isDarkMode}
        />
      )}
      {!!coin.ep && (
        <CurrencyRow
          amount={coin.ep}
          coinType={Constants.CoinTypeEnum.ep}
          label={Constants.CoinNamesEnum.ELECTRUM}
          isDarkMode={isDarkMode}
        />
      )}
      {!!coin.sp && (
        <CurrencyRow
          amount={coin.sp}
          coinType={Constants.CoinTypeEnum.sp}
          label={Constants.CoinNamesEnum.SILVER}
          isDarkMode={isDarkMode}
        />
      )}
      {!!coin.cp && (
        <CurrencyRow
          amount={coin.cp}
          coinType={Constants.CoinTypeEnum.cp}
          label={Constants.CoinNamesEnum.COPPER}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

interface Props {
  coin: CharacterCurrencyContract | null;
  isDarkMode: boolean;
  shouldShowPartyInventory: boolean;
  handleCurrencyClick: (evt: React.KeyboardEvent | React.MouseEvent) => void;
}

export const CurrencyButton: React.FC<Props> = ({
  coin,
  isDarkMode,
  shouldShowPartyInventory,
  handleCurrencyClick,
}) => {
  return (
    <div
      role="button"
      aria-label={`Manage ${
        shouldShowPartyInventory ? "Party " : ""
      }Coin ${generateCoinString(coin)}`}
      className="ct-currency-button__currency"
      onClick={handleCurrencyClick}
      onKeyDown={(evt) => {
        if (evt.key === "Enter") {
          handleCurrencyClick(evt);
        }
      }}
    >
      {coin ? (
        <Coins coin={coin} isDarkMode={isDarkMode} />
      ) : (
        <div className="ct-currency-button__currency-items">
          <CurrencyRow
            amount={0}
            coinType={Constants.CoinTypeEnum.gp}
            label={Constants.CoinNamesEnum.GOLD}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};

export default CurrencyButton;
