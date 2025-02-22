import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { Routes as Router, Route, Navigate } from "react-router-dom";

import config from "../config";
import { useAuth } from "../contexts/Authentication";
import { getCharacters } from "../helpers/characterServiceApi";
import type { AppUserState } from "../hooks/useUser";
import { getStatus } from "../state/selectors/characterUtils";
import { MyCharacters } from "../subApps/listing";
import { getUrlWithParams } from "../tools/js/CharacterBuilder/utils/navigationUtils";
import { CharacterStatusEnum, QueryResponseData } from "../types";
import MaxCharactersMessage from "./max-characters-message";
import SheetBuilderApp from "./sheet-builder-app";

const BASE_PATHNAME = config.basePathname;

/**
 *
 * RequireAuth checks if you are logged in and redirects to the login page if you are not.
 * To use just wrap your element prop in a Route component in it.
 * For example a the Character Sheet has a AnonymousRoute view so it is not wrapped in a RequireAuth.
 */
function RequireAuth({ children }: { children: JSX.Element }) {
  let user = useAuth();
  const isCharactersListing = useMatch({ path: BASE_PATHNAME, end: true });

  // loading state
  if (user === undefined) {
    return null;
  }
  // not authenticated
  if (user === null) {
    // Should only ever happen in local dev when not using app-shell locally
    // if you remove this it will reveal a memory leak :)
    if (process.env.NODE_ENV === "development" && isCharactersListing) {
      return (
        <div>{"YOU ARE NOT LOGGED IN. THIS VIEW IS HANDLED BY APP SHELL"}</div>
      );
    }

    window.location.href = getUrlWithParams();
  }
  // authenticated
  return children;
}

/**
 *
 * GetCharacters uses the renderProp pattern to handle requiring getting all characters. when a user is logged in.
 * This ensure that locked users are not able to use this part of the app until the resolved thier locked characters.
 * This was setup this way to avoid having to make a new api call to get the characters when the user is Anonymous.
 * Therefore, keeping our api calls to a minimum and minimizing errors from failed api calls.
 * Note: this could be simpler but complexity was added to make typescript happy.
 */
function GetCallCharacters({
  children,
}: {
  children: (QueryResponseData) => void;
}): JSX.Element {
  const isCharactersListing = useMatch({ path: BASE_PATHNAME, end: true });

  const { isLoading, data, refetch, error } = useQuery<
    QueryResponseData,
    Error
  >("repoData", () => getCharacters(), {
    refetchOnWindowFocus: false,
    refetchInterval: 24 * 60 * 60 * 1000,
  });
  if (isLoading) {
    return <>{null}</>;
  }
  if (!error && data?.data?.canUnlockCharacters && !isCharactersListing) {
    return (
      <>
        <Navigate to={BASE_PATHNAME} replace />
      </>
    );
  }
  return <>{children({ isLoading, data, refetch, error })}</>;
}

type AppRoute = {
  path: string;
  element: JSX.Element;
};

const getRoutes = (user: AppUserState): Array<AppRoute> => [
  {
    path: `${BASE_PATHNAME}/builder/*`,
    element: (
      <RequireAuth>
        <GetCallCharacters>
          {({ data }) => {
            const numberOfCharacters =
              data?.data?.characters?.filter(
                (character) =>
                  getStatus(character) === CharacterStatusEnum.Active
              ).length ?? 0;
            const maxCharacterSlotsAllowed =
              data?.data?.characterSlotLimit ?? Infinity;
            const hasMaxCharacters =
              numberOfCharacters >= maxCharacterSlotsAllowed;
            if (hasMaxCharacters) {
              return (
                <Navigate to={`${BASE_PATHNAME}/max-characters`} replace />
              );
            }
            return <SheetBuilderApp />;
          }}
        </GetCallCharacters>
      </RequireAuth>
    ),
  },
  {
    path: `${BASE_PATHNAME}/:characterId/builder/*`,
    element: (
      <RequireAuth>
        <GetCallCharacters>{() => <SheetBuilderApp />}</GetCallCharacters>
      </RequireAuth>
    ),
  },
  {
    path: `${BASE_PATHNAME}/:characterId/:shareId`,
    element: user ? (
      <GetCallCharacters>{() => <SheetBuilderApp />}</GetCallCharacters>
    ) : (
      <SheetBuilderApp />
    ),
  },
  {
    path: `${BASE_PATHNAME}/:characterId`,
    element: user ? (
      <GetCallCharacters>{() => <SheetBuilderApp />}</GetCallCharacters>
    ) : (
      <SheetBuilderApp />
    ),
  },
  {
    path: `${BASE_PATHNAME}/max-characters`,
    element: <MaxCharactersMessage />,
  },
  {
    path: BASE_PATHNAME,
    element: (
      <RequireAuth>
        <GetCallCharacters>
          {({ isLoading, data, refetch, error }) => (
            <MyCharacters
              characterQuery={{ isLoading, data, refetch, error }}
            />
          )}
        </GetCallCharacters>
      </RequireAuth>
    ),
  },
  {
    path: "/",
    element: <Navigate to={BASE_PATHNAME} replace />,
  },
];

export const Routes = () => {
  const user = useAuth();

  return (
    <Router>
      {getRoutes(user).map((props: AppRoute) => (
        <Route key={props.path} {...props} />
      ))}
    </Router>
  );
};
