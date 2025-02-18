const { Constants } = require("../../rules-engine/es");
enum EnvTypeEnum {
  PRODUCTION = "production",
  STAGING = "staging",
  TEST = "test",
  DRAFT = "draft",
  REVIEW = "review",
  DEVELOPMENT = "development",
  LOCAL_APP_SHELL = "local_app_shell",
}

const envConfigs = {
  [EnvTypeEnum.PRODUCTION]: {
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: "https://www.dndbeyond.com",
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        "https://character-service.dndbeyond.com",
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        "https://gamedata-service.dndbeyond.com",
    },
    gameLogApiEndpoint: "https://www.dndbeyond.com",
    ddbApiEndpoint: "https://api.dndbeyond.com",
    diceAssetEndpoint: "https://www.dndbeyond.com/dice",
    diceApiEndpoint: "https://dice-service.dndbeyond.com",
    analyticTrackingId: "UA-26524418-48",
    authEndpoint: "https://auth-service.dndbeyond.com/v1/cobalt-token",
    env: EnvTypeEnum.PRODUCTION,
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
  [EnvTypeEnum.STAGING]: {
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: "https://stg.dndbeyond.com",
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        "https://character-service-stg.dndbeyond.com",
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        "https://gamedata-service-stg.dndbeyond.com",
    },
    gameLogApiEndpoint: "https://stg.dndbeyond.com",
    ddbApiEndpoint: "https://test-api.dndbeyond.com",
    diceAssetEndpoint: "https://stg.dndbeyond.com/dice",
    diceApiEndpoint: "https://dice-service-stg.dndbeyond.com",
    analyticTrackingId: "UA-26524418-48",
    authEndpoint: "https://auth-service-stg.dndbeyond.com/v1/cobalt-token",
    env: EnvTypeEnum.STAGING,
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
  [EnvTypeEnum.DRAFT]: {
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: "https://draft.dndbeyond.com",
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        "https://character-service-draft.dndbeyond.com",
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        "https://gamedata-service-draft.dndbeyond.com",
    },
    gameLogApiEndpoint: "https://stg.dndbeyond.com",
    ddbApiEndpoint: "https://test-api.dndbeyond.com",
    diceAssetEndpoint: "https://stg.dndbeyond.com/dice",
    diceApiEndpoint: "https://dice-service-stg.dndbeyond.com",
    analyticTrackingId: "UA-26524418-48",
    authEndpoint: "https://auth-service-stg.dndbeyond.com/v1/cobalt-token",
    env: EnvTypeEnum.DRAFT,
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
  [EnvTypeEnum.REVIEW]: {
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: "https://review.dndbeyond.com",
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        "https://character-service-review.dndbeyond.com",
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        "https://gamedata-service-review.dndbeyond.com",
    },
    gameLogApiEndpoint: "https://stg.dndbeyond.com",
    ddbApiEndpoint: "https://test-api.dndbeyond.com",
    diceAssetEndpoint: "https://stg.dndbeyond.com/dice",
    diceApiEndpoint: "https://dice-service-stg.dndbeyond.com",
    analyticTrackingId: "UA-26524418-48",
    authEndpoint: "https://auth-service-stg.dndbeyond.com/v1/cobalt-token",
    env: EnvTypeEnum.REVIEW,
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
  [EnvTypeEnum.DEVELOPMENT]: {
    analyticTrackingId: "UA-26524418-48",
    env: EnvTypeEnum.DEVELOPMENT,
    diceAssetEndpoint: process.env.REACT_APP_DICE_ASSET_URL,
    diceApiEndpoint: process.env.REACT_APP_DICE_API_URL,
    gameLogApiEndpoint: process.env.REACT_APP_GAMELOG_API_URL,
    ddbApiEndpoint: process.env.REACT_APP_DDB_API_URL,
    authEndpoint: `${process.env.REACT_APP_DDB_AUTH_URL}`,
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: process.env.REACT_APP_DDB_BASE_URL,
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        process.env.REACT_APP_CHARACTER_SERVICE_URL,
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        process.env.REACT_APP_GAMEDATA_API_URL,
    },
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
  [EnvTypeEnum.LOCAL_APP_SHELL]: {
    apiInfo: {
      [Constants.ApiTypeEnum.WEBSITE]: "http://dev.dndbeyond.com:8080",
      [Constants.ApiTypeEnum.CHARACTER_SERVICE]:
        "https://character-service-stg.dndbeyond.com",
      [Constants.ApiTypeEnum.GAME_DATA_SERVICE]:
        "https://gamedata-service-stg.dndbeyond.com",
    },
    gameLogApiEndpoint: "https://stg.dndbeyond.com",
    ddbApiEndpoint: "https://test-api.dndbeyond.com",
    diceAssetEndpoint: "https://stg.dndbeyond.com/dice",
    diceApiEndpoint: "https://dice-service-stg.dndbeyond.com",
    analyticTrackingId: "UA-26524418-48",
    authEndpoint: "https://auth-service-stg.dndbeyond.com/v1/cobalt-token",
    env: EnvTypeEnum.LOCAL_APP_SHELL,
    ddbMediaUrl: "https://www.dndbeyond.com",
  },
};

