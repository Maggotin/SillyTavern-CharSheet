import { useState, useEffect } from "react";

import { getRoles } from "../helpers/userApi";

const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    getRoles()
      .then(setUserRoles)
      .catch(() => {
        setUserRoles([]);
      });
  }, []);

  return userRoles;
};

export default useUserRoles;
