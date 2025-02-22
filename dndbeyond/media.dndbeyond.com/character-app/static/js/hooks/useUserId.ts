import { useState, useEffect } from "react";

import { getUserId } from "../helpers/userApi";

const useUserId = (defaultUserId?: number) => {
  const [userId, setUserId] = useState<number | undefined>(defaultUserId);

  useEffect(() => {
    getUserId().then((user) => {
      setUserId(user as unknown as number);
    });
  }, []);

  return userId;
};

export default useUserId;
