import { FC, createContext, useContext, useEffect, useState } from "react";

import { toCamelCase } from "~/helpers/casing";
import { getFeatureFlagsFromCharacterService } from "~/helpers/characterServiceApi";

const featureFlagsToGet = [
  "release-gate-ims",
  "release-gate-gfs-blessings-ui",
  "release-gate-character-sheet-campaign-settings",
  "release-gate-character-sheet-tour",
  "release-gate-premade-characters",
];

export const defaultFlags = {
  imsFlag: false,
  gfsBlessingsUiFlag: false,
  campaignSettingsFlag: false,
  characterSheetTourFlag: false,
  premadeCharactersFlag: false,
};

export type FeatureFlags = typeof defaultFlags;

export interface FeatureFlagContextType extends FeatureFlags {
  featureFlags: FeatureFlags;
}

export const FeatureFlagContext = createContext<FeatureFlagContextType>(null!);

interface ProviderProps {
  defaultOverrides?: Partial<FeatureFlags>;
}

export const FeatureFlagProvider: FC<ProviderProps> = ({
  children,
  defaultOverrides,
}) => {
  const [featureFlags, setFeatureFlags] = useState({
    ...defaultFlags,
    ...defaultOverrides,
  });

  const convertFlagsToKeys = (flags: Object) => {
    return Object.keys(flags).reduce((acc, flag) => {
      // Perform any manipulations to remove unwanted characters
      const formattedFlag = flag
        // Remove `character-app` from the flag name
        .replace(/character-app\./i, "")
        // Remove `release-gate` from the flag name
        .replace(/release-gate\W/i, "")
        // Remove `character-sheet` from flag name if not the tour flag
        .replace(/character-sheet\W(?!tour)/i, "")
        // Change `2d` to `tactical` since var can't start with number
        .replace(/2d/i, "tactical");

      const key = toCamelCase(`${formattedFlag}Flag`);
      return { ...acc, [key]: flags[flag] };
    }, {});
  };

  const getFeatureFlags = async () => {
    try {
      const req = await getFeatureFlagsFromCharacterService(featureFlagsToGet);
      const res = await req.json();
      const flags = convertFlagsToKeys(res.data) as FeatureFlags;
      setFeatureFlags(flags);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!defaultOverrides) getFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOverrides]);

  return (
    <FeatureFlagContext.Provider value={{ ...featureFlags, featureFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  return useContext(FeatureFlagContext);
};
