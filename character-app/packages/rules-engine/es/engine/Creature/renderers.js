import { DiceRenderers } from '../Dice';
import { FormatUtils } from '../Format';
import { RuleDataUtils } from '../RuleData';
import { getAlignmentId, getArmorClass, getArmorClassDescription, getChallengeInfo, getDefinitionName, getHideCr, getHitPointDice, getHitPointInfo, getInitiative, getLairChallengeInfo, getLanguageNote, getLanguages, getLevel, getMovements, getName, getPassivePerception, getSavingThrows, getSenses, getSizeId, getSkills, getStatBlockType, getSubTypes, getTypeId, } from './accessors';
import { StatBlockTypeEnum } from './constants';
import { getTypeName } from './utils';
//Render a formatted meta text string for a given Creature
export function renderMetaText(creature, ruleData, useBaseMonsterType) {
    var _a, _b;
    //CreatureLevel
    const creatureLevel = getLevel(creature);
    const level = creatureLevel !== null ? `${FormatUtils.ordinalize(creatureLevel)}-level` : '';
    //CreatureSize
    const sizeInfo = RuleDataUtils.getCreatureSizeInfo(getSizeId(creature), ruleData);
    const size = (_a = sizeInfo === null || sizeInfo === void 0 ? void 0 : sizeInfo.name) !== null && _a !== void 0 ? _a : '';
    //CreatureType
    let type = '';
    if (useBaseMonsterType) {
        const typeInfo = RuleDataUtils.getMonsterTypeInfo(getTypeId(creature), ruleData);
        if (typeInfo === null || typeInfo === void 0 ? void 0 : typeInfo.name) {
            type = typeInfo.name;
        }
    }
    else {
        type = getTypeName(creature, ruleData);
    }
    //CreatureAlignment
    const alignmentInfo = RuleDataUtils.getAlignmentInfo(getAlignmentId(creature), ruleData);
    const alignment = (_b = alignmentInfo === null || alignmentInfo === void 0 ? void 0 : alignmentInfo.name) !== null && _b !== void 0 ? _b : '';
    //Extra Text
    let extraTextChunks = [];
    //If the creature has a customized name that is differenct than the definition name, add the definition name
    if (getName(creature) !== getDefinitionName(creature)) {
        extraTextChunks.push(getDefinitionName(creature));
    }
    //Add any subtypes
    const subTypes = getSubTypes(creature);
    if (subTypes.length) {
        subTypes.forEach((monsterInfo) => {
            if (monsterInfo.name !== null) {
                extraTextChunks.push(monsterInfo.name);
            }
        });
    }
    const extraText = extraTextChunks.join(', ');
    return `${level} ${size} ${type}${extraText ? ` (${extraText})` : ''}${alignment ? `, ${alignment}` : ''}`.trim();
}
//Render a Creature's Armor Class with any additional description added
export function renderArmorClass(creature) {
    return `${getArmorClass(creature)} ${getArmorClassDescription(creature)}`.trim();
}
//Render a Creature's initative info: bonus (score)
export function renderInitiativeInfo(creature) {
    const initiativeInfo = getInitiative(creature);
    if (initiativeInfo === null || initiativeInfo === void 0 ? void 0 : initiativeInfo.bonus) {
        const { bonus, score } = initiativeInfo;
        return `${FormatUtils.renderSignedNumber(bonus)} ${score ? `(${initiativeInfo.score})` : ''}`.trim();
    }
    return null;
}
//Render a Creature's total Hit Points and Hit Point Dice
export function renderHitPointInfo(creature) {
    const totalHp = getHitPointInfo(creature).totalHp;
    const hitPointDice = getHitPointDice(creature);
    const hpDiceText = hitPointDice ? ` (${DiceRenderers.renderDice(getHitPointDice(creature))})` : '';
    return `${totalHp}${hpDiceText}`;
}
//Render a Creature's Speed info
export function renderSpeedInfo(creature, ruleData) {
    const movements = getMovements(creature);
    if (movements.length) {
        const movementDisplays = movements.map((movement, idx) => {
            let label = '';
            if (idx !== 0) {
                label = RuleDataUtils.getMovementName(movement.movementId, ruleData);
            }
            return `${label} ${FormatUtils.renderDistance(movement.speed)} ${movement.notes ? movement.notes : ''}`.trim();
        });
        return movementDisplays.join(', ');
    }
    return '--';
}
//Render a Creature's Saving Throws info
export function renderSavingThrows(creature) {
    const savingThrows = getSavingThrows(creature);
    if (!savingThrows.length) {
        return null;
    }
    const savingThrowDisplays = savingThrows.map((savingThrow) => {
        return `${savingThrow.statKey} ${FormatUtils.renderSignedNumber(savingThrow.modifier)}`;
    });
    return savingThrowDisplays.join(', ');
}
//Render a Creature's Skills info
export function renderSkills(creature, ruleData) {
    const skills = getSkills(creature);
    if (!skills.length) {
        return null;
    }
    const skillDisplays = skills.map((skill) => {
        const skillInfo = RuleDataUtils.getSkillInfo(skill.id, ruleData);
        const name = (skillInfo === null || skillInfo === void 0 ? void 0 : skillInfo.name) ? skillInfo.name : '';
        const modifier = skill.modifier;
        return `${name} ${FormatUtils.renderSignedNumber(modifier)}`;
    });
    return skillDisplays.join(', ');
}
//Render a Creature's Senses info
export function renderSensesInfo(creature, ruleData) {
    const senses = getSenses(creature);
    const senseDisplays = senses.map((sense) => {
        const senseInfo = RuleDataUtils.getSenseInfo(sense.senseId, ruleData);
        const senseName = senseInfo ? senseInfo.name : '';
        return `${senseName} ${sense.notes}`;
    });
    const senseDisplay = senseDisplays.length ? `${senseDisplays.join(', ')}, ` : '';
    const passivePerception = getPassivePerception(creature);
    return `${senseDisplay}Passive Perception ${passivePerception}`;
}
//Render a Creature's Languages info
export function renderLanguages(creature, ruleData) {
    const languages = getLanguages(creature);
    const languageNote = getLanguageNote(creature);
    let languageText = '';
    if (languages.length || languageNote) {
        let languageDisplays = languages.map((language) => {
            const name = RuleDataUtils.getLanguageName(language.languageId, ruleData);
            return `${name} ${language.notes}`.trim();
        });
        if (languageNote) {
            languageDisplays.push(languageNote);
        }
        languageText = languageDisplays.join(', ');
    }
    else {
        languageText = '--';
    }
    return languageText;
}
//Render a Creature's Challenge Rating info, adjusted for 2014 vs 2024 version
export function renderChallengeRatingInfo(creature) {
    const challengeInfo = getChallengeInfo(creature);
    const hideCr = getHideCr(creature);
    const statBlockType = getStatBlockType(creature);
    if (!challengeInfo || hideCr) {
        return null;
    }
    if (statBlockType === StatBlockTypeEnum.CORE_RULES_2024) {
        const PBtext = `; PB ${FormatUtils.renderSignedNumber(challengeInfo.proficiencyBonus)}`;
        const lairChallengeInfo = getLairChallengeInfo(creature);
        const lairCRText = (lairChallengeInfo === null || lairChallengeInfo === void 0 ? void 0 : lairChallengeInfo.xp)
            ? `, or ${FormatUtils.renderLocaleNumber(lairChallengeInfo.xp)} in lair`
            : '';
        return `${FormatUtils.renderChallengeRating(challengeInfo.value)} (XP ${FormatUtils.renderLocaleNumber(challengeInfo.xp)}${lairCRText}${PBtext})`;
    }
    return `${FormatUtils.renderChallengeRating(challengeInfo.value)} (${FormatUtils.renderLocaleNumber(challengeInfo.xp)} XP)`;
}
//render a Creature's Proficiency Bonus
export function renderProficiencyBonus(creature) {
    const challengeInfo = getChallengeInfo(creature);
    const hideCr = getHideCr(creature);
    if (!challengeInfo || hideCr) {
        return null;
    }
    return FormatUtils.renderSignedNumber(challengeInfo.proficiencyBonus);
}
