import { TypeScriptUtils } from '../../utils';
import { DataOriginTypeEnum } from '../DataOrigin';
import { DurationAccessors, DurationRenderers } from '../Duration';
import { FormatUtils } from '../Format';
import { LimitedUseAccessors, LimitedUseDerivers, LimitedUseRenderers } from '../LimitedUse';
import { NoteGenerators } from '../Note';
import { DisplayIntentionEnum } from '../Note';
import { RuleDataUtils } from '../RuleData';
import { getAtHigherLevels, getComponents, getConcentration, getDuration, getLimitedUse, getNotes, getRange, getDataOriginType, isCantrip, getScaleType, } from './accessors';
import { SpellDurationTypeEnum } from './constants';
import { getConsumedLimitedUse, getSpellScaledAtHigher, isSpellScaledByCastLevel } from './derivers';
/**
 *
 * @param spell
 * @param castLevel
 * @param characterLevel
 */
export function getScaledNoteComponent(spell, castLevel, characterLevel) {
    const atHigherLevels = getAtHigherLevels(spell);
    if (!atHigherLevels) {
        return null;
    }
    const scaleType = getScaleType(spell);
    const additionalAttacks = atHigherLevels.additionalAttacks === null ? [] : atHigherLevels.additionalAttacks;
    const additionalTargets = atHigherLevels.additionalTargets === null ? [] : atHigherLevels.additionalTargets;
    const areaOfEffect = atHigherLevels.areaOfEffect === null ? [] : atHigherLevels.areaOfEffect;
    const duration = atHigherLevels.duration === null ? [] : atHigherLevels.duration;
    const creatures = atHigherLevels.creatures === null ? [] : atHigherLevels.creatures;
    const special = atHigherLevels.special === null ? [] : atHigherLevels.special;
    if (!additionalAttacks.length &&
        !additionalTargets.length &&
        !areaOfEffect.length &&
        !duration.length &&
        !creatures.length &&
        !special.length) {
        return null;
    }
    let isScaled = false;
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), additionalAttacks, castLevel);
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), additionalTargets, castLevel);
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), areaOfEffect, castLevel);
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), duration, castLevel);
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), creatures, castLevel);
    isScaled = isScaled || isSpellScaledByCastLevel(spell, getScaleType(spell), special, castLevel);
    let higherDisplay;
    const additionalAttackInfo = getSpellScaledAtHigher(spell, scaleType, additionalAttacks, characterLevel, castLevel);
    if (additionalAttackInfo) {
        const totalCount = additionalAttackInfo.totalCount;
        const additionalAttackCount = isCantrip(spell) ? totalCount + 1 : totalCount;
        const additionalAttackLabel = isCantrip(spell) ? '' : '+';
        higherDisplay = `Count: ${additionalAttackLabel}${additionalAttackCount}`;
    }
    const additionalTargetInfo = getSpellScaledAtHigher(spell, scaleType, additionalTargets, characterLevel, castLevel);
    if (!higherDisplay && additionalTargetInfo) {
        higherDisplay = `Targets: +${additionalTargetInfo.targets}`;
    }
    const aoeInfo = getSpellScaledAtHigher(spell, scaleType, areaOfEffect, characterLevel, castLevel);
    if (!higherDisplay && aoeInfo) {
        const extArea = aoeInfo.extendedAoe;
        if (extArea) {
            higherDisplay = `Ext. Area: ${FormatUtils.renderDistance(extArea)}`;
        }
    }
    const durationInfo = getSpellScaledAtHigher(spell, scaleType, duration, characterLevel, castLevel);
    if (!higherDisplay && durationInfo) {
        higherDisplay = `Ext. D: ${durationInfo.description}`;
    }
    const creatureInfo = getSpellScaledAtHigher(spell, scaleType, creatures, characterLevel, castLevel);
    if (!higherDisplay && creatureInfo) {
        higherDisplay = `Creatures: ${creatureInfo.description}`;
    }
    const specialInfo = getSpellScaledAtHigher(spell, scaleType, special, characterLevel, castLevel);
    if (!higherDisplay && specialInfo) {
        higherDisplay = `Special: ${specialInfo.description}`;
    }
    if (!higherDisplay) {
        return null;
    }
    const displayIntention = isScaled ? DisplayIntentionEnum.SCALED : null;
    return NoteGenerators.createPlainText(higherDisplay, displayIntention);
}
/**
 *
 * @param spell
 */
