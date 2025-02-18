import { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { DispatchProp, useDispatch, useSelector } from "react-redux";

import { TypeScriptUtils } from "@dndbeyond/character-components/es";
import {
  ApiAdapterUtils,
  CharacterTheme,
  ConfigUtils,
  rulesEngineSelectors,
  Constants,
  ApiException,
  CampaignDataContract,
  CampaignUtils,
  characterEnvSelectors,
} from "@dndbeyond/character-rules-engine/es";
import { Dice, DiceNotifier, IRollContext } from "@dndbeyond/dice";
import { DiceToolbar } from "@dndbeyond/dice-components";
import { GameLogContext } from "@dndbeyond/game-log-components";
import { getMessageBroker } from "@dndbeyond/message-broker-lib";

import { useAuth } from "~/contexts/Authentication";

import { appEnvActions } from "../../actions/appEnv";
import {
  appEnvSelectors,
  characterRollContextSelectors,
} from "../../selectors";
import {
  DiceFeatureConfigurationState,
  SharedAppState,
} from "../../stores/typings";
import { AppLoggerUtils } from "../../utils";

interface Props extends DispatchProp {
  campaign: CampaignDataContract | null;
  canShow: boolean;
  theme: CharacterTheme;
  diceEnabled: boolean;
  diceFeatureConfiguration: DiceFeatureConfigurationState;
  characterRollContext: IRollContext;
}

// <canvas id="dice-rolling-canvas" className={'dice-rolling-panel__container'} />
// this is the canvas element that we will use to draw the dice
// TODO: this is a temporary solution, we need to find a better way to do this
// waiting for adventure team to provide a better solution
const canvasElement = document.createElement("canvas");
canvasElement.id = "dice-rolling-canvas";
canvasElement.classList.add("dice-rolling-panel__container");

export default function DiceContainer({ canShow = true }) {
  const dispatch = useDispatch();
  const theme = useSelector(rulesEngineSelectors.getCharacterTheme);
  const diceEnabled = useSelector(appEnvSelectors.getDiceEnabled);
  const diceFeatureConfiguration = useSelector(
    appEnvSelectors.getDiceFeatureConfiguration
  );
  const characterRollContext = useSelector(
    characterRollContextSelectors.getCharacterRollContext
  );
  const campaign = useSelector(rulesEngineSelectors.getCampaign);
  const userConfigApi = "/diceuserconfig/v1/get";
  const authUser = useAuth();
  let userId: string | null = null;
  if (authUser?.id) {
    userId = authUser.id;
  }
  const [{ messageTargetOptions, defaultMessageTargetOption }] =
    useContext(GameLogContext);
  const canvasContainer = useRef<HTMLDivElement | null>(null);

  const isSheet =
    useSelector(characterEnvSelectors.getContext) ===
    Constants.AppContextTypeEnum.SHEET;

  useEffect(() => {
    if (!canvasContainer.current?.contains(canvasElement)) {
      canvasContainer.current?.appendChild(canvasElement);
    }
  });

  useEffect(() => {
    getMessageBroker().then((mb) => {
      if (mb && campaign && userId) {
        mb.gameId = isSheet ? CampaignUtils.getId(campaign).toString() : "0";
        mb.userId = userId;
      }
      ConfigUtils.configureRulesEngine({ messageBroker: mb });
      if (diceFeatureConfiguration.enabled) {
        const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
        if (rulesEngineConfig.apiAdapter) {
          rulesEngineConfig.apiAdapter
            .get(`${diceFeatureConfiguration.apiEndpoint}${userConfigApi}`)
            .then((x) => {
              const diceCanvas = canvasElement;
              Dice.init({
                isDebug: false,
                assetBaseLocation: diceFeatureConfiguration.assetBaseLocation,
                trackingId: diceFeatureConfiguration.trackingId,
                sessionName: "Dice",
                notifier: new DiceNotifier(),
                canvas: diceCanvas || undefined,
                previewMode: false,
                diceUserConfig: ApiAdapterUtils.getResponseData(x) as any,
              })
                .then(() =>
                  document.addEventListener("click", () => Dice.clear())
                )
                .catch((error: Error) => {
                  AppLoggerUtils.logMessage(
                    error.message,
                    Constants.LogMessageType.WARNING
                  );
                  dispatch(
                    appEnvActions.dataSet({
                      diceEnabled: false,
                    })
                  );
                });
            })
            .catch((error: ApiException) => {
              AppLoggerUtils.logMessage(
                error.message,
                Constants.LogMessageType.WARNING
              );
              dispatch(
                appEnvActions.dataSet({
                  diceEnabled: false,
                })
              );
            });
        }
      } else {
        Dice.analyticsInit(diceFeatureConfiguration.trackingId, "Dice");
      }
    });
  }, [diceFeatureConfiguration, dispatch]);

  return ReactDOM.createPortal(
    <div className={"dice-rolling-panel"} ref={canvasContainer}>
      {canShow && diceEnabled && (
        <DiceToolbar
          rollContext={characterRollContext}
          rollTargetOptions={
            messageTargetOptions && isSheet
              ? Object.values(messageTargetOptions?.entities).filter(
                  TypeScriptUtils.isNotNullOrUndefined
                )
              : undefined
          }
          rollTargetDefault={defaultMessageTargetOption}
          themeColor={theme.themeColor}
          userId={parseInt(userId || "0", 10)}
        />
      )}
      {/* We want this one so it is sticking around, 
            also this is where the canvas goes when we append */}
      {/* <canvas className={'dice-rolling-panel__container'} ref={canvas} /> */}
    </div>,
    document.body
  );
}
