import { HelperUtils } from '../Helper';
/**
 *
 * @param entityDefinition
 * @param entityRestrictionData
 */
export function validateIsRestrictedEntityDefinition(entityDefinition, entityRestrictionData) {
    // check if entity is homebrew and then check current user preference
    if (entityDefinition.isHomebrew) {
        return !entityRestrictionData.preferences.useHomebrewContent;
    }
    // check if entity has sources and then filter based on current active sources
    let sources = entityDefinition.sources;
    if (sources !== null && sources.length > 0) {
        return !sources.some((source) => HelperUtils.lookupDataOrFallback(entityRestrictionData.activeSourceLookup, source.sourceId) !== null);
    }
    // if entity isn't homebrew and it doesn't have sources it isn't restricted
    return false;
}
