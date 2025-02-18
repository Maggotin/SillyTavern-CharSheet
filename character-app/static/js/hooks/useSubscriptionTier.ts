import { useState, useEffect } from "react";

import { getSubscriptionTier } from "../helpers/userApi";

export const FREE_TIER = "free";
export const HERO_TIER = "hero";
export const MASTER_TIER = "master";
export const LEGENDARY_TIER = "legendary";

const useSubscriptionTier = (defaultSubscription?: string) => {
  const [subscriptionTier, setSubscriptionTier] = useState<string | undefined>(
    defaultSubscription
  );

  useEffect(() => {
    getSubscriptionTier().then((tier) => {
      if (tier) {
        setSubscriptionTier(tier as unknown as string);
      }
    });
  }, []);

  return (subscriptionTier || FREE_TIER).toLowerCase();
};

export default useSubscriptionTier;