function getWebsite(env: EnvTypeEnum): string {
  return envConfigs[env].apiInfo[Constants.ApiTypeEnum.WEBSITE];
}

function getConfig() {
  let envKey: EnvTypeEnum = EnvTypeEnum.PRODUCTION;
  switch (window.location.origin) {
    case getWebsite(EnvTypeEnum.PRODUCTION):
      envKey = EnvTypeEnum.PRODUCTION;
      break;
    case getWebsite(EnvTypeEnum.STAGING):
      envKey = EnvTypeEnum.STAGING;
      break;
    case getWebsite(EnvTypeEnum.DRAFT):
      envKey = EnvTypeEnum.DRAFT;
      break;
    case getWebsite(EnvTypeEnum.REVIEW):
      envKey = EnvTypeEnum.REVIEW;
      break;
    case getWebsite(EnvTypeEnum.DEVELOPMENT):
      envKey = EnvTypeEnum.DEVELOPMENT;
      break;
    case getWebsite(EnvTypeEnum.LOCAL_APP_SHELL):
      envKey = EnvTypeEnum.LOCAL_APP_SHELL;
      break;
    default:
      envKey = EnvTypeEnum.PRODUCTION;
      break;
  }
  // this is the config for the current environment
  let config: Record<string, any> = {
    ...envConfigs[envKey],
    debug: process.env.NODE_ENV !== "production",
    launchDarkylyClientId: process.env.REACT_APP_LAUNCH_DARKLY_CLIENT_ID,
    production: process.env.NODE_ENV === "production",
    version: process.env.REACT_APP_VERSION,
    analyticTrackingId: process.env.REACT_APP_TRACKING_ID,
    env: process.env.NODE_ENV,
    characterServiceBaseUrl: `${
      envConfigs[envKey].apiInfo[Constants.ApiTypeEnum.CHARACTER_SERVICE]
    }/character/v5`,
    userServiceBaseUrl: `${
      envConfigs[envKey].apiInfo[Constants.ApiTypeEnum.CHARACTER_SERVICE]
    }/user/v5`,
    ddbBaseUrl: envConfigs[envKey].apiInfo[Constants.ApiTypeEnum.WEBSITE],
    environment: envKey,
    basePathname: "/characters",
  };
  return config;
}

// Export config items individually
export const {
  analyticTrackingId,
  env,
  diceAssetEndpoint,
  diceApiEndpoint,
  gameLogApiEndpoint,
  ddbApiEndpoint,
  authEndpoint,
  apiInfo,
  ddbMediaUrl,
  debug,
  launchDarkylyClientId,
  production,
  version,
  characterServiceBaseUrl,
  userServiceBaseUrl,
  ddbBaseUrl,
  environment,
  basePathname,
} = getConfig();

// Export the entire config object
export default getConfig();
