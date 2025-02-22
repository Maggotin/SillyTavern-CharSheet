import {
  MovementTypeEnum,
  PreferenceAbilityScoreDisplayTypeEnum as AbilityScoreDisplayType,
  PreferenceEncumbranceTypeEnum,
  PreferenceHitPointTypeEnum,
  PreferencePrivacyTypeEnum,
  PreferenceProgressionTypeEnum,
  PreferenceSharingTypeEnum,
  SenseTypeEnum,
} from "~/constants";
import { FeatureFlags } from "~/contexts/FeatureFlag";

/**
 * This is a copy of the `generateCharacterPreferences` function from the rules
 * engine package. This is necessary because we have restructured the
 * featureFlagContext, so the `featureFlagInfo` variable is no longer
 * available.
 **/
export const generateCharacterPreferences = (featureFlags: FeatureFlags) => {
  // Default values
  const abilityScoreDisplayType = AbilityScoreDisplayType.MODIFIERS_TOP;
  const encumbranceType = PreferenceEncumbranceTypeEnum.ENCUMBRANCE;
  const hitPointType = PreferenceHitPointTypeEnum.FIXED;
  const primaryMovement = MovementTypeEnum.WALK;
  const primarySense = SenseTypeEnum.PASSIVE_PERCEPTION;
  const progressionType = PreferenceProgressionTypeEnum.MILESTONE;
  const sharingType = PreferenceSharingTypeEnum.LIMITED;
  const privacyType = PreferencePrivacyTypeEnum.CAMPAIGN_ONLY;

  return {
    abilityScoreDisplayType,
    enableContainerCurrency: false,
    enableDarkMode: false,
    enableOptionalClassFeatures: false,
    enableOptionalOrigins: false,
    encumbranceType,
    enforceFeatRules: true,
    enforceMulticlassRules: true,
    hitPointType,
    ignoreCoinWeight: true,
    primaryMovement,
    primarySense,
    privacyType,
    progressionType,
    sharingType,
    showCompanions: false,
    showScaledSpells: true,
    showUnarmedStrike: true,
    showWildShape: false,
    useHomebrewContent: true,
  };
};
