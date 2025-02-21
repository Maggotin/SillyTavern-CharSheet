import { AbilityAccessors } from '../Ability';
import { FormatUtils } from '../Format';
import { getEntityId, getFriendlySubtypeName, getPrerequisites, getSubType, getType, getValue } from './accessors';
import { PrerequisiteSubTypeEnum, PrerequisiteTypeEnum } from './constants';
import { validatePrerequisite } from './validators';
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailure(prerequisite, prerequisiteData) {
    switch (getType(prerequisite)) {
        case PrerequisiteTypeEnum.ABILITY_SCORE:
            return getPrerequisiteFailureAbilityScore(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.PROFICIENCY:
            return getPrerequisiteFailureProficiency(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SPECIES:
            return getPrerequisiteFailureRace(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SIZE:
            return getPrerequisiteFailureSize(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.SPECIES_OPTION:
            return getPrerequisiteFailureSubrace(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.LEVEL:
            return getPrerequisiteFailureLevel(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.CLASS:
            return getPrerequisiteFailureClass(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.FEAT:
            return getPrerequisiteFailureFeat(prerequisite, prerequisiteData);
        case PrerequisiteTypeEnum.CLASS_FEATURE:
            return getPrerequisiteFailureClassFeature(prerequisite);
        case PrerequisiteTypeEnum.CUSTOM_VALUE:
        default:
        // not defined
    }
    return null;
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureLevel(prerequisite, prerequisiteData) {
    let requiredDescription = '';
    switch (getSubType(prerequisite)) {
        case PrerequisiteSubTypeEnum.CHARACTER_LEVEL:
            let value = getValue(prerequisite);
            value = value ? value : 1;
            requiredDescription = `${FormatUtils.ordinalize(value)} Level`;
            break;
        default:
        // not implemented
    }
    return {
        type: PrerequisiteTypeEnum.LEVEL,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription,
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureAbilityScore(prerequisite, prerequisiteData) {
    let statKey = '';
    let currentAmount = null;
    const entityId = getEntityId(prerequisite);
    if (entityId !== null) {
        const ability = prerequisiteData.abilityLookup[entityId];
        statKey = AbilityAccessors.getStatKey(ability);
        currentAmount = AbilityAccessors.getScore(ability);
    }
    return {
        type: PrerequisiteTypeEnum.ABILITY_SCORE,
        data: {
            statKey,
            currentAmount,
            requiredValue: getValue(prerequisite),
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: `${getFriendlySubtypeName(prerequisite)} ${getValue(prerequisite)}+`,
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureProficiency(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.PROFICIENCY,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: `${getFriendlySubtypeName(prerequisite)} Proficiency`,
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureRace(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.SPECIES,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: getFriendlySubtypeName(prerequisite),
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureSubrace(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.SPECIES_OPTION,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: getFriendlySubtypeName(prerequisite),
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureSize(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.SIZE,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: `${getFriendlySubtypeName(prerequisite)} Size`,
        },
    };
}
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureClass(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.CLASS,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: `${getFriendlySubtypeName(prerequisite)}`,
        },
    };
}
export const getPrerequisiteFailureClassFeature = (prerequisite) => ({
    type: PrerequisiteTypeEnum.CLASS_FEATURE,
    data: {
        requiredChoice: prerequisite.friendlySubTypeName,
        requiredDescription: prerequisite.friendlySubTypeName,
    },
});
/**
 *
 * @param prerequisite
 * @param prerequisiteData
 */
export function getPrerequisiteFailureFeat(prerequisite, prerequisiteData) {
    return {
        type: PrerequisiteTypeEnum.FEAT,
        data: {
            requiredChoice: getFriendlySubtypeName(prerequisite),
            requiredDescription: `${getFriendlySubtypeName(prerequisite)}`,
        },
    };
}
/**
 *
 * @param prerequisiteGrouping
 * @param prerequisiteData
 */
export function getPrerequisiteGroupingFailures(prerequisiteGrouping, prerequisiteData) {
    const groupingFailures = [];
    if (prerequisiteGrouping !== null) {
        prerequisiteGrouping.forEach((prerequisiteGroup) => {
            const groupFailures = [];
            const prerequisites = getPrerequisites(prerequisiteGroup);
            prerequisites.forEach((prerequisite) => {
                if (!validatePrerequisite(prerequisite, prerequisiteData)) {
                    const prereqFailure = getPrerequisiteFailure(prerequisite, prerequisiteData);
                    if (prereqFailure) {
                        groupFailures.push(prereqFailure);
                    }
                }
            });
            groupingFailures.push(groupFailures);
        });
    }
    return groupingFailures.filter((group) => group.length);
}
/**
 * Get all prerequisites of a specific type
 * @param type
 * @param prereqGroups
 */
export function getPrereqsByType(type, prereqGroups) {
    return prereqGroups.reduce((acc, prereq) => {
        const featMappings = getPrerequisites(prereq).filter((mapping) => getType(mapping) === type);
        return acc.concat(featMappings);
    }, []);
}
