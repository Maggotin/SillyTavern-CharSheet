import AuthUtils from "../../authentication-lib-js";

import { getStt } from "./tokenUtils";

export const getAuthHeaders = AuthUtils.makeGetAuthorizationHeaders({
  madeGetShortTermToken: getStt,
});

/**
 * A wrapper around fetch that adds the Authorization header and anything else
 * that may need to be included in every request. If withCookies is true, the
 * request will add the credentials: "include" option. Otherwise, this function
 * should work exactly like the native fetch function.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
export const summon = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  withCookies?: boolean
) => {
  // Get the Authorization headers from the auth token
  const authHeaders = await getAuthHeaders();
  // If withCookies is true, set the credentials to include
  const credentials = withCookies && { credentials: "include" };
  // If there is a body, set the Content-Type to application/json
  const contentType = init?.body && { "Content-Type": "application/json" };

  return window.fetch(input, {
    ...(credentials as { credentials: RequestCredentials } | undefined),
    ...init,
    headers: {
      ...authHeaders,
      ...init?.headers,
      ...contentType,
      Accept: "application/json",
    },
  });
};
