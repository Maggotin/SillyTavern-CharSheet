import { AbilityAccessors } from '../Ability';
/**
 *
 * @param abilities
 * @param armorClass
 * @param hitPointInfo
 * @param initiative
 */
export function generateSocialImageData(abilities, armorClass, hitPointInfo, initiative) {
    const abilityScores = {};
    abilities.forEach((ability) => {
        const score = AbilityAccessors.getScore(ability);
        abilityScores[AbilityAccessors.getId(ability)] = score === null ? 0 : score;
    });
    return {
        abilityScores,
        armorClass,
        hitPoints: hitPointInfo.totalHp,
        initiative,
    };
}
