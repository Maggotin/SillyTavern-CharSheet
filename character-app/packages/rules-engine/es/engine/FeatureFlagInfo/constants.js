export var FeatureFlagEnum;
(function (FeatureFlagEnum) {
    // Brian added this in 06/2021 expected to be removed in 10/2021
    FeatureFlagEnum["RELEASE_GATE_IMS"] = "release-gate-ims";
    // Julie added this on 4/19/22 expected to be removed in ?? TODO
    FeatureFlagEnum["RELEASE_GATE_GFS_BLESSINGS_UI"] = "release-gate-gfs-blessings-ui";
    // Brian added this on 10/24/22 expected to remove in 11/2022
    FeatureFlagEnum["RELEASE_GATE_CAMPAIGN_SETTINGS"] = "release-gate-character-sheet-campaign-settings";
    // Tim added this on 02/23/23 expected to remove in ??
    FeatureFlagEnum["RELEASE_GATE_CHARACTER_SHEET_TOUR"] = "release-gate-character-sheet-tour";
    // Brittany added this on 2/24/2023
    FeatureFlagEnum["RELEASE_GATE_PREMADE_CHARACTERS"] = "release-gate-premade-characters";
})(FeatureFlagEnum || (FeatureFlagEnum = {}));
export const FEATURE_FLAG_LIST = [
    FeatureFlagEnum.RELEASE_GATE_IMS,
    FeatureFlagEnum.RELEASE_GATE_GFS_BLESSINGS_UI,
    FeatureFlagEnum.RELEASE_GATE_CAMPAIGN_SETTINGS,
    FeatureFlagEnum.RELEASE_GATE_CHARACTER_SHEET_TOUR,
    FeatureFlagEnum.RELEASE_GATE_PREMADE_CHARACTERS,
];
export const DEFAULT_FEATURE_FLAG_INFO = {
    [FeatureFlagEnum.RELEASE_GATE_IMS]: false,
    [FeatureFlagEnum.RELEASE_GATE_GFS_BLESSINGS_UI]: false,
    [FeatureFlagEnum.RELEASE_GATE_CAMPAIGN_SETTINGS]: false,
    [FeatureFlagEnum.RELEASE_GATE_CHARACTER_SHEET_TOUR]: false,
    [FeatureFlagEnum.RELEASE_GATE_PREMADE_CHARACTERS]: false,
};
