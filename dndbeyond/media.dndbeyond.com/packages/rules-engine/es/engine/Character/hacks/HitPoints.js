/**
 *
 * @param baseHp
 * @param overrideHp
 * @param bonusHp
 * @param tempHp
 * @param removedHp
 * https://github.com/reduxjs/reselect/issues/378
 */
export function hack__generateHitPointParts(baseHp, overrideHp, bonusHp, tempHp, removedHp) {
    return {
        baseHp,
        overrideHp,
        bonusHp,
        tempHp,
        removedHp,
    };
}
export function hack__generateSpecialWeaponPropertiesEnabled(hexWeaponEnabled, pactWeaponEnabled, improvedPactWeaponEnabled, dedicatedWeaponEnabled) {
    return {
        hexWeaponEnabled,
        pactWeaponEnabled,
        improvedPactWeaponEnabled,
        dedicatedWeaponEnabled,
    };
}
