import { UserUtils } from "../../authentication-lib-js";

import { getDecodedStt } from "./tokenUtils";

export const getUserToken = async () => {
  const stt = await getDecodedStt();
  return stt;
};

export const getUser = async () => {
  const token = await getUserToken();
  return {
    ...UserUtils.jwtToUser(token),
    displayName: token.displayName,
  };
};

export const getUserDisplayName = async () => {
  const user = await getUser();
  return user.displayName;
};

export const getUserId = async () => {
  const user = await getUser();
  return user.id;
};

export const getSubscriptionTier = async () => {
  const user = await getUser();
  return user.subscriptionTier;
};

export const getRoles = async () => {
  const user = await getUser();
  return user.roles;
};
