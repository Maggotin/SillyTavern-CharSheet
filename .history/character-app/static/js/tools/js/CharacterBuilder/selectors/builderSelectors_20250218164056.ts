import { createSelector } from "reselect";

import {
  featureFlagInfoSelectors,
  rulesEngineSelectors,
} from "../../rules-engine/es";

import { NavigationType } from "~/subApps/builder/constants";

import { getNavBuilderConfig } from "../config/navigation";
import { BuilderAppState } from "../typings";

export const getCurrentPath = (state) => window.location.pathname;

export const getBuilderMethod = (state: BuilderAppState) =>
  state.builder.method;
export const getConfirmSpecies = (state: BuilderAppState) =>
  state.builder.confirmSpecies;
export const getConfirmClass = (state: BuilderAppState) =>
  state.builder.confirmClass;
export const getIsCharacterLoading = (state: BuilderAppState) =>
  state.builder.isCharacterLoading;
export const getIsCharacterLoaded = (state: BuilderAppState) =>
  state.builder.isCharacterLoaded;
export const getSuggestedNames = (state: BuilderAppState) =>
  state.builder.suggestedNames;

export const getRoutePathing = createSelector(
  [
    (state) => state,
    getBuilderMethod,
    rulesEngineSelectors.getCharacterConfiguration,
  ],
  (state, builderMethod, configuration) => {
    const navConfig = getNavBuilderConfig(
      builderMethod,
      featureFlagInfoSelectors.getFeatureFlagInfo(state)
    );

    let exclusionNavTypes: Array<any> = [];
    if (!configuration.showHelpText) {
      exclusionNavTypes.push(NavigationType.HelpPage);
    }

    let routePath: Array<any> = [];
    navConfig.forEach((section) => {
      const { routes } = section;
      routes.forEach((routeDef) => {
        let available = true;
        if (exclusionNavTypes.indexOf(routeDef.type) > -1) {
          available = false;
        }
        if (!routeDef.checkCanAccess(routeDef, state)) {
          available = false;
        }
        routePath.push({
          ...routeDef,
          available,
        });
      });
    });

    return routePath;
  }
);

export const getAvailableRoutePathing = createSelector(
  [
    (state) => state,
    getBuilderMethod,
    rulesEngineSelectors.getCharacterConfiguration,
  ],
  (state, builderMethod, configuration) => {
    const navConfig = getNavBuilderConfig(
      builderMethod,
      featureFlagInfoSelectors.getFeatureFlagInfo(state)
    );

    let exclusionNavTypes: Array<any> = [];
    if (!configuration.showHelpText) {
      exclusionNavTypes.push(NavigationType.HelpPage);
    }

    let routePath: Array<any> = [];
    navConfig.forEach((section) => {
      const { routes } = section;
      routes.forEach((routeDef) => {
        if (exclusionNavTypes.indexOf(routeDef.type) > -1) {
          return;
        }
        if (!routeDef.checkCanAccess(routeDef, state)) {
          return;
        }
        routePath.push({
          ...routeDef,
        });
      });
    });

    return routePath;
  }
);

export const getFirstAvailableSectionRoutes = createSelector(
  [
    (state) => state,
    getBuilderMethod,
    rulesEngineSelectors.getCharacterConfiguration,
  ],
  (state, builderMethod, configuration) => {
    const navConfig = getNavBuilderConfig(
      builderMethod,
      featureFlagInfoSelectors.getFeatureFlagInfo(state)
    );

    let exclusionNavTypes: Array<any> = [];
    if (!configuration.showHelpText) {
      exclusionNavTypes.push(NavigationType.HelpPage);
    }

    let sections = {};
    navConfig.forEach((section) => {
      const { routes } = section;
      let found = false;
      routes.forEach((routeDef) => {
        if (found) {
          return;
        }
        if (exclusionNavTypes.indexOf(routeDef.type) > -1) {
          return;
        }
        if (!routeDef.checkCanAccess(routeDef, state)) {
          return;
        }
        sections[section.key] = routeDef;
        found = true;
      });
    });

    return sections;
  }
);

export const checkIsCharacterSheetReady = createSelector(
  [
    rulesEngineSelectors.getRace,
    rulesEngineSelectors.getClasses,
    rulesEngineSelectors.getAbilities,
    rulesEngineSelectors.getCharacterConfiguration,
  ],
  (species, classes, stats, configuration) => {
    if (!species) {
      return false;
    }

    if (!classes.length) {
      return false;
    }

    let hasAllStats = true;
    if (configuration.abilityScoreType === null) {
      hasAllStats = false;
    }
    stats.forEach((stat) => {
      if (stat.baseScore === null) {
        hasAllStats = false;
      }
    });

    if (!hasAllStats) {
      return false;
    }

    return true;
  }
);

export const checkHasCharRequiredData = createSelector(
  [rulesEngineSelectors.getRace, rulesEngineSelectors.getClasses],
  (species, classes) => species !== null && !!classes.length
);
