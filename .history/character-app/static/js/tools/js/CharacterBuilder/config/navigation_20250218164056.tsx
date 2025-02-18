import React from "react";
import { matchPath } from "react-router-dom";

import {
  FeatureFlagInfoState,
  rulesEngineSelectors,
} from "../../rules-engine/es";

// export interface RouteDefinition {
//     key: string,
//     type: string,
//     path: string,
//     Component: any,
//     checkCanAccess: (routeDef:any, state:any) => boolean,
// }
import config from "~/config";
import { FeatureFlags } from "~/contexts/FeatureFlag";
import {
  BuilderMethod,
  NavigationType,
  RouteKey,
  SectionKey,
} from "~/subApps/builder/constants";
import { ClassChoose } from "~/subApps/builder/routes/ClassChoose";
import { QuickBuild } from "~/subApps/builder/routes/QuickBuild";
import { RandomBuild } from "~/subApps/builder/routes/RandomBuild";
import { SpeciesChoose } from "~/subApps/builder/routes/SpeciesChoose";

import AbilityScoresHelp from "../containers/pages/AbilityScoresHelp";
import AbilityScoresManage from "../containers/pages/AbilityScoresManage";
import CharacterSheetOptions from "../containers/pages/CharacterSheetOptions";
import ClassHelp from "../containers/pages/ClassHelp";
import ClassesManage from "../containers/pages/ClassesManage";
import DescriptionHelp from "../containers/pages/DescriptionHelp";
import DescriptionManage from "../containers/pages/DescriptionManage";
import EquipmentHelp from "../containers/pages/EquipmentHelp";
import EquipmentManage from "../containers/pages/EquipmentManage";
import HomeBasicInfo from "../containers/pages/HomeBasicInfo";
import HomeHelp from "../containers/pages/HomeHelp";
import SpeciesHelp from "../containers/pages/SpeciesHelp";
import SpeciesManage from "../containers/pages/SpeciesManage";
import WhatsNext from "../containers/pages/WhatsNext";
import { NavigationUtils } from "../utils";

const BASE_PATHNAME = config.basePathname;

