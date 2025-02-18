import { throttle } from "lodash";
import { createRef, PureComponent } from "react";
import { connect, DispatchProp } from "react-redux";

import {
  characterEnvSelectors,
  Constants,
  FormatUtils,
  rulesEngineSelectors,
  CharacterTheme,
  CharacterPreferences,
  characterSelectors,
  CharacterStatusSlug,
} from "../../character-rules-engine/es";
import { GameLogContextProvider } from "../../game-log-components";

import { Link } from "~/components/Link";
import { NotificationSystem } from "~/components/NotificationSystem";
import { PremadeCharacterEditStatus } from "~/components/PremadeCharacterEditStatus";
import { usePositioning } from "~/hooks/usePositioning";
import { MobileNav } from "~/subApps/sheet/components/MobileNav";

import { useHeadContext } from "../../../../../contexts/Head";
import { ThemeManagerProvider } from "../../../contexts/ThemeManager";
import { getCharacterSlots } from "../../../../../helpers/characterServiceApi";
import SynchronousBlocker from "../../../CharacterBuilder/containers/SynchronousBlocker";
import { appEnvActions, toastMessageActions } from "../../../Shared/actions";
import LoadingBlocker from "../../../Shared/components/LoadingBlocker";
import AppErrorTypeEnum from "../../../Shared/constants/AppErrorTypeEnum";
import UserRoles from "../../../Shared/constants/UserRoles";
import { DiceContainer } from "../../../Shared/containers/DiceContainer";
import {
  appEnvSelectors,
  appInfoSelectors,
  toastMessageSelectors,
} from "../../../Shared/selectors";
import {
  AppEnvDimensionsState,
  AppInfoErrorState,
  DiceFeatureConfigurationState,
  GameLogState,
  ToastMessageState,
} from "../../../Shared/stores/typings";
import config from "../../../config";
import { sheetActions } from "../../actions";
import ClaimPremadeButton from "../../components/ClaimPremadeButton";
import { InvalidCharacter } from "../../components/InvalidCharacter";
import {
  DESKTOP_COMPONENT_START_WIDTH,
  MQ_IS_MOBILE_SIZE,
  TABLET_COMPONENT_START_WIDTH,
} from "../../config";
import { sheetAppSelectors, sheetSelectors } from "../../selectors";
import { SheetAppState, SheetPositioningInfo } from "../../typings";
import CharacterSheetDesktop from "../CharacterSheetDesktop";
import CharacterSheetGuidedTour from "../CharacterSheetGuidedTour";
import CharacterSheetMobile from "../CharacterSheetMobile";
import CharacterSheetTablet from "../CharacterSheetTablet";

interface Props extends DispatchProp {
  sheetPosition: SheetPositioningInfo;
  initFailed: boolean;
  loadingStatus: Constants.CharacterLoadingStatusEnum;
  toastMessages: ToastMessageState;
  builderUrl: string;
  isMobile: boolean;
  envDimensions: AppEnvDimensionsState;
  isReadonly: boolean;
  canEdit: boolean;
  nearTopLimit: number;
  appError: AppInfoErrorState | null;
  isCharacterSheetReady: boolean;
  diceEnabled: boolean;
  characterId: number | null;
  authEndpoint: string;
  diceFeatureConfiguration: DiceFeatureConfigurationState;
  gameLog: GameLogState;
  theme: CharacterTheme;
  username: string;
  characterName: string | null;
  preferences: CharacterPreferences;
  setManager: (manager: any) => void;
  setTitle: (title: string) => void;
  characterStatus: CharacterStatusSlug | null;
  userRoles: UserRoles;
}
interface State {
  curseHeaderHeight: number;
  scrollTop: number;
  isNotificationOpen: boolean;
  isLoaded: boolean;
  isSlotLimitsLoaded: boolean;
}

class CharacterSheet extends PureComponent<Props, State> {
  static defaultProps = {
    nearTopLimit: 40,
    characterJson: null,
    ruleDataJson: null,
    diceEnabled: false,
  };

