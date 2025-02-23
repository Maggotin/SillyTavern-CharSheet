/* eslint-disable no-process-env */
/* global process */
const environment = process.env.NODE_ENV;
const debug = environment === "development";

const config = {
  buildKey:
    typeof process.env.REACT_APP_BUILD_KEY === "undefined"
      ? "UNKNOWN"
      : process.env.REACT_APP_BUILD_KEY,
  debug,
  environment,
  version: process.env.REACT_APP_VERSION,
};

export default config;
