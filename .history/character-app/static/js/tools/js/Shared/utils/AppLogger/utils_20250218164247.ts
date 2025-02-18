import axios from "axios";
import { merge } from "lodash";

import {
  ApiAdapterDataException,
  ApiAdapterException,
  ApiAdapterUrlException,
  ApiException,
  AuthException,
  AuthMissingException,
  Constants,
} from "../../character-rules-engine/es";

import { appEnvActions } from "../../actions";
import { appInfoActions } from "../../actions/appInfo";
import AppErrorTypeEnum from "../../constants/AppErrorTypeEnum";
import * as HttpStatusCodes from "../../constants/HttpStatusCodes";
import { appEnvSelectors } from "../../selectors";
import { StateStoreUtils } from "../../stores";
import { AppNotificationUtils, ErrorCustomTags, ErrorUtils } from "../../utils";
import { COALESCED_ERROR_CODES } from "./constants";

let hasDispatchedAuthException: boolean = false;

/**
 *
 * @param url
 */
export function processApiUrl(url: string): string {
  let match = url.match(/^(.*\/character\/v\d+\/character)\/\d+$/);
  if (match) {
    return [match[1], "{id}"].join("/");
  }
  return url;
}

/**
 *
 * @param error
 * @param extraContextData
 */
export function getApiAdapterUrlExceptionContextData(
  error: ApiAdapterUrlException,
  extraContextData: Record<string, any>
): Record<string, any> {
  let errorContextData: Record<string, any> = error.contextData ?? {};
  let errorMessageContextData: Record<string, any> = {
    errorMessage: error.message,
    errorUrl: error.url,
    errorMethod: error.method,
  };

  return merge({}, errorContextData, errorMessageContextData, extraContextData);
}

/**
 *
 * @param error
 */
export function getApiAdapterUrlExceptionCustomTags(
  error: ApiAdapterUrlException
): ErrorCustomTags {
  return {
    serverErrorId: error.contextData?.serverErrorData?.errorCode ?? null,
  };
}

/**
 *
 * @param error
 * @param messagePrefix
 */
export function getApiAdapterUrlExceptionMessage(
  error: ApiAdapterUrlException,
  messagePrefix: string
): string {
  if (error.errorCode === null) {
    return "Unknown Client Request Failure";
  }

  if (COALESCED_ERROR_CODES.includes(error.errorCode)) {
    return [messagePrefix, error.errorCode].join(" - ");
  }

  return [
    messagePrefix,
    error.errorCode,
    error.method ?? "UNKNOWN Method",
    error.url ? processApiUrl(error.url) : "UNKNOWN URL",
  ].join(" - ");
}

/**
 *
 * @param error
 */
export function getApiAdapterUrlExceptionAppErrorType(
  error: ApiAdapterUrlException
): AppErrorTypeEnum {
  if (error.errorCode === HttpStatusCodes.FORBIDDEN) {
    return AppErrorTypeEnum.ACCESS_DENIED;
  }
  if (error.errorCode === HttpStatusCodes.NOT_FOUND) {
    return AppErrorTypeEnum.NOT_FOUND;
  }

  return AppErrorTypeEnum.API_FAIL;
}

/**
 *
 * @param error
 * @param contextData
 */
export function logError(
  error: Error,
  contextData: Record<string, any> = {}
): null {
  // This function returns null because the Rules Engine config expects a log method
  // that returns string | null. See packages/rules-engine/src/config/typings.ts

  if (process.env.NODE_ENV !== "production") {
    console.log("***************");
    console.log("The following error happened:");
    console.log(error);
    console.log("***************");
  }

  if (axios.isCancel(error)) {
    // only do something if not canceled, cancellation should be fine
    return null;
  }

  let appErrorType: AppErrorTypeEnum = AppErrorTypeEnum.GENERIC;

  let message: string | null = null;
  let shouldLogError: boolean = true;
  let customTags: ErrorCustomTags = {};

  if (error instanceof ApiException) {
    appErrorType = getApiAdapterUrlExceptionAppErrorType(error);
    contextData = getApiAdapterUrlExceptionContextData(error, contextData);
    customTags = getApiAdapterUrlExceptionCustomTags(error);
    message = getApiAdapterUrlExceptionMessage(error, "API");
  } else if (error instanceof ApiAdapterDataException) {
    appErrorType = getApiAdapterUrlExceptionAppErrorType(error);
    contextData = getApiAdapterUrlExceptionContextData(error, contextData);
    customTags = getApiAdapterUrlExceptionCustomTags(error);
    message = getApiAdapterUrlExceptionMessage(error, "API Data");
  } else if (error instanceof AuthException) {
    appErrorType = AppErrorTypeEnum.AUTH_FAIL;
    message = "Auth Failure";

    // We could emit multiple auth exceptions when we make parallel requests
    // AuthException isn't recoverable, so it should be fine to only log the first one
    if (hasDispatchedAuthException) {
      shouldLogError = false;
    } else {
      hasDispatchedAuthException = true;
    }
  } else if (error instanceof AuthMissingException) {
    appErrorType = AppErrorTypeEnum.AUTH_MISSING;
    shouldLogError = false;
  }

  if (shouldLogError) {
    if (message === null) {
      ErrorUtils.dispatchException(error, null, customTags);
    } else {
      ErrorUtils.dispatchError(
        message,
        contextData,
        customTags,
        Constants.LogMessageType.ERROR
      );
    }
  }

  const store = StateStoreUtils.getAppStore();
  if (store !== null) {
    const diceUrl = appEnvSelectors.getDiceFeatureConfiguration(
      store.getState()
    ).apiEndpoint;
    if (error instanceof ApiException && error?.url?.includes(diceUrl)) {
      store.dispatch(
        appEnvActions.dataSet({
          diceEnabled: false,
        })
      );

      AppNotificationUtils.dispatchError(
        "Dice Service Error",
        "The dice service is currently experiencing issues. We have disabled it temporarily as a result."
      );
    } else {
      store.dispatch(appInfoActions.errorSet(appErrorType));
    }
  }

  return null;
}

/**
 *
 * @param message
 * @param type
 * @param contextData
 */
export function logMessage(
  message: string,
  type: Constants.LogMessageType,
  contextData: Record<string, any> = {}
): null {
  ErrorUtils.dispatchError(message, contextData, null, type);
  return null;
}

/**
 *
 * @param error
 */
export function handleAdhocApiError(error: Error): void {
  // ApiAdapterException errors are handled by the AppApiAdapter
  if (!(error instanceof ApiAdapterException)) {
    logError(error);
  }
}
