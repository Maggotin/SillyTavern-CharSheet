import React from "react";
import { connect, DispatchProp } from "react-redux";

import {
  characterActions,
  CharacterPreferences,
  CharacterUtils,
  ConfigUtils,
  Constants,
  FeatureFlagInfo,
  featureFlagInfoSelectors,
  rulesEngineSelectors,
} from "@dndbeyond/character-rules-engine/es";

import { Header } from "~/subApps/sheet/components/Sidebar/components/Header";
import { PaneIdentifiersSettingsContext } from "~/subApps/sheet/components/Sidebar/types";

import { SharedAppState } from "../../../stores/typings";
import PreferencesPaneSelectField from "../PreferencesPane/PreferencesPaneSelectField";
import PreferencesPaneToggleField from "../PreferencesPane/PreferencesPaneToggleField";
import {
  SettingsContexts,
  SettingsContextsEnum,
  SettingsToggle,
  SettingsTypeEnum,
} from "./typings";

const ENABLE_CONTAINER_CURRENCY: SettingsToggle = {
  heading: "Put Coins in Containers",
  description:
    "Track individual coin totals for different containers in your inventory.",
  key: "enableContainerCurrency",
  type: SettingsTypeEnum.TOGGLE,
};

const SETTINGS_CONTEXTS: SettingsContexts = {
  [SettingsContextsEnum.COIN]: [
    {
      heading: "Ignore Coin Weight",
      description:
        "Coins do not count against your total weight carried (50 coins weigh 1 lb.).",
      key: "ignoreCoinWeight",
      type: SettingsTypeEnum.TOGGLE,
    },
  ],
  [SettingsContextsEnum.ENCUMBRANCE]: [
    {
      heading: "Ignore Coin Weight",
      description:
        "Coins do not count against your total weight carried (50 coins weigh 1 lb.).",
      key: "ignoreCoinWeight",
      type: SettingsTypeEnum.TOGGLE,
    },
    {
      heading: "Encumbrance Type",
      description:
        "Use the standard encumbrance rules / Disable the encumbrance display / Use the more detailed rules for encumbrance",
      key: "encumbranceType",
      type: SettingsTypeEnum.SELECT,
      options: [
        {
          label: "Use Encumbrance",
          value: Constants.PreferenceEncumbranceTypeEnum.ENCUMBRANCE,
        },
        {
          label: "No Encumbrance",
          value: Constants.PreferenceEncumbranceTypeEnum.NONE,
        },
        {
          label: "Variant Encumbrance",
          value: Constants.PreferenceEncumbranceTypeEnum.VARIANT,
        },
      ],
      initialOptionRemoved: true,
      block: true,
    },
  ],
  [SettingsContextsEnum.FEATURES]: [
    {
      heading: "Use Feat Prerequisites",
      description:
        "Allow or restrict available feats based on rule prerequisites for this character",
      key: "enforceFeatRules",
      type: SettingsTypeEnum.TOGGLE,
    },
  ],
};

function generateSettingsContexts(
  featureFlagInfo: FeatureFlagInfo
): SettingsContexts {
  const rulesEngineConfig = ConfigUtils.getCurrentRulesEngineConfig();
  if (rulesEngineConfig.canUseCurrencyContainers) {
    return {
      ...SETTINGS_CONTEXTS,
      COIN: [...SETTINGS_CONTEXTS.COIN, ENABLE_CONTAINER_CURRENCY],
    };
  }
  return SETTINGS_CONTEXTS;
}

interface Props extends DispatchProp {
  // Figure out if this is right
  preferences: CharacterPreferences;
  identifiers: PaneIdentifiersSettingsContext;
  featureFlagInfo: FeatureFlagInfo;
}

const SettingsPane: React.FC<Props> = ({
  identifiers: { context },
  preferences,
  dispatch,
  featureFlagInfo,
}) => {
  const contexts = generateSettingsContexts(featureFlagInfo);
  return (
    <div className="ct-settings-pane">
      <Header>Settings</Header>
      {contexts[context]
        ? contexts[context].map((setting) => {
            switch (setting.type) {
              case SettingsTypeEnum.TOGGLE:
                return (
                  <PreferencesPaneToggleField
                    key={setting.key}
                    heading={setting.heading}
                    description={setting.description}
                    initiallyEnabled={preferences[setting.key]}
                    onChange={(value) => {
                      const typedPrefKey = CharacterUtils.getPreferenceKey(
                        setting.key
                      );
                      if (typedPrefKey !== null) {
                        dispatch(
                          characterActions.preferenceChoose(typedPrefKey, value)
                        );
                      }
                    }}
                  />
                );
              case SettingsTypeEnum.SELECT:
                return (
                  <PreferencesPaneSelectField
                    key={setting.key}
                    heading={setting.heading}
                    description={setting.description}
                    onChange={(value) => {
                      const typedPrefKey = CharacterUtils.getPreferenceKey(
                        setting.key
                      );
                      if (typedPrefKey !== null) {
                        dispatch(
                          characterActions.preferenceChoose(typedPrefKey, value)
                        );
                      }
                    }}
                    initialOptionRemoved={setting.initialOptionRemoved}
                    options={setting.options}
                    initialValue={preferences[setting.key]}
                    block={setting.block}
                  />
                );
              default:
                return null;
            }
          })
        : null}
    </div>
  );
};

function mapStateToProps(state: SharedAppState) {
  return {
    preferences: rulesEngineSelectors.getCharacterPreferences(state),
    featureFlagInfo: featureFlagInfoSelectors.getFeatureFlagInfo(state),
  };
}

export default connect(mapStateToProps)(SettingsPane);
