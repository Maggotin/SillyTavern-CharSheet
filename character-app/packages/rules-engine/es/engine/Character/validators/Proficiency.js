import { CustomProficiencyTypeEnum } from '../../Core';
/**
 *
 * @param proficiency
 */
export function isCustomSkillProficiency(proficiency) {
    return proficiency.type === CustomProficiencyTypeEnum.SKILL;
}
