import { FeatAccessors } from '.';
import { DB_STRING_ELDRITCH_ADEPT, DB_STRING_MEDIUM_ARMOR_MASTER, DISGUISE_FEAT_TAG_NAME, INITIAL_ASI_TAG_NAME, } from '../Core';
import { getId, getName, getRepeatableParentId, isRepeatable } from './accessors';
/**
 *
 * @param feat
 */
export function isEldritchAdept(feat) {
    return getName(feat) === DB_STRING_ELDRITCH_ADEPT;
}
export function isMediumArmorMaster(feat) {
    return getName(feat) === DB_STRING_MEDIUM_ARMOR_MASTER;
}
export function doesTagSatisfyConstraint(tag, constraint) {
    return tag.entityTagId === constraint.entityTagId;
}
export function doesSatisfyTagConstraints(tags, constraints) {
    // For every constraint C,
    return constraints.every((constraint) => {
        // There exists at least one tag T such that
        return tags.some((tag) => {
            // T satisfies/matches C (i.e. T.entityTagId === C.entityTagId)
            return this.doesTagSatisfyConstraint(tag, constraint);
        });
    });
}
/*
 * Some feats, such as the ASI feats granted to new backgrounds
 * aren't Feats in the official sense. We're just using the feat
 * data structure to support other rules.
 * Another example is the Weapon Mastery class feature, which
 * actually just grants a special Weapon Mastery feat.
 *
 * Returns true when it is representing something other than a feat.
 * Returns false when the feat is a real feat from the rules.
 */
export function isHiddenFeat(feat) {
    return FeatAccessors.getCategories(feat).some(
    // TODO: Consider simplifying the logic by adding the __DISGUISE_FEAT tag to initial ASI feats.
    (cat) => cat.tagName === INITIAL_ASI_TAG_NAME || cat.tagName === DISGUISE_FEAT_TAG_NAME);
}
/**
 * @param feat
 */
export const getRepeatableGroupId = (feat) => {
    if (!isRepeatable(feat)) {
        return null;
    }
    return getRepeatableParentId(feat) || getId(feat);
};
