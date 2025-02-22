import { useState, useEffect } from "react";

import type { User } from "@dndbeyond/authentication-lib-js";

import { getUser } from "../helpers/userApi";

export interface AppUser extends User {
  displayName: string;
  id: string;
  name: string;
  roles: Array<string>;
  subscription: string;
  subscriptionTier: string;
}
/**
 * AppUserState has three states:
 * - undefined: We currently don't know if the user is authenticated or not. ie loading state
 * - null: user is not authenticated
 * - User: user is authenticated and is a registered user
 */
const useUserInitialState = undefined;
type UseUserUnauthenticated = null;
export type AppUserState =
  | AppUser
  | UseUserUnauthenticated
  | typeof useUserInitialState;

const useUser = () => {
  const [user, setUser] = useState<AppUserState>(useUserInitialState);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => {
        setUser(null);
      });
  }, []);

  return user;
};

export default useUser;
