import { DICE_ROLL_KEY_CONCEPT_SEPARATOR, DICE_ROLL_KEY_DATA_SEPARATOR } from './constants';
/**
 *
 * @param conceptString
 * @param dataKey
 */
export function generateComponentKey(conceptString, dataKey) {
    return [conceptString, dataKey].join(DICE_ROLL_KEY_CONCEPT_SEPARATOR);
}
/**
 *
 * @param dataKeyInfos
 */
export function generateComponentKeyDataKey(dataKeyInfos) {
    return dataKeyInfos.map(generateComponentKeyDataInfoKey).join(DICE_ROLL_KEY_DATA_SEPARATOR);
}
/**
 *
 * @param dataKeyInfo
 */
export function generateComponentKeyDataInfoKey(dataKeyInfo) {
    return [dataKeyInfo.key, dataKeyInfo.value].join(DICE_ROLL_KEY_DATA_SEPARATOR);
}
/**
 *
 * @param abilityScoreType
 */
export function generateAbilityManagerKey(abilityScoreType) {
    const dataStrings = [
        {
            key: 'Type',
            value: abilityScoreType.toString(),
        },
    ];
    return generateComponentKey('AbilityManager', generateComponentKeyDataKey(dataStrings));
}
