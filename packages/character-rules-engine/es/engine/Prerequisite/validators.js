import { AbilityAccessors } from '../Ability';
import { ClassAccessors } from '../Class';
import { HelperUtils } from '../Helper';
import { RaceAccessors } from '../Race';
import { getEntityId, getEntityKey, getEntityTypeId, getPrerequisites, getSubType, getType, getValue, } from './accessors';
import { PrerequisiteSubTypeEnum, PrerequisiteTypeEnum } from './constants';
import { getPrereqsByType } from './utils';
/**
 *
 * @param prerequisiteGrouping
 * @param prerequisiteData
 */
export function validatePrerequisiteGrouping(prerequisiteGrouping, prerequisiteData) {
    if (prerequisiteGrouping === null) {
        return true;
    }
    let isValid = !prerequisiteGrouping.length;
    prerequisiteGrouping.forEach((prerequisiteGroup) => {
        if (isValid) {
            return;
        }
        let meetsGroupPrereqs = true;
        const prerequisites = getPrerequisites(prerequisiteGroup);
        prerequisites.forEach((prerequisite) => {
            if (!meetsGroupPrereqs) {
                return;
            }
            meetsGroupPrereqs = validatePrerequisite(prerequisite, prerequisiteData);
        });
        isValid = isValid || meetsGroupPrereqs;
    });
    return isValid;
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisite(prerequisite, prerequisiteData) {
    switch (getType(prerequisite)) {
        case PrerequisiteTypeEnum.ABILITY_SCORE:
            return validatePrerequisiteAbilityScore(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.PROFICIENCY:
            return validatePrerequisiteProficiency(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SPECIES:
            return validatePrerequisiteRace(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SPECIES_OPTION:
            return validatePrerequisiteSubrace(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SIZE:
            return validatePrerequisiteSize(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.LEVEL:
            return validatePrerequisiteLevel(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.CLASS:
            return validatePrerequisiteClass(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.FEAT:
            return validatePrerequisiteFeat(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.CLASS_FEATURE:
            return validatePrerequisiteClassFeature(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.CUSTOM_VALUE:
        default:
        // not defined
    }
    return true;
}
export function validatePrerequisiteClassFeature(prerequisite, prerequisiteData) {
    if (!prerequisite.entityId)
        return true;
    return Object.prototype.hasOwnProperty.call(prerequisiteData.classFeatureLookup, prerequisite.entityId);
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteLevel(prerequisite, prerequisiteData) {
    switch (getSubType(prerequisite)) {
        case PrerequisiteSubTypeEnum.CHARACTER_LEVEL:
            const value = getValue(prerequisite);
            return prerequisiteData.characterLevel >= (value ? value : 0);
        default:
        // not implemented
    }
    return true;
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteAbilityScore(prerequisite, prerequisiteData) {
    const entityId = getEntityId(prerequisite);
    if (entityId === null) {
        return true;
    }
    const ability = prerequisiteData.abilityLookup[entityId];
    const abilityScore = AbilityAccessors.getScore(ability);
    if (abilityScore === null) {
        return true;
    }
    const value = getValue(prerequisite);
    if (value === null) {
        return true;
    }
    return abilityScore >= value;
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteProficiency(prerequisite, prerequisiteData) {
    return prerequisiteData.proficiencyLookup.hasOwnProperty(getEntityKey(prerequisite));
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteRace(prerequisite, prerequisiteData) {
    if (!prerequisiteData.race) {
        return true;
    }
    // check if race is a base race
    if (RaceAccessors.getBaseRaceId(prerequisiteData.race) === getEntityId(prerequisite) &&
        RaceAccessors.getBaseRaceTypeId(prerequisiteData.race) === getEntityTypeId(prerequisite)) {
        return true;
    }
    // check if race is specific race
    return validatePrerequisiteEntityRace(prerequisite, prerequisiteData);
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteSubrace(prerequisite, prerequisiteData) {
    if (!prerequisiteData.race) {
        return true;
    }
    // check if race is specific race
    return validatePrerequisiteEntityRace(prerequisite, prerequisiteData);
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
function validatePrerequisiteEntityRace(prerequisite, prerequisiteData) {
    if (!prerequisiteData.race) {
        return true;
    }
    return (RaceAccessors.getEntityRaceId(prerequisiteData.race) === getEntityId(prerequisite) &&
        RaceAccessors.getEntityRaceTypeId(prerequisiteData.race) === getEntityTypeId(prerequisite));
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteSize(prerequisite, prerequisiteData) {
    if (!prerequisiteData.race) {
        return true;
    }
    const sizeInfo = RaceAccessors.getSizeInfo(prerequisiteData.race);
    if (!sizeInfo) {
        return true;
    }
    return sizeInfo.id === getEntityId(prerequisite) && sizeInfo.entityTypeId === getEntityTypeId(prerequisite);
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteClass(prerequisite, prerequisiteData) {
    const entityId = getEntityId(prerequisite);
    if (entityId === null) {
        return true;
    }
    return Object.values(prerequisiteData.baseClassLookup).some((charClass) => ClassAccessors.getId(charClass) === entityId);
}
/**
 * @param prerequisiteGrouping
 * @param prerequisiteData
 */
export function validatePrerequisiteGroupingFeat(prerequisiteGrouping, prerequisiteData) {
    if (prerequisiteGrouping === null) {
        return true;
    }
    const mappings = getPrereqsByType(PrerequisiteTypeEnum.FEAT, prerequisiteGrouping);
    let isValid = true;
    mappings.forEach((prerequisite) => {
        if (!validatePrerequisiteFeat(prerequisite, prerequisiteData)) {
            isValid = false;
        }
    });
    return isValid;
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function validatePrerequisiteFeat(prerequisite, prerequisiteData) {
    const entityId = getEntityId(prerequisite);
    if (entityId === null) {
        return true;
    }
    return !!HelperUtils.lookupDataOrFallback(prerequisiteData.featLookup, entityId);
}
