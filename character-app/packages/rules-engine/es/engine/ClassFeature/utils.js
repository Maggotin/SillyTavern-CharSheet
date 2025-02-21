import { ClassAccessors } from '../Class';
import { AppContextTypeEnum, DB_STRING_MARTIAL_ARTS, DB_STRING_PACT_MAGIC, DB_STRING_SPELLCASTING, DB_STRING_DEDICATED_WEAPON, } from '../Core';
import { getHideInBuilder, getHideInSheet, getLevelScale, getName } from './accessors';
export function doesEnableSpellcasting(feature) {
    return getName(feature) === DB_STRING_SPELLCASTING;
}
export function doesEnablePactMagic(feature) {
    return getName(feature) === DB_STRING_PACT_MAGIC;
}
export function doesEnableDedicatedWeapon(feature) {
    return getName(feature) === DB_STRING_DEDICATED_WEAPON;
}
export function doesEnableMartialArts(feature) {
    return getName(feature).indexOf(DB_STRING_MARTIAL_ARTS) === 0;
}
export function getContextData(feature, charClass) {
    return {
        levelScale: getLevelScale(feature),
        classLevel: charClass ? ClassAccessors.getLevel(charClass) : null,
    };
}
export function getHideInContext(feature, context) {
    if (context === AppContextTypeEnum.SHEET) {
        return getHideInSheet(feature);
    }
    return getHideInBuilder(feature);
}
