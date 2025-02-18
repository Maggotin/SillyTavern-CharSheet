import { LogMessageType } from "../../character-rules-engine/es/logger/constants";

import { ErrorClientConfig, ErrorCustomTags } from "./typings";

// Historical note: This logging util used to be more fully featured,
// when we integrated with Sentry.io. Now it just logs to the
// console if debug is enabled.

let clientConfig: ErrorClientConfig | null = null;

/**
 * Logs an exception when debug is enabled in the client config
 * @param error The error object
 * @param contextData Any context data related to the exception
 * @param customTags
 */
export function dispatchException(
  error: Error,
  contextData: Record<string, any> | null = null,
  customTags: ErrorCustomTags | null = null
): void {
  if (clientConfig?.debug) {
    // eslint-disable-next-line no-console
    console.error("EXCEPTION", error, contextData, customTags);
  }
}

/**
 * Logs a message when debug is enabled in the client config
 * @param message The message to send
 * @param contextData Any context data related to the message
 * @param customTags
 * @param severity
 */
export function dispatchError(
  message: string,
  contextData: Record<string, any> | null,
  customTags: ErrorCustomTags | null,
  severity: LogMessageType
): void {
  if (clientConfig?.debug) {
    // eslint-disable-next-line no-console
    console.error(severity, message, contextData, customTags);
  }
}

/**
 * Initializes client error config
 * @param config config object
 */
export function initReporting(config: ErrorClientConfig): void {
  clientConfig = config;
}

/**
 * Reports a React error to logger
 * @param error The error to report
 * @param componentInfo Information about the component in which the error occurred
 */
export function reportReactError(error: Error, componentInfo: any): void {
  dispatchException(error, {
    componentInfo,
  });
}
