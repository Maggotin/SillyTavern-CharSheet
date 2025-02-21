/**
 *
 * @param proficiencyBonus
 * @param abilityKeyLookup
 * @param abilityLookup
 * @param xpInfo
 * @param hitPointInfo
 * @param ruleData
 */
export function generateSnippetData(proficiencyBonus, abilityKeyLookup, abilityLookup, xpInfo, hitPointInfo, ruleData) {
    return {
        proficiencyBonus,
        abilityKeyLookup,
        abilityLookup,
        xpInfo,
        hitPointInfo,
        ruleData,
    };
}