function getUserNoteComponent(spell) {
    const notes = getNotes(spell);
    if (notes) {
        return NoteGenerators.createPlainText(notes);
    }
    return null;
}
/**
 *
 * @param spell
 * @param castLevel
 * @param characterLevel
 * @param abilityLookup
 * @param ruleData
 * @param scaledAmount
 * @param proficiencyBonus
 */
export function getNoteComponents(spell, castLevel, characterLevel, abilityLookup, ruleData, scaledAmount = 0, proficiencyBonus) {
    const notes = [];
    const range = getRange(spell);
    const components = getComponents(spell);
    const duration = getDuration(spell);
    const limitedUse = getLimitedUse(spell);
    if (limitedUse) {
        const consumedAmount = getConsumedLimitedUse(spell, scaledAmount);
        const maxUses = LimitedUseDerivers.deriveMaxUses(limitedUse, abilityLookup, ruleData, proficiencyBonus);
        const numberUsed = LimitedUseAccessors.getNumberUsed(limitedUse);
        const numberRemaining = maxUses - numberUsed;
        if (getDataOriginType(spell) === DataOriginTypeEnum.ITEM) {
            if (consumedAmount !== null) {
                if (maxUses === 1) {
                    const isUsed = numberUsed === 1;
                    notes.push(NoteGenerators.createPlainText(`1 Charge${isUsed ? ' (Used)' : ''}`));
                }
                else {
                    notes.push(NoteGenerators.createPlainText(`${consumedAmount} Charge${consumedAmount !== 1 ? 's' : ''} (${numberRemaining}/${maxUses})`));
                }
            }
        }
        else if (maxUses === 1) {
            const resetType = LimitedUseAccessors.getResetType(limitedUse);
            const resetTypeAbbr = LimitedUseRenderers.renderLimitedUseResetAbbreviation(resetType);
            const isUsed = numberUsed === 1;
            const limitedUseResetTypeName = resetType === null ? '' : RuleDataUtils.getLimitedUseResetTypeName(resetType, ruleData);
            notes.push(NoteGenerators.createTooltip(`1/${resetTypeAbbr}${isUsed ? ' (Used)' : ''}`, `Once per ${limitedUseResetTypeName}${isUsed ? ' (Used)' : ''}`, {
                dynamicTitle: true,
            }));
        }
        else {
            notes.push(NoteGenerators.createPlainText(`${consumedAmount} Use${consumedAmount !== 1 ? 's' : ''} (${numberRemaining}/${maxUses})`));
        }
    }
    const scaledNotesNode = getScaledNoteComponent(spell, castLevel, characterLevel);
    if (scaledNotesNode) {
        notes.push(scaledNotesNode);
    }
    if (duration && DurationAccessors.getType(duration) !== SpellDurationTypeEnum.INSTANTANEOUS) {
        notes.push(NoteGenerators.createTooltip(`D: ${DurationRenderers.renderDurationAbbreviation(duration)}`, `${DurationRenderers.renderDuration(duration, getConcentration(spell))} Duration`));
    }
    if (range && range.aoeValue !== null && range.aoeType !== null) {
        notes.push(NoteGenerators.createGroup([NoteGenerators.createDistance(range.aoeValue), NoteGenerators.createAoeIcon(range.aoeType)], ''));
    }
    if (components) {
        const componentNoteParts = [];
        components.forEach((componentId, idx) => {
            const componentInfo = RuleDataUtils.getSpellComponentInfo(componentId, ruleData);
            if (componentInfo && componentInfo.shortName !== null) {
                componentNoteParts.push(NoteGenerators.createTooltip(componentInfo.shortName, componentInfo.name));
            }
        });
        notes.push(NoteGenerators.createGroup(componentNoteParts, '/'));
    }
    notes.push(getUserNoteComponent(spell));
    return notes.filter(TypeScriptUtils.isNotNullOrUndefined);
}
