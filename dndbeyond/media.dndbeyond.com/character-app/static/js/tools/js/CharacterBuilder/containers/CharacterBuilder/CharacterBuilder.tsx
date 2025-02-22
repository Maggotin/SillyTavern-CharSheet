import React, { useState } from "react";
import { connect, DispatchProp, useDispatch } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { CharacterAvatarPortrait } from "@dndbeyond/character-components/es";
import {
  characterSelectors,
  CharacterStatusSlug,
} from "@dndbeyond/character-rules-engine";
import {
  DecorationInfo,
  DecorationUtils,
  FormatUtils,
  rulesEngineSelectors,
  characterActions,
} from "@dndbeyond/character-rules-engine/es";

import { Link } from "~/components/Link";
import { NotificationSystem } from "~/components/NotificationSystem";
import config from "~/config";
import { useFeatureFlags } from "~/contexts/FeatureFlag";
import { useHeadContext } from "~/contexts/Head";
import { BuilderMethod } from "~/subApps/builder/constants";
import { ClassProvider } from "~/subApps/builder/contexts/Class";
import { SpeciesProvider } from "~/subApps/builder/contexts/Species";
import { BuilderTypeChoicePage } from "~/subApps/builder/routes/BuilderTypeChoicePage";

import { appEnvActions, toastMessageActions } from "../../../Shared/actions";
import LoadingBlocker from "../../../Shared/components/LoadingBlocker";
import { BuilderLinkButton } from "../../../Shared/components/common/LinkButton";
import AppErrorTypeEnum from "../../../Shared/constants/AppErrorTypeEnum";
import UserRoles from "../../../Shared/constants/UserRoles";
import { DiceContainer } from "../../../Shared/containers/DiceContainer";
import {
  appEnvSelectors,
  appInfoSelectors,
  toastMessageSelectors,
} from "../../../Shared/selectors";
import { AppInfoErrorState } from "../../../Shared/stores/typings";
import { builderActions } from "../../actions/builder";
import { BUILDER_MQ_IS_MOBILE_SIZE } from "../../config";
import { ROUTE_DEFINITIONS } from "../../config/navigation";
import { builderSelectors } from "../../selectors";
import { BuilderAppState } from "../../typings";
import { getUrlWithParams } from "../../utils/navigationUtils";
import ConfirmModalManager from "../ConfirmModalManager";
import NavigationSections from "../NavigationSections";
import SynchronousBlocker from "../SynchronousBlocker";
import TodoNavigation from "../TodoNavigation";
import HpManagerModal from "../modals/HpManager";
import styles from "./styles.module.css";

const BASE_PATHNAME = config.basePathname;

interface Props extends DispatchProp {
  appError: AppInfoErrorState | null;
  toastMessages: any;
  builderMethod: string | null;
  isCharacterLoading: boolean;
  isCharacterLoaded: boolean;
  isMobile: boolean;
  name: string | null;
  username: string | null;
  redirect: string;
  characterId: number | null;
  diceEnabled: boolean;
  decorationInfo: DecorationInfo;
  canEdit: boolean;
  isReadonly: boolean;
  userRoles: string[] | null | undefined;
  characterStatus: string | null;
}

