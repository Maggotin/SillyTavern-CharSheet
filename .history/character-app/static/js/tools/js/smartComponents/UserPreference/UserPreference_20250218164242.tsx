import { createContext, useEffect, useState } from "react";

import { RuleData } from "../../character-rules-engine/es";

import {
  getUserPreferences,
  updateUserPreferences,
  getRulesData,
} from "~/helpers/characterServiceApi";
import { UserPreferences } from "~/types";

import PreferenceUpdateLocation from "../../Shared/constants/PreferenceUpdateLocation";

interface UserPreferenceContextProps extends UserPreferences {
  updatePreferences: (updated: UserPreferences) => void;
  ruleData: RuleData | null;
}

const initialValue = {
  abilityScoreDisplayType: 2,
  privacyType: 2,
  isDarkModeEnabled: false,
  isDiceRollingEnabled: true,
  updateLocation: PreferenceUpdateLocation.CharacterBuilder,
  updatePreferences: () => {},
  ruleData: null,
  defaultEnabledSourceCategories: {},
  isHomebrewEnabled: true,
};

export const UserPreferenceContext =
  createContext<UserPreferenceContextProps>(initialValue);

export const UserPreferenceProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ruleData, setRuleData] = useState(null);

  const updatePreferences = (updated: UserPreferences) => {
    setPreferences((prev) => {
      return { ...prev, ...updated };
    });
  };

  const getPreferences = async () => {
    const userPreferences = await getUserPreferences();
    const userPreferencesJSON = await userPreferences.json();

    const rulesData = await getRulesData();
    const rulesDataJSON = await rulesData.json();

    setRuleData(rulesDataJSON.data);
    updatePreferences(userPreferencesJSON.data);
    setIsLoaded(true);
  };

  useEffect(() => {
    getPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoaded) {
      updateUserPreferences(preferences);
    }
  }, [preferences]);

  return (
    <UserPreferenceContext.Provider
      value={{ ...preferences, updatePreferences, ruleData }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
};
