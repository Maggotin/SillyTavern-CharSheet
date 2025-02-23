import { BackgroundAccessors } from '../Background';
import { ClassAccessors } from '../Class';
import { ClassFeatureAccessors } from '../ClassFeature';
import { ConditionAccessors } from '../Condition';
import { DataOriginTypeEnum, DataOriginUtils } from '../DataOrigin';
import { FeatAccessors } from '../Feat';
import { ItemAccessors } from '../Item';
import { RaceAccessors } from '../Race';
import { RacialTraitAccessors } from '../RacialTrait';
import { VehicleAccessors } from '../Vehicle';
import { validateIsRestrictedEntityDefinition } from './validators';
/**
 *
 * @param dataOrigin
 * @param defaultValue
 * @param tryParent
 */
export function getDataOriginName(dataOrigin, defaultValue = '', tryParent = false) {
    var _a;
    let extraDisplay = null;
    switch (dataOrigin.type) {
        case DataOriginTypeEnum.RACE:
            if (tryParent) {
                extraDisplay = RaceAccessors.getFullName(dataOrigin.parent);
            }
            if (extraDisplay === null) {
                extraDisplay = RacialTraitAccessors.getName(dataOrigin.primary);
            }
            break;
        case DataOriginTypeEnum.CLASS:
            extraDisplay = ClassAccessors.getName(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.CLASS_FEATURE:
            if (tryParent) {
                extraDisplay = ClassAccessors.getName(dataOrigin.parent);
            }
            if (extraDisplay === null) {
                extraDisplay = ClassFeatureAccessors.getName(dataOrigin.primary);
            }
            break;
        case DataOriginTypeEnum.FEAT:
            extraDisplay = FeatAccessors.getName(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.BACKGROUND:
            extraDisplay = BackgroundAccessors.getName(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.ITEM:
            extraDisplay = ItemAccessors.getDefinitionName(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.CUSTOM:
            extraDisplay = dataOrigin.primary === null ? null : dataOrigin.primary;
            break;
        case DataOriginTypeEnum.FEAT_LIST:
            if (tryParent && dataOrigin.parent !== null) {
                if (dataOrigin.parentType === DataOriginTypeEnum.BACKGROUND) {
                    extraDisplay = ((_a = dataOrigin.parent.definition) === null || _a === void 0 ? void 0 : _a.name) || null;
                }
                else if (dataOrigin.parentType === DataOriginTypeEnum.CLASS_FEATURE) {
                    extraDisplay = ClassFeatureAccessors.getName(dataOrigin.primary);
                }
            }
            if (extraDisplay === null && dataOrigin.primary !== null) {
                extraDisplay = dataOrigin.primary.name;
            }
            break;
        default:
        //not implemented
    }
    return extraDisplay === null ? defaultValue : extraDisplay;
}
/**
 * Gets the id as a string of the primary origin if possible.
 * @param dataOrigin the data origin object from an entity
 * @returns id of the primary origin object as a string, or null
 */
export function tryGetPrimaryId(dataOrigin) {
    // The data origin system is risky business because it is all `any` typed.
    // The logic about the types is based on `getDataOriginName` above.
    try {
        let id;
        switch (dataOrigin.type) {
            case DataOriginTypeEnum.RACE:
                id = RacialTraitAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.CLASS:
                id = ClassAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.CLASS_FEATURE:
                id = ClassFeatureAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.FEAT:
                id = FeatAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.BACKGROUND:
                id = BackgroundAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.ITEM:
                id = ItemAccessors.getId(dataOrigin.primary);
                break;
            case DataOriginTypeEnum.FEAT_LIST:
                if (dataOrigin.primary !== null) {
                    id = dataOrigin.primary.id;
                }
                break;
        }
        return id ? `${id}` : null;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
/**
 * Gets the id as a string of parent origin if possible.
 * Note that most entity types don't have a parent origin.
 * @param dataOrigin the data origin object from an entity
 * @returns id of the parent origin object as a string, or null
 */
export function tryGetParentId(dataOrigin) {
    var _a;
    // See comment above about the typings.
    try {
        let id;
        switch (dataOrigin.type) {
            case DataOriginTypeEnum.RACE:
                id = RaceAccessors.getDefinitionKey(dataOrigin.parent);
                break;
            case DataOriginTypeEnum.CLASS_FEATURE:
                id = ClassAccessors.getId(dataOrigin.parent);
                break;
            case DataOriginTypeEnum.FEAT_LIST:
                if (dataOrigin.parentType === DataOriginTypeEnum.BACKGROUND && dataOrigin.parent !== null) {
                    id = (_a = dataOrigin.parent.definition) === null || _a === void 0 ? void 0 : _a.id;
                }
                else if (dataOrigin.parentType === DataOriginTypeEnum.CLASS_FEATURE && dataOrigin.parent !== null) {
                    id = ClassFeatureAccessors.getId(dataOrigin.parent);
                }
                break;
        }
        return id ? `${id}` : null;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
/**
 *
 * @param ref
 * @param refData
 * @param defaultValue
 * @param tryParent
 */
export function getDataOriginRefName(ref, refData, defaultValue, tryParent = false) {
    var _a;
    let extraDisplay = null;
    switch (ref.type) {
        case DataOriginTypeEnum.RACE: {
            if (tryParent) {
                const parent = DataOriginUtils.getRefParent(ref, refData);
                if (parent !== null) {
                    extraDisplay = RaceAccessors.getFullName(parent);
                }
            }
            if (extraDisplay === null) {
                const primary = DataOriginUtils.getRefPrimary(ref, refData);
                if (primary !== null) {
                    extraDisplay = RacialTraitAccessors.getName(primary);
                }
            }
            break;
        }
        case DataOriginTypeEnum.CLASS: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary) {
                extraDisplay = ClassAccessors.getName(primary);
            }
            break;
        }
        case DataOriginTypeEnum.CLASS_FEATURE: {
            if (tryParent) {
                const parent = DataOriginUtils.getRefParent(ref, refData);
                if (parent !== null) {
                    extraDisplay = ClassAccessors.getName(parent);
                }
            }
            if (extraDisplay === null) {
                const primary = DataOriginUtils.getRefPrimary(ref, refData);
                if (primary !== null) {
                    extraDisplay = ClassFeatureAccessors.getName(primary);
                }
            }
            break;
        }
        case DataOriginTypeEnum.FEAT: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                extraDisplay = FeatAccessors.getName(primary);
            }
            break;
        }
        case DataOriginTypeEnum.BACKGROUND: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                extraDisplay = BackgroundAccessors.getName(primary);
            }
            break;
        }
        case DataOriginTypeEnum.ITEM: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                extraDisplay = ItemAccessors.getName(primary);
            }
            break;
        }
        case DataOriginTypeEnum.CUSTOM: {
            extraDisplay = 'Custom';
            break;
        }
        case DataOriginTypeEnum.UNKNOWN: {
            extraDisplay = defaultValue !== null && defaultValue !== void 0 ? defaultValue : 'No Origin';
            break;
        }
        default:
        //not implemented
    }
    return (_a = extraDisplay !== null && extraDisplay !== void 0 ? extraDisplay : defaultValue) !== null && _a !== void 0 ? _a : '';
}
/**
 *
 * @param dataOrigin
 * @param fallback
 */
