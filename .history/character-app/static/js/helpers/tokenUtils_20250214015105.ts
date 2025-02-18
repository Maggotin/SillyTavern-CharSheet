import jwtDecode from "jwt-decode";

import { AuthUtils } from "@dndbeyond/authentication-lib-js";

import { authEndpoint as authUrl } from "../config";

export const getStt = AuthUtils.makeGetShortTermToken({
  authUrl,
  throwOnHttpStatusError: false,
});

export const getDecodedStt = async () => {
  const stt = await getStt();
  return stt ? jwtDecode(stt) : null;
};
