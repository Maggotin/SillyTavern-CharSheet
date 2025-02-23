import { keyBy } from 'lodash';
import { TypeScriptUtils } from '../../utils';
import { getNotes, getValue, getValueId, getValueIntId } from './accessors';
import { AdjustmentTypeEnum } from './constants';
import { generateEntityContextKey, generateUniqueKey } from './generators';
/**
 *
 * @param valueLookup
 * @param typeId
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @returns
 */
export function getData(valueLookup, typeId, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null) {
    const key = generateUniqueKey(typeId, valueId, valueTypeId, contextId, contextTypeId);
    if (valueLookup.hasOwnProperty(key)) {
        return valueLookup[key];
    }
    return null;
}
/**
 *
 * @param valueLookup
 * @param typeIds
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @returns
 */
export function getDataLookup(valueLookup, typeIds, valueId = null, valueTypeId = null, contextId = null, contextTypeId = null) {
    const data = typeIds
        .map((typeId) => getData(valueLookup, typeId, valueId, valueTypeId, contextId, contextTypeId))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
    return keyBy(data, 'typeId');
}
/**
 *
 * @param entityValueLookup
 * @param valueId
 * @param valueTypeId
 * @param contextId
 * @param contextTypeId
 * @returns
 */
export function getEntityData(entityValueLookup, valueId, valueTypeId, contextId = null, contextTypeId = null) {
    const key = generateEntityContextKey(valueId, valueTypeId, contextId, contextTypeId);
    if (entityValueLookup.hasOwnProperty(key)) {
        return entityValueLookup[key];
    }
    return {};
}
/**
 *
 * @param typeValueLookup
 * @param typeId
 * @returns
 */
export function getTypeData(typeValueLookup, typeId) {
    if (typeId === null) {
        return [];
    }
    if (typeValueLookup.hasOwnProperty(typeId)) {
        return typeValueLookup[typeId];
    }
    return [];
}
/**
 *
 * @param typeValueLookup
 * @param typeId
 * @returns
 */
export function getTypeValues(typeValueLookup, typeId) {
    return getTypeData(typeValueLookup, typeId)
        .map((charValue) => getValue(charValue))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param  typeValueLookup
 * @param  typeId
 * @returns
 */
export function getTypeValueIds(typeValueLookup, typeId) {
    return getTypeData(typeValueLookup, typeId)
        .map((charValue) => getValueId(charValue))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param  typeValueLookup
 * @param  typeId
 * @returns
 */
export function getTypeValueIntIds(typeValueLookup, typeId) {
    return getTypeData(typeValueLookup, typeId)
        .map((charValue) => getValueIntId(charValue))
        .filter(TypeScriptUtils.isNotNullOrUndefined);
}
/**
 *
 * @param  valueLookup
 * @param  typeId
 * @param  valueId
 * @param  valueTypeId
 * @param  defaultValue
 * @param  contextId
 * @param  contextTypeId
 * @returns
 */
export function getKeyValue(valueLookup, typeId, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    const charValue = getData(valueLookup, typeId, valueId, valueTypeId, contextId, contextTypeId);
    if (charValue !== null) {
        return getValue(charValue);
    }
    return defaultValue;
}
/**
 *
 * @param  valueLookup
 * @param  typeId
 * @param  valueId
 * @param  valueTypeId
 * @param  defaultValue
 * @param  contextId
 * @param  contextTypeId
 * @returns
 */
export function getKeyNotes(valueLookup, typeId, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    const charValue = getData(valueLookup, typeId, valueId, valueTypeId, contextId, contextTypeId);
    if (charValue !== null) {
        return getNotes(charValue);
    }
    return defaultValue;
}
/**
 *
 * @param valueLookup
 * @param typeId
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getTypedKeyValue(valueLookup, typeId, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getKeyValue(valueLookup, typeId, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param characterValue
 * @param defaultValue
 */
export function getCharacterValueValue(characterValue, defaultValue = null) {
    const value = getValue(characterValue);
    if (value === null) {
        return defaultValue;
    }
    return value;
}
/**
 *
 * @param characterValue
 * @param defaultValue
 */
export function getTypedCharacterValueValue(characterValue, defaultValue = null) {
    return getCharacterValueValue(characterValue, defaultValue);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getSavingThrowMiscBonusValue(valueLookup, valueId = null, valueTypeId = null, defaultValue = 0, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.SAVING_THROW_MISC_BONUS, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getSavingThrowMagicBonusValue(valueLookup, valueId = null, valueTypeId = null, defaultValue = 0, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.SAVING_THROW_MAGIC_BONUS, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getSavingThrowOverrideValue(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.SAVING_THROW_OVERRIDE, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getSavingThrowProficiencyLevelValue(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.SAVING_THROW_PROFICIENCY_LEVEL, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param defaultValue
 */
export function getOverridePassivePerceptionValue(valueLookup, defaultValue = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.OVERRIDE_PASSIVE_PERCEPTION, undefined, undefined, defaultValue);
}
/**
 *
 * @param valueLookup
 * @param defaultValue
 */
export function getOverridePassiveInvestigationValue(valueLookup, defaultValue = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.OVERRIDE_PASSIVE_INVESTIGATION, undefined, undefined, defaultValue);
}
/**
 *
 * @param valueLookup
 * @param defaultValue
 */
export function getOverridePassiveInsightValue(valueLookup, defaultValue = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.OVERRIDE_PASSIVE_INSIGHT, undefined, undefined, defaultValue);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getIsOffhand(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.IS_OFFHAND, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getFixedValueBonus(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.FIXED_VALUE_BONUS, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getToHitBonus(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.TO_HIT_BONUS, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
/**
 *
 * @param valueLookup
 * @param valueId
 * @param valueTypeId
 * @param defaultValue
 * @param contextId
 * @param contextTypeId
 */
export function getToHitOverride(valueLookup, valueId = null, valueTypeId = null, defaultValue = null, contextId = null, contextTypeId = null) {
    return getTypedKeyValue(valueLookup, AdjustmentTypeEnum.TO_HIT_OVERRIDE, valueId, valueTypeId, defaultValue, contextId, contextTypeId);
}
