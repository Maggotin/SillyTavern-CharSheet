/**
 *
 * @param preKey
 */
export function getPreferenceKey(preKey) {
    switch (preKey) {
        case 'abilityScoreDisplayType':
            return preKey;
        case 'enableDarkMode':
            return preKey;
        case 'enableContainerCurrency':
            return preKey;
        case 'enableOptionalClassFeatures':
            return preKey;
        case 'enableOptionalOrigins':
            return preKey;
        case 'encumbranceType':
            return preKey;
        case 'enforceFeatRules':
            return preKey;
        case 'enforceMulticlassRules':
            return preKey;
        case 'hitPointType':
            return preKey;
        case 'ignoreCoinWeight':
            return preKey;
        case 'primaryMovement':
            return preKey;
        case 'primarySense':
            return preKey;
        case 'privacyType':
            return preKey;
        case 'progressionType':
            return preKey;
        case 'sharingType':
            return preKey;
        case 'showCompanions':
            return preKey;
        case 'showScaledSpells':
            return preKey;
        case 'showUnarmedStrike':
            return preKey;
        case 'showWildShape':
            return preKey;
        case 'useHomebrewContent':
            return preKey;
        default:
        //not implemented
    }
    return null;
}
