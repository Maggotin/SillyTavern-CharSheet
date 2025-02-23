import { ConditionAccessors } from '../Condition';
import { DisplayIntentionEnum, NoteGenerators } from '../Note';
import { RuleDataUtils } from '../RuleData';
import { VehicleComponentAccessors } from '../VehicleComponent';
import { getActiveConditions, getAllComponentsData, getCreatureCapacity, getDescription, getPrimaryComponent, } from './accessors';
import { VehicleConfigurationKeyEnum } from './constants';
import { getConfigurationValue } from './utils';
/**
 *
 * @param vehicle
 */
export function getConditionsNotesComponents(vehicle) {
    return NoteGenerators.createGroup(getActiveConditions(vehicle).map((condition) => {
        const name = ConditionAccessors.getName(condition);
        const level = ConditionAccessors.getActiveLevel(condition);
        let note = name;
        if (level !== null) {
            note = `${name} (Level ${level})`;
        }
        return NoteGenerators.createPlainText(note, DisplayIntentionEnum.NEGATIVE);
    }), ', ');
}
/**
 *
 * @param vehicle
 */
export function getUserDescriptionNoteComponents(vehicle) {
    const description = getDescription(vehicle);
    if (!description) {
        return null;
    }
    return NoteGenerators.createPlainText(description);
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function getCreatureCapacityNoteComponents(vehicle, ruleData) {
    const creatureCapacityInfos = getCreatureCapacity(vehicle);
    const creatureCapacityDescriptions = creatureCapacityInfos.map((capacity) => {
        var _a;
        let sizeName = '';
        if (capacity.sizeId !== null) {
            const sizeInfo = RuleDataUtils.getCreatureSizeInfo(capacity.sizeId, ruleData);
            if (sizeInfo && sizeInfo.name) {
                sizeName = sizeInfo.name;
            }
        }
        return `${capacity.capacity} ${sizeName} ${(_a = capacity.type) !== null && _a !== void 0 ? _a : 'crew'}`.trim();
    });
    if (creatureCapacityDescriptions.length === 0) {
        return null;
    }
    return NoteGenerators.createGroup(creatureCapacityDescriptions.map((capacityInfo) => NoteGenerators.createPlainText(capacityInfo)), ', ');
}
/**
 *
 * @param vehicle
 */
export function getDamageTakenNotesComponents(vehicle) {
    const primaryComponent = getPrimaryComponent(vehicle);
    if (primaryComponent === null) {
        return null;
    }
    let damageNote = null;
    const primaryComponentHitPointInfo = VehicleComponentAccessors.getHitPointInfo(primaryComponent);
    if (primaryComponentHitPointInfo !== null && primaryComponentHitPointInfo.remainingHp === 0) {
        damageNote = 'Wrecked';
    }
    else if (getConfigurationValue(VehicleConfigurationKeyEnum.ENABLE_COMPONENT_HIT_POINTS, vehicle)) {
        let count = 0;
        getAllComponentsData(vehicle).forEach((component) => {
            const hitPointInfo = VehicleComponentAccessors.getHitPointInfo(component);
            if (hitPointInfo !== null && hitPointInfo.remainingHp < hitPointInfo.totalHp) {
                count += 1;
            }
        });
        if (count > 0) {
            damageNote = `Damaged Components: ${count}`;
        }
    }
    return damageNote !== null ? NoteGenerators.createPlainText(damageNote, DisplayIntentionEnum.NEGATIVE) : null;
}
/**
 *
 * @param vehicle
 * @param ruleData
 */
export function getNoteComponents(vehicle, ruleData) {
    const notes = [];
    const descriptionNotes = getUserDescriptionNoteComponents(vehicle);
    if (descriptionNotes) {
        notes.push(descriptionNotes);
    }
    const damageTakenNotes = getDamageTakenNotesComponents(vehicle);
    if (damageTakenNotes) {
        notes.push(damageTakenNotes);
    }
    const conditionsNotes = getConditionsNotesComponents(vehicle);
    if (conditionsNotes) {
        notes.push(conditionsNotes);
    }
    const creatureCapacityNotes = getCreatureCapacityNoteComponents(vehicle, ruleData);
    if (creatureCapacityNotes) {
        notes.push(creatureCapacityNotes);
    }
    return notes;
}
