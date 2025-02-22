import { useContext } from "react";
import { createContext } from "react";

import useUser from "~/hooks/useUser";
import type { AppUserState } from "~/hooks/useUser";

export let AuthContext = createContext<AppUserState>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  if (user === undefined) {
    return null;
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
