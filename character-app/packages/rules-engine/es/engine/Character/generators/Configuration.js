import { MovementTypeEnum, PreferenceAbilityScoreDisplayTypeEnum, PreferenceEncumbranceTypeEnum, PreferenceHitPointTypeEnum, PreferencePrivacyTypeEnum, PreferenceProgressionTypeEnum, PreferenceSharingTypeEnum, SenseTypeEnum, } from '../../Core';
/**
 *
 * @param race
 * @param classes
 * @param stats
 * @param configuration
 */
export function generateIsCharacterSheetReady(race, classes, stats, configuration) {
    if (!race) {
        return false;
    }
    if (!classes.length) {
        return false;
    }
    let hasAllStats = true;
    if (configuration.abilityScoreType === null) {
        hasAllStats = false;
    }
    stats.forEach((stat) => {
        if (stat.value === null) {
            hasAllStats = false;
        }
    });
    if (!hasAllStats) {
        return false;
    }
    return true;
}
/**
 *
 * @param preferencesContract
 */
export function generateCharacterPreferences(preferencesContract, featureFlagInfo) {
    if (preferencesContract !== null) {
        return preferencesContract;
    }
    return {
        abilityScoreDisplayType: PreferenceAbilityScoreDisplayTypeEnum.MODIFIERS_TOP,
        enableOptionalClassFeatures: false,
        enableOptionalOrigins: false,
        encumbranceType: PreferenceEncumbranceTypeEnum.ENCUMBRANCE,
        enforceFeatRules: true,
        enforceMulticlassRules: true,
        hitPointType: PreferenceHitPointTypeEnum.FIXED,
        ignoreCoinWeight: true,
        primaryMovement: MovementTypeEnum.WALK,
        primarySense: SenseTypeEnum.PASSIVE_PERCEPTION,
        privacyType: PreferencePrivacyTypeEnum.CAMPAIGN_ONLY,
        progressionType: PreferenceProgressionTypeEnum.MILESTONE,
        sharingType: PreferenceSharingTypeEnum.LIMITED,
        showCompanions: false,
        showScaledSpells: true,
        showUnarmedStrike: true,
        showWildShape: false,
        enableDarkMode: false,
        useHomebrewContent: true,
        enableContainerCurrency: false,
    };
}
/**
 *
 * @param configurationContract
 */
export function generateCharacterConfiguration(configurationContract) {
    if (configurationContract !== null) {
        return configurationContract;
    }
    return {
        abilityScoreType: null,
        showHelpText: false,
        startingEquipmentType: null,
    };
}
