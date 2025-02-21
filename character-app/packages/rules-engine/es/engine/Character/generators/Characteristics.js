import { HelperUtils } from '../../Helper';
import { RaceAccessors } from '../../Race';
import { RuleDataAccessors } from '../../RuleData';
/**
 *
 * @param alignmentId
 * @param ruleData
 */
export function generateAlignment(alignmentId, ruleData) {
    if (alignmentId === null) {
        return null;
    }
    return HelperUtils.lookupDataOrFallback(RuleDataAccessors.getAlignmentLookup(ruleData), alignmentId);
}
/**
 *
 * @param lifeStyleId
 * @param ruleData
 */
export function generateLifestyle(lifeStyleId, ruleData) {
    if (lifeStyleId === null) {
        return null;
    }
    return HelperUtils.lookupDataOrFallback(RuleDataAccessors.getLifestyleLookup(ruleData), lifeStyleId);
}
/**
 *
 * @param race
 */
export function generateSize(race) {
    if (race === null) {
        return null;
    }
    return RaceAccessors.getSizeInfo(race);
}
/**
 *
 * @param traitsContract
 */
export function generateCharacterTraits(traitsContract) {
    if (traitsContract !== null) {
        return traitsContract;
    }
    return {
        appearance: null,
        bonds: null,
        flaws: null,
        ideals: null,
        personalityTraits: null,
    };
}
/**
 *
 * @param notesContract
 */
export function generateCharacterNotes(notesContract) {
    if (notesContract !== null) {
        return notesContract;
    }
    return {
        allies: null,
        backstory: null,
        enemies: null,
        organizations: null,
        otherHoldings: null,
        otherNotes: null,
        personalPossessions: null,
    };
}