  // useImperativeHandle is hard to type when we us our own context this will just disapear
  notificationSystem = createRef<any>();
  sheetRef = createRef<HTMLDivElement>();
  mobileMql: MediaQueryList | null = null;

  constructor(props) {
    super(props);

    this.state = {
      curseHeaderHeight: 0,
      scrollTop: 0,
      isNotificationOpen: false,
      isLoaded: false,
      isSlotLimitsLoaded: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { isLoaded } = this.state;
    if (!isLoaded) {
      dispatch(sheetActions.characterInit());
      this.setState({ isLoaded: true });
    }
    this.initScrollWatchers();

    this.mobileMql = window.matchMedia(MQ_IS_MOBILE_SIZE);
    dispatch(appEnvActions.mobileSet(this.mobileMql.matches));
    this.mobileMql.onchange = (e) => {
      dispatch(appEnvActions.mobileSet(e.matches));
    };

    this.initResizeWatchers();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      dispatch,
      loadingStatus,
      canEdit,
      diceEnabled,
      characterName,
      setTitle,
      characterStatus,
      username,
      userRoles,
    } = this.props;

    if (loadingStatus === Constants.CharacterLoadingStatusEnum.LOADED) {
      if (characterStatus === CharacterStatusSlug.PREMADE) {
        dispatch(
          appEnvActions.dataSet({
            canOverrideReadOnly:
              userRoles.includes(UserRoles.ADMIN) ||
              userRoles.includes(UserRoles.DEV) ||
              userRoles.includes(UserRoles.LOREKEEPER),
          })
        );
      } else {
        dispatch(
          appEnvActions.dataSet({
            isReadonly: !canEdit,
            diceEnabled: canEdit ? diceEnabled : false,
          })
        );
      }

      if (characterName) {
        setTitle(`${characterName}'s Character Sheet`);
      }

      if (
        username &&
        characterStatus === CharacterStatusSlug.PREMADE &&
        !this.state.isSlotLimitsLoaded
      ) {
        this.setState({ isSlotLimitsLoaded: true });
        getCharacterSlots().then((characterSlots) => {
          dispatch(
            appEnvActions.dataSet({
              characterSlots,
            })
          );
        });
      }
    }

    this.checkForMessages();
  }

  updateSheetScrollState = (): void => {
    const curScrollTop = window.scrollY;
    const { scrollTop } = this.state;
    const { nearTopLimit } = this.props;

    if (curScrollTop === 0) {
      document.body.classList.add("ct-character-sheet--top");
      document.body.classList.remove("ct-character-sheet--not-top");
    } else {
      document.body.classList.add("ct-character-sheet--not-top");
      document.body.classList.remove("ct-character-sheet--top");
    }

    if (curScrollTop < nearTopLimit) {
      document.body.classList.add("ct-character-sheet--near-top");
      document.body.classList.remove("ct-character-sheet--far-top");
    } else {
      document.body.classList.add("ct-character-sheet--far-top");
      document.body.classList.remove("ct-character-sheet--near-top");
    }

    if (curScrollTop < scrollTop) {
      // Going up
      document.body.classList.add("ct-character-sheet--going-up");
      document.body.classList.remove("ct-character-sheet--going-down");
    } else {
      // Going down
      document.body.classList.add("ct-character-sheet--going-down");
      document.body.classList.remove("ct-character-sheet--going-up");
    }

    this.setState({
      scrollTop: curScrollTop,
    });
  };

  // TODO: we should setup a remove listener for this
  initScrollWatchers = (): void => {
    // Assuming there should be only 1
    const curseHeader = document.querySelector<HTMLElement>("header.main");
    const curseHeaderHeight: number = curseHeader
      ? curseHeader.offsetHeight
      : 0;

    this.setState({ curseHeaderHeight: curseHeaderHeight });
    this.updateSheetScrollState();

    const SCROLL_THROTTLE_AMOUNT = 70;
    document.addEventListener(
      "scroll",
      throttle(() => {
        this.updateSheetScrollState();
      }, SCROLL_THROTTLE_AMOUNT)
    );
  };

