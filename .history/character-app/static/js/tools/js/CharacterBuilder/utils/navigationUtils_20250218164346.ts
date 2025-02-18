import { flatten } from "lodash";

import {
  featureFlagInfoSelectors,
  rulesEngineSelectors,
} from "../../character-rules-engine";

import config from "~/config";
import { NavigationType } from "~/subApps/builder/constants";

import * as navConfig from "../config/navigation";
import { builderSelectors } from "../selectors";

const BASE_PATHNAME = config.basePathname;

function checkIsRouteInNavConfig(targetRouteDef, navConfig) {
  const routeDefs: Array<any> = flatten(
    navConfig.map((section) => section.routes)
  );
  return routeDefs.filter((routeDef) => routeDef.key === targetRouteDef.key)
    .length;
}

export function checkStdBuilderPageRequirements(routeDef, state) {
  return (
    builderSelectors.getBuilderMethod(state) !== null &&
    checkIsRouteInNavConfig(
      routeDef,
      navConfig.getNavBuilderConfig(
        builderSelectors.getBuilderMethod(state),
        featureFlagInfoSelectors.getFeatureFlagInfo(state)
      )
    )
  );
}

export function checkIsCurrentRouteInRoutePathing(state) {
  const currentPath = state.routeControls.currentPath;
  const characterId = rulesEngineSelectors.getId(state);
  const routePathing = builderSelectors.getRoutePathing(state);
  const currentRoutePathIdx = getRoutePathIdxByPath(
    currentPath,
    routePathing,
    characterId
  );
  return currentRoutePathIdx > 0;
}

// TODO: This function seems to jsut return '/' so investigate it and remove it if it's not needed
export const getAvailableRouteRedirect = (routeKey, state) => {
  const routePath = navConfig.getRouteDefPath(routeKey);
  const routePathing = builderSelectors.getRoutePathing(state);
  const currentRoutePathIdx = getRoutePathIdxByPath(routePath, routePathing);

  const currentRoutePathingNode = routePathing[currentRoutePathIdx];

  if (currentRoutePathIdx === -1 || !currentRoutePathingNode.available) {
    return "/";
  }

  return "/";
};

export const getRoutePathIdx = (routeKey, routePathDef) => {
  const path = navConfig.getRouteDefPath(routeKey);
  return routePathDef.findIndex((routeDef) => path === routeDef.path);
};

export function getRoutePathIdxByPath(path, routePathDef, characterId = 0) {
  return routePathDef.findIndex(
    (routeDef) => path === routeDef.path.replace(":characterId", characterId)
  );
}

export function getCurrentSectionHelpRoutePath(state) {
  const currentPath = builderSelectors.getCurrentPath(state);
  const sections = navConfig.getNavigationSections(
    builderSelectors.getBuilderMethod(state),
    navConfig.getCurrentRouteDef(currentPath),
    featureFlagInfoSelectors.getFeatureFlagInfo(state)
  );
  const currentSection = sections.find((section) => section.active);
  const currentSectionHelpRoute = currentSection.routes.find(
    (route) => route.type === NavigationType.HelpPage
  );
  //TODO change this to getRouteDefPath once it takes a routeDef instead of routeKey
  if (currentSectionHelpRoute) {
    return currentSectionHelpRoute.path;
  } else {
    return null;
  }
}

export function getAvailablePathRedirect(state) {
  const currentPath = builderSelectors.getCurrentPath(state);
  const routePathing = builderSelectors.getRoutePathing(state);
  const characterId = rulesEngineSelectors.getId(state);
  const currentRoutePathIdx = getRoutePathIdxByPath(
    currentPath,
    routePathing,
    characterId
  );

  const currentRoutePathingNode = routePathing[currentRoutePathIdx];
  if (!currentRoutePathingNode.available) {
    for (let i = currentRoutePathIdx; i < routePathing.length; i++) {
      if (routePathing[i].available) {
        return routePathing[i].path;
      }
    }
  }

  return null;
}

export const getAvailablePrevRoute = (routeDef, state) => {
  const availableRoutePath = builderSelectors.getAvailableRoutePathing(state);
  const currentRoutePathIdx = getRoutePathIdx(routeDef.key, availableRoutePath);

  // -1 === can't find in route path
  // 0 === first page in path and there isn't a previous
  if (currentRoutePathIdx <= 0) {
    return null;
  }

  return availableRoutePath[currentRoutePathIdx - 1];
};

export const getAvailableNextRoute = (routeDef, state) => {
  const availableRoutePath = builderSelectors.getAvailableRoutePathing(state);
  const currentRoutePathIdx = getRoutePathIdx(routeDef.key, availableRoutePath);
  const lastAvailableRoutePathIdx = availableRoutePath.length - 1;

  // -1 === can't find in route path
  // current = last === can't go any next because at last
  if (
    currentRoutePathIdx < 0 ||
    currentRoutePathIdx >= lastAvailableRoutePathIdx
  ) {
    return null;
  }

  return availableRoutePath[currentRoutePathIdx + 1];
};

export function getCharacterBuilderUrl(characterId): string {
  return `${BASE_PATHNAME}/${characterId}/builder`;
}

export function getCharacterSheetUrl(characterId): string {
  return `${BASE_PATHNAME}/${characterId}`;
}

export function getCharacterListingUrl(): string {
  return `${BASE_PATHNAME}`;
}

export function getUrlWithParams(url?: string): string {
  const baseUrl = url ?? BASE_PATHNAME;
  return window.location.search
    ? `${baseUrl}${window.location.search}`
    : baseUrl;
}
