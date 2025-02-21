import { DataOriginTypeEnum } from './constants';
/**
 *
 * @param dataOriginId
 * @param dataOriginTypeId
 */
export function generateDataOriginKey(dataOriginId, dataOriginTypeId) {
    return `${dataOriginId}-${dataOriginTypeId}`;
}
/**
 *
 * @param dataOriginType
 * @param primary
 * @param parent
 */
export function generateDataOrigin(dataOriginType, primary = null, parent = null, parentDataOriginType = null) {
    return {
        type: dataOriginType,
        primary,
        parent,
        parentType: parentDataOriginType,
    };
}
/**
 * This is v2 of dataOrigin concept where the data origin is just a reference that is eventually
 * pieced together in the UI at runtime and not duplicated in parent/child relationship
 *
 * @param type
 * @param key
 */
export function generateDataOriginRef(type, key) {
    return {
        type,
        key,
    };
}
/**
 *
 * @param backgroundData
 * @param classData
 * @param classFeatureData
 * @param conditionData
 * @param featData
 * @param itemData
 * @param raceData
 * @param vehicleData
 */
export function generateDataOriginRefData(backgroundData, classData, classFeatureData, conditionData, featData, itemData, raceData, vehicleData, featListData) {
    return {
        [DataOriginTypeEnum.ADHOC]: {},
        [DataOriginTypeEnum.BACKGROUND]: backgroundData,
        [DataOriginTypeEnum.CLASS]: classData,
        [DataOriginTypeEnum.CLASS_FEATURE]: classFeatureData,
        [DataOriginTypeEnum.CONDITION]: conditionData,
        [DataOriginTypeEnum.CUSTOM]: {},
        [DataOriginTypeEnum.FEAT]: featData,
        [DataOriginTypeEnum.ITEM]: itemData,
        [DataOriginTypeEnum.RACE]: raceData,
        [DataOriginTypeEnum.RULE_DATA]: {},
        [DataOriginTypeEnum.SIMULATED]: {},
        [DataOriginTypeEnum.UNKNOWN]: {},
        [DataOriginTypeEnum.VEHICLE]: vehicleData,
        [DataOriginTypeEnum.FEAT_LIST]: featListData,
    };
}
