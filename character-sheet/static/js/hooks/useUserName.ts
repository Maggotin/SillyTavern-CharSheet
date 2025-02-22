import { useState, useEffect } from "react";

import { getUserDisplayName } from "../helpers/userApi";

const useUserName = () => {
  const [userName, setUserName] = useState<string | null>("");

  useEffect(() => {
    getUserDisplayName()
      .then(setUserName)
      .catch(() => {
        setUserName(null);
      });
  }, []);

  return userName;
};

export default useUserName;