  updateEnvDimensions = (): void => {
    const { dispatch } = this.props;

    if (this.sheetRef.current === null) {
      return;
    }

    dispatch(
      appEnvActions.dimensionsSet({
        window: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        sheet: {
          width: this.sheetRef.current.clientWidth,
          height: this.sheetRef.current.clientHeight,
        },
      })
    );
  };

  initResizeWatchers = (): void => {
    const { envDimensions } = this.props;

    if (this.sheetRef.current === null) {
      return;
    }

    this.updateEnvDimensions();

    const RESIZE_THROTTLE_AMOUNT: number = 300;
    window.addEventListener(
      "resize",
      throttle(() => {
        this.updateEnvDimensions();
      }, RESIZE_THROTTLE_AMOUNT)
    );

    window.addEventListener(
      "orientationchange",
      throttle(() => {
        let oldSize: number = envDimensions.window.width;
        let count: number = 0;
        let orientationIntervalId = window.setInterval(() => {
          if (oldSize !== envDimensions.window.width || count > 15) {
            window.clearInterval(orientationIntervalId);
            return;
          }
          if (oldSize !== window.innerWidth) {
            this.updateEnvDimensions();
          }
          count++;
        }, 100);
      }, RESIZE_THROTTLE_AMOUNT)
    );
  };

  checkForMessages = (): void => {
    if (this.notificationSystem.current === null) {
      return;
    }

    const { toastMessages, dispatch } = this.props;

    Object.keys(toastMessages).forEach((messageId) => {
      const message = toastMessages[messageId];
      const { componentProps, Component, ...metaProps } = message.meta;

      let children: React.ReactNode;
      if (Component) {
        let childrenProps = componentProps ? componentProps : {};
        children = <Component {...childrenProps} />;
      }

      if (this.notificationSystem.current !== null) {
        this.notificationSystem.current.addNotification({
          title: message.payload.title,
          message: message.payload.message,
          uid: messageId,
          children,
          onRemove: () => dispatch(toastMessageActions.removeToast(messageId)),
          ...metaProps,
        });
      }
    });
  };

  isSheetErrored = (): boolean => {
    const { initFailed, appError } = this.props;

    return initFailed || appError !== null;
  };

  renderCharacterSheet = (): React.ReactNode => {
    const { envDimensions, isCharacterSheetReady, builderUrl, isReadonly } =
      this.props;

    if (!isCharacterSheetReady) {
      return (
        <InvalidCharacter builderUrl={builderUrl} isReadonly={isReadonly} />
      );
    }

    if (envDimensions.window.width >= DESKTOP_COMPONENT_START_WIDTH) {
      return <CharacterSheetDesktop />;
    } else if (envDimensions.window.width >= TABLET_COMPONENT_START_WIDTH) {
      return <CharacterSheetTablet />;
    }

    return <CharacterSheetMobile />;
  };

  renderSyncBlocker = (): React.ReactNode => {
    const { initFailed, appError } = this.props;

    if (appError !== null) {
      return null;
    }

    if (initFailed) {
      return null;
    }

    return <SynchronousBlocker />;
  };

  renderInitFailed = (): React.ReactNode => {
    return (
      <div className="ct-character-sheet__failed">
        <div className="ct-character-sheet__failed-content">
          <p>
            Whoops! We rolled a 1 on our Retrieve Character check. We're heading
            into town to visit the blacksmith for repairs.
          </p>
          <p>Try again after a Short Rest.</p>
        </div>
      </div>
    );
  };