const RenderAuthError: React.FC<{ appError: Props["appError"] }> | null = ({
  appError,
}) => {
  if (appError === null) {
    return null;
  }

  let contentNode: React.ReactNode;
  switch (appError.type) {
    case AppErrorTypeEnum.AUTH_MISSING:
      let signInUrl: string = `/sign-in?returnUrl=${encodeURIComponent(
        window.location.pathname
      )}`;
      contentNode = (
        <React.Fragment>
          <p>
            You are no longer signed into D&D Beyond. Go to the{" "}
            <Link href={signInUrl}>Sign In page</Link> to continue the
            adventure!
          </p>
        </React.Fragment>
      );
      break;

    case AppErrorTypeEnum.API_FAIL:
      contentNode = (
        <React.Fragment>
          <p>
            Whoops! We rolled a 1 on our API check. We're heading into town to
            visit the blacksmith for repairs.
          </p>
          <p>Try again after a Short Rest.</p>
        </React.Fragment>
      );
      break;

    case AppErrorTypeEnum.API_DATA_FAIL:
      contentNode = (
        <React.Fragment>
          <p>
            Whoops! We rolled a 1 on our API Data check. We're heading into town
            to visit the blacksmith for repairs.
          </p>
          <p>Try again after a Short Rest.</p>
        </React.Fragment>
      );
      break;

    case AppErrorTypeEnum.AUTH_FAIL:
      contentNode = (
        <React.Fragment>
          <p>
            Whoops! We rolled a 1 on our Authentication check. We're heading
            into town to visit the blacksmith for repairs.
          </p>
          <p>Try again after a Short Rest.</p>
        </React.Fragment>
      );
      break;

    case AppErrorTypeEnum.ACCESS_DENIED:
      contentNode = (
        <React.Fragment>
          <p>You don't have access to this page.</p>
          <p>
            If you are trying to access a character sheet, make sure its privacy
            setting is configured correctly for you to access it.
          </p>
          <p>
            It is also possible that you are trying to enter the 403rd level of
            the endless dungeon and the ancient dragon Rylzrayrth is rising up
            to block your path...
          </p>
        </React.Fragment>
      );
      break;
    case AppErrorTypeEnum.NOT_FOUND:
      appError.errorId = null;
      contentNode = (
        <>
          <p>
            We live in a world of uncertainty. But certainly, the page you were
            looking for isn’t here. Perhaps this halfling has stolen it and
            hidden it in another place. Try searching for what you were looking
            for in another realm.
          </p>
        </>
      );
      break;

    case AppErrorTypeEnum.GENERIC:
    default:
      contentNode = (
        <React.Fragment>
          <p>
            Whoops! We rolled a 1 on our check. We're heading into town to visit
            the blacksmith for repairs.
          </p>
          <p>Try again after a Short Rest.</p>
        </React.Fragment>
      );
      break;
  }

  return (
    <div className="ct-character-sheet--failed">
      <div
        className={[
          "ct-character-sheet__failed",
          `ct-character-sheet__failed--${FormatUtils.slugify(appError.type)}`,
        ].join(" ")}
      >
        <div className="ct-character-sheet__failed-content">
          {contentNode}
          {appError.errorId && (
            <React.Fragment>
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
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

const checkForMessages = (
  toastMessages,
  dispatch,
  notificationSystem
): void => {
  Object.keys(toastMessages).forEach((messageId) => {
    if (!notificationSystem) {
      return;
    }

    const message = toastMessages[messageId];
    const { autoDismiss, dismissible, position } = message.meta;

    if (!notificationSystem.current) {
      return;
    }

    notificationSystem.current.addNotification({
      title: message.payload.title,
      message: message.payload.message,
      level: message.meta.level,
      autoDismiss,
      dismissible,
      position,
      uid: messageId,
      onRemove: () => dispatch(toastMessageActions.removeToast(messageId)),
    });
  });
};

const CharacterBuilder: React.FC<Props> | null = ({
  appError,
  toastMessages,
  builderMethod,
  isCharacterLoading,
  isCharacterLoaded,
  isMobile,
  name,
  username,
  redirect,
  characterId,
  diceEnabled,
  decorationInfo,
  canEdit,
  isReadonly,
  userRoles,
  characterStatus,
}) => {
  let mobileMql: MediaQueryList | null = null;
  // useImperativeHandle is hard to type when we us our own context this will just disapear
  const notificationSystem = React.createRef<any>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setTitle } = useHeadContext();
  const [isLoaded, setIsLoaded] = useState(false);

  const { featureFlags } = useFeatureFlags();

  React.useEffect(() => {
    if (characterId !== null && !isLoaded) {
      dispatch(builderActions.characterLoadRequest());
      setIsLoaded(true);
    }
    mobileMql = window.matchMedia(BUILDER_MQ_IS_MOBILE_SIZE);
    dispatch(appEnvActions.mobileSet(mobileMql.matches));
    mobileMql.onchange = (e) => {
      dispatch(appEnvActions.mobileSet(e.matches));
    };
  }, [characterId]);

  React.useEffect(() => {
    if (
      isLoaded &&
      characterId !== null &&
      characterStatus === CharacterStatusSlug.PREMADE
    ) {
      const isLorekeeper =
        userRoles?.includes(UserRoles.LOREKEEPER) ||
        userRoles?.includes(UserRoles.ADMIN);
      isLorekeeper && dispatch(characterActions.premadeInfoGet(characterId));
    }
  }, [characterId, characterStatus, isLoaded, userRoles]);

  React.useEffect(() => {
    //check for isCharacterLoaded and canEdit to set isReadonly and redirect, or is Random build to set isReadonly
    if (isCharacterLoaded) {
      dispatch(appEnvActions.dataSet({ isReadonly: !canEdit }));
      if (!canEdit) {
        navigate(getUrlWithParams(`${BASE_PATHNAME}/${characterId}`));
      }
    } else if (builderMethod && builderMethod === BuilderMethod.RANDOMIZE) {
      dispatch(appEnvActions.dataSet({ isReadonly: !canEdit }));
    }
  }, [
    isCharacterLoaded,
    canEdit,
    characterId,
    navigate,
    dispatch,
    builderMethod,
  ]);

  React.useEffect(() => {
    checkForMessages(toastMessages, dispatch, notificationSystem);
  });

  React.useLayoutEffect(() => {
    const toolsTarget = document.getElementById("character-tools-target");
    if (toolsTarget) {
      toolsTarget.style.zIndex = "0";
    }
    return () => {
      const toolsTarget = document.getElementById("character-tools-target");
      if (toolsTarget) {
        toolsTarget.style.zIndex = "auto";
      }
    };
  });

  React.useEffect(() => {
    setTitle("Character Builder");
  }, [setTitle]);

  if (appError !== null) {
    return <RenderAuthError appError={appError} />;
  }

  let clsNames: Array<string> = ["character-builder"];
  if (builderMethod) {
    clsNames.push(`character-builder-${FormatUtils.slugify(builderMethod)}`);
  }

  // useEffect above handles redirect but this blocks UI from showing
  if (isReadonly && isCharacterLoaded) {
    return null;
  }

  if (!isCharacterLoading && builderMethod === null) {
    let anonNode: React.ReactNode;
    if (!username) {
      anonNode = (
        <div className="character-builder-anon">
          <div className="character-builder-anon-heading">
            Start Your Adventure
          </div>
          <div className="character-builder-anon-content">
            <p>
              You need to be signed in to a D&amp;D Beyond account in order to
              save characters. You can use your character sheet anywhere, on any
              device.
            </p>
          </div>
          <div className="character-builder-anon-actions">
            <BuilderLinkButton size="oversized" url={redirect}>
              Sign in or Create Account
            </BuilderLinkButton>
          </div>
        </div>
      );
    }

    return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="character-builder">
              <SynchronousBlocker />
              <div className="character-builder-inner">
                {anonNode}
                {<BuilderTypeChoicePage isEnabled={!!username} />}
              </div>
            </div>
          }
        ></Route>
      </Routes>
    );
  }

  clsNames.push(styles.characterBuilder);

  if (diceEnabled) {
    clsNames.push("character-builder--dice-enabled");
  }

  clsNames.push(styles.characterBuilder);

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <div className={clsNames.join(" ")}>
            {(characterId !== null || isCharacterLoading) && (
              <LoadingBlocker isFinished={isCharacterLoaded} />
            )}
            {!isCharacterLoading && (
              <ClassProvider>
                <SpeciesProvider>
                  <SynchronousBlocker />
                  <div className="character-builder-inner">
                    {builderMethod === BuilderMethod.STEP_BY_STEP && (
                      <React.Fragment>
                        {!isMobile && (
                          <div className="character-builder-page-header">
                            <h1 className="character-builder-page-header-heading">
                              Character Builder
                            </h1>
                            {name && (
                              <div className="character-builder-page-header-summary">
                                <CharacterAvatarPortrait
                                  className={
                                    "character-builder-page-header-avatar"
                                  }
                                  avatarUrl={
                                    DecorationUtils.getAvatarInfo(
                                      decorationInfo
                                    ).avatarUrl
                                  }
                                />
                                <div className="character-builder-page-header-name">
                                  {name}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <ConfirmModalManager />
                        <NavigationSections
                          pathname={pathname}
                          characterId={characterId}
                        />
                        <TodoNavigation
                          pathname={pathname}
                          characterId={characterId}
                        />
                        <HpManagerModal />
                      </React.Fragment>
                    )}
                    <Routes>
                      {Object.values(ROUTE_DEFINITIONS).map(
                        ({ key, path, getComponent }) => {
                          const Component = getComponent(featureFlags);
                          // console.log('COMPONENT', Component);
                          return (
                            <Route
                              key={key}
                              path={path
                                .replace(`${BASE_PATHNAME}/builder/`, "")
                                .replace(
                                  `${BASE_PATHNAME}/:characterId/builder/`,
                                  ""
                                )}
                              element={Component}
                            />
                          );
                        }
                      )}
                      <Route
                        path="/"
                        element={<BuilderTypeChoicePage />}
                      ></Route>
                    </Routes>
                  </div>
                </SpeciesProvider>
              </ClassProvider>
            )}
            <NotificationSystem ref={notificationSystem} />
            {diceEnabled && !isReadonly ? (
              <DiceContainer canShow={isCharacterLoaded} />
            ) : null}
          </div>
        }
      ></Route>
    </Routes>
  );
};

function mapStateToProps(state: BuilderAppState) {
  return {
    toastMessages: toastMessageSelectors.getToastMessages(state),
    builderMethod: builderSelectors.getBuilderMethod(state),
    isCharacterLoading: builderSelectors.getIsCharacterLoading(state),
    isCharacterLoaded: builderSelectors.getIsCharacterLoaded(state),
    isMobile: appEnvSelectors.getIsMobile(state),
    isReadonly: appEnvSelectors.getIsReadonly(state),
    name: rulesEngineSelectors.getName(state),
    decorationInfo: rulesEngineSelectors.getDecorationInfo(state),
    canEdit: rulesEngineSelectors.getCanEdit(state),
    username: appEnvSelectors.getUsername(state),
    redirect: appEnvSelectors.getRedirect(state),
    appError: appInfoSelectors.getError(state),
    characterId: appEnvSelectors.getCharacterId(state),
    diceEnabled: appEnvSelectors.getDiceEnabled(state),
    userRoles: appEnvSelectors.getUserRoles(state),
    characterStatus: characterSelectors.getStatusSlug(state),
  };
}

export default connect(mapStateToProps)(CharacterBuilder);