export function getPrimaryDescription(dataOrigin, fallback = '') {
    let description = fallback;
    if (!dataOrigin) {
        return description;
    }
    switch (dataOrigin.type) {
        case DataOriginTypeEnum.RACE:
            description = RacialTraitAccessors.getDescription(dataOrigin.primary);
            break;
        case DataOriginTypeEnum.FEAT:
            const featDescription = FeatAccessors.getDescription(dataOrigin.primary);
            description = featDescription === null ? '' : featDescription;
            break;
        case DataOriginTypeEnum.CLASS_FEATURE:
            const classFeatureDescription = ClassFeatureAccessors.getDescription(dataOrigin.primary);
            description = classFeatureDescription === null ? '' : classFeatureDescription;
            break;
        default:
            if (dataOrigin.primary && dataOrigin.primary.definition && dataOrigin.primary.definition.description) {
                description = dataOrigin.primary.definition.description;
            }
    }
    return description === null ? '' : description;
}
/**
 *
 * @param ref
 * @param refData
 * @param fallback
 */
export function getDataOriginRefPrimaryDescription(ref, refData, fallback = '') {
    let description = null;
    switch (ref.type) {
        case DataOriginTypeEnum.RACE: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = RacialTraitAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.FEAT: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = FeatAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.CLASS: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary) {
                description = ClassAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.CLASS_FEATURE: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = ClassFeatureAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.BACKGROUND: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = BackgroundAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.ITEM: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = ItemAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.VEHICLE: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = VehicleAccessors.getDescription(primary);
            }
            break;
        }
        case DataOriginTypeEnum.CONDITION: {
            const primary = DataOriginUtils.getRefPrimary(ref, refData);
            if (primary !== null) {
                description = ConditionAccessors.getDescription(primary);
            }
            break;
        }
        default:
        // not implemented
    }
    return description !== null && description !== void 0 ? description : fallback;
}
/**
 *
 * @param entities
 * @param entityRestrictionData
 */
export function filterNonRestrictedEntities(entities, entityRestrictionData) {
    return entities.filter((entity) => entity.definition !== null &&
        !validateIsRestrictedEntityDefinition(entity.definition, entityRestrictionData));
}
/**
 *
 * @param entityDefinitions
 * @param entityRestrictionData
 */
export function filterNonRestrictedEntityDefinitions(entityDefinitions, entityRestrictionData) {
    return entityDefinitions.filter((definition) => !validateIsRestrictedEntityDefinition(definition, entityRestrictionData));
}
