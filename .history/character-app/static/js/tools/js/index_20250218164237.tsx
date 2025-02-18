// import axe from '@axe-core/react';
import { css } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import React from "react";
import Modal from "react-modal";
import { Provider } from "react-redux";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { Store } from "redux";

import {
  characterEnvActions,
  ConfigUtils,
  Constants,
  generateApiAdapter,
} from "../../character-rules-engine/es";

import config from "~/config";
import { CharacterThemeProvider } from "~/contexts/CharacterTheme";
import { SidebarProvider } from "~/contexts/Sidebar";
import useUserId from "~/hooks/useUserId";
import useUserName from "~/hooks/useUserName";
import useUserRoles from "~/hooks/useUserRoles";

import "../styles/styles.scss";
import CharacterBuilderContainer from "./CharacterBuilder/containers/CharacterBuilderContainer";
import CharacterSheetContainer from "./CharacterSheet/containers/CharacterSheetContainer";
import configureSheetStore from "./CharacterSheet/store/configureStore";
import { appEnvActions } from "./Shared/actions";
import { Managers } from "./Shared/managers";
import {
  DiceFeatureConfigurationState,
  GameLogState,
} from "./Shared/stores/typings";
import {
  AppLoggerUtils,
  AppNotificationUtils,
  ErrorUtils,
} from "./Shared/utils";
import appConfig from "./config";

const BASE_PATHNAME = config.basePathname;

interface Props {
  readOnly: boolean;
  redirect?: string;
  characterId: number | null;
}

export const SheetBuilderApp: React.FC<Props> = ({
  readOnly,
  characterId,
  redirect,
}) => {
  const username = useUserName();
  const userId = useUserId();
  const userRoles = useUserRoles();
  const navigate = useNavigate();
  const matchBuilderWithOutCharacter = useMatch(`${BASE_PATHNAME}/builder/*`);
  const matchBuilderWithCharacter = useMatch(
    `${BASE_PATHNAME}/:characterId/builder/*`
  );
  const matchSheet = useMatch(`${BASE_PATHNAME}/:characterId/`);
  const matchSheetWithShareId = useMatch(
    `${BASE_PATHNAME}/:characterId/:shareId`
  );
  const currentPath = useLocation().pathname;

  if (config === undefined) {
    throw Error("Missing Config");
  }

  let appContext: Constants.AppContextTypeEnum | null = null;
  switch (true) {
    case !!(matchBuilderWithOutCharacter || matchBuilderWithCharacter):
      appContext = Constants.AppContextTypeEnum.BUILDER;
      break;
    case !!(matchSheet || matchSheetWithShareId):
      appContext = Constants.AppContextTypeEnum.SHEET;
      break;
    default:
      throw new Error("Invalid app context");
  }

  const diceFeatureConfiguration: DiceFeatureConfigurationState = {
    enabled: true,
    menu: true,
    assetBaseLocation: config.diceAssetEndpoint,
    apiEndpoint: config.diceApiEndpoint,
    trackingId: config.analyticTrackingId,
  };

  ErrorUtils.initReporting({
    debug: appConfig.debug,
  });

  let store: Store = configureSheetStore();
  store.dispatch({
    type: "SET_ROUTE_CONTROLS",
    payload: { navigate, currentPath },
  });

  let parsedDiceEnabled: boolean = true;
  if (!diceFeatureConfiguration.enabled) {
    parsedDiceEnabled = false;
  } else {
    // if local storage is disabled it will just crash when trying to access, this prevents crashing.
    try {
      const diceEnabled = localStorage.getItem("dice-enabled");
      // once dice are enabled set the default to on;
      parsedDiceEnabled = diceEnabled === "true" || diceEnabled === null;
    } catch (e) {}
  }

  let lastMessageTime = 0;
  try {
    const lsLastMessageTime = localStorage.getItem(
      `gameLog-lastMessageTime-${characterId}`
    );
    if (lsLastMessageTime) {
      lastMessageTime = parseInt(lsLastMessageTime);
    }
  } catch (e) {}

  const gameLogSettings: GameLogState = {
    isOpen: false,
    lastMessageTime: lastMessageTime,
    apiEndpoint: config.gameLogApiEndpoint,
    ddbApiEndpoint: config.ddbApiEndpoint,
  };

  ConfigUtils.configureRulesEngine({
    apiAdapter: generateApiAdapter(config.authEndpoint, readOnly),
    apiInfo: config.apiInfo,
    store,
    onLogMessage: AppLoggerUtils.logMessage,
    onLogError: AppLoggerUtils.logError,
    onNotification: AppNotificationUtils.dispatchNotification,
    includeCustomItems: true,
    canUseCurrencyContainers: true,
  });

  store.dispatch(
    characterEnvActions.dataSet({
      context: appContext,
    })
  );

  store.dispatch(
    appEnvActions.dataSet({
      username,
      userId: userId ? Number(userId) : -1,
      userRoles,
      characterId,
      authEndpoint: config.authEndpoint,
      redirect,
      diceEnabled: parsedDiceEnabled,
      diceFeatureConfiguration: diceFeatureConfiguration,
      gameLog: gameLogSettings,
    })
  );

  // Setup axe-core in development, not in production
  if (process.env.NODE_ENV !== "production") {
    // axe(React, ReactDOM, 10000);
  }

  Modal.setAppElement("#character-tools-target");
  return (
    <Provider store={store}>
      <Managers>
        <CharacterThemeProvider>
          <SidebarProvider>
            <GlobalStyles
              styles={() => {
                return css`
                  input,
                  button,
                  select,
                  textarea {
                    font-family: Roboto, Helvetica, sans-serif;
                    font-size: 100%;
                    margin: 0;
                    vertical-align: baseline;
                  }

                  input[type="text"],
                  input[type="number"],
                  input[type="search"],
                  input[type="password"],
                  input[type="email"],
                  textarea,
                  select {
                    background-color: #fff;
                    background: #fff none;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                    color: #000;
                    padding: 4px;
                    transition: 0.2s linear border, 0.2s linear box-shadow;
                  }

                  input[type="text"]:focus,
                  input[type="number"]:focus,
                  input[type="search"]:focus,
                  input[type="password"]:focus,
                  input[type="email"]:focus,
                  textarea:focus {
                    border-color: #242527;
                    box-shadow: 0 0 4px rgba(36, 37, 39, 0.6);
                    background-color: #f9f9f9;
                    outline: 0;
                  }

                  button,
                  input[type="button"],
                  input[type="reset"],
                  input[type="submit"] {
                    cursor: pointer;
                  }
                `;
              }}
            />
            {matchBuilderWithOutCharacter || matchBuilderWithCharacter ? (
              <CharacterBuilderContainer />
            ) : (
              <CharacterSheetContainer authEndpoint={config.authEndpoint} />
            )}
          </SidebarProvider>
        </CharacterThemeProvider>
      </Managers>
    </Provider>
  );
};