export const ROUTE_DEFINITIONS = {
  [RouteKey.QUICK_BUILD]: {
    key: RouteKey.QUICK_BUILD,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/builder/quick-build`,
    Component: QuickBuild,
    getComponent: () => <QuickBuild />,
    checkCanAccess: (routeDef, state) => {
      return NavigationUtils.checkStdBuilderPageRequirements(routeDef, state);
    },
  },
  [RouteKey.RANDOMIZE_BUILD]: {
    key: RouteKey.RANDOMIZE_BUILD,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/builder/randomize`,
    Component: RandomBuild,
    getComponent: () => <RandomBuild />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.HOME_BASIC_INFO]: {
    key: RouteKey.HOME_BASIC_INFO,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/home/basic`,
    Component: HomeBasicInfo,
    getComponent: ({ campaignSettingsFlag }) =>
      campaignSettingsFlag ? <CharacterSheetOptions /> : <HomeBasicInfo />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.RACE_CHOOSE]: {
    key: RouteKey.RACE_CHOOSE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/species/choose`,
    Component: SpeciesChoose,
    getComponent: () => <SpeciesChoose />,
    checkCanAccess: (routeDef, state, dispatch) => {
      if (!NavigationUtils.checkStdBuilderPageRequirements(routeDef, state)) {
        return false;
      }

      if (rulesEngineSelectors.getRace(state) !== null) {
        return false;
      }

      return true;
    },
  },
  [RouteKey.RACE_MANAGE]: {
    key: RouteKey.RACE_MANAGE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/species/manage`,
    Component: SpeciesManage,
    getComponent: () => <SpeciesManage />,
    checkCanAccess: (routeDef, state, dispatch) => {
      if (rulesEngineSelectors.getRace(state) === null) {
        return false;
      }

      return true;
    },
  },
  [RouteKey.CLASS_CHOOSE]: {
    key: RouteKey.CLASS_CHOOSE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/class/choose`,
    Component: ClassChoose,
    getComponent: () => <ClassChoose />,
    checkCanAccess: (routeDef, state, dispatch) => {
      if (!NavigationUtils.checkStdBuilderPageRequirements(routeDef, state)) {
        return false;
      }

      if (rulesEngineSelectors.getClasses(state).length > 0) {
        return false;
      }

      return true;
    },
  },
  [RouteKey.CLASS_MANAGE]: {
    key: RouteKey.CLASS_MANAGE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/class/manage`,
    Component: ClassesManage,
    getComponent: () => <ClassesManage />,
    checkCanAccess: (routeDef, state, dispatch) => {
      if (!NavigationUtils.checkStdBuilderPageRequirements(routeDef, state)) {
        return false;
      }

      if (rulesEngineSelectors.getClasses(state).length === 0) {
        return false;
      }

      return true;
    },
  },
  [RouteKey.ABILITY_SCORES_MANAGE]: {
    key: RouteKey.ABILITY_SCORES_MANAGE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/ability-scores/manage`,
    Component: AbilityScoresManage,
    getComponent: () => <AbilityScoresManage />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.DESCRIPTION_MANAGE]: {
    key: RouteKey.DESCRIPTION_MANAGE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/description/manage`,
    Component: DescriptionManage,
    getComponent: () => <DescriptionManage />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.EQUIPMENT_MANAGE]: {
    key: RouteKey.EQUIPMENT_MANAGE,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/equipment/manage`,
    Component: EquipmentManage,
    getComponent: () => <EquipmentManage />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },

  [RouteKey.WHATS_NEXT]: {
    key: RouteKey.WHATS_NEXT,
    type: NavigationType.Page,
    path: `${BASE_PATHNAME}/:characterId/builder/whats-next`,
    Component: WhatsNext,
    getComponent: () => <WhatsNext />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },

  [RouteKey.HOME_HELP]: {
    key: RouteKey.HOME_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/home/help`,
    Component: HomeHelp,
    getComponent: () => <HomeHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.RACE_HELP]: {
    key: RouteKey.RACE_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/species/help`,
    Component: SpeciesHelp,
    getComponent: () => <SpeciesHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.CLASS_HELP]: {
    key: RouteKey.CLASS_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/class/help`,
    Component: ClassHelp,
    getComponent: () => <ClassHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.ABILITY_SCORES_HELP]: {
    key: RouteKey.ABILITY_SCORES_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/ability-scores/help`,
    Component: AbilityScoresHelp,
    getComponent: () => <AbilityScoresHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.DESCRIPTION_HELP]: {
    key: RouteKey.DESCRIPTION_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/description/help`,
    Component: DescriptionHelp,
    getComponent: () => <DescriptionHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
  [RouteKey.EQUIPMENT_HELP]: {
    key: RouteKey.EQUIPMENT_HELP,
    type: NavigationType.HelpPage,
    path: `${BASE_PATHNAME}/:characterId/builder/equipment/help`,
    Component: EquipmentHelp,
    getComponent: () => <EquipmentHelp />,
    checkCanAccess: (routeDef, state) =>
      NavigationUtils.checkStdBuilderPageRequirements(routeDef, state),
  },
};
export interface RouteDef {
  key: string; // get the thing as an enum
  type: typeof NavigationType;
  path: string;
  Component: React.ComponentType<any>;
  getComponent: (featureFlags: FeatureFlags) => React.ComponentType<any>;
  checkCanAccess?: (routeDef: RouteDef, state: any) => boolean;
}

export const getAllRouterRoutes = () => {
  return Object.values(ROUTE_DEFINITIONS).map((routeDef: RouteDef) => ({
    element: <routeDef.Component />,
    path: routeDef.path,
    routeDef,
  }));
};

export const getRouteDef = (routeKey) => ROUTE_DEFINITIONS[routeKey];
export const getRouteDefPath = (routeKey) => getRouteDef(routeKey).path;
export const getRouteDefType = (routeKey) => getRouteDef(routeKey).type;

export const NAVIGATION_DEFINITIONS = {
  [BuilderMethod.QUICK]: [
    {
      type: NavigationType.Section,
      key: SectionKey.QUICK_BUILD,
      getLabel: () => "Quick Build",
      routes: [getRouteDef(RouteKey.QUICK_BUILD)],
    },
  ],
  [BuilderMethod.RANDOMIZE]: [
    {
      type: NavigationType.Section,
      key: SectionKey.RANDOMIZE,
      getLabel: () => "Randomize Build",
      routes: [getRouteDef(RouteKey.RANDOMIZE_BUILD)],
    },
  ],
  [BuilderMethod.STEP_BY_STEP]: [
    {
      type: NavigationType.Section,
      key: SectionKey.HOME,
      getLabel: ({ campaignSettingsFlag }) =>
        campaignSettingsFlag ? "Options" : "Home",
      routes: [
        getRouteDef(RouteKey.HOME_HELP),
        getRouteDef(RouteKey.HOME_BASIC_INFO),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.CLASS,
      getLabel: () => "1. Class",
      routes: [
        getRouteDef(RouteKey.CLASS_HELP),
        getRouteDef(RouteKey.CLASS_CHOOSE),
        getRouteDef(RouteKey.CLASS_MANAGE),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.DESCRIPTION,
      getLabel: () => "2. Background",
      routes: [
        getRouteDef(RouteKey.DESCRIPTION_HELP),
        getRouteDef(RouteKey.DESCRIPTION_MANAGE),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.RACE,
      getLabel: () => "3. Species",
      routes: [
        getRouteDef(RouteKey.RACE_HELP),
        getRouteDef(RouteKey.RACE_CHOOSE),
        getRouteDef(RouteKey.RACE_MANAGE),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.ABILITY_SCORES,
      getLabel: () => "4. Abilities",
      routes: [
        getRouteDef(RouteKey.ABILITY_SCORES_HELP),
        getRouteDef(RouteKey.ABILITY_SCORES_MANAGE),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.EQUIPMENT,
      getLabel: () => "5. Equipment",
      routes: [
        getRouteDef(RouteKey.EQUIPMENT_HELP),
        getRouteDef(RouteKey.EQUIPMENT_MANAGE),
      ],
    },
    {
      type: NavigationType.Section,
      key: SectionKey.WHATS_NEXT,
      getLabel: () => "What's Next",
      routes: [getRouteDef(RouteKey.WHATS_NEXT)],
    },
  ],
};

export function checkIsRouteInSection(testRouteDef, sectionRoutes) {
  if (testRouteDef && sectionRoutes) {
    return !!sectionRoutes.filter(
      (routeDef) => routeDef.key === testRouteDef.key
    ).length;
  }

  return false;
}

export function getNavigationSections(
  builderMethod,
  currentRouteDef,
  featureFlags: FeatureFlagInfoState
) {
  const navConfig = getNavBuilderConfig(builderMethod, featureFlags);

  return navConfig.map((section) => ({
    ...section,
    active: checkIsRouteInSection(currentRouteDef, section.routes),
  }));
}

export function getNavBuilderConfig(
  builderMethod,
  featureFlags: FeatureFlagInfoState
) {
  if (builderMethod) {
    return NAVIGATION_DEFINITIONS[builderMethod];
  } else {
    return [];
  }
}

export function getCurrentRouteDef(currentPath) {
  const routes = getAllRouterRoutes();

  let matchedRouteDef: RouteDef | null = null;
  routes.forEach((route) => {
    const match = matchPath(route.path, currentPath);

    if (match) {
      matchedRouteDef = route.routeDef;
    }
  });

  return matchedRouteDef;
}