  renderAppError = (): React.ReactNode => {
    const { appError } = this.props;

    if (appError === null) {
      return null;
    }

    let contentNode: React.ReactNode;
    switch (appError.type) {
      case AppErrorTypeEnum.AUTH_MISSING:
        let signInUrl = `/sign-in?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}`;
        contentNode = (
          <>
            <p>
              You are no longer signed into D&D Beyond. Go to the{" "}
              <Link href={signInUrl}>Sign In page</Link> to continue the
              adventure!
            </p>
          </>
        );
        break;

      case AppErrorTypeEnum.API_FAIL:
        contentNode = (
          <>
            <p>
              Whoops! We rolled a 1 on our API check. We're heading into town to
              visit the blacksmith for repairs.
            </p>
            <p>Try again after a Short Rest.</p>
          </>
        );
        break;

      case AppErrorTypeEnum.API_DATA_FAIL:
        contentNode = (
          <>
            <p>
              Whoops! We rolled a 1 on our API Data check. We're heading into
              town to visit the blacksmith for repairs.
            </p>
            <p>Try again after a Short Rest.</p>
          </>
        );
        break;

      case AppErrorTypeEnum.AUTH_FAIL:
        contentNode = (
          <>
            <p>
              Whoops! We rolled a 1 on our Authentication check. We're heading
              into town to visit the blacksmith for repairs.
            </p>
            <p>Try again after a Short Rest.</p>
          </>
        );
        break;

      case AppErrorTypeEnum.ACCESS_DENIED:
        contentNode = (
          <>
            <p>You don't have access to this page.</p>
            <p>
              If you are trying to access a character sheet, make sure its
              privacy setting is configured correctly for you to access it.
            </p>
            <p>
              It is also possible that you are trying to enter the 403rd level
              of the endless dungeon and the ancient dragon Rylzrayrth is rising
              up to block your path...
            </p>
          </>
        );
        break;
      case AppErrorTypeEnum.NOT_FOUND:
        appError.errorId = null;
        contentNode = (
          <>
            <p>
              We live in a world of uncertainty. But certainly, the page you
              were looking for isn’t here. Perhaps this halfling has stolen it
              and hidden it in another place. Try searching for what you were
              looking for in another realm.
            </p>
          </>
        );
        break;

      case AppErrorTypeEnum.GENERIC:
      default:
        contentNode = (
          <>
            <p>
              Whoops! We rolled a 1 on our check. We're heading into town to
              visit the blacksmith for repairs.
            </p>
            <p>Try again after a Short Rest.</p>
          </>
        );
        break;
    }

    return (
      <div
        className={[
          "ct-character-sheet__failed",
          `ct-character-sheet__failed--${FormatUtils.slugify(appError.type)}`,
        ].join(" ")}
      >
        <div className="ct-character-sheet__failed-content">
          {contentNode}
          {appError.errorId && (
            <>
              <div className="ct-character-sheet__failed-code">
                <div className="ct-character-sheet__failed-code-label">
                  Error Code
                </div>
                <div className="ct-character-sheet__failed-code-value">
                  {appError.errorId}
                </div>
              </div>
              <div className="ct-character-sheet__failed-code">
                <div className="ct-character-sheet__failed-code-label">
                  Version
                </div>
                <div className="ct-character-sheet__failed-code-value">
                  {config.version}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  renderContent = (): React.ReactNode => {
    const { loadingStatus, initFailed, appError } = this.props;

    if (appError !== null) {
      return this.renderAppError();
    }

    if (initFailed) {
      return this.renderInitFailed();
    }

    const isLoaded =
      loadingStatus === Constants.CharacterLoadingStatusEnum.LOADED;

    return (
      <>
        {isLoaded && this.renderCharacterSheet()}
        <LoadingBlocker isFinished={isLoaded || initFailed} />
      </>
    );
  };

  render() {
    const {
      loadingStatus,
      sheetPosition,
      envDimensions,
      isCharacterSheetReady,
      diceEnabled,
      characterId,
      authEndpoint,
      diceFeatureConfiguration,
      gameLog,
      theme,
      isReadonly,
      characterStatus,
    } = this.props;

    let sheetStyles: React.CSSProperties = {};
    if (envDimensions.window.width >= DESKTOP_COMPONENT_START_WIDTH) {
      sheetStyles = {
        transform: `translateX(${sheetPosition.left}px)`,
        WebkitTransform: `translateX(${sheetPosition.left}px)`,
      };
    }

    let classNames: Array<string> = ["ct-character-sheet"];
    if (this.isSheetErrored()) {
      classNames.push("ct-character-sheet--failed");
    }
    if (!isCharacterSheetReady) {
      classNames.push("ct-character-sheet--invalid");
    }
    if (diceEnabled) {
      classNames.push("ct-character-sheet--dice-enabled");
    }
    if (theme.isDarkMode) {
      classNames.push("ct-character-sheet--dark-mode");
    }

    const everythingIsLoadedWithoutErrors: boolean =
      loadingStatus === Constants.CharacterLoadingStatusEnum.LOADED &&
      isCharacterSheetReady &&
      !this.isSheetErrored();

    return (
      <CharacterSheetGuidedTour>
        <GameLogContextProvider
          baseUrl={gameLog.apiEndpoint}
          ddbApiUrl={gameLog.ddbApiEndpoint}
          diceServiceUrl={diceFeatureConfiguration.apiEndpoint}
          authUrl={authEndpoint}
          diceThumbnailsUrl={`${diceFeatureConfiguration.assetBaseLocation}/images/thumbnails`}
          entityId={characterId ? characterId.toString() : ""}
        >
          <div className={classNames.join(" ")}>
            {this.renderSyncBlocker()}
            <div
              className="ct-character-sheet__inner"
              ref={this.sheetRef}
              style={sheetStyles}
            >
              <ThemeManagerProvider
                manager={{
                  lightOrDark: theme.isDarkMode ? "dark" : "light",
                  primary: theme.themeColor,
                }}
              >
                {everythingIsLoadedWithoutErrors && (
                  <PremadeCharacterEditStatus
                    characterStatus={characterStatus}
                    isReadonly={isReadonly}
                  />
                )}
                {this.renderContent()}
                {everythingIsLoadedWithoutErrors && <MobileNav />}
              </ThemeManagerProvider>
            </div>
            <NotificationSystem ref={this.notificationSystem} />
            {diceEnabled && !isReadonly && (
              <DiceContainer canShow={everythingIsLoadedWithoutErrors} />
            )}
            {everythingIsLoadedWithoutErrors &&
              characterStatus === CharacterStatusSlug.PREMADE &&
              isReadonly && <ClaimPremadeButton />}
          </div>
        </GameLogContextProvider>
      </CharacterSheetGuidedTour>
    );
  }
}

const CharacterSheetWrapper = (props) => {
  const { setTitle } = useHeadContext();
  const { getSheetPositioning } = usePositioning();
  return (
    <CharacterSheet
      {...props}
      setTitle={setTitle}
      sheetPosition={getSheetPositioning()}
    />
  );
};

function mapStateToProps(state: SheetAppState) {
  return {
    initFailed: sheetSelectors.getInitFailed(state),
    loadingStatus: characterEnvSelectors.getLoadingStatus(state),
    toastMessages: toastMessageSelectors.getToastMessages(state),
    builderUrl: sheetAppSelectors.getBuilderUrl(state),
    isMobile: appEnvSelectors.getIsMobile(state),
    envDimensions: appEnvSelectors.getDimensions(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    userRoles: appEnvSelectors.getUserRoles(state),
    appError: appInfoSelectors.getError(state),
    isCharacterSheetReady: rulesEngineSelectors.isCharacterSheetReady(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    characterId: appEnvSelectors.getCharacterId(state),
    diceFeatureConfiguration:
      appEnvSelectors.getDiceFeatureConfiguration(state),
    gameLog: appEnvSelectors.getGameLog(state),
    theme: rulesEngineSelectors.getCharacterTheme(state),
    canEdit: rulesEngineSelectors.getCanEdit(state),
    username: appEnvSelectors.getUsername(state),
    characterName: rulesEngineSelectors.getName(state),
    preferences: rulesEngineSelectors.getPreferences(state),
    characterStatus: characterSelectors.getStatusSlug(state),
  };
}
export default connect(mapStateToProps)(CharacterSheetWrapper);
